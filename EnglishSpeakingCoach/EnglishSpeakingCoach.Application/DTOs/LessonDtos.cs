namespace EnglishSpeakingCoach.Application.DTOs;

public record LessonDto(
    int Id,
    string Title,
    string? Description,
    string Level,
    string? Category,
    string? Content,
    string? AudioUrl,
    int DurationMinutes,
    int OrderIndex,
    bool IsActive
);

public record CreateLessonRequest(
    string Title,
    string? Description,
    string Level,
    string? Category,
    string? Content,
    string? AudioUrl,
    int DurationMinutes,
    int OrderIndex
);

public record UpdateLessonRequest(
    string Title,
    string? Description,
    string Level,
    string? Category,
    string? Content,
    string? AudioUrl,
    int DurationMinutes,
    int OrderIndex,
    bool IsActive
);
