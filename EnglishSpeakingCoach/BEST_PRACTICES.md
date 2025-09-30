# Best Practices - English Speaking Coach API

## Security Best Practices

### 1. Authentication & Authorization

#### JWT Token Management
- **Token Expiration**: Set reasonable expiration times (24 hours for access tokens)
- **Refresh Tokens**: Implement refresh token mechanism for long-lived sessions
- **Token Storage**: Never store tokens in localStorage on the client (use httpOnly cookies)
- **Secret Keys**: Store JWT secret keys in environment variables or secure key vaults

```csharp
// Good Practice
var secretKey = configuration["JwtSettings:SecretKey"];
if (string.IsNullOrEmpty(secretKey))
    throw new InvalidOperationException("JWT secret key not configured");

// Bad Practice
var secretKey = "hardcoded-secret-key"; // Never do this!
```

#### Password Security
- **Hashing**: Use bcrypt, Argon2, or PBKDF2 (not SHA256 as in the demo)
- **Salt**: Always use unique salts per user
- **Complexity**: Enforce strong password policies
- **Validation**: Validate password strength on registration

```csharp
// Production-ready password hashing (using BCrypt.Net)
using BCrypt.Net;

public string HashPassword(string password)
{
    return BCrypt.HashPassword(password, workFactor: 12);
}

public bool VerifyPassword(string password, string hash)
{
    return BCrypt.Verify(password, hash);
}
```

### 2. Input Validation

#### Request Validation
```csharp
// Use Data Annotations
public record RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; init; }
    
    [Required]
    [MinLength(8)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")]
    public string Password { get; init; }
    
    [Required]
    [MaxLength(200)]
    public string FullName { get; init; }
}
```

#### SQL Injection Prevention
- Always use parameterized queries (EF Core handles this automatically)
- Never concatenate user input into SQL queries
- Use stored procedures when appropriate

### 3. CORS Configuration

```csharp
// Development
builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Production
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://app.englishcoach.com")
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .WithHeaders("Authorization", "Content-Type")
              .AllowCredentials();
    });
});
```

### 4. HTTPS & SSL/TLS
- Always use HTTPS in production
- Enforce HTTPS redirection
- Use valid SSL certificates
- Configure HSTS (HTTP Strict Transport Security)

```csharp
app.UseHsts();
app.UseHttpsRedirection();
```

### 5. Rate Limiting
```csharp
// Install: AspNetCoreRateLimit
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(options =>
{
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "*",
            Limit = 100,
            Period = "1m"
        }
    };
});
```

---

## Performance Best Practices

### 1. Database Optimization

#### Use Async/Await
```csharp
// Good
public async Task<User?> GetUserAsync(int id)
{
    return await _context.Users.FindAsync(id);
}

// Bad
public User? GetUser(int id)
{
    return _context.Users.Find(id); // Blocks thread
}
```

#### Optimize Queries
```csharp
// Good - Explicit loading
var sessions = await _context.Sessions
    .Include(s => s.Lesson)
    .Include(s => s.Recordings)
    .Where(s => s.UserId == userId)
    .ToListAsync();

// Bad - Lazy loading (N+1 queries)
var sessions = await _context.Sessions
    .Where(s => s.UserId == userId)
    .ToListAsync();
// Then accessing s.Lesson triggers additional queries
```

#### Use Pagination
```csharp
public async Task<PagedResult<Lesson>> GetLessonsAsync(int page, int pageSize)
{
    var total = await _context.Lessons.CountAsync();
    var lessons = await _context.Lessons
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
        
    return new PagedResult<Lesson>
    {
        Items = lessons,
        TotalCount = total,
        Page = page,
        PageSize = pageSize
    };
}
```

#### Add Database Indexes
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<User>()
        .HasIndex(u => u.Email)
        .IsUnique();
        
    modelBuilder.Entity<Session>()
        .HasIndex(s => new { s.UserId, s.StartTime });
        
    modelBuilder.Entity<ProgressMetrics>()
        .HasIndex(p => new { p.UserId, p.MetricDate });
}
```

### 2. Caching

#### Response Caching
```csharp
[ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
[HttpGet("level/{level}")]
public async Task<ActionResult<IEnumerable<LessonDto>>> GetByLevel(string level)
{
    // Cached for 1 hour
    var lessons = await _lessonService.GetLessonsByLevelAsync(level);
    return Ok(lessons);
}
```

#### Distributed Caching (Redis)
```csharp
public class CachedLessonService : ILessonService
{
    private readonly ILessonService _innerService;
    private readonly IDistributedCache _cache;
    
    public async Task<IEnumerable<LessonDto>> GetAllLessonsAsync()
    {
        var cacheKey = "lessons:all";
        var cached = await _cache.GetStringAsync(cacheKey);
        
        if (cached != null)
            return JsonSerializer.Deserialize<IEnumerable<LessonDto>>(cached);
            
        var lessons = await _innerService.GetAllLessonsAsync();
        await _cache.SetStringAsync(cacheKey, 
            JsonSerializer.Serialize(lessons),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
            });
            
        return lessons;
    }
}
```

### 3. Background Processing

#### Use Background Jobs (Hangfire)
```csharp
// For long-running tasks like ML processing
public async Task<RecordingDto> UploadRecordingAsync(UploadRecordingRequest request)
{
    var recording = await SaveRecording(request);
    
    // Queue background job instead of blocking
    BackgroundJob.Enqueue(() => ProcessRecordingAsync(recording.Id));
    
    return _mapper.Map<RecordingDto>(recording);
}
```

### 4. Connection Pooling
```csharp
// Configure in appsettings.json
"ConnectionStrings": {
    "DefaultConnection": "Server=...;Min Pool Size=5;Max Pool Size=100;"
}
```

---

## Code Quality Best Practices

### 1. Clean Code Principles

#### Single Responsibility
```csharp
// Good - Each class has one responsibility
public class UserService : IUserService { }
public class UserValidator { }
public class UserNotifier { }

// Bad - God class
public class UserManager
{
    public void CreateUser() { }
    public void ValidateUser() { }
    public void SendEmail() { }
    public void LogActivity() { }
}
```

#### Dependency Injection
```csharp
// Good
public class LessonService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    
    public LessonService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
}

// Bad
public class LessonService
{
    private readonly UnitOfWork _unitOfWork = new UnitOfWork();
}
```

### 2. Error Handling

#### Global Exception Handler
```csharp
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Unhandled exception occurred");
        
        var response = exception switch
        {
            ValidationException => (StatusCodes.Status400BadRequest, "Validation error"),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
            KeyNotFoundException => (StatusCodes.Status404NotFound, "Not found"),
            _ => (StatusCodes.Status500InternalServerError, "Internal server error")
        };
        
        context.Response.StatusCode = response.Item1;
        await context.Response.WriteAsJsonAsync(new { error = response.Item2 });
        
        return true;
    }
}

// Register in Program.cs
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
```

### 3. Logging

#### Structured Logging
```csharp
public class LessonService
{
    private readonly ILogger<LessonService> _logger;
    
    public async Task<LessonDto> CreateLessonAsync(CreateLessonRequest request)
    {
        _logger.LogInformation(
            "Creating lesson {LessonTitle} for level {Level}",
            request.Title,
            request.Level);
            
        try
        {
            var lesson = await _repository.AddAsync(request);
            _logger.LogInformation(
                "Successfully created lesson {LessonId}",
                lesson.Id);
            return lesson;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to create lesson {LessonTitle}",
                request.Title);
            throw;
        }
    }
}
```

### 4. Testing

#### Unit Tests
```csharp
public class LessonServiceTests
{
    [Fact]
    public async Task GetLessonByIdAsync_ExistingId_ReturnsLesson()
    {
        // Arrange
        var mockRepo = new Mock<IRepository<Lesson>>();
        mockRepo.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(new Lesson { Id = 1, Title = "Test" });
            
        var service = new LessonService(mockRepo.Object, Mock.Of<IMapper>());
        
        // Act
        var result = await service.GetLessonByIdAsync(1);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
    }
}
```

---

## API Design Best Practices

### 1. RESTful Conventions
- Use nouns for resource names (not verbs)
- Use HTTP methods appropriately (GET, POST, PUT, DELETE)
- Return appropriate status codes
- Use consistent naming conventions

### 2. Versioning
```csharp
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class LessonsController : ControllerBase { }
```

### 3. Documentation
- Document all public endpoints
- Include examples in Swagger/OpenAPI
- Provide error response examples
- Keep documentation up-to-date

### 4. Response Format
```csharp
// Consistent response wrapper
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Error { get; set; }
    public Dictionary<string, string[]>? ValidationErrors { get; set; }
}
```

---

## Deployment Best Practices

### 1. Configuration Management
- Use environment-specific configuration files
- Never commit secrets to source control
- Use Azure Key Vault or AWS Secrets Manager
- Use environment variables for sensitive data

### 2. Health Checks
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>()
    .AddCheck<MLServiceHealthCheck>("ml-service");

app.MapHealthChecks("/health");
```

### 3. Monitoring
- Implement Application Insights or similar
- Log all errors and warnings
- Track performance metrics
- Set up alerts for critical issues

### 4. CI/CD Pipeline
```yaml
# Example Azure DevOps pipeline
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: DotNetCoreCLI@2
    displayName: 'Restore'
    inputs:
      command: 'restore'
      
  - task: DotNetCoreCLI@2
    displayName: 'Build'
    inputs:
      command: 'build'
      
  - task: DotNetCoreCLI@2
    displayName: 'Test'
    inputs:
      command: 'test'
      
  - task: DotNetCoreCLI@2
    displayName: 'Publish'
    inputs:
      command: 'publish'
      publishWebProjects: true
```

---

## Object Storage Best Practices

### 1. File Upload
- Validate file types and sizes
- Generate unique file names
- Use CDN for serving files
- Implement virus scanning

```csharp
public class AudioUploadService
{
    private const long MaxFileSize = 10 * 1024 * 1024; // 10MB
    private static readonly string[] AllowedExtensions = { ".wav", ".mp3", ".m4a" };
    
    public async Task<string> UploadAudioAsync(IFormFile file)
    {
        // Validate
        if (file.Length > MaxFileSize)
            throw new InvalidOperationException("File too large");
            
        var extension = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(extension))
            throw new InvalidOperationException("Invalid file type");
            
        // Generate unique name
        var fileName = $"{Guid.NewGuid()}{extension}";
        
        // Upload to blob storage
        var blobClient = _containerClient.GetBlobClient(fileName);
        await blobClient.UploadAsync(file.OpenReadStream());
        
        return blobClient.Uri.ToString();
    }
}
```

---

## Summary Checklist

### Security
- [ ] Use HTTPS in production
- [ ] Implement proper JWT authentication
- [ ] Hash passwords with bcrypt/Argon2
- [ ] Validate all inputs
- [ ] Implement rate limiting
- [ ] Configure CORS properly
- [ ] Use secrets management

### Performance
- [ ] Use async/await everywhere
- [ ] Implement caching
- [ ] Add database indexes
- [ ] Use pagination
- [ ] Optimize queries
- [ ] Use connection pooling

### Code Quality
- [ ] Write unit tests
- [ ] Follow SOLID principles
- [ ] Use dependency injection
- [ ] Implement proper error handling
- [ ] Add structured logging
- [ ] Document code

### Deployment
- [ ] Use environment variables
- [ ] Implement health checks
- [ ] Set up monitoring
- [ ] Create CI/CD pipeline
- [ ] Use Docker containers
- [ ] Configure auto-scaling
