# Quick Start Guide - English Speaking Coach API

## Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- ✅ **SQL Server** or **SQL Server LocalDB** - [Download](https://www.microsoft.com/sql-server/sql-server-downloads)
- ✅ **Visual Studio 2022** (recommended) or **VS Code** with C# extension
- ✅ **Git** - [Download](https://git-scm.com/)

## Step 1: Clone or Download the Project

```bash
# Clone the repository
git clone <repository-url>
cd EnglishSpeakingCoach

# Or if you already have it, navigate to the folder
cd /path/to/EnglishSpeakingCoach
```

## Step 2: Verify .NET Installation

```bash
dotnet --version
# Should output: 9.0.x
```

## Step 3: Restore NuGet Packages

```bash
dotnet restore
```

This will download all required dependencies including:
- Entity Framework Core
- AutoMapper
- JWT Bearer Authentication
- Swagger/OpenAPI

## Step 4: Configure Database Connection

### Option A: Using SQL Server LocalDB (Recommended for Development)

The default configuration uses LocalDB. No changes needed!

```json
// appsettings.json (already configured)
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=EnglishSpeakingCoachDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

### Option B: Using SQL Server

Edit `EnglishSpeakingCoach.API/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=EnglishSpeakingCoachDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True"
}
```

## Step 5: Apply Database Migrations

The database will be automatically created when you run the application for the first time (in Development mode).

**OR** you can manually apply migrations:

```bash
# Navigate to the solution folder
cd EnglishSpeakingCoach

# Apply migrations
dotnet ef database update --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API
```

This will create:
- **6 tables**: Users, Lessons, Sessions, Recordings, Feedbacks, ProgressMetrics
- **Initial seed data**: 3 sample lessons

## Step 6: Build the Solution

```bash
dotnet build
```

You should see:
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

## Step 7: Run the Application

```bash
cd EnglishSpeakingCoach.API
dotnet run
```

You should see output like:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started.
```

## Step 8: Test the API

### Open Swagger UI

Navigate to: **https://localhost:5001** or **http://localhost:5000**

You'll see the interactive Swagger API documentation!

### Test Registration

1. Click on **POST /api/auth/register**
2. Click **"Try it out"**
3. Enter the following JSON:

```json
{
  "email": "test@example.com",
  "password": "Test123!@#",
  "fullName": "Test User",
  "level": "Beginner"
}
```

4. Click **"Execute"**
5. You should get a **201 Created** response with a JWT token!

### Test Login

1. Click on **POST /api/auth/login**
2. Click **"Try it out"**
3. Enter:

```json
{
  "email": "test@example.com",
  "password": "Test123!@#"
}
```

4. Click **"Execute"**
5. Copy the `token` from the response

### Authorize in Swagger

1. Click the **"Authorize"** button (🔒) at the top
2. Enter: `Bearer YOUR_TOKEN_HERE`
3. Click **"Authorize"**
4. Now you can test protected endpoints!

### Test Getting Lessons

1. Click on **GET /api/lessons**
2. Click **"Try it out"**
3. Click **"Execute"**
4. You should see 3 pre-seeded lessons!

## Step 9: Test More Endpoints

### Start a Practice Session

```json
POST /api/sessions/start
{
  "userId": 1,
  "lessonId": 1,
  "notes": "First practice session"
}
```

### Upload a Recording

```json
POST /api/recordings/upload
{
  "sessionId": 1,
  "audioUrl": "https://example.com/recording.wav",
  "originalFileName": "practice.wav",
  "durationSeconds": 30,
  "fileSizeBytes": 512000
}
```

### Get Recording Analysis

```
GET /api/recordings/{id}/analysis
```

This will show:
- Transcript
- Pronunciation, Fluency, and Accuracy scores
- AI-generated feedback

### View Progress

```
GET /api/progress/user/1/weekly
GET /api/progress/user/1/monthly
```

## Common Issues & Solutions

### Issue 1: "dotnet command not found"

**Solution:** Install .NET 9 SDK from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)

### Issue 2: "Cannot connect to database"

**Solution:** 
- Verify SQL Server is running
- Check connection string in appsettings.json
- For LocalDB: `sqllocaldb start mssqllocaldb`

### Issue 3: "Port already in use"

**Solution:** Change ports in `launchSettings.json`:

```json
"applicationUrl": "https://localhost:5003;http://localhost:5002"
```

### Issue 4: "Migration failed"

**Solution:**
```bash
# Drop database and recreate
dotnet ef database drop --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API
dotnet ef database update --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API
```

### Issue 5: Build errors

**Solution:**
```bash
# Clean and rebuild
dotnet clean
dotnet restore
dotnet build
```

## Development Workflow

### 1. Making Code Changes

```bash
# Edit files in your IDE
# Save changes

# Build to check for errors
dotnet build

# Run the application
cd EnglishSpeakingCoach.API
dotnet run
```

### 2. Adding New Features

1. Create entities in **Domain** layer
2. Add DTOs in **Application** layer
3. Create services in **Infrastructure** layer
4. Add controllers in **API** layer
5. Test in Swagger

### 3. Database Changes

```bash
# Add migration
dotnet ef migrations add MigrationName --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API

# Apply migration
dotnet ef database update --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API
```

## VS Code Setup

If using VS Code, install these extensions:

1. **C# Dev Kit** (Microsoft)
2. **REST Client** or **Thunder Client** (for API testing)
3. **SQLite Viewer** (optional)

### Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (web)",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "build",
      "program": "${workspaceFolder}/EnglishSpeakingCoach.API/bin/Debug/net9.0/EnglishSpeakingCoach.API.dll",
      "args": [],
      "cwd": "${workspaceFolder}/EnglishSpeakingCoach.API",
      "stopAtEntry": false,
      "serverReadyAction": {
        "action": "openExternally",
        "pattern": "\\bNow listening on:\\s+(https?://\\S+)"
      },
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  ]
}
```

## Testing with Postman

### Import Collection

1. Open Postman
2. Import this collection:

```json
{
  "info": {
    "name": "English Speaking Coach API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!@#\",\n  \"fullName\": \"Test User\",\n  \"level\": \"Beginner\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "https://localhost:5001/api/auth/register",
              "protocol": "https",
              "host": ["localhost"],
              "port": "5001",
              "path": ["api", "auth", "register"]
            }
          }
        }
      ]
    }
  ]
}
```

## Production Deployment Checklist

Before deploying to production:

- [ ] Update connection string to production database
- [ ] Change JWT secret key to a strong, secure key
- [ ] Update CORS origins to production frontend URL
- [ ] Disable Swagger in production (or secure it)
- [ ] Enable HTTPS only
- [ ] Configure logging to a centralized service
- [ ] Set up health checks
- [ ] Configure backup and disaster recovery
- [ ] Review and apply security best practices
- [ ] Set up monitoring and alerts

## Next Steps

1. 📚 Read the [API Contract](API_CONTRACT.md) for detailed endpoint documentation
2. 🏗️ Review [Best Practices](BEST_PRACTICES.md) for development guidelines
3. 📂 Check [Folder Structure](FOLDER_STRUCTURE.md) to understand the architecture
4. 🧪 Write unit tests for your new features
5. 🔄 Integrate with Angular frontend

## Getting Help

- 📖 Check the [README.md](README.md) for comprehensive documentation
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions
- 📧 Contact support: support@englishcoach.com

## Useful Commands Reference

```bash
# Build
dotnet build

# Run
dotnet run --project EnglishSpeakingCoach.API

# Test (when tests are added)
dotnet test

# Clean
dotnet clean

# Restore packages
dotnet restore

# Create migration
dotnet ef migrations add MigrationName --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API

# Update database
dotnet ef database update --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API

# Drop database
dotnet ef database drop --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API

# List migrations
dotnet ef migrations list --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API
```

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/user/{id}` - Get user profile

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/{id}` - Get lesson by ID
- `GET /api/lessons/level/{level}` - Get lessons by level
- `POST /api/lessons` - Create lesson
- `PUT /api/lessons/{id}` - Update lesson
- `DELETE /api/lessons/{id}` - Delete lesson

### Sessions
- `POST /api/sessions/start` - Start session
- `POST /api/sessions/{id}/end` - End session
- `GET /api/sessions/{id}` - Get session
- `GET /api/sessions/user/{userId}` - Get user sessions
- `GET /api/sessions/{id}/summary` - Get session summary

### Recordings
- `POST /api/recordings/upload` - Upload recording
- `GET /api/recordings/{id}` - Get recording
- `GET /api/recordings/session/{sessionId}` - Get session recordings
- `GET /api/recordings/{id}/analysis` - Get recording analysis

### Progress
- `GET /api/progress/user/{userId}/weekly` - Weekly progress
- `GET /api/progress/user/{userId}/monthly` - Monthly progress
- `GET /api/progress/user/{userId}/history` - Progress history
- `POST /api/progress/user/{userId}/update` - Update metrics

---

**Happy Coding! 🚀**
