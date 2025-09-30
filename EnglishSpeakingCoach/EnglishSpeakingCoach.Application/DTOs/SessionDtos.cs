namespace EnglishSpeakingCoach.Application.DTOs;

public record SessionDto(
    int Id,
    int UserId,
    int? LessonId,
    DateTime StartTime,
    DateTime? EndTime,
    int? DurationSeconds,
    string Status,
    string? Notes,
    string? LessonTitle
);

public record StartSessionRequest(
    int UserId,
    int? LessonId,
    string? Notes
);

public record EndSessionRequest(
    string? Notes
);

public record SessionSummaryDto(
    int Id,
    int RecordingsCount,
    int DurationSeconds,
    double? AveragePronunciationScore,
    string Status
);
