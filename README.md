# 🎤 English Speaking Coach App

แอพพลิเคชันสำหรับฝึกพูดภาษาอังกฤษแบบโต้ตอบ  
ผู้ใช้สามารถฝึกพูด, บันทึกเสียง, ได้รับ Feedback และติดตามความก้าวหน้าการเรียนรู้  

---

## 🏗️ Architecture Summary

- **Backend:** .NET Core 9 + SQL Server  
  - Clean Architecture, Repository Pattern, Service Layer  
  - EF Core Code-First, Swagger/OpenAPI, JWT Authentication  
- **Frontend:** Angular 20 + Tailwind CSS + Angular Material  
  - Responsive UI, Mobile-first  
  - State management (Angular Signals / NgRx)  
  - JWT Authentication + Route Guards  
- **AI Integration:**  
  - Speech-to-Text (ASR)  
  - Pronunciation Scoring  
  - Feedback Suggestion via LLM  

---

## ✨ Features

- User Authentication (Register/Login)  
- Lesson Management (CRUD, Filter by level)  
- Audio Recording (Upload, Playback)  
- ASR & Pronunciation Feedback (transcript, highlight, score)  
- Progress Tracking (weekly/monthly chart)  
- Settings (voice preference, privacy)  

---

## 📌 AI Prompt (Context Engineering)

### 🔹 Backend API (.NET Core 9 + SQL)
[ROLE]
คุณคือสถาปนิกซอฟต์แวร์และนักพัฒนา Backend ที่เชี่ยวชาญ .NET Core 9 และ SQL Server

[CONTEXT]
ระบบคือ “แอพครูฝึกพูดภาษาอังกฤษ (English Speaking Coach)”
ผู้ใช้บันทึกเสียง → API วิเคราะห์ (ASR/Pronunciation Scoring) → ให้ Feedback + เก็บ Progress
ใช้ Clean Architecture, Repository Pattern และ Service Layer

[CONSTRAINTS]

Framework: .NET Core 9

Database: SQL Server + EF Core (Code-First)

ใช้ Dependency Injection + DTO + AutoMapper

รองรับ CORS สำหรับ Angular Frontend

มี Swagger/OpenAPI

เก็บเสียงใน Object Storage และเก็บ URL ใน DB

[TASK]

ออกแบบโครงสร้างโปรเจกต์ .NET Core 9 (solution structure)

สร้าง Entities: User, Lesson, Session, Recording, Feedback, ProgressMetrics

DbContext + Migration + Seed Data

Repository + Service Layer + Controller

API Endpoints: Auth, Lessons, Sessions, Recordings, Feedback, Progress

Mock Integration สำหรับ ML Service

API Contract (Swagger/OpenAPI spec)

[OUTPUT FORMAT]

Solution structure

ตัวอย่างโค้ด (Entity, DbContext, Repository, Controller)

Migration script

รายการ Endpoints

OpenAPI Spec

Best practices Security & Performance

---

### 🔹 Frontend (Angular 20 + Tailwind + Material)
[ROLE]
คุณคือสถาปนิกซอฟต์แวร์และนักพัฒนา Frontend ที่เชี่ยวชาญ Angular 20, Angular Material และ Tailwind CSS

[CONTEXT]
Frontend ใช้สำหรับ “แอพครูฝึกพูดภาษาอังกฤษ”
ต้องรองรับ Lesson, Recording, Feedback, Progress Dashboard และเชื่อม Backend API

[CONSTRAINTS]

Framework: Angular 20

UI Libraries: Angular Material + Tailwind CSS

State Management: Angular Signals หรือ NgRx

Auth: JWT

Responsive, Mobile-first

Routing Module + Route Guards

[TASK]

ออกแบบโครงสร้าง Angular Project (modules, components, services, guards)

ระบุหน้าจอ: Login, Home, Lesson, Feedback, Progress, Settings

Components: LessonCard, FeedbackPanel, ProgressChart, AudioRecorder

Services: AuthService, LessonService, RecordingService, FeedbackService

Routing + Guards

UI Guideline: Tailwind Grid + Material Components + Animations

[OUTPUT FORMAT]

Project structure

ตัวอย่างโค้ด Components + Services

Routing Module + Guard

UI Mockup (hierarchy)

Best practices Performance & UX

