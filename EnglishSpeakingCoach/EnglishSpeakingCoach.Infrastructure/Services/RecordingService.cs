using AutoMapper;
using EnglishSpeakingCoach.Application.DTOs;
using EnglishSpeakingCoach.Application.Services;
using EnglishSpeakingCoach.Domain.Entities;
using EnglishSpeakingCoach.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using EnglishSpeakingCoach.Infrastructure.Data;

namespace EnglishSpeakingCoach.Infrastructure.Services;

public class RecordingService : IRecordingService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IMLService _mlService;
    private readonly ApplicationDbContext _context;

    public RecordingService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IMLService mlService,
        ApplicationDbContext context)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _mlService = mlService;
        _context = context;
    }

    public async Task<RecordingDto> UploadRecordingAsync(UploadRecordingRequest request)
    {
        var recording = _mapper.Map<Recording>(request);
        recording.CreatedAt = DateTime.UtcNow;
        recording.ProcessingStatus = "Pending";

        await _unitOfWork.Recordings.AddAsync(recording);
        await _unitOfWork.SaveChangesAsync();

        // Trigger async processing (in real app, this would be a background job)
        _ = Task.Run(async () => await ProcessRecordingAsync(recording.Id));

        return _mapper.Map<RecordingDto>(recording);
    }

    public async Task<RecordingDto?> GetRecordingByIdAsync(int id)
    {
        var recording = await _unitOfWork.Recordings.GetByIdAsync(id);
        return recording == null ? null : _mapper.Map<RecordingDto>(recording);
    }

    public async Task<IEnumerable<RecordingDto>> GetSessionRecordingsAsync(int sessionId)
    {
        var recordings = await _unitOfWork.Recordings.FindAsync(r => r.SessionId == sessionId);
        return _mapper.Map<IEnumerable<RecordingDto>>(recordings.OrderBy(r => r.CreatedAt));
    }

    public async Task<RecordingAnalysisDto?> GetRecordingAnalysisAsync(int recordingId)
    {
        var recording = await _context.Recordings
            .Include(r => r.Feedbacks)
            .FirstOrDefaultAsync(r => r.Id == recordingId);

        if (recording == null)
        {
            return null;
        }

        var feedbacks = _mapper.Map<List<FeedbackDto>>(recording.Feedbacks);

        return new RecordingAnalysisDto(
            RecordingId: recording.Id,
            Transcript: recording.Transcript,
            PronunciationScore: recording.PronunciationScore,
            FluencyScore: recording.FluencyScore,
            AccuracyScore: recording.AccuracyScore,
            Feedbacks: feedbacks
        );
    }

    public async Task ProcessRecordingAsync(int recordingId)
    {
        var recording = await _unitOfWork.Recordings.GetByIdAsync(recordingId);
        if (recording == null)
        {
            return;
        }

        try
        {
            recording.ProcessingStatus = "Processing";
            await _unitOfWork.Recordings.UpdateAsync(recording);
            await _unitOfWork.SaveChangesAsync();

            // Call ML service for analysis
            var analysis = await _mlService.AnalyzeRecordingAsync(recording.AudioUrl);

            // Update recording with analysis results
            recording.Transcript = analysis.Transcript;
            recording.PronunciationScore = analysis.PronunciationScore;
            recording.FluencyScore = analysis.FluencyScore;
            recording.AccuracyScore = analysis.AccuracyScore;
            recording.ProcessingStatus = "Completed";
            recording.ProcessedAt = DateTime.UtcNow;

            await _unitOfWork.Recordings.UpdateAsync(recording);

            // Save feedback items
            foreach (var feedbackItem in analysis.FeedbackItems)
            {
                var feedback = new Feedback
                {
                    RecordingId = recordingId,
                    FeedbackType = feedbackItem.Type,
                    Content = feedbackItem.Content,
                    DetailedAnalysis = feedbackItem.DetailedAnalysis,
                    Severity = feedbackItem.Severity,
                    WordPosition = feedbackItem.WordPosition,
                    Suggestion = feedbackItem.Suggestion,
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.Feedbacks.AddAsync(feedback);
            }

            await _unitOfWork.SaveChangesAsync();
        }
        catch
        {
            recording.ProcessingStatus = "Failed";
            await _unitOfWork.Recordings.UpdateAsync(recording);
            await _unitOfWork.SaveChangesAsync();
            throw;
        }
    }
}
