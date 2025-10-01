# English Speaking Coach - Angular 20 Frontend

## 📋 Overview

This is the frontend application for the English Speaking Coach platform, built with Angular 20, Angular Material, and Tailwind CSS. It provides an interactive interface for users to practice English speaking, receive AI-powered feedback, and track their progress.

## 🏗️ Architecture

### Technology Stack

- **Framework**: Angular 20
- **UI Library**: Angular Material (Material Design 3)
- **Styling**: Tailwind CSS 3.4
- **State Management**: Angular Signals
- **Charts**: ng2-charts + Chart.js
- **HTTP Client**: Angular HttpClient
- **Authentication**: JWT Token-based
- **Routing**: Angular Router with Guards

### Design Patterns

- **Standalone Components**: All components are standalone (no NgModules)
- **Lazy Loading**: Feature modules are lazy-loaded for better performance
- **Signal-based State**: Using Angular Signals for reactive state management
- **Service Layer**: Centralized business logic in services
- **Guard Pattern**: Route protection with functional guards
- **Interceptor Pattern**: HTTP interceptor for JWT token injection

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                          # Core functionality
│   │   ├── guards/                    # Route guards
│   │   │   └── auth.guard.ts          # Authentication & guest guards
│   │   ├── interceptors/              # HTTP interceptors
│   │   │   └── auth.interceptor.ts    # JWT token interceptor
│   │   └── services/                  # Core services
│   │       ├── auth.service.ts        # Authentication service
│   │       ├── lesson.service.ts      # Lesson management
│   │       ├── recording.service.ts   # Audio recording & analysis
│   │       ├── session.service.ts     # Practice session tracking
│   │       └── progress.service.ts    # Progress tracking
│   │
│   ├── shared/                        # Shared components
│   │   └── components/
│   │       ├── lesson-card.component.ts       # Lesson display card
│   │       ├── feedback-panel.component.ts    # Feedback display
│   │       ├── progress-chart.component.ts    # Progress charts
│   │       └── audio-recorder.component.ts    # Audio recording UI
│   │
│   ├── features/                      # Feature modules
│   │   ├── auth/                      # Authentication
│   │   │   └── components/
│   │   │       ├── login.component.ts
│   │   │       └── register.component.ts
│   │   │
│   │   ├── home/                      # Home dashboard
│   │   │   └── components/
│   │   │       └── home.component.ts
│   │   │
│   │   ├── lesson/                    # Lesson practice
│   │   │   └── components/
│   │   │       └── lesson.component.ts
│   │   │
│   │   ├── progress/                  # Progress dashboard
│   │   │   └── components/
│   │   │       └── progress.component.ts
│   │   │
│   │   └── settings/                  # User settings
│   │       └── components/
│   │           └── settings.component.ts
│   │
│   ├── app.config.ts                  # App configuration
│   ├── app.routes.ts                  # Route definitions
│   ├── app.ts                         # Root component
│   └── app.html                       # Root template
│
├── environments/                      # Environment configs
│   ├── environment.ts                 # Development
│   └── environment.prod.ts            # Production
│
├── styles.scss                        # Global styles
└── index.html                         # HTML entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Angular CLI 20.x

### Installation

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Navigate to
http://localhost:4200
```

### Build

```bash
# Development build
ng build --configuration development

# Production build
ng build --configuration production
```

### Testing

```bash
# Run unit tests
ng test

# Run e2e tests
ng e2e
```

## 📱 Features

### 1. Authentication

- **Login**: Email/password authentication with JWT
- **Register**: User registration with level selection
- **Guards**: Protected routes with auth guards
- **Token Management**: Automatic token injection via interceptor

### 2. Home Dashboard

- Welcome message with user info
- Progress summary cards (practice time, lessons, recordings, scores)
- Daily practice suggestions
- Available lessons with filters (Beginner, Intermediate, Advanced)
- Quick access to progress and settings

### 3. Lesson Practice

- **Lesson View**: Display lesson content, description, and metadata
- **Reference Audio**: Play sample pronunciation
- **Practice Mode**: Record yourself speaking
- **Real-time Recording**: Audio capture with timer
- **Feedback Tab**: View analysis results after submission

### 4. Feedback System

- Overall score display (0-100)
- Breakdown scores (Pronunciation, Fluency, Accuracy)
- Transcript display with highlighting
- Detailed feedback items with severity levels
- Actionable suggestions for improvement
- Color-coded feedback (red: critical, yellow: medium, blue: minor)

### 5. Progress Dashboard

- Summary statistics (total time, lessons, streak, avg score)
- Weekly progress charts (scores & practice time)
- Monthly trend analysis
- Interactive charts with Chart.js

### 6. Settings

- Profile information display
- Audio preferences (voice gender, accent)
- Notification settings (daily reminder, progress updates, achievements)
- Privacy settings (share progress, data collection)

## 🎨 UI/UX Guidelines

### Material Design 3

- Using Angular Material components with Material 3 theme
- Primary color: Blue (#3b82f6)
- Accent color: Purple (#8b5cf6)
- Warn color: Red (#ef4444)

### Tailwind CSS Integration

- Utility-first CSS for rapid development
- Responsive design (mobile-first approach)
- Custom spacing and colors matching Material theme
- Grid-based layouts for consistency

### Responsive Design

```scss
// Mobile First Breakpoints
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
```

### Animation Guidelines

- Use Angular Material animations for dialogs, menus
- Subtle transitions (200-300ms) for hover effects
- Smooth page transitions with router animations
- Loading states with progress spinners

## 🔒 Security

### Authentication Flow

1. User enters credentials
2. POST to `/api/auth/login`
3. Server returns JWT token
4. Token stored in localStorage
5. Interceptor adds token to all requests
6. Guards protect routes requiring authentication

### Best Practices

- JWT tokens stored in localStorage (consider HttpOnly cookies for production)
- Token refresh mechanism (to be implemented)
- CSRF protection via SameSite cookies
- XSS prevention via Angular's built-in sanitization
- Route guards for unauthorized access prevention

## 📊 State Management

### Angular Signals

Using Angular Signals for reactive state management:

```typescript
// Example: Auth state
currentUser = signal<User | null>(null);
isAuthenticated = signal<boolean>(false);

// Update state
this.currentUser.set(user);

// Read state in template
{{ currentUser()?.fullName }}
```

### Benefits

- Simple and performant
- Built-in change detection
- Type-safe
- No additional libraries needed
- Easy to test

## 🌐 API Integration

### Base Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api'
};
```

### HTTP Interceptor

Automatically adds JWT token to all API requests:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

### Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class LessonService {
  constructor(private http: HttpClient) {}
  
  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${environment.apiUrl}/lessons`);
  }
}
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('AuthService', () => {
  it('should login user', () => {
    service.login({ email, password }).subscribe(response => {
      expect(response.token).toBeDefined();
    });
  });
});
```

### Component Tests

```typescript
describe('LoginComponent', () => {
  it('should render login form', () => {
    expect(fixture.nativeElement.querySelector('form')).toBeTruthy();
  });
});
```

## 🚀 Deployment

### Build for Production

```bash
ng build --configuration production
```

### Environment Variables

Update `environment.prod.ts` with production API URL:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.englishcoach.com/api'
};
```

### Hosting Options

- **Static Hosting**: Netlify, Vercel, Firebase Hosting
- **CDN**: CloudFlare, AWS CloudFront
- **Container**: Docker + nginx
- **Platform**: Azure Static Web Apps, AWS Amplify

## 📝 Development Guidelines

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Prefer standalone components
- Use signals for state management
- Write meaningful component/service names

### Component Structure

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, ...],
  template: `...`,
  styles: [`...`]
})
export class FeatureComponent {
  // Signals for reactive state
  data = signal<Data | null>(null);
  isLoading = signal(false);
  
  // Dependency injection
  constructor(private service: Service) {}
  
  // Lifecycle hooks
  ngOnInit(): void {
    this.loadData();
  }
  
  // Methods
  loadData(): void {
    // Implementation
  }
}
```

### Service Structure

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}
  
  getData(): Observable<Data[]> {
    return this.http.get<Data[]>(`${environment.apiUrl}/data`);
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS configuration allows frontend origin
2. **401 Unauthorized**: Check JWT token validity and expiration
3. **Module Not Found**: Run `npm install` to install dependencies
4. **Build Errors**: Clear `.angular` cache and rebuild

### Debug Mode

Enable debug mode in development:

```typescript
// main.ts
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZone: 'zone.js',
  ngZoneEventCoalescing: true,
  ngZoneRunCoalescing: true
});
```

## 📚 Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Chart.js](https://www.chartjs.org)
- [RxJS](https://rxjs.dev)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is part of the English Speaking Coach application.
