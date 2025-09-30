# Frontend Architecture - English Speaking Coach

## 🏛️ Architecture Overview

This document describes the architecture and design decisions for the Angular 20 frontend application.

## 📐 Architectural Patterns

### 1. Standalone Components Architecture

All components are standalone (no NgModules), following Angular's modern approach:

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, MaterialModule, ...],
  template: `...`
})
export class FeatureComponent {}
```

**Benefits:**
- Simpler dependency management
- Better tree-shaking
- Explicit imports
- Easier to understand and maintain

### 2. Lazy Loading Strategy

Features are lazy-loaded using route-level code splitting:

```typescript
{
  path: 'home',
  loadComponent: () => import('./features/home/components/home.component')
    .then(m => m.HomeComponent)
}
```

**Benefits:**
- Faster initial load time
- Smaller bundle sizes
- Better performance
- On-demand loading

### 3. Signal-Based State Management

Using Angular Signals instead of RxJS BehaviorSubjects for component state:

```typescript
// Auth Service
currentUser = signal<User | null>(null);
isAuthenticated = signal<boolean>(false);

// Component usage
{{ authService.currentUser()?.fullName }}
```

**Benefits:**
- Simpler API
- Better performance
- Built-in change detection
- Type-safe
- No subscription management

### 4. Service Layer Pattern

Business logic is centralized in injectable services:

```
┌─────────────┐
│ Components  │ ← Presentation Layer
└──────┬──────┘
       │
┌──────▼──────┐
│  Services   │ ← Business Logic Layer
└──────┬──────┘
       │
┌──────▼──────┐
│ HTTP Client │ ← Data Access Layer
└─────────────┘
```

## 🎯 Component Architecture

### Component Hierarchy

```
App (Root)
│
├─── Auth Module
│    ├─── Login Component
│    └─── Register Component
│
├─── Home Module
│    └─── Home Component
│         ├─── Lesson Card (Shared)
│         └─── Progress Summary
│
├─── Lesson Module
│    └─── Lesson Component
│         ├─── Audio Recorder (Shared)
│         └─── Feedback Panel (Shared)
│
├─── Progress Module
│    └─── Progress Component
│         └─── Progress Chart (Shared)
│
└─── Settings Module
     └─── Settings Component
```

### Component Types

#### 1. Smart (Container) Components
- Manage state
- Handle business logic
- Call services
- Route navigation

**Examples:**
- HomeComponent
- LessonComponent
- ProgressComponent

#### 2. Presentational (Dumb) Components
- Receive data via @Input
- Emit events via @Output
- No service dependencies
- Pure presentation logic

**Examples:**
- LessonCardComponent
- FeedbackPanelComponent
- ProgressChartComponent
- AudioRecorderComponent

## 🔐 Authentication Flow

```
┌─────────┐      ┌─────────────┐      ┌──────────┐
│  Login  │─────►│ AuthService │─────►│ Backend  │
│  Page   │      │             │      │   API    │
└─────────┘      └─────┬───────┘      └──────────┘
                       │
                       ▼
              ┌────────────────┐
              │  localStorage  │
              │  (JWT Token)   │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │  HTTP Request  │
              │  (Interceptor) │
              └────────────────┘
```

### Guard Protection

```typescript
// Route configuration with guards
{
  path: 'home',
  canActivate: [authGuard],
  loadComponent: () => import('./home.component')
}

// Auth Guard implementation
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};
```

## 📡 HTTP Communication

### Interceptor Pattern

```
HTTP Request
     ↓
┌────────────────┐
│ Auth           │
│ Interceptor    │ → Add JWT Token
└────┬───────────┘
     ↓
┌────────────────┐
│ HTTP Client    │
└────┬───────────┘
     ↓
Backend API
```

### Error Handling

```typescript
this.http.get<Data>('/api/data').pipe(
  retry(2),
  catchError(error => {
    console.error('API Error:', error);
    return throwError(() => error);
  })
);
```

## 🎨 UI Component Architecture

### Material + Tailwind Integration

**Material Design Components:**
- Structural components (Card, Toolbar, Tabs)
- Form controls (Input, Select, Checkbox)
- Interactive elements (Button, Menu, Dialog)

**Tailwind CSS:**
- Spacing utilities
- Color utilities
- Responsive design
- Custom layouts

```html
<!-- Hybrid approach -->
<mat-card class="shadow-lg rounded-lg">
  <mat-card-content class="p-6 space-y-4">
    <button mat-raised-button class="w-full py-3">
      Submit
    </button>
  </mat-card-content>
</mat-card>
```

### Responsive Design Strategy

```typescript
// Mobile-first breakpoints
┌──────────┬──────────┬──────────┬──────────┐
│  Mobile  │  Tablet  │  Desktop │   Wide   │
│   < 640  │   < 768  │  < 1024  │  < 1280  │
└──────────┴──────────┴──────────┴──────────┘

// Tailwind classes
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Responsive grid -->
</div>
```

## 📊 Data Flow

### Unidirectional Data Flow

```
┌──────────────────────────────────────┐
│           Component                  │
│  ┌──────────┐      ┌──────────┐    │
│  │ Template │─────►│   Logic  │    │
│  └────┬─────┘      └────┬─────┘    │
│       │                 │           │
│   (Event)          (State)          │
└───────┼─────────────────┼───────────┘
        │                 │
        ▼                 ▼
   ┌─────────┐       ┌─────────┐
   │ Service │───────►│  Store  │
   └─────────┘       └─────────┘
                          │
                          ▼
                    ┌──────────┐
                    │   API    │
                    └──────────┘
```

### Signal Updates

```typescript
// Service
export class DataService {
  private data = signal<Data[]>([]);
  
  loadData(): void {
    this.http.get<Data[]>('/api/data').subscribe(
      result => this.data.set(result)
    );
  }
  
  getData = computed(() => this.data());
}

// Component
export class Component {
  data = inject(DataService).getData();
  
  // Template automatically updates
}
```

## 🧩 Module Organization

### Feature-Based Structure

```
features/
├── auth/              # Authentication feature
│   ├── components/
│   ├── services/
│   └── models/
│
├── home/              # Home dashboard feature
│   ├── components/
│   └── models/
│
└── lesson/            # Lesson practice feature
    ├── components/
    ├── services/
    └── models/
```

### Shared Resources

```
shared/
├── components/        # Reusable components
├── directives/        # Custom directives
├── pipes/            # Custom pipes
└── utils/            # Utility functions
```

### Core Resources

```
core/
├── guards/           # Route guards
├── interceptors/     # HTTP interceptors
├── services/         # Singleton services
└── models/          # Core interfaces
```

## 🔄 State Management Strategy

### Local Component State

```typescript
// Component-level state with signals
export class Component {
  isLoading = signal(false);
  data = signal<Data | null>(null);
  error = signal<string | null>(null);
}
```

### Shared Service State

```typescript
// Service-level state for cross-component sharing
@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);
}
```

### When to Use What?

| State Type | Use | Example |
|------------|-----|---------|
| Component Signal | Local UI state | Loading, errors, form values |
| Service Signal | Shared state | Current user, auth status |
| Service + LocalStorage | Persistent state | User preferences, tokens |

## 🎯 Performance Optimization

### 1. Lazy Loading

- Route-level code splitting
- On-demand module loading
- Preloading strategies

### 2. OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 3. TrackBy Functions

```typescript
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>

trackById(index: number, item: Item): number {
  return item.id;
}
```

### 4. Virtual Scrolling

```typescript
<cdk-virtual-scroll-viewport itemSize="50">
  <div *cdkVirtualFor="let item of items">
    {{ item.name }}
  </div>
</cdk-virtual-scroll-viewport>
```

## 🧪 Testing Architecture

### Unit Testing

```typescript
describe('Service', () => {
  let service: Service;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Service]
    });
    service = TestBed.inject(Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch data', () => {
    service.getData().subscribe(data => {
      expect(data).toBeDefined();
    });
  });
});
```

### Component Testing

```typescript
describe('Component', () => {
  let component: Component;
  let fixture: ComponentFixture<Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Component]
    }).compileComponents();

    fixture = TestBed.createComponent(Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 🚀 Build & Deployment

### Build Configurations

```json
{
  "configurations": {
    "development": {
      "optimization": false,
      "sourceMap": true,
      "extractLicenses": false,
      "namedChunks": true
    },
    "production": {
      "optimization": true,
      "sourceMap": false,
      "extractLicenses": true,
      "namedChunks": false,
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "2mb",
          "maximumError": "5mb"
        }
      ]
    }
  }
}
```

### Bundle Optimization

```
Initial Bundle
├── main.js           (11 KB)   - App bootstrap
├── polyfills.js      (90 KB)   - Browser polyfills
├── styles.css        (26 KB)   - Global styles
└── vendor.js         (2 MB)    - Third-party libraries

Lazy Bundles (On-demand)
├── home.js           (31 KB)
├── lesson.js         (56 KB)
├── progress.js       (20 KB)
└── settings.js       (77 KB)
```

## 📝 Best Practices

### 1. Component Design

✅ **Do:**
- Keep components focused and single-purpose
- Use signals for reactive state
- Prefer standalone components
- Use OnPush change detection

❌ **Don't:**
- Mix business logic with presentation
- Subscribe in templates
- Use any type
- Bypass change detection

### 2. Service Design

✅ **Do:**
- Use dependency injection
- Return Observables from HTTP calls
- Handle errors gracefully
- Use typed responses

❌ **Don't:**
- Store state in components
- Use global variables
- Ignore error handling
- Bypass HTTP interceptors

### 3. Performance

✅ **Do:**
- Lazy load routes
- Use trackBy with ngFor
- Optimize images
- Use virtual scrolling for large lists

❌ **Don't:**
- Load everything upfront
- Create functions in templates
- Ignore bundle size
- Skip performance testing

## 🔮 Future Enhancements

### Planned Improvements

1. **PWA Support**
   - Service worker
   - Offline capability
   - Push notifications

2. **State Management**
   - Consider NgRx for complex state
   - Redux DevTools integration

3. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

4. **Internationalization**
   - i18n support
   - Multiple languages
   - RTL support

5. **Advanced Features**
   - Real-time collaboration
   - Voice chat
   - Video lessons
   - Social features

## 📚 References

- [Angular Architecture Guide](https://angular.dev/guide/architecture)
- [Angular Signals](https://angular.dev/guide/signals)
- [Material Design 3](https://m3.material.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)
