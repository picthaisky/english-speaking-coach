import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Recording {
  id: number;
  sessionId: number;
  audioUrl: string;
  transcript?: string;
  pronunciationScore: number;
  fluencyScore: number;
  accuracyScore: number;
  overallScore: number;
  duration: number;
  createdAt: string;
}

export interface CreateRecordingRequest {
  sessionId: number;
  audioUrl: string;
  duration: number;
}

export interface RecordingFeedback {
  recordingId: number;
  transcript: string;
  pronunciationScore: number;
  fluencyScore: number;
  accuracyScore: number;
  overallScore: number;
  feedbacks: Feedback[];
}

export interface Feedback {
  id: number;
  recordingId: number;
  feedbackType: string;
  content: string;
  detailedAnalysis?: string;
  severity?: number;
  wordPosition?: number;
  suggestion?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecordingService {
  constructor(private http: HttpClient) {}

  createRecording(recording: CreateRecordingRequest): Observable<Recording> {
    return this.http.post<Recording>(`${environment.apiUrl}/recordings`, recording);
  }

  getRecording(id: number): Observable<Recording> {
    return this.http.get<Recording>(`${environment.apiUrl}/recordings/${id}`);
  }

  getUserRecordings(userId: number): Observable<Recording[]> {
    return this.http.get<Recording[]>(`${environment.apiUrl}/recordings/user/${userId}`);
  }

  analyzeRecording(recordingId: number): Observable<RecordingFeedback> {
    return this.http.post<RecordingFeedback>(
      `${environment.apiUrl}/recordings/${recordingId}/analyze`, 
      {}
    );
  }

  getRecordingFeedback(recordingId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${environment.apiUrl}/recordings/${recordingId}/feedback`);
  }
}
