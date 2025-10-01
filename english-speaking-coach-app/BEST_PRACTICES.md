# Best Practices - English Speaking Coach Frontend

## 🎯 Code Quality

### TypeScript

#### ✅ DO

```typescript
// Use explicit types
function getLesson(id: number): Observable<Lesson> {
  return this.http.get<Lesson>(`/api/lessons/${id}`);
}

// Use interfaces for data structures
interface User {
  id: number;
  email: string;
  fullName: string;
}

// Use const for immutable values
const API_URL = 'http://localhost:5001/api';

// Use strict null checks
let user: User | null = null;
```

#### ❌ DON'T

```typescript
// Don't use 'any'
function getData(): any { } // BAD

// Don't skip type annotations
function process(data) { } // BAD

// Don't use var
var count = 0; // BAD
```

### Component Design

#### ✅ DO

```typescript
// Keep components focused and small
@Component({
  selector: 'app-lesson-card',
  // ... focused on displaying lesson
})
export class LessonCardComponent {
  @Input() lesson!: Lesson;
  @Output() select = new EventEmitter<Lesson>();
}

// Use signals for reactive state
export class Component {
  isLoading = signal(false);
  data = signal<Data[]>([]);
}

// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Unsubscribe from observables
private destroy$ = new Subject<void>();

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

#### ❌ DON'T

```typescript
// Don't create god components
@Component({
  // 1000+ lines of code
})

// Don't subscribe in templates
{{ getData().subscribe() }} // BAD

// Don't forget to unsubscribe
ngOnInit() {
  this.service.getData().subscribe(); // Memory leak
}
```

### Service Design

#### ✅ DO

```typescript
// Provide services at root level
@Injectable({
  providedIn: 'root'
})
export class DataService { }

// Return Observables from HTTP calls
getData(): Observable<Data[]> {
  return this.http.get<Data[]>('/api/data');
}

// Handle errors
getData(): Observable<Data[]> {
  return this.http.get<Data[]>('/api/data').pipe(
    catchError(error => {
      console.error('Error:', error);
      return throwError(() => error);
    })
  );
}

// Use dependency injection
constructor(
  private http: HttpClient,
  private router: Router
) { }
```

#### ❌ DON'T

```typescript
// Don't use services as global variables
export class DataService {
  public globalData = []; // BAD
}

// Don't subscribe in services
getData() {
  this.http.get('/api/data').subscribe(); // BAD
  return this.data;
}

// Don't create circular dependencies
// ServiceA depends on ServiceB
// ServiceB depends on ServiceA // BAD
```

## 🎨 Styling

### ✅ DO

```typescript
// Use component-scoped styles
@Component({
  styles: [`
    :host {
      display: block;
    }
    
    .card {
      padding: 1rem;
    }
  `]
})

// Use Tailwind utility classes
<div class="flex items-center gap-4 p-6">

// Use Material Design components
<mat-card>
  <mat-card-content>
  </mat-card-content>
</mat-card>

// Follow design system
const primaryColor = '#3b82f6'; // From design system
```

### ❌ DON'T

```typescript
// Don't use inline styles
<div style="color: red; padding: 10px;"> // BAD

// Don't use !important
.my-class {
  color: red !important; // BAD
}

// Don't use random colors
color: #abc123; // Not in design system

// Don't use pixel values everywhere
padding: 17px; // Use design system spacing
```

## 🔐 Security

### ✅ DO

```typescript
// Use HttpClient (XSS protection built-in)
this.http.get('/api/data');

// Sanitize user input
import { DomSanitizer } from '@angular/platform-browser';
this.sanitizer.sanitize(SecurityContext.HTML, userInput);

// Use environment variables for config
import { environment } from '../environments/environment';
const apiUrl = environment.apiUrl;

// Validate on both client and server
if (form.valid) {
  // Submit to server for validation
}
```

### ❌ DON'T

```typescript
// Don't bypass security
this.sanitizer.bypassSecurityTrustHtml(userInput); // BAD

// Don't store sensitive data in localStorage
localStorage.setItem('password', pass); // BAD

// Don't commit secrets
const API_KEY = 'secret-key-123'; // BAD

// Don't trust client-side validation only
// Always validate on server
```

## 📊 State Management

### ✅ DO

```typescript
// Use signals for local state
export class Component {
  count = signal(0);
  
  increment() {
    this.count.update(c => c + 1);
  }
}

// Use services for shared state
@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
}

// Use computed for derived state
readonly fullName = computed(() => 
  `${this.firstName()} ${this.lastName()}`
);
```

### ❌ DON'T

```typescript
// Don't use global variables
window.userData = {}; // BAD

// Don't share state through components
// Use services instead

// Don't mutate signals directly
this.count() = 5; // BAD
// Use set() or update() instead
```

## 🎯 Performance

### ✅ DO

```typescript
// Use lazy loading
{
  path: 'feature',
  loadComponent: () => import('./feature.component')
}

// Use trackBy with ngFor
<div *ngFor="let item of items; trackBy: trackById">

trackById(index: number, item: Item): number {
  return item.id;
}

// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Optimize images
<img 
  loading="lazy"
  [src]="imageUrl"
  width="300"
  height="200">

// Use virtual scrolling for large lists
<cdk-virtual-scroll-viewport itemSize="50">
  <div *cdkVirtualFor="let item of items">
</cdk-virtual-scroll-viewport>
```

### ❌ DON'T

```typescript
// Don't create functions in templates
{{ calculateTotal() }} // Called on every change detection

// Don't load everything upfront
// Use lazy loading

// Don't subscribe in templates
{{ data$ | async | async }} // BAD

// Don't create large bundles
// Split code into modules
```

## 🧪 Testing

### ✅ DO

```typescript
// Write unit tests
describe('Component', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// Test user interactions
it('should submit form', () => {
  component.form.setValue({ email: 'test@test.com' });
  component.submit();
  expect(mockService.save).toHaveBeenCalled();
});

// Mock dependencies
const mockService = {
  getData: jest.fn().mockReturnValue(of([]))
};

// Test error cases
it('should handle error', () => {
  service.getData().subscribe({
    error: (err) => expect(err).toBeDefined()
  });
});
```

### ❌ DON'T

```typescript
// Don't skip tests
it('should work', () => {
  // TODO: write test // BAD
});

// Don't test implementation details
expect(component.privateMethod()).toBe(true); // BAD

// Don't make tests dependent
it('test 1', () => { /* sets global state */ });
it('test 2', () => { /* depends on test 1 */ }); // BAD
```

## 📱 Accessibility

### ✅ DO

```html
<!-- Use semantic HTML -->
<button>Click me</button>
<nav></nav>
<main></main>

<!-- Add ARIA labels -->
<button aria-label="Close dialog">
  <mat-icon>close</mat-icon>
</button>

<!-- Support keyboard navigation -->
<div 
  tabindex="0"
  (keydown.enter)="select()"
  (keydown.space)="select()">

<!-- Provide alt text -->
<img [src]="url" alt="Description">

<!-- Use proper color contrast -->
<!-- WCAG AA: 4.5:1 for normal text -->
```

### ❌ DON'T

```html
<!-- Don't use divs as buttons -->
<div (click)="action()">Click</div> <!-- BAD -->

<!-- Don't skip ARIA labels on icons -->
<mat-icon>close</mat-icon> <!-- BAD -->

<!-- Don't use color alone to convey info -->
<span class="text-red-500">Error</span> <!-- Need icon too -->

<!-- Don't forget alt text -->
<img [src]="url"> <!-- BAD -->
```

## 🚀 Deployment

### ✅ DO

```bash
# Use production build
ng build --configuration production

# Enable source maps in dev only
"sourceMap": false

# Set budget limits
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "2mb",
    "maximumError": "5mb"
  }
]

# Use environment variables
export const environment = {
  production: true,
  apiUrl: process.env['API_URL']
};

# Enable service worker for PWA
ng add @angular/pwa
```

### ❌ DON'T

```bash
# Don't deploy development builds
ng build # Missing --configuration production

# Don't commit dist folder
git add dist/ # BAD

# Don't use hardcoded URLs in production
const API_URL = 'http://localhost:5001'; # BAD

# Don't ignore bundle size
# Check and optimize large bundles
```

## 📝 Code Organization

### ✅ DO

```
src/
├── app/
│   ├── core/           # Singleton services, guards
│   ├── shared/         # Reusable components
│   ├── features/       # Feature modules
│   └── app.config.ts
├── assets/            # Images, fonts, etc.
└── environments/      # Environment configs
```

### File Naming

```
// Components
user-profile.component.ts
user-profile.component.html
user-profile.component.scss
user-profile.component.spec.ts

// Services
auth.service.ts
auth.service.spec.ts

// Models
user.model.ts

// Guards
auth.guard.ts

// Interceptors
auth.interceptor.ts
```

## 🔄 Git Workflow

### ✅ DO

```bash
# Write meaningful commit messages
git commit -m "feat: add user profile page"
git commit -m "fix: resolve login redirect issue"
git commit -m "refactor: simplify auth service"

# Create feature branches
git checkout -b feature/user-profile

# Keep commits small and focused
# One logical change per commit

# Write PR descriptions
- What changed
- Why it changed
- How to test
```

### Commit Message Format

```
<type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style (formatting)
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance

Examples:
feat(auth): add password reset functionality
fix(lesson): resolve audio playback issue
docs(readme): update installation instructions
```

## 🐛 Error Handling

### ✅ DO

```typescript
// Handle HTTP errors
getData(): Observable<Data[]> {
  return this.http.get<Data[]>('/api/data').pipe(
    retry(2),
    catchError(error => {
      console.error('API Error:', error);
      this.showError('Failed to load data');
      return of([]);
    })
  );
}

// Show user-friendly messages
if (error.status === 404) {
  this.message = 'Item not found';
} else if (error.status === 500) {
  this.message = 'Server error. Please try again later.';
}

// Log errors for debugging
console.error('Error details:', {
  message: error.message,
  stack: error.stack,
  url: request.url
});
```

### ❌ DON'T

```typescript
// Don't silently fail
getData() {
  this.http.get('/api/data').subscribe(); // No error handling
}

// Don't show technical errors to users
alert(error.stack); // BAD

// Don't ignore errors
.subscribe({
  error: () => { } // Empty error handler
});
```

## 📚 Documentation

### ✅ DO

```typescript
/**
 * Authenticates a user with email and password
 * @param credentials User login credentials
 * @returns Observable of authentication response
 * @throws HttpErrorResponse if authentication fails
 */
login(credentials: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>('/api/auth/login', credentials);
}

// Document complex logic
// This uses debounce to avoid too many API calls
this.searchInput.pipe(
  debounceTime(300),
  switchMap(term => this.search(term))
);

// Add README files
// README.md
// ARCHITECTURE.md
// API_DOCS.md
```

### ❌ DON'T

```typescript
// Don't write obvious comments
// Increment counter
counter++; // BAD

// Don't leave TODO without context
// TODO: fix this // BAD
// TODO: fix user login bug (see issue #123) // GOOD

// Don't comment out code
// function oldMethod() {
//   // ...
// } // Remove instead of commenting
```

## 🎯 Summary Checklist

### Before Commit
- [ ] Code compiles without errors
- [ ] Tests pass
- [ ] No console errors
- [ ] Code is formatted
- [ ] No TODO comments without context
- [ ] Documentation updated

### Before PR
- [ ] Feature works as expected
- [ ] Edge cases handled
- [ ] Error cases handled
- [ ] Tests written/updated
- [ ] No breaking changes (or documented)
- [ ] PR description written

### Before Release
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Bundle size acceptable
- [ ] Performance acceptable
- [ ] Accessibility checked
- [ ] Security reviewed
- [ ] Documentation complete

## 📚 References

- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Web Accessibility](https://www.w3.org/WAI/fundamentals/)
