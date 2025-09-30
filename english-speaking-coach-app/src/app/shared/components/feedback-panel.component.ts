import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Feedback } from '../../core/services/recording.service';

@Component({
  selector: 'app-feedback-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, MatProgressBarModule],
  template: `
    <mat-card class="feedback-panel">
      <mat-card-header>
        <mat-card-title class="flex items-center text-xl font-bold">
          <mat-icon class="mr-2 text-primary">feedback</mat-icon>
          Analysis Results
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content class="space-y-6 mt-4">
        <!-- Overall Score -->
        <div class="score-section p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div class="text-center">
            <div class="text-5xl font-bold text-primary mb-2">
              {{ overallScore }}
            </div>
            <div class="text-sm text-gray-600 uppercase tracking-wide">
              Overall Score
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4 mt-6">
            <div class="text-center">
              <div class="text-2xl font-semibold text-gray-700">{{ pronunciationScore }}</div>
              <div class="text-xs text-gray-500">Pronunciation</div>
              <mat-progress-bar 
                mode="determinate" 
                [value]="pronunciationScore"
                class="mt-2">
              </mat-progress-bar>
            </div>
            <div class="text-center">
              <div class="text-2xl font-semibold text-gray-700">{{ fluencyScore }}</div>
              <div class="text-xs text-gray-500">Fluency</div>
              <mat-progress-bar 
                mode="determinate" 
                [value]="fluencyScore"
                class="mt-2">
              </mat-progress-bar>
            </div>
            <div class="text-center">
              <div class="text-2xl font-semibold text-gray-700">{{ accuracyScore }}</div>
              <div class="text-xs text-gray-500">Accuracy</div>
              <mat-progress-bar 
                mode="determinate" 
                [value]="accuracyScore"
                class="mt-2">
              </mat-progress-bar>
            </div>
          </div>
        </div>

        <!-- Transcript -->
        <div class="transcript-section" *ngIf="transcript">
          <h3 class="text-lg font-semibold mb-3 flex items-center">
            <mat-icon class="mr-2">text_fields</mat-icon>
            Transcript
          </h3>
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p class="text-gray-800 leading-relaxed">{{ transcript }}</p>
          </div>
        </div>

        <!-- Detailed Feedback -->
        <div class="feedback-items" *ngIf="feedbacks && feedbacks.length > 0">
          <h3 class="text-lg font-semibold mb-3 flex items-center">
            <mat-icon class="mr-2">tips_and_updates</mat-icon>
            Detailed Feedback
          </h3>
          
          <div class="space-y-3">
            <div 
              *ngFor="let feedback of feedbacks" 
              class="feedback-item p-4 border-l-4 rounded-r-lg shadow-sm"
              [class.border-red-500]="feedback.severity && feedback.severity >= 4"
              [class.border-yellow-500]="feedback.severity && feedback.severity === 3"
              [class.border-blue-500]="feedback.severity && feedback.severity <= 2"
              [class.bg-red-50]="feedback.severity && feedback.severity >= 4"
              [class.bg-yellow-50]="feedback.severity && feedback.severity === 3"
              [class.bg-blue-50]="feedback.severity && feedback.severity <= 2">
              
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <mat-chip class="!text-xs">
                      {{ feedback.feedbackType }}
                    </mat-chip>
                    <span 
                      *ngIf="feedback.severity" 
                      class="ml-2 text-xs font-medium px-2 py-1 rounded"
                      [class.bg-red-200]="feedback.severity >= 4"
                      [class.bg-yellow-200]="feedback.severity === 3"
                      [class.bg-blue-200]="feedback.severity <= 2">
                      Severity: {{ feedback.severity }}/5
                    </span>
                  </div>
                  
                  <p class="text-gray-800 mb-2">{{ feedback.content }}</p>
                  
                  <div 
                    *ngIf="feedback.suggestion" 
                    class="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                    <div class="flex items-start">
                      <mat-icon class="text-green-600 mr-2 text-sm">lightbulb</mat-icon>
                      <div>
                        <div class="text-xs font-semibold text-gray-600 mb-1">Suggestion:</div>
                        <p class="text-sm text-gray-700">{{ feedback.suggestion }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Feedback Message -->
        <div 
          *ngIf="!feedbacks || feedbacks.length === 0" 
          class="text-center p-8 bg-green-50 rounded-lg">
          <mat-icon class="text-green-600 text-5xl mb-3">check_circle</mat-icon>
          <p class="text-lg font-semibold text-green-800">Excellent Work!</p>
          <p class="text-sm text-green-600 mt-2">No major issues detected in your speech.</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .feedback-panel {
      max-width: 100%;
    }

    mat-progress-bar {
      height: 6px;
      border-radius: 3px;
    }
  `]
})
export class FeedbackPanelComponent {
  @Input() overallScore: number = 0;
  @Input() pronunciationScore: number = 0;
  @Input() fluencyScore: number = 0;
  @Input() accuracyScore: number = 0;
  @Input() transcript?: string;
  @Input() feedbacks?: Feedback[];
}
