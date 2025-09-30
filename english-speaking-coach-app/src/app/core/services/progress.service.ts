import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProgressMetrics {
  id: number;
  userId: number;
  date: string;
  totalPracticeMinutes: number;
  lessonsCompleted: number;
  recordingsCount: number;
  averageScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  accuracyScore: number;
}

export interface ProgressSummary {
  userId: number;
  totalPracticeTime: number;
  totalLessonsCompleted: number;
  totalRecordings: number;
  averageOverallScore: number;
  currentStreak: number;
  bestStreak: number;
  dailyMetrics: ProgressMetrics[];
  weeklyTrend: TrendData[];
  monthlyTrend: TrendData[];
}

export interface TrendData {
  period: string;
  averageScore: number;
  practiceMinutes: number;
  recordingsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  constructor(private http: HttpClient) {}

  getDailyProgress(userId: number, date: string): Observable<ProgressMetrics> {
    return this.http.get<ProgressMetrics>(`${environment.apiUrl}/progress/${userId}/daily/${date}`);
  }

  getWeeklyProgress(userId: number): Observable<ProgressMetrics[]> {
    return this.http.get<ProgressMetrics[]>(`${environment.apiUrl}/progress/${userId}/weekly`);
  }

  getMonthlyProgress(userId: number): Observable<ProgressMetrics[]> {
    return this.http.get<ProgressMetrics[]>(`${environment.apiUrl}/progress/${userId}/monthly`);
  }

  getProgressSummary(userId: number): Observable<ProgressSummary> {
    return this.http.get<ProgressSummary>(`${environment.apiUrl}/progress/${userId}/summary`);
  }
}
