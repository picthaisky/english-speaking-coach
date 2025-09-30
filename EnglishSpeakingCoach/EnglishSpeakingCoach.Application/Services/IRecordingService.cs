using EnglishSpeakingCoach.Application.DTOs;

namespace EnglishSpeakingCoach.Application.Services;

public interface IRecordingService
{
    Task<RecordingDto> UploadRecordingAsync(UploadRecordingRequest request);
    Task<RecordingDto?> GetRecordingByIdAsync(int id);
    Task<IEnumerable<RecordingDto>> GetSessionRecordingsAsync(int sessionId);
    Task<RecordingAnalysisDto?> GetRecordingAnalysisAsync(int recordingId);
    Task ProcessRecordingAsync(int recordingId);
}
