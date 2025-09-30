# English Speaking Coach - Complete Folder Structure

```
EnglishSpeakingCoach/
│
├── 📄 EnglishSpeakingCoach.sln                    # Solution file
├── 📄 README.md                                    # Main documentation
├── 📄 API_CONTRACT.md                             # API endpoint documentation
├── 📄 BEST_PRACTICES.md                           # Development best practices
│
├── 📁 EnglishSpeakingCoach.Domain/                # Domain Layer (Core Business Logic)
│   ├── 📁 Entities/                               # Domain Entities
│   │   ├── 📄 User.cs                             # User entity
│   │   ├── 📄 Lesson.cs                           # Lesson entity
│   │   ├── 📄 Session.cs                          # Practice session entity
│   │   ├── 📄 Recording.cs                        # Audio recording entity
│   │   ├── 📄 Feedback.cs                         # Feedback entity
│   │   └── 📄 ProgressMetrics.cs                  # Progress tracking entity
│   │
│   └── 📁 Interfaces/                             # Repository Interfaces
│       ├── 📄 IRepository.cs                      # Generic repository interface
│       └── 📄 IUnitOfWork.cs                      # Unit of work interface
│
├── 📁 EnglishSpeakingCoach.Application/          # Application Layer (Business Logic)
│   ├── 📁 DTOs/                                   # Data Transfer Objects
│   │   ├── 📄 AuthDtos.cs                         # Auth DTOs (Register, Login, etc.)
│   │   ├── 📄 LessonDtos.cs                       # Lesson DTOs
│   │   ├── 📄 SessionDtos.cs                      # Session DTOs
│   │   ├── 📄 RecordingDtos.cs                    # Recording DTOs
│   │   ├── 📄 FeedbackDtos.cs                     # Feedback DTOs
│   │   └── 📄 ProgressDtos.cs                     # Progress DTOs
│   │
│   ├── 📁 Mappings/                               # AutoMapper Profiles
│   │   └── 📄 MappingProfile.cs                   # Entity to DTO mappings
│   │
│   └── 📁 Services/                               # Service Interfaces
│       ├── 📄 IAuthService.cs                     # Authentication service interface
│       ├── 📄 ILessonService.cs                   # Lesson service interface
│       ├── 📄 ISessionService.cs                  # Session service interface
│       ├── 📄 IRecordingService.cs                # Recording service interface
│       ├── 📄 IProgressService.cs                 # Progress service interface
│       └── 📄 IMLService.cs                       # ML service interface (ASR/Scoring)
│
├── 📁 EnglishSpeakingCoach.Infrastructure/       # Infrastructure Layer (Data Access & External Services)
│   ├── 📁 Data/                                   # Database Context
│   │   └── 📄 ApplicationDbContext.cs             # EF Core DbContext with configurations
│   │
│   ├── 📁 Repositories/                           # Repository Implementations
│   │   ├── 📄 Repository.cs                       # Generic repository implementation
│   │   └── 📄 UnitOfWork.cs                       # Unit of work implementation
│   │
│   ├── 📁 Services/                               # Service Implementations
│   │   ├── 📄 AuthService.cs                      # Authentication service
│   │   ├── 📄 LessonService.cs                    # Lesson service
│   │   ├── 📄 SessionService.cs                   # Session service
│   │   ├── 📄 RecordingService.cs                 # Recording service
│   │   ├── 📄 ProgressService.cs                  # Progress service
│   │   └── 📄 MockMLService.cs                    # Mock ML service (ASR/Pronunciation)
│   │
│   └── 📁 Migrations/                             # EF Core Migrations
│       ├── 📄 20240930_InitialCreate.cs           # Initial database migration
│       └── 📄 ApplicationDbContextModelSnapshot.cs # Current database model
│
└── 📁 EnglishSpeakingCoach.API/                  # API Layer (Web API Controllers)
    ├── 📁 Controllers/                            # API Controllers
    │   ├── 📄 AuthController.cs                   # Authentication endpoints
    │   ├── 📄 LessonsController.cs                # Lesson CRUD endpoints
    │   ├── 📄 SessionsController.cs               # Session management endpoints
    │   ├── 📄 RecordingsController.cs             # Recording upload/retrieval endpoints
    │   └── 📄 ProgressController.cs               # Progress tracking endpoints
    │
    ├── 📁 Properties/                             # Launch settings
    │   └── 📄 launchSettings.json                 # Development launch configuration
    │
    ├── 📄 Program.cs                              # Application entry point & configuration
    ├── 📄 appsettings.json                        # Configuration settings
    ├── 📄 appsettings.Development.json            # Development-specific settings
    └── 📄 EnglishSpeakingCoach.API.csproj         # Project file with dependencies
```

## Layer Responsibilities

### 🔷 Domain Layer
**Purpose:** Contains core business entities and contracts (interfaces)
- **No dependencies** on other layers
- Pure business objects
- Repository interfaces
- Business rules and validation

### 🔷 Application Layer
**Purpose:** Contains business logic, DTOs, and service interfaces
- **Depends on:** Domain layer only
- DTOs for data transfer
- Service interfaces
- Business workflows
- AutoMapper configurations

### 🔷 Infrastructure Layer
**Purpose:** Implements data access and external service integration
- **Depends on:** Domain and Application layers
- Database context and configurations
- Repository implementations
- External service integrations (ML, Storage, etc.)
- EF Core migrations

### 🔷 API Layer
**Purpose:** Exposes HTTP endpoints and handles requests/responses
- **Depends on:** Application and Infrastructure layers
- RESTful API controllers
- Request/response handling
- Authentication/Authorization
- Swagger configuration
- Dependency injection setup

## Data Flow

```
┌─────────────┐
│   Client    │ (Angular App)
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐
│ Controllers │ (API Layer)
└──────┬──────┘
       │ Calls
       ▼
┌─────────────┐
│  Services   │ (Application Layer)
└──────┬──────┘
       │ Uses
       ▼
┌─────────────┐
│Repositories │ (Infrastructure Layer)
└──────┬──────┘
       │ Access
       ▼
┌─────────────┐
│  Database   │ (SQL Server)
└─────────────┘
```

## Key Design Patterns

### 1. **Repository Pattern**
- Abstracts data access logic
- Makes the code more testable
- Centralized data access logic

### 2. **Unit of Work Pattern**
- Maintains a list of objects affected by a business transaction
- Coordinates writing changes to the database
- Ensures data consistency

### 3. **Dependency Injection**
- Loose coupling between components
- Easier testing and maintenance
- Configurable dependencies

### 4. **DTO Pattern**
- Separates internal models from API contracts
- Reduces over-posting vulnerabilities
- Cleaner API responses

### 5. **Service Layer Pattern**
- Encapsulates business logic
- Coordinates between repositories
- Provides transaction boundaries

## File Naming Conventions

### Entities
- PascalCase, singular nouns
- Example: `User.cs`, `Lesson.cs`, `Recording.cs`

### DTOs
- PascalCase with suffix indicating purpose
- Example: `RegisterRequest`, `LessonDto`, `AuthResponse`

### Interfaces
- PascalCase with `I` prefix
- Example: `IRepository<T>`, `IAuthService`, `IUnitOfWork`

### Services
- PascalCase with `Service` suffix
- Example: `AuthService`, `LessonService`, `MockMLService`

### Controllers
- PascalCase with `Controller` suffix
- Example: `AuthController`, `LessonsController`

## Project Dependencies

### Domain Project
```xml
<ItemGroup>
  <!-- No external dependencies - Pure C# -->
</ItemGroup>
```

### Application Project
```xml
<ItemGroup>
  <PackageReference Include="AutoMapper" Version="15.0.1" />
  <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
  <ProjectReference Include="..\EnglishSpeakingCoach.Domain\EnglishSpeakingCoach.Domain.csproj" />
</ItemGroup>
```

### Infrastructure Project
```xml
<ItemGroup>
  <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.9" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="9.0.9" />
  <ProjectReference Include="..\EnglishSpeakingCoach.Domain\EnglishSpeakingCoach.Domain.csproj" />
  <ProjectReference Include="..\EnglishSpeakingCoach.Application\EnglishSpeakingCoach.Application.csproj" />
</ItemGroup>
```

### API Project
```xml
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.9" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.9" />
  <PackageReference Include="Swashbuckle.AspNetCore" Version="7.2.0" />
  <ProjectReference Include="..\EnglishSpeakingCoach.Application\EnglishSpeakingCoach.Application.csproj" />
  <ProjectReference Include="..\EnglishSpeakingCoach.Infrastructure\EnglishSpeakingCoach.Infrastructure.csproj" />
</ItemGroup>
```

## Build Order

1. **EnglishSpeakingCoach.Domain** (No dependencies)
2. **EnglishSpeakingCoach.Application** (Depends on Domain)
3. **EnglishSpeakingCoach.Infrastructure** (Depends on Domain & Application)
4. **EnglishSpeakingCoach.API** (Depends on Application & Infrastructure)

## Testing Structure (Recommended)

```
EnglishSpeakingCoach.Tests/
├── 📁 Unit/
│   ├── 📁 Services/
│   │   ├── AuthServiceTests.cs
│   │   ├── LessonServiceTests.cs
│   │   └── ...
│   └── 📁 Repositories/
│       ├── RepositoryTests.cs
│       └── UnitOfWorkTests.cs
│
├── 📁 Integration/
│   ├── 📁 Controllers/
│   │   ├── AuthControllerTests.cs
│   │   ├── LessonsControllerTests.cs
│   │   └── ...
│   └── 📁 Database/
│       └── DatabaseIntegrationTests.cs
│
└── 📁 E2E/
    └── 📁 Scenarios/
        ├── UserRegistrationScenario.cs
        ├── RecordingUploadScenario.cs
        └── ProgressTrackingScenario.cs
```

## Configuration Files

### appsettings.json
- Connection strings
- JWT settings
- Logging configuration
- Application settings

### appsettings.Development.json
- Development-specific overrides
- Local database connection
- Debug logging levels

### launchSettings.json
- Development launch profiles
- Environment variables
- Port configurations

## Clean Architecture Benefits

✅ **Testability** - Easy to unit test business logic  
✅ **Maintainability** - Clear separation of concerns  
✅ **Scalability** - Easy to add new features  
✅ **Independence** - Business logic independent of frameworks  
✅ **Flexibility** - Easy to swap implementations  
✅ **Reusability** - Domain logic can be reused across projects
