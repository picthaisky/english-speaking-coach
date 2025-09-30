using EnglishSpeakingCoach.Application.DTOs;

namespace EnglishSpeakingCoach.Application.Services;

public interface ILessonService
{
    Task<IEnumerable<LessonDto>> GetAllLessonsAsync();
    Task<IEnumerable<LessonDto>> GetLessonsByLevelAsync(string level);
    Task<LessonDto?> GetLessonByIdAsync(int id);
    Task<LessonDto> CreateLessonAsync(CreateLessonRequest request);
    Task<LessonDto> UpdateLessonAsync(int id, UpdateLessonRequest request);
    Task<bool> DeleteLessonAsync(int id);
}
