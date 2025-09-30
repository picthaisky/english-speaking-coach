import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/components/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/components/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/components/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'lesson/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/lesson/components/lesson.component').then(m => m.LessonComponent)
  },
  {
    path: 'progress',
    canActivate: [authGuard],
    loadComponent: () => import('./features/progress/components/progress.component').then(m => m.ProgressComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/components/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
