# Architecture Diagrams - English Speaking Coach

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Applications                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Angular    │  │    React     │  │   Mobile     │         │
│  │   Frontend   │  │   Frontend   │  │     Apps     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          │  HTTPS / REST    │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway / Load Balancer                 │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ASP.NET Core 9 Web API                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                      API Layer                            │ │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │  Auth   │ │Lessons  │ │Sessions  │ │Progress  │ ... │ │
│  │  │Controller│ │Controller│ │Controller│ │Controller│      │ │
│  │  └────┬────┘ └────┬────┘ └────┬─────┘ └────┬─────┘      │ │
│  └───────┼───────────┼───────────┼─────────────┼────────────┘ │
│          │           │           │             │              │
│  ┌───────▼───────────▼───────────▼─────────────▼────────────┐ │
│  │                  Application Layer                        │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │  Auth    │ │ Lesson   │ │ Session  │ │Recording │    │ │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │... │ │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘    │ │
│  └───────┼────────────┼────────────┼────────────┼───────────┘ │
│          │            │            │            │             │
│  ┌───────▼────────────▼────────────▼────────────▼───────────┐ │
│  │                Infrastructure Layer                       │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │Repository│ │Repository│ │Repository│ │  Mock ML │    │ │
│  │  │  User    │ │ Lesson   │ │ Session  │ │ Service  │    │ │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘    │ │
│  └───────┼────────────┼────────────┼────────────┼───────────┘ │
│          │            │            │            │             │
│  ┌───────▼────────────▼────────────▼────────────┘             │
│  │              DbContext (EF Core)                           │ │
│  └────────────────────────┬───────────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SQL Server Database                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  Users  │ │ Lessons │ │Sessions │ │Progress │ ...          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Azure     │  │   Google     │  │   AWS S3     │         │
│  │   Blob       │  │  Cloud ML    │  │   Storage    │         │
│  │  Storage     │  │   Services   │  │   (Files)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     🌐 Presentation Layer                       │
│                    (EnglishSpeakingCoach.API)                   │
│  • Controllers (Auth, Lessons, Sessions, Recordings, Progress)  │
│  • Middleware (Exception, Logging, Authentication)              │
│  • Swagger/OpenAPI Configuration                                │
│  • Dependency Injection Setup                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ depends on
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    📋 Application Layer                         │
│                (EnglishSpeakingCoach.Application)               │
│  • Service Interfaces (IAuthService, ILessonService, etc.)      │
│  • DTOs (Data Transfer Objects)                                 │
│  • AutoMapper Profiles                                          │
│  • Business Logic Orchestration                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ depends on
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     🏗️ Infrastructure Layer                      │
│               (EnglishSpeakingCoach.Infrastructure)             │
│  • Repository Implementations                                   │
│  • Unit of Work Implementation                                  │
│  • DbContext & Configurations                                   │
│  • Service Implementations (Auth, Lesson, ML, etc.)             │
│  • External Service Integrations                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ depends on
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      💎 Domain Layer                            │
│                  (EnglishSpeakingCoach.Domain)                  │
│  • Entities (User, Lesson, Session, Recording, Feedback)        │
│  • Repository Interfaces (IRepository<T>, IUnitOfWork)          │
│  • Business Rules                                               │
│  • Domain Events (Optional)                                     │
│  ⚠️  NO DEPENDENCIES on other layers                            │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow Diagram

```
User Request → Controller → Service → Repository → Database

1️⃣  HTTP Request
    ↓
2️⃣  AuthController.Login()
    │  - Validate request
    │  - Extract credentials
    ↓
3️⃣  IAuthService.LoginAsync()
    │  - Business logic
    │  - Password verification
    │  - Token generation
    ↓
4️⃣  IUnitOfWork.Users.FindAsync()
    │  - Query database
    │  - Fetch user entity
    ↓
5️⃣  SQL Server
    │  - Execute query
    │  - Return results
    ↓
6️⃣  Map Entity → DTO
    │  - AutoMapper
    │  - Transform data
    ↓
7️⃣  HTTP Response (JSON)
    │  - 200 OK with token
    └─ AuthResponse DTO
```

## Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │   API    │
└─────┬────┘                                    └────┬─────┘
      │                                              │
      │  POST /api/auth/register                    │
      │  { email, password, fullName }              │
      ├────────────────────────────────────────────►│
      │                                              │
      │                                        ┌─────▼─────┐
      │                                        │ Validate  │
      │                                        │ Hash PWD  │
      │                                        │ Save User │
      │                                        └─────┬─────┘
      │                                              │
      │  201 Created                                 │
      │  { userId, token, expiresAt }               │
      │◄────────────────────────────────────────────┤
      │                                              │
      │  POST /api/auth/login                       │
      │  { email, password }                        │
      ├────────────────────────────────────────────►│
      │                                              │
      │                                        ┌─────▼─────┐
      │                                        │ Find User │
      │                                        │ Verify PWD│
      │                                        │ Gen Token │
      │                                        └─────┬─────┘
      │                                              │
      │  200 OK                                     │
      │  { userId, token, expiresAt }               │
      │◄────────────────────────────────────────────┤
      │                                              │
      │  GET /api/lessons                           │
      │  Authorization: Bearer <token>              │
      ├────────────────────────────────────────────►│
      │                                              │
      │                                        ┌─────▼─────┐
      │                                        │ Validate  │
      │                                        │   Token   │
      │                                        │ Get Data  │
      │                                        └─────┬─────┘
      │                                              │
      │  200 OK                                     │
      │  [ { lesson1 }, { lesson2 } ]               │
      │◄────────────────────────────────────────────┤
      │                                              │
```

## Recording Processing Flow

```
User Upload → API → Service → ML Processing → Feedback

┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. Upload Recording
     │    POST /api/recordings/upload
     ▼
┌──────────────────┐
│ Recording Service│
└────┬─────────────┘
     │ 2. Save Recording
     │    Status: Pending
     ▼
┌──────────────────┐
│    Database      │
└────┬─────────────┘
     │
     │ 3. Trigger Async Job
     ▼
┌──────────────────┐
│  Background Job  │
└────┬─────────────┘
     │ 4. Process Recording
     │    Status: Processing
     ▼
┌──────────────────┐
│   ML Service     │
│  (ASR + Scoring) │
└────┬─────────────┘
     │ 5. Get Results
     │    - Transcript
     │    - Scores
     │    - Feedback Items
     ▼
┌──────────────────┐
│ Update Recording │
│  Status: Complete│
└────┬─────────────┘
     │ 6. Save Feedback
     ▼
┌──────────────────┐
│    Database      │
│  - Recording     │
│  - Feedback (N)  │
└──────────────────┘
```

## Database Entity Relationships

```
                    ┌─────────────────┐
                    │      User       │
                    │  (Primary Key)  │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │   1          M  │
                    ▼                 ▼
           ┌────────────────┐  ┌────────────────┐
           │    Session     │  │ ProgressMetrics│
           │  (Foreign Key) │  │  (Foreign Key) │
           └────────┬───────┘  └────────────────┘
                    │
         ┌──────────┼──────────┐
         │ M        │ 1     M  │
         ▼          │          ▼
┌────────────────┐  │  ┌────────────────┐
│     Lesson     │  │  │   Recording    │
│  (Optional FK) │  │  │  (Foreign Key) │
└────────────────┘  │  └────────┬───────┘
                    │           │
                    │           │ 1
                    │           │
                    │           │ M
                    │           ▼
                    │  ┌────────────────┐
                    │  │    Feedback    │
                    │  │  (Foreign Key) │
                    │  └────────────────┘
                    │
Relationship Types:
• One-to-Many (1:M)
• Optional (nullable FK)
• Cascade Delete ▓▓▓
• Set Null Delete ░░░
```

## API Endpoint Organization

```
/api/auth
├── POST   /register         (Create user account)
├── POST   /login            (Authenticate user)
└── GET    /user/{id}        (Get user profile)

/api/lessons
├── GET    /                 (List all lessons)
├── GET    /{id}             (Get specific lesson)
├── GET    /level/{level}    (Filter by level)
├── POST   /                 (Create lesson)
├── PUT    /{id}             (Update lesson)
└── DELETE /{id}             (Delete lesson)

/api/sessions
├── POST   /start            (Start practice session)
├── POST   /{id}/end         (End session)
├── GET    /{id}             (Get session details)
├── GET    /user/{userId}    (List user sessions)
└── GET    /{id}/summary     (Get session statistics)

/api/recordings
├── POST   /upload           (Upload recording)
├── GET    /{id}             (Get recording)
├── GET    /session/{sid}    (List session recordings)
└── GET    /{id}/analysis    (Get AI analysis)

/api/progress
├── GET    /user/{id}/weekly   (Weekly progress)
├── GET    /user/{id}/monthly  (Monthly progress)
├── GET    /user/{id}/history  (Historical data)
└── POST   /user/{id}/update   (Update metrics)
```

## Security Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Security Layers                     │
└──────────────────────────────────────────────────────────┘

1️⃣  HTTPS/TLS Encryption
    └─ All traffic encrypted in transit

2️⃣  CORS Policy
    └─ Restrict origins to trusted domains

3️⃣  JWT Authentication
    ├─ Token validation on each request
    ├─ 24-hour token expiration
    └─ Refresh token mechanism (optional)

4️⃣  Authorization
    └─ Role-based access control (extensible)

5️⃣  Input Validation
    ├─ Data annotations on DTOs
    ├─ Model state validation
    └─ SQL injection prevention (EF Core)

6️⃣  Rate Limiting
    └─ Prevent API abuse

7️⃣  Password Security
    ├─ SHA256 hashing (demo)
    └─ Recommended: bcrypt/Argon2

8️⃣  Error Handling
    └─ Don't leak sensitive information
```

## Scalability Considerations

```
┌─────────────────────────────────────────────────────────┐
│                   Horizontal Scaling                    │
└─────────────────────────────────────────────────────────┘

              Load Balancer
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
    API #1     API #2     API #3
        │          │          │
        └──────────┼──────────┘
                   │
           Shared Database
         (Read Replicas)

┌─────────────────────────────────────────────────────────┐
│                    Caching Strategy                     │
└─────────────────────────────────────────────────────────┘

Client → CDN → Redis Cache → API → Database
         ↑        ↑          ↑       ↑
       Static  Hot Data   Logic   Cold Data

┌─────────────────────────────────────────────────────────┐
│                 Async Processing                        │
└─────────────────────────────────────────────────────────┘

API → Message Queue → Worker Process → ML Service
  ↓                        ↓
Database            Update Results
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                   Production Environment                   │
└────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Azure      │
│   Front Door │  ← Global Load Balancer
└──────┬───────┘
       │
┌──────▼────────────────────────────────────────────┐
│             Azure App Service                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  API #1  │  │  API #2  │  │  API #3  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼──────────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
          ┌───────────▼───────────┐
          │   Azure SQL Database  │
          │   (Geo-Replicated)    │
          └───────────────────────┘

External Services:
├─ Azure Blob Storage (Audio files)
├─ Azure Key Vault (Secrets)
├─ Azure Application Insights (Monitoring)
├─ Azure Speech Services (ML/ASR)
└─ Azure CDN (Static content)
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend Layer                        │
│  Angular, React, Mobile (iOS/Android)                  │
└─────────────────────────────────────────────────────────┘
                        ↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│  .NET Core 9, ASP.NET Core Web API                     │
│  Swagger/OpenAPI, JWT Authentication                   │
└─────────────────────────────────────────────────────────┘
                        ↕ Services
┌─────────────────────────────────────────────────────────┐
│                 Business Logic Layer                    │
│  C# Services, AutoMapper, FluentValidation             │
└─────────────────────────────────────────────────────────┘
                        ↕ Repository
┌─────────────────────────────────────────────────────────┐
│                  Data Access Layer                      │
│  Entity Framework Core 9, Repository Pattern           │
└─────────────────────────────────────────────────────────┘
                        ↕ ADO.NET
┌─────────────────────────────────────────────────────────┐
│                   Database Layer                        │
│  SQL Server, Indexes, Stored Procedures (optional)     │
└─────────────────────────────────────────────────────────┘
```

## Development to Production Pipeline

```
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│   Local    │     │   Build    │     │   Test     │     │   Deploy   │
│   Dev      │ ──► │   Server   │ ──► │   Server   │ ──► │   Prod     │
└────────────┘     └────────────┘     └────────────┘     └────────────┘
     │                   │                   │                   │
     │                   │                   │                   │
     ▼                   ▼                   ▼                   ▼
Git Commit         dotnet build       dotnet test      Azure App Service
     │                   │                   │                   │
     └───────────────────┴───────────────────┴───────────────────┘
                    CI/CD Pipeline (Azure DevOps / GitHub Actions)
```

---

## Quick Navigation

- **Main Documentation**: [README.md](README.md)
- **API Reference**: [API_CONTRACT.md](API_CONTRACT.md)
- **Best Practices**: [BEST_PRACTICES.md](BEST_PRACTICES.md)
- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **Folder Structure**: [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)
- **Migration Guide**: [MIGRATION_EXAMPLE.md](MIGRATION_EXAMPLE.md)
