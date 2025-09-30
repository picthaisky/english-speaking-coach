namespace EnglishSpeakingCoach.Application.Services;

public interface IMLService
{
    Task<MLAnalysisResult> AnalyzeRecordingAsync(string audioUrl);
}

public record MLAnalysisResult(
    string Transcript,
    double PronunciationScore,
    double FluencyScore,
    double AccuracyScore,
    List<MLFeedbackItem> FeedbackItems
);

public record MLFeedbackItem(
    string Type,
    string Content,
    string? DetailedAnalysis,
    int Severity,
    int? WordPosition,
    string? Suggestion
);
