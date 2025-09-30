using AutoMapper;
using EnglishSpeakingCoach.Application.DTOs;
using EnglishSpeakingCoach.Application.Services;
using EnglishSpeakingCoach.Domain.Entities;
using EnglishSpeakingCoach.Domain.Interfaces;

namespace EnglishSpeakingCoach.Infrastructure.Services;

public class LessonService : ILessonService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public LessonService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<LessonDto>> GetAllLessonsAsync()
    {
        var lessons = await _unitOfWork.Lessons.FindAsync(l => l.IsActive);
        return _mapper.Map<IEnumerable<LessonDto>>(lessons.OrderBy(l => l.OrderIndex));
    }

    public async Task<IEnumerable<LessonDto>> GetLessonsByLevelAsync(string level)
    {
        var lessons = await _unitOfWork.Lessons.FindAsync(l => l.IsActive && l.Level == level);
        return _mapper.Map<IEnumerable<LessonDto>>(lessons.OrderBy(l => l.OrderIndex));
    }

    public async Task<LessonDto?> GetLessonByIdAsync(int id)
    {
        var lesson = await _unitOfWork.Lessons.GetByIdAsync(id);
        return lesson == null ? null : _mapper.Map<LessonDto>(lesson);
    }

    public async Task<LessonDto> CreateLessonAsync(CreateLessonRequest request)
    {
        var lesson = _mapper.Map<Lesson>(request);
        lesson.CreatedAt = DateTime.UtcNow;
        lesson.IsActive = true;

        await _unitOfWork.Lessons.AddAsync(lesson);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<LessonDto>(lesson);
    }

    public async Task<LessonDto> UpdateLessonAsync(int id, UpdateLessonRequest request)
    {
        var lesson = await _unitOfWork.Lessons.GetByIdAsync(id);
        if (lesson == null)
        {
            throw new KeyNotFoundException($"Lesson with ID {id} not found");
        }

        _mapper.Map(request, lesson);
        lesson.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Lessons.UpdateAsync(lesson);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<LessonDto>(lesson);
    }

    public async Task<bool> DeleteLessonAsync(int id)
    {
        var lesson = await _unitOfWork.Lessons.GetByIdAsync(id);
        if (lesson == null)
        {
            return false;
        }

        // Soft delete
        lesson.IsActive = false;
        await _unitOfWork.Lessons.UpdateAsync(lesson);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
