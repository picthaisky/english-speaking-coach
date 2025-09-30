using EnglishSpeakingCoach.Application.Services;

namespace EnglishSpeakingCoach.Infrastructure.Services;

/// <summary>
/// Mock ML Service for ASR (Automatic Speech Recognition) and Pronunciation Scoring
/// In production, this would integrate with real ML services like Azure Speech Services,
/// Google Cloud Speech-to-Text, or custom ML models
/// </summary>
public class MockMLService : IMLService
{
    private readonly Random _random = new();

    public async Task<MLAnalysisResult> AnalyzeRecordingAsync(string audioUrl)
    {
        // Simulate processing delay
        await Task.Delay(1000);

        // Generate mock transcript
        var transcript = GenerateMockTranscript();

        // Generate mock scores (70-95 range for realistic results)
        var pronunciationScore = Math.Round(70 + _random.NextDouble() * 25, 2);
        var fluencyScore = Math.Round(70 + _random.NextDouble() * 25, 2);
        var accuracyScore = Math.Round(70 + _random.NextDouble() * 25, 2);

        // Generate mock feedback items
        var feedbackItems = GenerateMockFeedback();

        return new MLAnalysisResult(
            Transcript: transcript,
            PronunciationScore: pronunciationScore,
            FluencyScore: fluencyScore,
            AccuracyScore: accuracyScore,
            FeedbackItems: feedbackItems
        );
    }

    private string GenerateMockTranscript()
    {
        var templates = new[]
        {
            "Hello, how are you today? I am practicing my English speaking skills.",
            "Good morning. This is a test recording for pronunciation practice.",
            "Thank you very much for this opportunity to improve my English.",
            "I would like to schedule a meeting to discuss the project details.",
            "The weather is beautiful today. I think I'll go for a walk in the park."
        };

        return templates[_random.Next(templates.Length)];
    }

    private List<MLFeedbackItem> GenerateMockFeedback()
    {
        var feedbackTemplates = new[]
        {
            new MLFeedbackItem(
                Type: "Pronunciation",
                Content: "The 'th' sound needs improvement",
                DetailedAnalysis: "Focus on placing your tongue between your teeth for clearer 'th' sounds",
                Severity: 2,
                WordPosition: 3,
                Suggestion: "Practice words: think, thank, the, this"
            ),
            new MLFeedbackItem(
                Type: "Fluency",
                Content: "Good speaking pace",
                DetailedAnalysis: "Your speaking rhythm is natural and easy to understand",
                Severity: 1,
                WordPosition: null,
                Suggestion: "Keep maintaining this comfortable pace"
            ),
            new MLFeedbackItem(
                Type: "Grammar",
                Content: "Excellent sentence structure",
                DetailedAnalysis: "Correct use of present tense and word order",
                Severity: 1,
                WordPosition: null,
                Suggestion: "Continue using complete sentences"
            )
        };

        // Return 1-3 random feedback items
        var count = _random.Next(1, 4);
        return feedbackTemplates.Take(count).ToList();
    }
}
