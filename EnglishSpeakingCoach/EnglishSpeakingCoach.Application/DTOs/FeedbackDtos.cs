namespace EnglishSpeakingCoach.Application.DTOs;

public record FeedbackDto(
    int Id,
    int RecordingId,
    string FeedbackType,
    string Content,
    string? DetailedAnalysis,
    int? Severity,
    int? WordPosition,
    string? Suggestion,
    DateTime CreatedAt
);

public record CreateFeedbackRequest(
    int RecordingId,
    string FeedbackType,
    string Content,
    string? DetailedAnalysis,
    int? Severity,
    int? WordPosition,
    string? Suggestion
);
