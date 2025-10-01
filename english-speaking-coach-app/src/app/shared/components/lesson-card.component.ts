import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Lesson } from '../../core/services/lesson.service';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <mat-card class="lesson-card hover:shadow-lg transition-shadow duration-300">
      <mat-card-header class="flex items-center mb-4">
        <div class="flex-1">
          <mat-card-title class="text-xl font-bold text-gray-900">
            {{ lesson.title }}
          </mat-card-title>
          <mat-card-subtitle class="text-sm text-gray-600 mt-1">
            {{ lesson.description }}
          </mat-card-subtitle>
        </div>
      </mat-card-header>
      
      <mat-card-content class="space-y-3">
        <div class="flex gap-2 flex-wrap">
          <mat-chip [highlighted]="true">
            <mat-icon class="mr-1">school</mat-icon>
            {{ lesson.level }}
          </mat-chip>
          <mat-chip>
            <mat-icon class="mr-1">category</mat-icon>
            {{ lesson.category }}
          </mat-chip>
          <mat-chip>
            <mat-icon class="mr-1">schedule</mat-icon>
            {{ lesson.durationMinutes }} min
          </mat-chip>
        </div>
        
        <p class="text-gray-700 text-sm line-clamp-3">
          {{ lesson.content }}
        </p>
      </mat-card-content>
      
      <mat-card-actions class="flex justify-end gap-2 mt-4">
        <button 
          mat-button 
          color="primary"
          (click)="onViewDetails()"
          class="hover:bg-blue-50">
          View Details
        </button>
        <button 
          mat-raised-button 
          color="primary"
          (click)="onStartLesson()"
          class="px-6">
          <mat-icon class="mr-1">play_arrow</mat-icon>
          Start
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .lesson-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    mat-card-content {
      flex: 1;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class LessonCardComponent {
  @Input() lesson!: Lesson;
  @Output() startLesson = new EventEmitter<Lesson>();
  @Output() viewDetails = new EventEmitter<Lesson>();

  onStartLesson(): void {
    this.startLesson.emit(this.lesson);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.lesson);
  }
}
