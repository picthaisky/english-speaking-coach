# Database Migration Example

## Initial Database Schema

The `InitialCreate` migration creates the complete database schema for the English Speaking Coach application.

## Generated Tables

### 1. Users
```sql
CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Email] nvarchar(255) NOT NULL,
    [PasswordHash] nvarchar(500) NOT NULL,
    [FullName] nvarchar(200) NOT NULL,
    [ProfilePictureUrl] nvarchar(500) NULL,
    [Level] nvarchar(50) NOT NULL DEFAULT 'Beginner',
    [CreatedAt] datetime2 NOT NULL,
    [LastLoginAt] datetime2 NULL,
    [IsActive] bit NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
```

### 2. Lessons
```sql
CREATE TABLE [Lessons] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Title] nvarchar(255) NOT NULL,
    [Description] nvarchar(1000) NULL,
    [Level] nvarchar(50) NOT NULL DEFAULT 'Beginner',
    [Category] nvarchar(100) NULL,
    [Content] nvarchar(max) NULL,
    [AudioUrl] nvarchar(500) NULL,
    [DurationMinutes] int NOT NULL,
    [OrderIndex] int NOT NULL,
    [IsActive] bit NOT NULL DEFAULT 1,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Lessons] PRIMARY KEY ([Id])
);
```

### 3. Sessions
```sql
CREATE TABLE [Sessions] (
    [Id] int NOT NULL IDENTITY(1,1),
    [UserId] int NOT NULL,
    [LessonId] int NULL,
    [StartTime] datetime2 NOT NULL,
    [EndTime] datetime2 NULL,
    [DurationSeconds] int NULL,
    [Status] nvarchar(50) NOT NULL DEFAULT 'Active',
    [Notes] nvarchar(1000) NULL,
    CONSTRAINT [PK_Sessions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Sessions_Users_UserId] 
        FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Sessions_Lessons_LessonId] 
        FOREIGN KEY ([LessonId]) REFERENCES [Lessons] ([Id]) ON DELETE SET NULL
);

CREATE INDEX [IX_Sessions_UserId] ON [Sessions] ([UserId]);
CREATE INDEX [IX_Sessions_LessonId] ON [Sessions] ([LessonId]);
```

### 4. Recordings
```sql
CREATE TABLE [Recordings] (
    [Id] int NOT NULL IDENTITY(1,1),
    [SessionId] int NOT NULL,
    [AudioUrl] nvarchar(500) NOT NULL,
    [OriginalFileName] nvarchar(255) NULL,
    [DurationSeconds] int NULL,
    [FileSizeBytes] bigint NULL,
    [Transcript] nvarchar(max) NULL,
    [PronunciationScore] float NULL,
    [FluencyScore] float NULL,
    [AccuracyScore] float NULL,
    [ProcessingStatus] nvarchar(50) NOT NULL DEFAULT 'Pending',
    [CreatedAt] datetime2 NOT NULL,
    [ProcessedAt] datetime2 NULL,
    CONSTRAINT [PK_Recordings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Recordings_Sessions_SessionId] 
        FOREIGN KEY ([SessionId]) REFERENCES [Sessions] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Recordings_SessionId] ON [Recordings] ([SessionId]);
```

### 5. Feedbacks
```sql
CREATE TABLE [Feedbacks] (
    [Id] int NOT NULL IDENTITY(1,1),
    [RecordingId] int NOT NULL,
    [FeedbackType] nvarchar(50) NOT NULL DEFAULT 'General',
    [Content] nvarchar(2000) NOT NULL,
    [DetailedAnalysis] nvarchar(max) NULL,
    [Severity] int NULL,
    [WordPosition] int NULL,
    [Suggestion] nvarchar(1000) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Feedbacks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Feedbacks_Recordings_RecordingId] 
        FOREIGN KEY ([RecordingId]) REFERENCES [Recordings] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Feedbacks_RecordingId] ON [Feedbacks] ([RecordingId]);
```

### 6. ProgressMetrics
```sql
CREATE TABLE [ProgressMetrics] (
    [Id] int NOT NULL IDENTITY(1,1),
    [UserId] int NOT NULL,
    [MetricDate] datetime2 NOT NULL,
    [Period] nvarchar(50) NOT NULL DEFAULT 'Daily',
    [TotalSessions] int NOT NULL,
    [TotalRecordings] int NOT NULL,
    [TotalMinutesPracticed] int NOT NULL,
    [AveragePronunciationScore] float NOT NULL,
    [AverageFluencyScore] float NOT NULL,
    [AverageAccuracyScore] float NOT NULL,
    [OverallScore] float NOT NULL,
    [CompletedLessons] int NOT NULL,
    [Notes] nvarchar(1000) NULL,
    CONSTRAINT [PK_ProgressMetrics] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProgressMetrics_Users_UserId] 
        FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_ProgressMetrics_UserId_MetricDate_Period] 
    ON [ProgressMetrics] ([UserId], [MetricDate], [Period]);
```

## Seed Data

The migration includes initial seed data for lessons:

```sql
INSERT INTO [Lessons] ([Id], [Title], [Description], [Level], [Category], [Content], [DurationMinutes], [OrderIndex], [IsActive], [CreatedAt])
VALUES 
(1, 'Basic Greetings', 'Learn common English greetings and introductions', 'Beginner', 'Conversation', 
 'Hello, Hi, Good morning, Good afternoon, Good evening, How are you?', 10, 1, 1, GETUTCDATE()),

(2, 'Pronunciation: TH Sounds', 'Practice the ''th'' sound in English', 'Beginner', 'Pronunciation',
 'Think, Thank, The, This, That, Those, These', 15, 2, 1, GETUTCDATE()),

(3, 'Business English Basics', 'Essential phrases for business conversations', 'Intermediate', 'Conversation',
 'Nice to meet you, Let me introduce myself, I''d like to discuss, Could you please', 20, 3, 1, GETUTCDATE());
```

## Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
└──────┬──────┘
       │ 1
       │
       │ M
┌──────▼──────────┐         ┌─────────────┐
│    Sessions     │ M     1 │   Lessons   │
└──────┬──────────┘◄────────┤             │
       │ 1                  └─────────────┘
       │
       │ M
┌──────▼──────────┐
│   Recordings    │
└──────┬──────────┘
       │ 1
       │
       │ M
┌──────▼──────────┐
│   Feedbacks     │
└─────────────────┘

┌─────────────┐
│    Users    │
└──────┬──────┘
       │ 1
       │
       │ M
┌──────▼──────────┐
│ ProgressMetrics │
└─────────────────┘
```

## Running Migrations

### Create Migration
```bash
dotnet ef migrations add InitialCreate \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API
```

### Apply Migration
```bash
dotnet ef database update \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API
```

### Rollback Migration
```bash
dotnet ef database update PreviousMigration \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API
```

### Remove Last Migration
```bash
dotnet ef migrations remove \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API
```

### Generate SQL Script
```bash
dotnet ef migrations script \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API \
  --output migration.sql
```

## Example: Adding a New Field

### Step 1: Modify Entity
```csharp
// In User.cs
public class User
{
    // ... existing properties
    public string? PhoneNumber { get; set; }  // New field
}
```

### Step 2: Update DbContext Configuration
```csharp
// In ApplicationDbContext.cs
modelBuilder.Entity<User>(entity =>
{
    // ... existing configurations
    entity.Property(e => e.PhoneNumber).HasMaxLength(20);
});
```

### Step 3: Create Migration
```bash
dotnet ef migrations add AddPhoneNumberToUser \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API
```

### Step 4: Review Generated Migration
```csharp
public partial class AddPhoneNumberToUser : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "PhoneNumber",
            table: "Users",
            type: "nvarchar(20)",
            maxLength: 20,
            nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "PhoneNumber",
            table: "Users");
    }
}
```

### Step 5: Apply Migration
```bash
dotnet ef database update \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API
```

## Production Migration Strategy

### Option 1: Auto-migrate on Startup (Development Only)
```csharp
// In Program.cs
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}
```

### Option 2: Manual SQL Scripts (Production)
```bash
# Generate SQL script
dotnet ef migrations script \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API \
  --idempotent \
  --output production-migration.sql

# Review and apply manually on production database
```

### Option 3: CI/CD Pipeline
```yaml
- task: DotNetCoreCLI@2
  displayName: 'Apply Database Migrations'
  inputs:
    command: 'custom'
    custom: 'ef'
    arguments: 'database update --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API'
```

## Migration Best Practices

### ✅ Do's
- Always review generated migrations before applying
- Test migrations on a backup database first
- Use meaningful migration names
- Keep migrations small and focused
- Version control all migrations
- Generate idempotent scripts for production

### ❌ Don'ts
- Don't modify applied migrations
- Don't delete migration files from source control
- Don't apply migrations directly to production without testing
- Don't skip migrations in the sequence
- Don't use `EnsureCreated()` in production

## Troubleshooting

### Issue: "Migration already applied"
```bash
# Reset to a specific migration
dotnet ef database update TargetMigration \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API
```

### Issue: "Pending model changes"
```bash
# Check for differences
dotnet ef migrations list \
  --project EnglishSpeakingCoach.Infrastructure \
  --startup-project EnglishSpeakingCoach.API
```

### Issue: "Cannot connect to database"
```bash
# Verify connection string in appsettings.json
# Test with SQL Server Management Studio
# Check SQL Server service is running
```

## Data Seeding Strategies

### Strategy 1: In Migration (Current)
```csharp
migrationBuilder.InsertData(
    table: "Lessons",
    columns: new[] { "Id", "Title", "Description", ... },
    values: new object[] { 1, "Basic Greetings", "Learn...", ... });
```

### Strategy 2: Seed Method
```csharp
public static class DataSeeder
{
    public static void SeedData(ApplicationDbContext context)
    {
        if (!context.Lessons.Any())
        {
            context.Lessons.AddRange(
                new Lesson { Title = "Basic Greetings", ... },
                new Lesson { Title = "Pronunciation", ... }
            );
            context.SaveChanges();
        }
    }
}
```

### Strategy 3: JSON Import
```csharp
var json = File.ReadAllText("seed-data.json");
var lessons = JsonSerializer.Deserialize<List<Lesson>>(json);
context.Lessons.AddRange(lessons);
context.SaveChanges();
```

## Summary

The migration system provides:
- ✅ Automated schema management
- ✅ Version control for database changes
- ✅ Rollback capability
- ✅ Team collaboration support
- ✅ Production deployment strategies

For more information, see:
- [EF Core Migrations Documentation](https://docs.microsoft.com/ef/core/managing-schemas/migrations/)
- [Code-First Approach](https://docs.microsoft.com/ef/core/modeling/)
