using AutoMapper;
using EnglishSpeakingCoach.Application.DTOs;
using EnglishSpeakingCoach.Domain.Entities;

namespace EnglishSpeakingCoach.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        
        // Lesson mappings
        CreateMap<Lesson, LessonDto>();
        CreateMap<CreateLessonRequest, Lesson>();
        CreateMap<UpdateLessonRequest, Lesson>();
        
        // Session mappings
        CreateMap<Session, SessionDto>()
            .ForMember(dest => dest.LessonTitle, 
                opt => opt.MapFrom(src => src.Lesson != null ? src.Lesson.Title : null));
        CreateMap<StartSessionRequest, Session>();
        
        // Recording mappings
        CreateMap<Recording, RecordingDto>();
        CreateMap<UploadRecordingRequest, Recording>();
        
        // Feedback mappings
        CreateMap<Feedback, FeedbackDto>();
        CreateMap<CreateFeedbackRequest, Feedback>();
        
        // Progress mappings
        CreateMap<ProgressMetrics, ProgressMetricsDto>();
    }
}
