namespace EnglishSpeakingCoach.Domain.Entities;

public class Lesson
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public string Level { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced
    public string? Category { get; set; } // Conversation, Pronunciation, Grammar, etc.
    public string? Content { get; set; } // Lesson content/script
    public string? AudioUrl { get; set; } // Reference audio for the lesson
    public int DurationMinutes { get; set; }
    public int OrderIndex { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
}
