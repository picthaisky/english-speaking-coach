using EnglishSpeakingCoach.Domain.Entities;
using EnglishSpeakingCoach.Domain.Interfaces;
using EnglishSpeakingCoach.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace EnglishSpeakingCoach.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Users = new Repository<User>(_context);
        Lessons = new Repository<Lesson>(_context);
        Sessions = new Repository<Session>(_context);
        Recordings = new Repository<Recording>(_context);
        Feedbacks = new Repository<Feedback>(_context);
        ProgressMetrics = new Repository<ProgressMetrics>(_context);
    }

    public IRepository<User> Users { get; }
    public IRepository<Lesson> Lessons { get; }
    public IRepository<Session> Sessions { get; }
    public IRepository<Recording> Recordings { get; }
    public IRepository<Feedback> Feedbacks { get; }
    public IRepository<ProgressMetrics> ProgressMetrics { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await SaveChangesAsync();
            await _transaction!.CommitAsync();
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
