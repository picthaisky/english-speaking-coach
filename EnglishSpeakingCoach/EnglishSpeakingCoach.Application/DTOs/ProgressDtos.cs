namespace EnglishSpeakingCoach.Application.DTOs;

public record ProgressMetricsDto(
    int Id,
    int UserId,
    DateTime MetricDate,
    string Period,
    int TotalSessions,
    int TotalRecordings,
    int TotalMinutesPracticed,
    double AveragePronunciationScore,
    double AverageFluencyScore,
    double AverageAccuracyScore,
    double OverallScore,
    int CompletedLessons,
    string? Notes
);

public record ProgressSummaryDto(
    string Period,
    int TotalSessions,
    int TotalRecordings,
    int TotalMinutesPracticed,
    double AverageScore,
    double ImprovementPercentage,
    List<ProgressMetricsDto> DailyMetrics
);
