using EnglishSpeakingCoach.Application.DTOs;
using EnglishSpeakingCoach.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EnglishSpeakingCoach.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProgressController : ControllerBase
{
    private readonly IProgressService _progressService;
    private readonly ILogger<ProgressController> _logger;

    public ProgressController(IProgressService progressService, ILogger<ProgressController> logger)
    {
        _progressService = progressService;
        _logger = logger;
    }

    /// <summary>
    /// Get weekly progress summary for a user
    /// </summary>
    [HttpGet("user/{userId}/weekly")]
    [ProducesResponseType(typeof(ProgressSummaryDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProgressSummaryDto>> GetWeeklyProgress(int userId)
    {
        var progress = await _progressService.GetWeeklyProgressAsync(userId);
        return Ok(progress);
    }

    /// <summary>
    /// Get monthly progress summary for a user
    /// </summary>
    [HttpGet("user/{userId}/monthly")]
    [ProducesResponseType(typeof(ProgressSummaryDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProgressSummaryDto>> GetMonthlyProgress(int userId)
    {
        var progress = await _progressService.GetMonthlyProgressAsync(userId);
        return Ok(progress);
    }

    /// <summary>
    /// Get progress history for a user
    /// </summary>
    [HttpGet("user/{userId}/history")]
    [ProducesResponseType(typeof(IEnumerable<ProgressMetricsDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProgressMetricsDto>>> GetHistory(
        int userId,
        [FromQuery] int days = 30)
    {
        var history = await _progressService.GetUserProgressHistoryAsync(userId, days);
        return Ok(history);
    }

    /// <summary>
    /// Update progress metrics for a user (typically called at end of day)
    /// </summary>
    [HttpPost("user/{userId}/update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateProgress(int userId)
    {
        await _progressService.UpdateProgressMetricsAsync(userId);
        return Ok(new { message = "Progress metrics updated successfully" });
    }
}
