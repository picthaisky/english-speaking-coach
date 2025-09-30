namespace EnglishSpeakingCoach.Domain.Entities;

public class ProgressMetrics
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime MetricDate { get; set; } = DateTime.UtcNow;
    public string Period { get; set; } = "Daily"; // Daily, Weekly, Monthly
    public int TotalSessions { get; set; }
    public int TotalRecordings { get; set; }
    public int TotalMinutesPracticed { get; set; }
    public double AveragePronunciationScore { get; set; }
    public double AverageFluencyScore { get; set; }
    public double AverageAccuracyScore { get; set; }
    public double OverallScore { get; set; }
    public int CompletedLessons { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}
