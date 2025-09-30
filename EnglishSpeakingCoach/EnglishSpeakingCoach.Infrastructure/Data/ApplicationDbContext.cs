using EnglishSpeakingCoach.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EnglishSpeakingCoach.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Recording> Recordings => Set<Recording>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();
    public DbSet<ProgressMetrics> ProgressMetrics => Set<ProgressMetrics>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(500);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Level).HasMaxLength(50);
            entity.Property(e => e.ProfilePictureUrl).HasMaxLength(500);
        });

        // Lesson Configuration
        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Level).HasMaxLength(50);
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Content).HasMaxLength(5000);
            entity.Property(e => e.AudioUrl).HasMaxLength(500);
        });

        // Session Configuration
        modelBuilder.Entity<Session>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Sessions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Lesson)
                .WithMany(l => l.Sessions)
                .HasForeignKey(e => e.LessonId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Recording Configuration
        modelBuilder.Entity<Recording>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AudioUrl).IsRequired().HasMaxLength(500);
            entity.Property(e => e.OriginalFileName).HasMaxLength(255);
            entity.Property(e => e.Transcript).HasMaxLength(5000);
            entity.Property(e => e.ProcessingStatus).HasMaxLength(50);
            
            entity.HasOne(e => e.Session)
                .WithMany(s => s.Recordings)
                .HasForeignKey(e => e.SessionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Feedback Configuration
        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FeedbackType).HasMaxLength(50);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(2000);
            entity.Property(e => e.DetailedAnalysis).HasMaxLength(5000);
            entity.Property(e => e.Suggestion).HasMaxLength(1000);
            
            entity.HasOne(e => e.Recording)
                .WithMany(r => r.Feedbacks)
                .HasForeignKey(e => e.RecordingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ProgressMetrics Configuration
        modelBuilder.Entity<ProgressMetrics>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Period).HasMaxLength(50);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.ProgressMetrics)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => new { e.UserId, e.MetricDate, e.Period });
        });

        // Seed initial data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed some initial lessons
        modelBuilder.Entity<Lesson>().HasData(
            new Lesson
            {
                Id = 1,
                Title = "Basic Greetings",
                Description = "Learn common English greetings and introductions",
                Level = "Beginner",
                Category = "Conversation",
                Content = "Hello, Hi, Good morning, Good afternoon, Good evening, How are you?",
                DurationMinutes = 10,
                OrderIndex = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Lesson
            {
                Id = 2,
                Title = "Pronunciation: TH Sounds",
                Description = "Practice the 'th' sound in English",
                Level = "Beginner",
                Category = "Pronunciation",
                Content = "Think, Thank, The, This, That, Those, These",
                DurationMinutes = 15,
                OrderIndex = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Lesson
            {
                Id = 3,
                Title = "Business English Basics",
                Description = "Essential phrases for business conversations",
                Level = "Intermediate",
                Category = "Conversation",
                Content = "Nice to meet you, Let me introduce myself, I'd like to discuss, Could you please",
                DurationMinutes = 20,
                OrderIndex = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}
