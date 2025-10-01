import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../core/services/auth.service';
import { ProgressService, ProgressSummary, ProgressMetrics } from '../../../core/services/progress.service';
import { ProgressChartComponent, ChartData } from '../../../shared/components/progress-chart.component';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    ProgressChartComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <mat-toolbar color="primary" class="shadow-md">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Progress Dashboard</span>
      </mat-toolbar>

      <div class="container mx-auto px-4 py-8 max-w-7xl">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Your Learning Progress</h1>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" *ngIf="summary()">
          <mat-card>
            <mat-card-content class="text-center p-6">
              <mat-icon class="text-5xl text-blue-600 mb-3">schedule</mat-icon>
              <div class="text-3xl font-bold text-gray-900 mb-2">
                {{ summary()?.totalPracticeTime || 0 }}
              </div>
              <div class="text-sm text-gray-600">Total Minutes</div>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-content class="text-center p-6">
              <mat-icon class="text-5xl text-green-600 mb-3">school</mat-icon>
              <div class="text-3xl font-bold text-gray-900 mb-2">
                {{ summary()?.totalLessonsCompleted || 0 }}
              </div>
              <div class="text-sm text-gray-600">Lessons Completed</div>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-content class="text-center p-6">
              <mat-icon class="text-5xl text-orange-600 mb-3">local_fire_department</mat-icon>
              <div class="text-3xl font-bold text-gray-900 mb-2">
                {{ summary()?.currentStreak || 0 }}
              </div>
              <div class="text-sm text-gray-600">Day Streak</div>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-content class="text-center p-6">
              <mat-icon class="text-5xl text-purple-600 mb-3">trending_up</mat-icon>
              <div class="text-3xl font-bold text-gray-900 mb-2">
                {{ summary()?.averageOverallScore || 0 }}%
              </div>
              <div class="text-sm text-gray-600">Avg Score</div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Charts -->
        <mat-tab-group>
          <mat-tab label="Weekly Progress">
            <div class="py-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <app-progress-chart
                  title="Weekly Scores"
                  [data]="weeklyScoreData()"
                  chartType="line">
                </app-progress-chart>

                <app-progress-chart
                  title="Practice Time (Minutes)"
                  [data]="weeklyTimeData()"
                  chartType="bar">
                </app-progress-chart>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Monthly Progress">
            <div class="py-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <app-progress-chart
                  title="Monthly Scores"
                  [data]="monthlyScoreData()"
                  chartType="line">
                </app-progress-chart>

                <app-progress-chart
                  title="Recordings per Month"
                  [data]="monthlyRecordingsData()"
                  chartType="bar">
                </app-progress-chart>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: []
})
export class ProgressComponent implements OnInit {
  summary = signal<ProgressSummary | null>(null);
  weeklyMetrics = signal<ProgressMetrics[]>([]);
  monthlyMetrics = signal<ProgressMetrics[]>([]);
  
  weeklyScoreData = signal<ChartData>({ labels: [], datasets: [] });
  weeklyTimeData = signal<ChartData>({ labels: [], datasets: [] });
  monthlyScoreData = signal<ChartData>({ labels: [], datasets: [] });
  monthlyRecordingsData = signal<ChartData>({ labels: [], datasets: [] });

  constructor(
    private authService: AuthService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.progressService.getProgressSummary(userId).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.prepareChartData(summary);
      },
      error: (error) => console.error('Error loading progress:', error)
    });

    this.progressService.getWeeklyProgress(userId).subscribe({
      next: (metrics) => {
        this.weeklyMetrics.set(metrics);
        this.updateWeeklyCharts(metrics);
      }
    });

    this.progressService.getMonthlyProgress(userId).subscribe({
      next: (metrics) => {
        this.monthlyMetrics.set(metrics);
        this.updateMonthlyCharts(metrics);
      }
    });
  }

  prepareChartData(summary: ProgressSummary): void {
    // Prepare chart data from summary trends
    if (summary.weeklyTrend) {
      this.updateWeeklyChartsFromTrend(summary.weeklyTrend);
    }
    if (summary.monthlyTrend) {
      this.updateMonthlyChartsFromTrend(summary.monthlyTrend);
    }
  }

  updateWeeklyCharts(metrics: ProgressMetrics[]): void {
    const labels = metrics.map(m => new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' }));
    
    this.weeklyScoreData.set({
      labels,
      datasets: [
        {
          label: 'Average Score',
          data: metrics.map(m => m.averageScore),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true
        }
      ]
    });

    this.weeklyTimeData.set({
      labels,
      datasets: [
        {
          label: 'Practice Minutes',
          data: metrics.map(m => m.totalPracticeMinutes),
          backgroundColor: '#10b981'
        }
      ]
    });
  }

  updateMonthlyCharts(metrics: ProgressMetrics[]): void {
    const labels = metrics.map(m => new Date(m.date).toLocaleDateString('en-US', { month: 'short' }));
    
    this.monthlyScoreData.set({
      labels,
      datasets: [
        {
          label: 'Average Score',
          data: metrics.map(m => m.averageScore),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true
        }
      ]
    });

    this.monthlyRecordingsData.set({
      labels,
      datasets: [
        {
          label: 'Recordings',
          data: metrics.map(m => m.recordingsCount),
          backgroundColor: '#f59e0b'
        }
      ]
    });
  }

  updateWeeklyChartsFromTrend(trends: any[]): void {
    const labels = trends.map(t => t.period);
    
    this.weeklyScoreData.set({
      labels,
      datasets: [
        {
          label: 'Average Score',
          data: trends.map(t => t.averageScore),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true
        }
      ]
    });

    this.weeklyTimeData.set({
      labels,
      datasets: [
        {
          label: 'Practice Minutes',
          data: trends.map(t => t.practiceMinutes),
          backgroundColor: '#10b981'
        }
      ]
    });
  }

  updateMonthlyChartsFromTrend(trends: any[]): void {
    const labels = trends.map(t => t.period);
    
    this.monthlyScoreData.set({
      labels,
      datasets: [
        {
          label: 'Average Score',
          data: trends.map(t => t.averageScore),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true
        }
      ]
    });

    this.monthlyRecordingsData.set({
      labels,
      datasets: [
        {
          label: 'Recordings',
          data: trends.map(t => t.recordingsCount),
          backgroundColor: '#f59e0b'
        }
      ]
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
