using AutoMapper;
using EnglishSpeakingCoach.Application.DTOs;
using EnglishSpeakingCoach.Application.Services;
using EnglishSpeakingCoach.Domain.Entities;
using EnglishSpeakingCoach.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using EnglishSpeakingCoach.Infrastructure.Data;

namespace EnglishSpeakingCoach.Infrastructure.Services;

public class ProgressService : IProgressService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;

    public ProgressService(IUnitOfWork unitOfWork, IMapper mapper, ApplicationDbContext context)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _context = context;
    }

    public async Task<ProgressSummaryDto> GetWeeklyProgressAsync(int userId)
    {
        var weekAgo = DateTime.UtcNow.AddDays(-7);
        return await GetProgressSummaryAsync(userId, weekAgo, "Weekly");
    }

    public async Task<ProgressSummaryDto> GetMonthlyProgressAsync(int userId)
    {
        var monthAgo = DateTime.UtcNow.AddDays(-30);
        return await GetProgressSummaryAsync(userId, monthAgo, "Monthly");
    }

    public async Task<IEnumerable<ProgressMetricsDto>> GetUserProgressHistoryAsync(int userId, int days)
    {
        var startDate = DateTime.UtcNow.AddDays(-days);
        var metrics = await _unitOfWork.ProgressMetrics.FindAsync(
            p => p.UserId == userId && p.MetricDate >= startDate);

        return _mapper.Map<IEnumerable<ProgressMetricsDto>>(
            metrics.OrderByDescending(m => m.MetricDate));
    }

    public async Task UpdateProgressMetricsAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;

        // Get sessions for today
        var sessions = await _context.Sessions
            .Include(s => s.Recordings)
            .Where(s => s.UserId == userId && s.StartTime.Date == today)
            .ToListAsync();

        if (!sessions.Any())
        {
            return;
        }

        var recordings = sessions.SelectMany(s => s.Recordings).ToList();

        var metric = new ProgressMetrics
        {
            UserId = userId,
            MetricDate = today,
            Period = "Daily",
            TotalSessions = sessions.Count,
            TotalRecordings = recordings.Count,
            TotalMinutesPracticed = sessions.Sum(s => s.DurationSeconds ?? 0) / 60,
            AveragePronunciationScore = recordings.Any(r => r.PronunciationScore.HasValue)
                ? recordings.Where(r => r.PronunciationScore.HasValue)
                    .Average(r => r.PronunciationScore!.Value)
                : 0,
            AverageFluencyScore = recordings.Any(r => r.FluencyScore.HasValue)
                ? recordings.Where(r => r.FluencyScore.HasValue)
                    .Average(r => r.FluencyScore!.Value)
                : 0,
            AverageAccuracyScore = recordings.Any(r => r.AccuracyScore.HasValue)
                ? recordings.Where(r => r.AccuracyScore.HasValue)
                    .Average(r => r.AccuracyScore!.Value)
                : 0,
            CompletedLessons = sessions.Count(s => s.Status == "Completed" && s.LessonId.HasValue)
        };

        metric.OverallScore = (metric.AveragePronunciationScore +
                               metric.AverageFluencyScore +
                               metric.AverageAccuracyScore) / 3;

        await _unitOfWork.ProgressMetrics.AddAsync(metric);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task<ProgressSummaryDto> GetProgressSummaryAsync(
        int userId, DateTime startDate, string period)
    {
        var sessions = await _context.Sessions
            .Include(s => s.Recordings)
            .Where(s => s.UserId == userId && s.StartTime >= startDate)
            .ToListAsync();

        var recordings = sessions.SelectMany(s => s.Recordings).ToList();

        var metrics = await _unitOfWork.ProgressMetrics.FindAsync(
            p => p.UserId == userId && p.MetricDate >= startDate && p.Period == "Daily");

        var avgScore = recordings.Any(r => r.PronunciationScore.HasValue)
            ? recordings.Where(r => r.PronunciationScore.HasValue)
                .Average(r => (r.PronunciationScore!.Value +
                              (r.FluencyScore ?? 0) +
                              (r.AccuracyScore ?? 0)) / 3)
            : 0;

        // Calculate improvement (comparing first half to second half of period)
        var midDate = startDate.AddDays((DateTime.UtcNow - startDate).TotalDays / 2);
        var firstHalfRecordings = recordings.Where(r => r.CreatedAt < midDate).ToList();
        var secondHalfRecordings = recordings.Where(r => r.CreatedAt >= midDate).ToList();

        var improvementPercentage = 0.0;
        if (firstHalfRecordings.Any() && secondHalfRecordings.Any())
        {
            var firstAvg = firstHalfRecordings.Average(r => r.PronunciationScore ?? 0);
            var secondAvg = secondHalfRecordings.Average(r => r.PronunciationScore ?? 0);
            improvementPercentage = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg * 100) : 0;
        }

        return new ProgressSummaryDto(
            Period: period,
            TotalSessions: sessions.Count,
            TotalRecordings: recordings.Count,
            TotalMinutesPracticed: sessions.Sum(s => s.DurationSeconds ?? 0) / 60,
            AverageScore: Math.Round(avgScore, 2),
            ImprovementPercentage: Math.Round(improvementPercentage, 2),
            DailyMetrics: _mapper.Map<List<ProgressMetricsDto>>(metrics.OrderBy(m => m.MetricDate))
        );
    }
}
