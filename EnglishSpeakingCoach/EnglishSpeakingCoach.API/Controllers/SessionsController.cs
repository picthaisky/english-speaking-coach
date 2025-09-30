using EnglishSpeakingCoach.Application.DTOs;
using EnglishSpeakingCoach.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EnglishSpeakingCoach.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SessionsController : ControllerBase
{
    private readonly ISessionService _sessionService;
    private readonly ILogger<SessionsController> _logger;

    public SessionsController(ISessionService sessionService, ILogger<SessionsController> logger)
    {
        _sessionService = sessionService;
        _logger = logger;
    }

    /// <summary>
    /// Start a new practice session
    /// </summary>
    [HttpPost("start")]
    [ProducesResponseType(typeof(SessionDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<SessionDto>> StartSession([FromBody] StartSessionRequest request)
    {
        var session = await _sessionService.StartSessionAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = session.Id }, session);
    }

    /// <summary>
    /// End an active session
    /// </summary>
    [HttpPost("{id}/end")]
    [ProducesResponseType(typeof(SessionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessionDto>> EndSession(int id, [FromBody] EndSessionRequest request)
    {
        try
        {
            var session = await _sessionService.EndSessionAsync(id, request);
            return Ok(session);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Get session by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(SessionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessionDto>> GetById(int id)
    {
        var session = await _sessionService.GetSessionByIdAsync(id);
        if (session == null)
        {
            return NotFound();
        }
        return Ok(session);
    }

    /// <summary>
    /// Get all sessions for a user
    /// </summary>
    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(IEnumerable<SessionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SessionDto>>> GetUserSessions(int userId)
    {
        var sessions = await _sessionService.GetUserSessionsAsync(userId);
        return Ok(sessions);
    }

    /// <summary>
    /// Get session summary with statistics
    /// </summary>
    [HttpGet("{id}/summary")]
    [ProducesResponseType(typeof(SessionSummaryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessionSummaryDto>> GetSummary(int id)
    {
        var summary = await _sessionService.GetSessionSummaryAsync(id);
        if (summary == null)
        {
            return NotFound();
        }
        return Ok(summary);
    }
}
