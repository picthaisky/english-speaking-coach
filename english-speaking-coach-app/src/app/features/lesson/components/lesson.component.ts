import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LessonService, Lesson } from '../../../core/services/lesson.service';
import { SessionService } from '../../../core/services/session.service';
import { RecordingService } from '../../../core/services/recording.service';
import { AuthService } from '../../../core/services/auth.service';
import { AudioRecorderComponent } from '../../../shared/components/audio-recorder.component';
import { FeedbackPanelComponent } from '../../../shared/components/feedback-panel.component';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    AudioRecorderComponent,
    FeedbackPanelComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <mat-toolbar color="primary" class="shadow-md">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>{{ lesson()?.title || 'Lesson' }}</span>
      </mat-toolbar>

      <div class="container mx-auto px-4 py-8 max-w-5xl" *ngIf="lesson(); else loading">
        <mat-tab-group class="lesson-tabs" [(selectedIndex)]="selectedTabIndex">
          <!-- Lesson Content Tab -->
          <mat-tab label="Lesson">
            <div class="py-6">
              <mat-card>
                <mat-card-header>
                  <mat-card-title class="text-2xl">{{ lesson()?.title }}</mat-card-title>
                  <mat-card-subtitle>{{ lesson()?.description }}</mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content class="mt-4">
                  <div class="flex gap-3 mb-6">
                    <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {{ lesson()?.level }}
                    </span>
                    <span class="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {{ lesson()?.category }}
                    </span>
                    <span class="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                      {{ lesson()?.durationMinutes }} minutes
                    </span>
                  </div>

                  <div class="prose max-w-none">
                    <h3 class="text-xl font-semibold mb-4">Content</h3>
                    <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ lesson()?.content }}</p>
                  </div>

                  <div *ngIf="lesson()?.audioUrl" class="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 class="text-lg font-semibold mb-3">Reference Audio</h3>
                    <audio controls class="w-full">
                      <source [src]="lesson()!.audioUrl" type="audio/mpeg">
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </mat-card-content>

                <mat-card-actions class="flex justify-end mt-4">
                  <button 
                    mat-raised-button 
                    color="primary"
                    (click)="goToPractice()"
                    class="px-8">
                    <mat-icon class="mr-2">play_arrow</mat-icon>
                    Start Practice
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Practice Tab -->
          <mat-tab label="Practice">
            <div class="py-6">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Practice Speaking</mat-card-title>
                  <mat-card-subtitle>Record yourself speaking the lesson content</mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content class="mt-4">
                  <app-audio-recorder 
                    (recordingComplete)="onRecordingComplete($event)">
                  </app-audio-recorder>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Feedback Tab -->
          <mat-tab label="Feedback" [disabled]="!hasFeedback()">
            <div class="py-6">
              <app-feedback-panel
                *ngIf="feedbackData()"
                [overallScore]="feedbackData()!.overallScore"
                [pronunciationScore]="feedbackData()!.pronunciationScore"
                [fluencyScore]="feedbackData()!.fluencyScore"
                [accuracyScore]="feedbackData()!.accuracyScore"
                [transcript]="feedbackData()!.transcript"
                [feedbacks]="feedbackData()!.feedbacks">
              </app-feedback-panel>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>

      <ng-template #loading>
        <div class="flex justify-center items-center h-screen">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .lesson-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class LessonComponent implements OnInit {
  lesson = signal<Lesson | null>(null);
  feedbackData = signal<any>(null);
  hasFeedback = signal(false);
  selectedTabIndex = 0;
  private currentSessionId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonService,
    private sessionService: SessionService,
    private recordingService: RecordingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const lessonId = this.route.snapshot.params['id'];
    if (lessonId) {
      this.loadLesson(lessonId);
      this.startSession(lessonId);
    }
  }

  loadLesson(id: number): void {
    this.lessonService.getLesson(id).subscribe({
      next: (lesson) => this.lesson.set(lesson),
      error: (error) => console.error('Error loading lesson:', error)
    });
  }

  startSession(lessonId: number): void {
    this.sessionService.startSession({ lessonId }).subscribe({
      next: (session) => this.currentSessionId = session.id,
      error: (error) => console.error('Error starting session:', error)
    });
  }

  onRecordingComplete(audioBlob: Blob): void {
    if (!this.currentSessionId) {
      console.error('No active session');
      return;
    }

    // In a real app, upload to cloud storage first
    const mockAudioUrl = 'https://example.com/recording.webm';
    
    this.recordingService.createRecording({
      sessionId: this.currentSessionId,
      audioUrl: mockAudioUrl,
      duration: 60
    }).subscribe({
      next: (recording) => {
        this.analyzeRecording(recording.id);
      },
      error: (error) => console.error('Error creating recording:', error)
    });
  }

  analyzeRecording(recordingId: number): void {
    this.recordingService.analyzeRecording(recordingId).subscribe({
      next: (feedback) => {
        this.feedbackData.set(feedback);
        this.hasFeedback.set(true);
        this.selectedTabIndex = 2; // Switch to feedback tab
      },
      error: (error) => console.error('Error analyzing recording:', error)
    });
  }

  goToPractice(): void {
    this.selectedTabIndex = 1;
  }

  goBack(): void {
    if (this.currentSessionId) {
      this.sessionService.endSession(this.currentSessionId, {}).subscribe();
    }
    this.router.navigate(['/home']);
  }
}
