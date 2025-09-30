import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { LessonService, Lesson } from '../../../core/services/lesson.service';
import { ProgressService, ProgressSummary } from '../../../core/services/progress.service';
import { LessonCardComponent } from '../../../shared/components/lesson-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    LessonCardComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <mat-toolbar color="primary" class="shadow-md">
        <span class="flex items-center">
          <mat-icon class="mr-2">record_voice_over</mat-icon>
          English Speaking Coach
        </span>
        <span class="flex-1"></span>
        <button mat-button [routerLink]="['/progress']">
          <mat-icon>trending_up</mat-icon>
          Progress
        </button>
        <button mat-button [routerLink]="['/settings']">
          <mat-icon>settings</mat-icon>
          Settings
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-toolbar>

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-8 max-w-7xl">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {{ authService.currentUser()?.fullName }}!
          </h1>
          <p class="text-gray-600">Let's continue improving your English speaking skills today.</p>
        </div>

        <!-- Progress Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" *ngIf="progressSummary()">
          <mat-card class="stat-card">
            <mat-card-content class="text-center">
              <mat-icon class="text-4xl text-blue-600 mb-2">schedule</mat-icon>
              <div class="text-2xl font-bold text-gray-900">
                {{ progressSummary()?.totalPracticeTime || 0 }}
              </div>
              <div class="text-sm text-gray-600">Minutes Practiced</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content class="text-center">
              <mat-icon class="text-4xl text-green-600 mb-2">school</mat-icon>
              <div class="text-2xl font-bold text-gray-900">
                {{ progressSummary()?.totalLessonsCompleted || 0 }}
              </div>
              <div class="text-sm text-gray-600">Lessons Completed</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content class="text-center">
              <mat-icon class="text-4xl text-purple-600 mb-2">mic</mat-icon>
              <div class="text-2xl font-bold text-gray-900">
                {{ progressSummary()?.totalRecordings || 0 }}
              </div>
              <div class="text-sm text-gray-600">Recordings</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content class="text-center">
              <mat-icon class="text-4xl text-orange-600 mb-2">emoji_events</mat-icon>
              <div class="text-2xl font-bold text-gray-900">
                {{ progressSummary()?.averageOverallScore || 0 }}%
              </div>
              <div class="text-sm text-gray-600">Average Score</div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Daily Practice Suggestion -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            <mat-icon class="align-middle mr-2">lightbulb</mat-icon>
            Today's Practice
          </h2>
          <mat-card class="practice-suggestion bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <mat-card-content class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-semibold mb-2">Ready for a new challenge?</h3>
                  <p class="text-blue-100">Complete 1 lesson today to maintain your learning streak!</p>
                </div>
                <button 
                  mat-raised-button 
                  class="bg-white text-primary"
                  (click)="scrollToLessons()">
                  Start Learning
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Available Lessons -->
        <div id="lessons-section">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-900">
              <mat-icon class="align-middle mr-2">menu_book</mat-icon>
              Available Lessons
            </h2>
            <div class="flex gap-2">
              <button 
                mat-stroked-button 
                [class.mat-primary]="selectedLevel() === 'Beginner'"
                (click)="filterByLevel('Beginner')">
                Beginner
              </button>
              <button 
                mat-stroked-button 
                [class.mat-primary]="selectedLevel() === 'Intermediate'"
                (click)="filterByLevel('Intermediate')">
                Intermediate
              </button>
              <button 
                mat-stroked-button 
                [class.mat-primary]="selectedLevel() === 'Advanced'"
                (click)="filterByLevel('Advanced')">
                Advanced
              </button>
              <button 
                mat-stroked-button 
                [class.mat-primary]="selectedLevel() === null"
                (click)="filterByLevel(null)">
                All
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="!isLoading(); else loading">
            <app-lesson-card
              *ngFor="let lesson of filteredLessons()"
              [lesson]="lesson"
              (startLesson)="startLesson($event)"
              (viewDetails)="viewLessonDetails($event)">
            </app-lesson-card>
          </div>

          <ng-template #loading>
            <div class="flex justify-center items-center py-12">
              <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            </div>
          </ng-template>

          <div *ngIf="filteredLessons().length === 0 && !isLoading()" class="text-center py-12">
            <mat-icon class="text-6xl text-gray-400 mb-4">info</mat-icon>
            <p class="text-gray-600">No lessons found for the selected level.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .practice-suggestion mat-card-content {
      padding: 0;
    }
  `]
})
export class HomeComponent implements OnInit {
  lessons = signal<Lesson[]>([]);
  filteredLessons = signal<Lesson[]>([]);
  progressSummary = signal<ProgressSummary | null>(null);
  selectedLevel = signal<string | null>(null);
  isLoading = signal(true);

  constructor(
    public authService: AuthService,
    private lessonService: LessonService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLessons();
    this.loadProgress();
  }

  loadLessons(): void {
    this.isLoading.set(true);
    this.lessonService.getLessons().subscribe({
      next: (lessons) => {
        this.lessons.set(lessons);
        this.filteredLessons.set(lessons);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading lessons:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadProgress(): void {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.progressService.getProgressSummary(userId).subscribe({
        next: (summary) => this.progressSummary.set(summary),
        error: (error) => console.error('Error loading progress:', error)
      });
    }
  }

  filterByLevel(level: string | null): void {
    this.selectedLevel.set(level);
    if (level) {
      this.filteredLessons.set(
        this.lessons().filter(lesson => lesson.level === level)
      );
    } else {
      this.filteredLessons.set(this.lessons());
    }
  }

  startLesson(lesson: Lesson): void {
    this.router.navigate(['/lesson', lesson.id]);
  }

  viewLessonDetails(lesson: Lesson): void {
    this.router.navigate(['/lesson', lesson.id]);
  }

  scrollToLessons(): void {
    document.getElementById('lessons-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
