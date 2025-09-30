using AutoMapper;
using EnglishSpeakingCoach.Application.DTOs;
using EnglishSpeakingCoach.Application.Services;
using EnglishSpeakingCoach.Domain.Entities;
using EnglishSpeakingCoach.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using EnglishSpeakingCoach.Infrastructure.Data;

namespace EnglishSpeakingCoach.Infrastructure.Services;

public class SessionService : ISessionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;

    public SessionService(IUnitOfWork unitOfWork, IMapper mapper, ApplicationDbContext context)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _context = context;
    }

    public async Task<SessionDto> StartSessionAsync(StartSessionRequest request)
    {
        var session = new Session
        {
            UserId = request.UserId,
            LessonId = request.LessonId,
            StartTime = DateTime.UtcNow,
            Status = "Active",
            Notes = request.Notes
        };

        await _unitOfWork.Sessions.AddAsync(session);
        await _unitOfWork.SaveChangesAsync();

        // Load related entities for mapping
        session = await _context.Sessions
            .Include(s => s.Lesson)
            .FirstAsync(s => s.Id == session.Id);

        return _mapper.Map<SessionDto>(session);
    }

    public async Task<SessionDto> EndSessionAsync(int sessionId, EndSessionRequest request)
    {
        var session = await _context.Sessions
            .Include(s => s.Lesson)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null)
        {
            throw new KeyNotFoundException($"Session with ID {sessionId} not found");
        }

        session.EndTime = DateTime.UtcNow;
        session.DurationSeconds = (int)(session.EndTime.Value - session.StartTime).TotalSeconds;
        session.Status = "Completed";
        if (!string.IsNullOrEmpty(request.Notes))
        {
            session.Notes = request.Notes;
        }

        await _unitOfWork.Sessions.UpdateAsync(session);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<SessionDto>(session);
    }

    public async Task<SessionDto?> GetSessionByIdAsync(int id)
    {
        var session = await _context.Sessions
            .Include(s => s.Lesson)
            .FirstOrDefaultAsync(s => s.Id == id);

        return session == null ? null : _mapper.Map<SessionDto>(session);
    }

    public async Task<IEnumerable<SessionDto>> GetUserSessionsAsync(int userId)
    {
        var sessions = await _context.Sessions
            .Include(s => s.Lesson)
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.StartTime)
            .ToListAsync();

        return _mapper.Map<IEnumerable<SessionDto>>(sessions);
    }

    public async Task<SessionSummaryDto?> GetSessionSummaryAsync(int sessionId)
    {
        var session = await _context.Sessions
            .Include(s => s.Recordings)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null)
        {
            return null;
        }

        var avgScore = session.Recordings.Any(r => r.PronunciationScore.HasValue)
            ? session.Recordings.Where(r => r.PronunciationScore.HasValue)
                .Average(r => r.PronunciationScore!.Value)
            : (double?)null;

        return new SessionSummaryDto(
            Id: session.Id,
            RecordingsCount: session.Recordings.Count,
            DurationSeconds: session.DurationSeconds ?? 0,
            AveragePronunciationScore: avgScore,
            Status: session.Status
        );
    }
}
