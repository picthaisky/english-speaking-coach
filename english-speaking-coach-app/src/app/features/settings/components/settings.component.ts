import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <mat-toolbar color="primary" class="shadow-md">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Settings</span>
      </mat-toolbar>

      <div class="container mx-auto px-4 py-8 max-w-3xl">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <!-- Profile Settings -->
        <mat-card class="mb-6">
          <mat-card-header>
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2">person</mat-icon>
              Profile
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="space-y-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <div class="text-gray-900">{{ authService.currentUser()?.fullName }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div class="text-gray-900">{{ authService.currentUser()?.email }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <div class="text-gray-900">{{ authService.currentUser()?.level || 'Not set' }}</div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Audio Settings -->
        <mat-card class="mb-6">
          <mat-card-header>
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2">mic</mat-icon>
              Audio Preferences
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="space-y-4 mt-4">
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Voice Gender Preference</mat-label>
              <mat-select [(value)]="voicePreference">
                <mat-option value="male">Male</mat-option>
                <mat-option value="female">Female</mat-option>
                <mat-option value="neutral">Neutral</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Accent Preference</mat-label>
              <mat-select [(value)]="accentPreference">
                <mat-option value="us">US English</mat-option>
                <mat-option value="uk">British English</mat-option>
                <mat-option value="au">Australian English</mat-option>
              </mat-select>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- Notification Settings -->
        <mat-card class="mb-6">
          <mat-card-header>
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2">notifications</mat-icon>
              Notifications
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="space-y-4 mt-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Daily Practice Reminder</div>
                <div class="text-sm text-gray-600">Get reminded to practice daily</div>
              </div>
              <mat-slide-toggle [(ngModel)]="dailyReminder"></mat-slide-toggle>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Progress Updates</div>
                <div class="text-sm text-gray-600">Receive weekly progress reports</div>
              </div>
              <mat-slide-toggle [(ngModel)]="progressUpdates"></mat-slide-toggle>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Achievement Notifications</div>
                <div class="text-sm text-gray-600">Get notified about achievements</div>
              </div>
              <mat-slide-toggle [(ngModel)]="achievementNotifs"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Privacy Settings -->
        <mat-card class="mb-6">
          <mat-card-header>
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2">security</mat-icon>
              Privacy & Security
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="space-y-4 mt-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Share Progress</div>
                <div class="text-sm text-gray-600">Allow sharing your progress</div>
              </div>
              <mat-slide-toggle [(ngModel)]="shareProgress"></mat-slide-toggle>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Data Collection</div>
                <div class="text-sm text-gray-600">Help improve our services</div>
              </div>
              <mat-slide-toggle [(ngModel)]="dataCollection"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button mat-raised-button color="primary" (click)="saveSettings()" class="flex-1">
            <mat-icon class="mr-2">save</mat-icon>
            Save Settings
          </button>
          <button mat-stroked-button color="warn" (click)="logout()">
            <mat-icon class="mr-2">logout</mat-icon>
            Logout
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SettingsComponent {
  voicePreference = signal('female');
  accentPreference = signal('us');
  dailyReminder = true;
  progressUpdates = true;
  achievementNotifs = true;
  shareProgress = false;
  dataCollection = true;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  saveSettings(): void {
    // Save settings logic here
    console.log('Settings saved:', {
      voicePreference: this.voicePreference(),
      accentPreference: this.accentPreference(),
      dailyReminder: this.dailyReminder,
      progressUpdates: this.progressUpdates,
      achievementNotifs: this.achievementNotifs,
      shareProgress: this.shareProgress,
      dataCollection: this.dataCollection
    });
    alert('Settings saved successfully!');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
