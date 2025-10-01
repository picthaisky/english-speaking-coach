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
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLessonRequest {
  title: string;
  description: string;
  level: string;
  category: string;
  content: string;
  audioUrl?: string;
  durationMinutes: number;
  orderIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  constructor(private http: HttpClient) {}

  getLessons(level?: string, category?: string): Observable<Lesson[]> {
    let params = new HttpParams();
    if (level) params = params.set('level', level);
    if (category) params = params.set('category', category);
    
    return this.http.get<Lesson[]>(`${environment.apiUrl}/lessons`, { params });
  }

  getLesson(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${environment.apiUrl}/lessons/${id}`);
  }

  createLesson(lesson: CreateLessonRequest): Observable<Lesson> {
    return this.http.post<Lesson>(`${environment.apiUrl}/lessons`, lesson);
  }

  updateLesson(id: number, lesson: Partial<CreateLessonRequest>): Observable<Lesson> {
    return this.http.put<Lesson>(`${environment.apiUrl}/lessons/${id}`, lesson);
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/lessons/${id}`);
  }
}
