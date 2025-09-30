namespace EnglishSpeakingCoach.Application.DTOs;

public record RegisterRequest(
    string Email,
    string Password,
    string FullName,
    string? Level = "Beginner"
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthResponse(
    int UserId,
    string Email,
    string FullName,
    string Token,
    DateTime ExpiresAt
);

public record UserDto(
    int Id,
    string Email,
    string FullName,
    string? ProfilePictureUrl,
    string Level,
    DateTime CreatedAt,
    DateTime? LastLoginAt
);
