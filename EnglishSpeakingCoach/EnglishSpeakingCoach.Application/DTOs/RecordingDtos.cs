namespace EnglishSpeakingCoach.Application.DTOs;

public record RecordingDto(
    int Id,
    int SessionId,
    string AudioUrl,
    string? OriginalFileName,
    int? DurationSeconds,
    long? FileSizeBytes,
    string? Transcript,
    double? PronunciationScore,
    double? FluencyScore,
    double? AccuracyScore,
    string ProcessingStatus,
    DateTime CreatedAt,
    DateTime? ProcessedAt
);

public record UploadRecordingRequest(
    int SessionId,
    string AudioUrl,
    string? OriginalFileName,
    int? DurationSeconds,
    long? FileSizeBytes
);

public record RecordingAnalysisDto(
    int RecordingId,
    string? Transcript,
    double? PronunciationScore,
    double? FluencyScore,
    double? AccuracyScore,
    List<FeedbackDto> Feedbacks
);
