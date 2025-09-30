# English Speaking Coach - .NET Core 9 Backend API

## Overview
**English Speaking Coach** is a comprehensive backend API system built with .NET Core 9 that helps users practice and improve their English speaking skills. The system processes voice recordings, provides AI-powered feedback, and tracks progress over time.

## Architecture
The project follows **Clean Architecture** principles with the following layers:

### Solution Structure
```
EnglishSpeakingCoach/
├── EnglishSpeakingCoach.Domain/          # Core business entities and interfaces
│   ├── Entities/                          # Domain entities
│   │   ├── User.cs
│   │   ├── Lesson.cs
│   │   ├── Session.cs
│   │   ├── Recording.cs
│   │   ├── Feedback.cs
│   │   └── ProgressMetrics.cs
│   └── Interfaces/                        # Repository interfaces
│       ├── IRepository.cs
│       └── IUnitOfWork.cs
│
├── EnglishSpeakingCoach.Application/     # Business logic and DTOs
│   ├── DTOs/                              # Data Transfer Objects
│   │   ├── AuthDtos.cs
│   │   ├── LessonDtos.cs
│   │   ├── SessionDtos.cs
│   │   ├── RecordingDtos.cs
│   │   ├── FeedbackDtos.cs
│   │   └── ProgressDtos.cs
│   ├── Mappings/                          # AutoMapper profiles
│   │   └── MappingProfile.cs
│   └── Services/                          # Service interfaces
│       ├── IAuthService.cs
│       ├── ILessonService.cs
│       ├── ISessionService.cs
│       ├── IRecordingService.cs
│       ├── IProgressService.cs
│       └── IMLService.cs
│
├── EnglishSpeakingCoach.Infrastructure/  # Data access and external services
│   ├── Data/                              # Database context
│   │   └── ApplicationDbContext.cs
│   ├── Repositories/                      # Repository implementations
│   │   ├── Repository.cs
│   │   └── UnitOfWork.cs
│   ├── Services/                          # Service implementations
│   │   ├── AuthService.cs
│   │   ├── LessonService.cs
│   │   ├── SessionService.cs
│   │   ├── RecordingService.cs
│   │   ├── ProgressService.cs
│   │   └── MockMLService.cs
│   └── Migrations/                        # EF Core migrations
│
└── EnglishSpeakingCoach.API/             # Web API layer
    ├── Controllers/                       # API controllers
    │   ├── AuthController.cs
    │   ├── LessonsController.cs
    │   ├── SessionsController.cs
    │   ├── RecordingsController.cs
    │   └── ProgressController.cs
    ├── Program.cs                         # Application configuration
    └── appsettings.json                   # Configuration settings
```

## Technologies Used
- **.NET Core 9** - Latest .NET framework
- **Entity Framework Core 9** - ORM for database operations
- **SQL Server** - Database (LocalDB for development)
- **AutoMapper** - Object-to-object mapping
- **JWT Authentication** - Secure authentication
- **Swagger/OpenAPI** - API documentation
- **CORS** - Cross-origin resource sharing for Angular frontend

## Core Features

### 1. Authentication & User Management
- User registration with email and password
- JWT-based authentication
- User profile management
- Role-based access (extensible)

### 2. Lesson Management
- CRUD operations for lessons
- Categorization by level (Beginner, Intermediate, Advanced)
- Category-based filtering (Conversation, Pronunciation, Grammar, etc.)
- Lesson content and reference audio management

### 3. Practice Sessions
- Start/End session tracking
- Session duration monitoring
- Association with specific lessons (optional)
- Session notes and metadata

### 4. Recording Management
- Voice recording upload (stores URL to object storage)
- Automatic ASR (Automatic Speech Recognition) processing
- Pronunciation scoring (0-100)
- Fluency and accuracy scoring
- Transcript generation

### 5. Feedback System
- AI-generated feedback on recordings
- Multiple feedback types (Pronunciation, Grammar, Fluency)
- Severity levels (1-5)
- Actionable suggestions for improvement
- Word-level feedback positioning

### 6. Progress Tracking
- Daily, weekly, and monthly metrics
- Score trending and improvement analysis
- Practice time tracking
- Completed lessons tracking
- Historical progress data

## Database Schema

### Entity Relationships
```
User (1) ──< (M) Session (M) >── (1) Lesson
             │
             │ (1)
             ▼
        Recording (M)
             │
             │ (1)
             ▼
         Feedback (M)

User (1) ──< (M) ProgressMetrics
```

### Key Tables
- **Users** - User accounts and profiles
- **Lessons** - Learning content
- **Sessions** - Practice sessions
- **Recordings** - Audio recordings with analysis
- **Feedbacks** - AI-generated feedback items
- **ProgressMetrics** - Progress tracking data

## API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/user/{id}       - Get user profile
```

### Lessons
```
GET    /api/lessons              - Get all lessons
GET    /api/lessons/{id}         - Get lesson by ID
GET    /api/lessons/level/{level} - Get lessons by level
POST   /api/lessons              - Create new lesson
PUT    /api/lessons/{id}         - Update lesson
DELETE /api/lessons/{id}         - Delete lesson (soft delete)
```

### Sessions
```
POST   /api/sessions/start       - Start new session
POST   /api/sessions/{id}/end    - End session
GET    /api/sessions/{id}        - Get session details
GET    /api/sessions/user/{userId} - Get user's sessions
GET    /api/sessions/{id}/summary - Get session summary
```

### Recordings
```
POST   /api/recordings/upload    - Upload new recording
GET    /api/recordings/{id}      - Get recording details
GET    /api/recordings/session/{sessionId} - Get session recordings
GET    /api/recordings/{id}/analysis - Get recording analysis with feedback
```

### Progress
```
GET    /api/progress/user/{userId}/weekly - Get weekly progress
GET    /api/progress/user/{userId}/monthly - Get monthly progress
GET    /api/progress/user/{userId}/history?days=30 - Get progress history
POST   /api/progress/user/{userId}/update - Update progress metrics
```

## Configuration

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=EnglishSpeakingCoachDb;Trusted_Connection=True"
  },
  "JwtSettings": {
    "SecretKey": "YourSecretKeyHere",
    "Issuer": "EnglishSpeakingCoach",
    "Audience": "EnglishSpeakingCoachUsers",
    "ExpirationHours": 24
  },
  "ObjectStorage": {
    "Provider": "Azure",
    "ConnectionString": "",
    "ContainerName": "recordings",
    "BaseUrl": "https://yourstorage.blob.core.windows.net/recordings/"
  }
}
```

## Getting Started

### Prerequisites
- .NET 9 SDK
- SQL Server or SQL Server LocalDB
- Visual Studio 2022 or VS Code

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd EnglishSpeakingCoach
```

2. **Restore dependencies**
```bash
dotnet restore
```

3. **Update database connection string**
Edit `EnglishSpeakingCoach.API/appsettings.json` and configure your SQL Server connection.

4. **Apply migrations**
```bash
dotnet ef database update --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API
```

5. **Run the application**
```bash
cd EnglishSpeakingCoach.API
dotnet run
```

6. **Access Swagger UI**
Open browser and navigate to: `https://localhost:5001` or `http://localhost:5000`

## ML Service Integration

The system includes a **MockMLService** for demonstration purposes. In production, replace this with:

### Recommended ML Services
1. **Azure Speech Services**
   - Speech-to-Text (ASR)
   - Pronunciation Assessment API

2. **Google Cloud Speech-to-Text**
   - Real-time transcription
   - Confidence scores

3. **Custom ML Models**
   - Deploy your own pronunciation scoring models
   - Use TensorFlow or PyTorch

### Integration Points
- `IMLService` interface in Application layer
- Implement in Infrastructure/Services
- Returns: Transcript, Pronunciation Score, Fluency Score, Accuracy Score, Feedback Items

## Security Best Practices

### Implemented Security Features
1. **JWT Authentication**
   - Token-based authentication
   - Configurable expiration
   - Secure key management

2. **Password Hashing**
   - SHA256 hashing (use bcrypt/Argon2 in production)
   - No plain text passwords stored

3. **CORS Configuration**
   - Restricted to specific origins
   - Configurable for different environments

4. **Input Validation**
   - Required field validation
   - Model validation with Data Annotations

### Additional Recommendations
- Use HTTPS only in production
- Implement rate limiting
- Add request/response logging
- Use secrets management (Azure Key Vault, AWS Secrets Manager)
- Implement SQL injection protection (EF Core handles this)
- Add input sanitization for user-generated content
- Implement account lockout policies
- Use refresh tokens for long-lived sessions

## Performance Optimization

### Implemented Optimizations
1. **Async/Await Pattern** - All data access is asynchronous
2. **Connection Pooling** - EF Core handles automatically
3. **Lazy Loading Prevention** - Explicit includes used
4. **Indexed Queries** - Indexes on frequently queried columns

### Additional Recommendations
- Implement caching (Redis, Memory Cache)
- Use pagination for large result sets
- Implement background job processing (Hangfire)
- Add database query optimization
- Use CDN for static audio files
- Implement API versioning
- Add response compression

## Testing

### Recommended Test Structure
```
EnglishSpeakingCoach.Tests/
├── Unit/
│   ├── Services/
│   └── Repositories/
├── Integration/
│   └── Controllers/
└── E2E/
    └── Scenarios/
```

### Testing Tools
- **xUnit** - Unit testing framework
- **Moq** - Mocking framework
- **FluentAssertions** - Fluent assertion library
- **WebApplicationFactory** - Integration testing

## API Documentation

### Swagger/OpenAPI
The API includes comprehensive Swagger documentation:
- Interactive API testing
- Request/response schemas
- Authentication support
- Example requests and responses

Access Swagger UI at the root URL when running in development mode.

## Deployment

### Production Checklist
- [ ] Update connection strings
- [ ] Configure JWT secret key
- [ ] Set up object storage (Azure Blob Storage, AWS S3)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up logging and monitoring
- [ ] Configure backup strategy
- [ ] Implement health checks
- [ ] Set up CI/CD pipeline
- [ ] Configure auto-scaling

### Docker Support
```dockerfile
# Add Dockerfile for containerization
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EnglishSpeakingCoach.API.dll"]
```

## Migration Scripts

### Create Migration
```bash
dotnet ef migrations add MigrationName --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API
```

### Update Database
```bash
dotnet ef database update --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API
```

### Rollback Migration
```bash
dotnet ef database update PreviousMigrationName --project EnglishSpeakingCoach.Infrastructure --startup-project EnglishSpeakingCoach.API
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License - See LICENSE file for details

## Support
For issues and questions, please create an issue in the repository.

## Roadmap
- [ ] Real ML service integration
- [ ] Speech synthesis for lesson audio
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app integration
- [ ] Real-time pronunciation feedback
- [ ] Gamification features
- [ ] Social learning features
- [ ] Video lessons support
- [ ] Live coaching sessions
