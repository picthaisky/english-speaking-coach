using EnglishSpeakingCoach.Domain.Entities;

namespace EnglishSpeakingCoach.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Lesson> Lessons { get; }
    IRepository<Session> Sessions { get; }
    IRepository<Recording> Recordings { get; }
    IRepository<Feedback> Feedbacks { get; }
    IRepository<ProgressMetrics> ProgressMetrics { get; }
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
