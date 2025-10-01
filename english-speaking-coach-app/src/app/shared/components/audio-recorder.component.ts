import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-audio-recorder',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="audio-recorder bg-white rounded-lg shadow-lg p-6">
      <div class="flex flex-col items-center space-y-4">
        <!-- Recording Status -->
        <div class="text-center">
          <div 
            class="w-24 h-24 rounded-full flex items-center justify-center mb-4"
            [class.bg-red-100]="isRecording()"
            [class.bg-gray-100]="!isRecording()">
            <mat-icon 
              class="text-5xl"
              [class.text-red-600]="isRecording()"
              [class.text-gray-400]="!isRecording()"
              [class.animate-pulse]="isRecording()">
              {{ isRecording() ? 'mic' : 'mic_off' }}
            </mat-icon>
          </div>
          
          <div class="text-lg font-semibold text-gray-700">
            {{ isRecording() ? 'Recording...' : 'Ready to Record' }}
          </div>
          
          <div *ngIf="isRecording()" class="text-sm text-gray-500 mt-2">
            {{ formatTime(recordingTime()) }}
          </div>
        </div>

        <!-- Control Buttons -->
        <div class="flex gap-4">
          <button 
            *ngIf="!isRecording() && !audioBlob()"
            mat-raised-button 
            color="primary"
            (click)="startRecording()"
            [disabled]="isProcessing()"
            class="px-8 py-3">
            <mat-icon class="mr-2">fiber_manual_record</mat-icon>
            Start Recording
          </button>

          <button 
            *ngIf="isRecording()"
            mat-raised-button 
            color="warn"
            (click)="stopRecording()"
            class="px-8 py-3">
            <mat-icon class="mr-2">stop</mat-icon>
            Stop Recording
          </button>

          <button 
            *ngIf="audioBlob() && !isRecording()"
            mat-raised-button 
            color="accent"
            (click)="playAudio()"
            [disabled]="isProcessing()"
            class="px-6 py-3">
            <mat-icon class="mr-2">{{ isPlaying() ? 'pause' : 'play_arrow' }}</mat-icon>
            {{ isPlaying() ? 'Pause' : 'Play' }}
          </button>

          <button 
            *ngIf="audioBlob() && !isRecording()"
            mat-button 
            color="primary"
            (click)="resetRecording()"
            [disabled]="isProcessing()">
            <mat-icon class="mr-2">refresh</mat-icon>
            Reset
          </button>
        </div>

        <!-- Submit Button -->
        <button 
          *ngIf="audioBlob() && !isRecording()"
          mat-raised-button 
          color="primary"
          (click)="submitRecording()"
          [disabled]="isProcessing()"
          class="px-12 py-3 !mt-6">
          <mat-spinner 
            *ngIf="isProcessing()" 
            diameter="20" 
            class="mr-2 inline-block">
          </mat-spinner>
          <mat-icon *ngIf="!isProcessing()" class="mr-2">send</mat-icon>
          {{ isProcessing() ? 'Processing...' : 'Submit for Analysis' }}
        </button>

        <!-- Error Message -->
        <div 
          *ngIf="errorMessage()" 
          class="text-red-600 text-sm bg-red-50 p-3 rounded-lg w-full text-center">
          {{ errorMessage() }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .audio-recorder {
      max-width: 100%;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class AudioRecorderComponent {
  @Output() recordingComplete = new EventEmitter<Blob>();
  
  isRecording = signal(false);
  isPlaying = signal(false);
  isProcessing = signal(false);
  audioBlob = signal<Blob | null>(null);
  recordingTime = signal(0);
  errorMessage = signal<string | null>(null);

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingTimer: any = null;
  private audioElement: HTMLAudioElement | null = null;

  async startRecording(): Promise<void> {
    try {
      this.errorMessage.set(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.recordingTime.set(0);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioBlob.set(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording.set(true);

      // Start timer
      this.recordingTimer = setInterval(() => {
        this.recordingTime.update(time => time + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      this.errorMessage.set('Could not access microphone. Please check permissions.');
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
      this.isRecording.set(false);
      
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }
    }
  }

  playAudio(): void {
    const blob = this.audioBlob();
    if (!blob) return;

    if (this.isPlaying()) {
      this.audioElement?.pause();
      this.isPlaying.set(false);
      return;
    }

    const audioUrl = URL.createObjectURL(blob);
    this.audioElement = new Audio(audioUrl);
    
    this.audioElement.onended = () => {
      this.isPlaying.set(false);
      URL.revokeObjectURL(audioUrl);
    };

    this.audioElement.play();
    this.isPlaying.set(true);
  }

  resetRecording(): void {
    this.audioBlob.set(null);
    this.recordingTime.set(0);
    this.errorMessage.set(null);
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    this.isPlaying.set(false);
  }

  submitRecording(): void {
    const blob = this.audioBlob();
    if (blob) {
      this.isProcessing.set(true);
      this.recordingComplete.emit(blob);
      // Reset processing state after emission (parent component should handle this)
      setTimeout(() => this.isProcessing.set(false), 1000);
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
