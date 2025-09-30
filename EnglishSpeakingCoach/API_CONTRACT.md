# English Speaking Coach API Contract

## Base URL
```
Development: https://localhost:5001
Production: https://api.englishcoach.com
```

## Authentication
All authenticated endpoints require JWT Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. Authentication

#### 1.1 Register New User
```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe",
  "level": "Beginner"  // Optional: Beginner, Intermediate, Advanced
}

Response: 201 Created
{
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-10-01T10:30:00Z"
}
```

#### 1.2 Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-10-01T10:30:00Z"
}
```

#### 1.3 Get User Profile
```http
GET /api/auth/user/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "profilePictureUrl": null,
  "level": "Beginner",
  "createdAt": "2024-09-01T10:00:00Z",
  "lastLoginAt": "2024-09-30T14:30:00Z"
}
```

---

### 2. Lessons

#### 2.1 Get All Lessons
```http
GET /api/lessons

Response: 200 OK
[
  {
    "id": 1,
    "title": "Basic Greetings",
    "description": "Learn common English greetings and introductions",
    "level": "Beginner",
    "category": "Conversation",
    "content": "Hello, Hi, Good morning, Good afternoon...",
    "audioUrl": null,
    "durationMinutes": 10,
    "orderIndex": 1,
    "isActive": true
  }
]
```

#### 2.2 Get Lessons by Level
```http
GET /api/lessons/level/{level}
Example: GET /api/lessons/level/Beginner

Response: 200 OK
[
  {
    "id": 1,
    "title": "Basic Greetings",
    "level": "Beginner",
    ...
  }
]
```

#### 2.3 Create Lesson
```http
POST /api/lessons
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Advanced Idioms",
  "description": "Learn common English idioms",
  "level": "Advanced",
  "category": "Conversation",
  "content": "Break the ice, Hit the nail on the head...",
  "audioUrl": "https://storage.example.com/audio/lesson-4.mp3",
  "durationMinutes": 25,
  "orderIndex": 4
}

Response: 201 Created
{
  "id": 4,
  "title": "Advanced Idioms",
  ...
}
```

---

### 3. Sessions

#### 3.1 Start Session
```http
POST /api/sessions/start
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "userId": 1,
  "lessonId": 1,  // Optional
  "notes": "Evening practice session"  // Optional
}

Response: 201 Created
{
  "id": 1,
  "userId": 1,
  "lessonId": 1,
  "startTime": "2024-09-30T14:30:00Z",
  "endTime": null,
  "durationSeconds": null,
  "status": "Active",
  "notes": "Evening practice session",
  "lessonTitle": "Basic Greetings"
}
```

#### 3.2 End Session
```http
POST /api/sessions/{id}/end
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "notes": "Good progress today"  // Optional
}

Response: 200 OK
{
  "id": 1,
  "userId": 1,
  "lessonId": 1,
  "startTime": "2024-09-30T14:30:00Z",
  "endTime": "2024-09-30T14:50:00Z",
  "durationSeconds": 1200,
  "status": "Completed",
  "notes": "Good progress today",
  "lessonTitle": "Basic Greetings"
}
```

#### 3.3 Get Session Summary
```http
GET /api/sessions/{id}/summary
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "recordingsCount": 5,
  "durationSeconds": 1200,
  "averagePronunciationScore": 82.5,
  "status": "Completed"
}
```

---

### 4. Recordings

#### 4.1 Upload Recording
```http
POST /api/recordings/upload
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "sessionId": 1,
  "audioUrl": "https://storage.example.com/recordings/user1/rec-001.wav",
  "originalFileName": "recording-001.wav",
  "durationSeconds": 45,
  "fileSizeBytes": 512000
}

Response: 201 Created
{
  "id": 1,
  "sessionId": 1,
  "audioUrl": "https://storage.example.com/recordings/user1/rec-001.wav",
  "originalFileName": "recording-001.wav",
  "durationSeconds": 45,
  "fileSizeBytes": 512000,
  "transcript": null,
  "pronunciationScore": null,
  "fluencyScore": null,
  "accuracyScore": null,
  "processingStatus": "Pending",
  "createdAt": "2024-09-30T14:35:00Z",
  "processedAt": null
}

Note: Processing happens asynchronously. Check status or use webhooks.
```

#### 4.2 Get Recording Analysis
```http
GET /api/recordings/{id}/analysis
Authorization: Bearer <token>

Response: 200 OK
{
  "recordingId": 1,
  "transcript": "Hello, how are you today? I am practicing my English speaking skills.",
  "pronunciationScore": 85.5,
  "fluencyScore": 78.3,
  "accuracyScore": 92.1,
  "feedbacks": [
    {
      "id": 1,
      "recordingId": 1,
      "feedbackType": "Pronunciation",
      "content": "The 'th' sound needs improvement",
      "detailedAnalysis": "Focus on placing your tongue between your teeth...",
      "severity": 2,
      "wordPosition": 3,
      "suggestion": "Practice words: think, thank, the, this",
      "createdAt": "2024-09-30T14:36:00Z"
    },
    {
      "id": 2,
      "recordingId": 1,
      "feedbackType": "Fluency",
      "content": "Good speaking pace",
      "detailedAnalysis": "Your speaking rhythm is natural...",
      "severity": 1,
      "wordPosition": null,
      "suggestion": "Keep maintaining this comfortable pace",
      "createdAt": "2024-09-30T14:36:00Z"
    }
  ]
}
```

---

### 5. Progress Tracking

#### 5.1 Get Weekly Progress
```http
GET /api/progress/user/{userId}/weekly
Authorization: Bearer <token>

Response: 200 OK
{
  "period": "Weekly",
  "totalSessions": 12,
  "totalRecordings": 48,
  "totalMinutesPracticed": 180,
  "averageScore": 82.5,
  "improvementPercentage": 15.3,
  "dailyMetrics": [
    {
      "id": 1,
      "userId": 1,
      "metricDate": "2024-09-30T00:00:00Z",
      "period": "Daily",
      "totalSessions": 2,
      "totalRecordings": 8,
      "totalMinutesPracticed": 30,
      "averagePronunciationScore": 85.5,
      "averageFluencyScore": 78.3,
      "averageAccuracyScore": 92.1,
      "overallScore": 85.3,
      "completedLessons": 1,
      "notes": null
    }
  ]
}
```

#### 5.2 Get Monthly Progress
```http
GET /api/progress/user/{userId}/monthly
Authorization: Bearer <token>

Response: 200 OK
{
  "period": "Monthly",
  "totalSessions": 48,
  "totalRecordings": 192,
  "totalMinutesPracticed": 720,
  "averageScore": 85.2,
  "improvementPercentage": 28.7,
  "dailyMetrics": [...]
}
```

#### 5.3 Get Progress History
```http
GET /api/progress/user/{userId}/history?days=30
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 30,
    "userId": 1,
    "metricDate": "2024-09-30T00:00:00Z",
    "period": "Daily",
    "totalSessions": 2,
    "totalRecordings": 8,
    ...
  },
  {
    "id": 29,
    "userId": 1,
    "metricDate": "2024-09-29T00:00:00Z",
    ...
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "User with this email already exists"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid email or password"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An unexpected error occurred"
}
```

---

## Rate Limiting
- Rate limit: 100 requests per minute per IP
- Burst limit: 10 requests per second

## Pagination
For endpoints returning lists, use query parameters:
```
?page=1&pageSize=20
```

## Sorting
For endpoints supporting sorting:
```
?sortBy=createdAt&sortOrder=desc
```

## Filtering
Example filtering on lessons:
```
?level=Beginner&category=Pronunciation&isActive=true
```

## Webhooks
Configure webhooks for asynchronous events:
- Recording processing completed
- Session ended
- Daily progress calculated

## SDK & Client Libraries
- JavaScript/TypeScript client
- C# client
- Python client
- Mobile SDKs (iOS, Android)

## API Versioning
Current version: v1
Access via: `/api/v1/...`

## Support
- Documentation: https://docs.englishcoach.com
- Support: support@englishcoach.com
- Status: https://status.englishcoach.com
