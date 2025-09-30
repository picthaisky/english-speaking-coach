using EnglishSpeakingCoach.Application.DTOs;

namespace EnglishSpeakingCoach.Application.Services;

public interface IProgressService
{
    Task<ProgressSummaryDto> GetWeeklyProgressAsync(int userId);
    Task<ProgressSummaryDto> GetMonthlyProgressAsync(int userId);
    Task<IEnumerable<ProgressMetricsDto>> GetUserProgressHistoryAsync(int userId, int days);
    Task UpdateProgressMetricsAsync(int userId);
}
