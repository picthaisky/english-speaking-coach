using EnglishSpeakingCoach.Application.DTOs;

namespace EnglishSpeakingCoach.Application.Services;

public interface ISessionService
{
    Task<SessionDto> StartSessionAsync(StartSessionRequest request);
    Task<SessionDto> EndSessionAsync(int sessionId, EndSessionRequest request);
    Task<SessionDto?> GetSessionByIdAsync(int id);
    Task<IEnumerable<SessionDto>> GetUserSessionsAsync(int userId);
    Task<SessionSummaryDto?> GetSessionSummaryAsync(int sessionId);
}
