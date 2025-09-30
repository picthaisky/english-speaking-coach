namespace EnglishSpeakingCoach.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string FullName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string Level { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    public ICollection<ProgressMetrics> ProgressMetrics { get; set; } = new List<ProgressMetrics>();
}
