using EnglishSpeakingCoach.Application.DTOs;
using EnglishSpeakingCoach.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EnglishSpeakingCoach.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class RecordingsController : ControllerBase
{
    private readonly IRecordingService _recordingService;
    private readonly ILogger<RecordingsController> _logger;

    public RecordingsController(IRecordingService recordingService, ILogger<RecordingsController> logger)
    {
        _recordingService = recordingService;
        _logger = logger;
    }

    /// <summary>
    /// Upload a new recording
    /// </summary>
    /// <remarks>
    /// In production, this would handle actual file upload to object storage.
    /// For now, it accepts the audio URL where the file has been uploaded.
    /// </remarks>
    [HttpPost("upload")]
    [ProducesResponseType(typeof(RecordingDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<RecordingDto>> Upload([FromBody] UploadRecordingRequest request)
    {
        var recording = await _recordingService.UploadRecordingAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = recording.Id }, recording);
    }

    /// <summary>
    /// Get recording by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RecordingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RecordingDto>> GetById(int id)
    {
        var recording = await _recordingService.GetRecordingByIdAsync(id);
        if (recording == null)
        {
            return NotFound();
        }
        return Ok(recording);
    }

    /// <summary>
    /// Get all recordings for a session
    /// </summary>
    [HttpGet("session/{sessionId}")]
    [ProducesResponseType(typeof(IEnumerable<RecordingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RecordingDto>>> GetSessionRecordings(int sessionId)
    {
        var recordings = await _recordingService.GetSessionRecordingsAsync(sessionId);
        return Ok(recordings);
    }

    /// <summary>
    /// Get recording analysis with transcript and feedback
    /// </summary>
    [HttpGet("{id}/analysis")]
    [ProducesResponseType(typeof(RecordingAnalysisDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RecordingAnalysisDto>> GetAnalysis(int id)
    {
        var analysis = await _recordingService.GetRecordingAnalysisAsync(id);
        if (analysis == null)
        {
            return NotFound();
        }
        return Ok(analysis);
    }
}
