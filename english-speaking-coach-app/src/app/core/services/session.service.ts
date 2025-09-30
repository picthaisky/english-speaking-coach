import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Session {
  id: number;
  userId: number;
  lessonId?: number;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  notes?: string;
}

export interface CreateSessionRequest {
  lessonId?: number;
  notes?: string;
}

export interface EndSessionRequest {
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private http: HttpClient) {}

  startSession(session: CreateSessionRequest): Observable<Session> {
    return this.http.post<Session>(`${environment.apiUrl}/sessions`, session);
  }

  endSession(sessionId: number, data: EndSessionRequest): Observable<Session> {
    return this.http.put<Session>(`${environment.apiUrl}/sessions/${sessionId}/end`, data);
  }

  getSession(id: number): Observable<Session> {
    return this.http.get<Session>(`${environment.apiUrl}/sessions/${id}`);
  }

  getUserSessions(userId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${environment.apiUrl}/sessions/user/${userId}`);
  }

  getActiveSession(userId: number): Observable<Session | null> {
    return this.http.get<Session | null>(`${environment.apiUrl}/sessions/user/${userId}/active`);
  }
}
