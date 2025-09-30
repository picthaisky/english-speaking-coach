namespace EnglishSpeakingCoach.Domain.Entities;

public class Feedback
{
    public int Id { get; set; }
    public int RecordingId { get; set; }
    public string FeedbackType { get; set; } = "General"; // General, Pronunciation, Grammar, Fluency
    public required string Content { get; set; }
    public string? DetailedAnalysis { get; set; } // JSON or detailed text analysis
    public int? Severity { get; set; } // 1-5 (1=minor, 5=critical)
    public int? WordPosition { get; set; } // Position in transcript if applicable
    public string? Suggestion { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Recording Recording { get; set; } = null!;
}
