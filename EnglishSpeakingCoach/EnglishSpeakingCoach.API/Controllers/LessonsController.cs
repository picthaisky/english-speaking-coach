using EnglishSpeakingCoach.Application.DTOs;
using EnglishSpeakingCoach.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EnglishSpeakingCoach.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class LessonsController : ControllerBase
{
    private readonly ILessonService _lessonService;
    private readonly ILogger<LessonsController> _logger;

    public LessonsController(ILessonService lessonService, ILogger<LessonsController> logger)
    {
        _lessonService = lessonService;
        _logger = logger;
    }

    /// <summary>
    /// Get all active lessons
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<LessonDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<LessonDto>>> GetAll()
    {
        var lessons = await _lessonService.GetAllLessonsAsync();
        return Ok(lessons);
    }

    /// <summary>
    /// Get lessons by level (Beginner, Intermediate, Advanced)
    /// </summary>
    [HttpGet("level/{level}")]
    [ProducesResponseType(typeof(IEnumerable<LessonDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<LessonDto>>> GetByLevel(string level)
    {
        var lessons = await _lessonService.GetLessonsByLevelAsync(level);
        return Ok(lessons);
    }

    /// <summary>
    /// Get lesson by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(LessonDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LessonDto>> GetById(int id)
    {
        var lesson = await _lessonService.GetLessonByIdAsync(id);
        if (lesson == null)
        {
            return NotFound();
        }
        return Ok(lesson);
    }

    /// <summary>
    /// Create a new lesson
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(LessonDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LessonDto>> Create([FromBody] CreateLessonRequest request)
    {
        var lesson = await _lessonService.CreateLessonAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = lesson.Id }, lesson);
    }

    /// <summary>
    /// Update an existing lesson
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(LessonDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LessonDto>> Update(int id, [FromBody] UpdateLessonRequest request)
    {
        try
        {
            var lesson = await _lessonService.UpdateLessonAsync(id, request);
            return Ok(lesson);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Delete (soft delete) a lesson
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _lessonService.DeleteLessonAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
