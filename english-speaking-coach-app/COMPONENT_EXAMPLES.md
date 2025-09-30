# Component Examples - English Speaking Coach

This document provides code examples for common components and patterns used in the application.

## 📦 Shared Components

### 1. Lesson Card Component

A reusable card component for displaying lesson information.

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface Lesson {
  id: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  content: string;
  durationMinutes: number;
}

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <mat-card class="lesson-card hover:shadow-lg transition-shadow">
      <mat-card-header>
        <mat-card-title>{{ lesson.title }}</mat-card-title>
        <mat-card-subtitle>{{ lesson.description }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content class="space-y-3">
        <div class="flex gap-2">
          <mat-chip>{{ lesson.level }}</mat-chip>
          <mat-chip>{{ lesson.category }}</mat-chip>
          <mat-chip>{{ lesson.durationMinutes }} min</mat-chip>
        </div>
      </mat-card-content>
      
      <mat-card-actions class="flex justify-end gap-2">
        <button mat-raised-button color="primary" (click)="startLesson.emit(lesson)">
          <mat-icon>play_arrow</mat-icon>
          Start
        </button>
      </mat-card-actions>
    </mat-card>
  `
})
export class LessonCardComponent {
  @Input() lesson!: Lesson;
  @Output() startLesson = new EventEmitter<Lesson>();
}
```

**Usage:**
```html
<app-lesson-card
  [lesson]="lesson"
  (startLesson)="onStartLesson($event)">
</app-lesson-card>
```

### 2. Audio Recorder Component

Component for recording audio with playback functionality.

```typescript
import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-audio-recorder',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="audio-recorder bg-white rounded-lg shadow-lg p-6">
      <div class="flex flex-col items-center space-y-4">
        <div class="text-center">
          <div 
            class="w-24 h-24 rounded-full flex items-center justify-center"
            [class.bg-red-100]="isRecording()"
            [class.bg-gray-100]="!isRecording()">
            <mat-icon 
              class="text-5xl"
              [class.text-red-600]="isRecording()"
              [class.animate-pulse]="isRecording()">
              {{ isRecording() ? 'mic' : 'mic_off' }}
            </mat-icon>
          </div>
        </div>

        <div class="flex gap-4">
          <button 
            *ngIf="!isRecording()"
            mat-raised-button 
            color="primary"
            (click)="startRecording()">
            <mat-icon>fiber_manual_record</mat-icon>
            Start
          </button>

          <button 
            *ngIf="isRecording()"
            mat-raised-button 
            color="warn"
            (click)="stopRecording()">
            <mat-icon>stop</mat-icon>
            Stop
          </button>
        </div>
      </div>
    </div>
  `
})
export class AudioRecorderComponent {
  @Output() recordingComplete = new EventEmitter<Blob>();
  
  isRecording = signal(false);
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.recordingComplete.emit(audioBlob);
      stream.getTracks().forEach(track => track.stop());
    };

    this.mediaRecorder.start();
    this.isRecording.set(true);
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
      this.isRecording.set(false);
    }
  }
}
```

**Usage:**
```html
<app-audio-recorder 
  (recordingComplete)="onRecordingComplete($event)">
</app-audio-recorder>
```

### 3. Progress Chart Component

Chart component using ng2-charts for displaying progress data.

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content class="mt-4">
        <canvas 
          baseChart
          [type]="chartType"
          [data]="chartData"
          [options]="chartOptions">
        </canvas>
      </mat-card-content>
    </mat-card>
  `
})
export class ProgressChartComponent implements OnInit {
  @Input() title: string = 'Progress Chart';
  @Input() data!: ChartData;
  @Input() chartType: 'line' | 'bar' = 'line';

  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  ngOnInit(): void {
    this.chartData = this.data;
  }
}
```

**Usage:**
```html
<app-progress-chart
  title="Weekly Scores"
  [data]="weeklyScoreData"
  chartType="line">
</app-progress-chart>
```

## 🔐 Authentication Components

### Login Component

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <mat-card class="max-w-md w-full">
        <mat-card-header class="text-center">
          <mat-card-title class="text-2xl">Sign In</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" formControlName="email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
            </mat-form-field>

            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input 
                matInput 
                [type]="hidePassword() ? 'password' : 'text'" 
                formControlName="password">
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              class="w-full"
              [disabled]="loginForm.invalid || isLoading()">
              {{ isLoading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
```

## 🏠 Feature Components

### Home Dashboard Component

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { LessonService, Lesson } from '../../../core/services/lesson.service';
import { LessonCardComponent } from '../../../shared/components/lesson-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    LessonCardComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <mat-toolbar color="primary" class="shadow-md">
        <span>English Speaking Coach</span>
        <span class="flex-1"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-toolbar>

      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">
          Welcome, {{ authService.currentUser()?.fullName }}!
        </h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <mat-card class="stat-card">
            <mat-card-content class="text-center">
              <mat-icon class="text-4xl text-blue-600">schedule</mat-icon>
              <div class="text-2xl font-bold">150</div>
              <div class="text-sm text-gray-600">Minutes</div>
            </mat-card-content>
          </mat-card>
          <!-- More stat cards -->
        </div>

        <!-- Lessons Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-lesson-card
            *ngFor="let lesson of lessons()"
            [lesson]="lesson"
            (startLesson)="startLesson($event)">
          </app-lesson-card>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  lessons = signal<Lesson[]>([]);

  constructor(
    public authService: AuthService,
    private lessonService: LessonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  loadLessons(): void {
    this.lessonService.getLessons().subscribe({
      next: (lessons) => this.lessons.set(lessons)
    });
  }

  startLesson(lesson: Lesson): void {
    this.router.navigate(['/lesson', lesson.id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
```

## 🔧 Service Examples

### Auth Service

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  email: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  email: string;
  fullName: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`, 
      credentials
    ).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    this.currentUser.set({
      id: response.userId,
      email: response.email,
      fullName: response.fullName
    });
    this.isAuthenticated.set(true);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token) {
      // Validate and load user
      this.isAuthenticated.set(true);
    }
  }
}
```

### Lesson Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Lesson {
  id: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  content: string;
  audioUrl?: string;
  durationMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  constructor(private http: HttpClient) {}

  getLessons(level?: string): Observable<Lesson[]> {
    let params = new HttpParams();
    if (level) {
      params = params.set('level', level);
    }
    return this.http.get<Lesson[]>(`${environment.apiUrl}/lessons`, { params });
  }

  getLesson(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${environment.apiUrl}/lessons/${id}`);
  }

  createLesson(lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.post<Lesson>(`${environment.apiUrl}/lessons`, lesson);
  }

  updateLesson(id: number, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.put<Lesson>(`${environment.apiUrl}/lessons/${id}`, lesson);
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/lessons/${id}`);
  }
}
```

## 🛡️ Guards & Interceptors

### Auth Guard

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

### HTTP Interceptor

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
```

## 🎯 Routing Configuration

```typescript
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/components/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/components/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'lesson/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/lesson/components/lesson.component')
      .then(m => m.LessonComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
```

## 📝 Testing Examples

### Service Test

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login user', () => {
    const mockResponse = {
      userId: 1,
      email: 'test@example.com',
      fullName: 'Test User',
      token: 'mock-token'
    };

    service.login({ email: 'test@example.com', password: 'password' })
      .subscribe(response => {
        expect(response.token).toBe('mock-token');
        expect(service.isAuthenticated()).toBeTruthy();
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

### Component Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render login form', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should validate email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid');
    expect(emailControl?.hasError('email')).toBeTruthy();
  });
});
```

## 🎨 Styling Patterns

### Custom Material Theme

```scss
@use '@angular/material' as mat;

// Define custom palette
$custom-primary: mat.m2-define-palette(mat.$blue-palette);
$custom-accent: mat.m2-define-palette(mat.$purple-palette);

// Create theme
$custom-theme: mat.m2-define-light-theme((
  color: (
    primary: $custom-primary,
    accent: $custom-accent,
  )
));

// Apply theme
@include mat.all-component-themes($custom-theme);
```

### Component-Specific Styles

```scss
:host {
  display: block;
}

.lesson-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
}
```

## 📚 Additional Resources

- [Angular Standalone Components](https://angular.dev/guide/components)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular Material](https://material.angular.io)
- [Tailwind CSS](https://tailwindcss.com/docs)
