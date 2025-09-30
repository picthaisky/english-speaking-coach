namespace EnglishSpeakingCoach.Domain.Entities;

public class Recording
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public required string AudioUrl { get; set; } // URL to audio file in object storage
    public string? OriginalFileName { get; set; }
    public int? DurationSeconds { get; set; }
    public long? FileSizeBytes { get; set; }
    public string? Transcript { get; set; } // ASR output
    public double? PronunciationScore { get; set; } // 0-100
    public double? FluencyScore { get; set; } // 0-100
    public double? AccuracyScore { get; set; } // 0-100
    public string ProcessingStatus { get; set; } = "Pending"; // Pending, Processing, Completed, Failed
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }

    // Navigation properties
    public Session Session { get; set; } = null!;
    public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
}
