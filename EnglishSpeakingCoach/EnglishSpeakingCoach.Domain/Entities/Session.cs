namespace EnglishSpeakingCoach.Domain.Entities;

public class Session
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? LessonId { get; set; }
    public DateTime StartTime { get; set; } = DateTime.UtcNow;
    public DateTime? EndTime { get; set; }
    public int? DurationSeconds { get; set; }
    public string Status { get; set; } = "Active"; // Active, Completed, Abandoned
    public string? Notes { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Lesson? Lesson { get; set; }
    public ICollection<Recording> Recordings { get; set; } = new List<Recording>();
}
