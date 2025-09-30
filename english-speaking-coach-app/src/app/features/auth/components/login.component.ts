import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <mat-card class="max-w-md w-full">
        <mat-card-header class="flex flex-col items-center pb-6">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <mat-icon class="text-white text-4xl">record_voice_over</mat-icon>
          </div>
          <mat-card-title class="text-2xl font-bold text-center">
            English Speaking Coach
          </mat-card-title>
          <mat-card-subtitle class="text-center mt-2">
            Sign in to continue your learning journey
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input 
                matInput 
                type="email" 
                formControlName="email"
                placeholder="your@email.com"
                autocomplete="email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input 
                matInput 
                [type]="hidePassword() ? 'password' : 'text'" 
                formControlName="password"
                autocomplete="current-password">
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword.set(!hidePassword())"
                [attr.aria-label]="'Hide password'" 
                [attr.aria-pressed]="hidePassword()">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div *ngIf="errorMessage()" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {{ errorMessage() }}
            </div>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              class="w-full py-3"
              [disabled]="loginForm.invalid || isLoading()">
              <mat-spinner *ngIf="isLoading()" diameter="20" class="mr-2 inline-block"></mat-spinner>
              <span *ngIf="!isLoading()">Sign In</span>
              <span *ngIf="isLoading()">Signing in...</span>
            </button>
          </form>

          <div class="text-center mt-6">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <a routerLink="/auth/register" class="text-primary font-semibold hover:underline ml-1">
                Sign up
              </a>
            </p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    mat-card {
      padding: 2rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Login failed. Please check your credentials.');
        console.error('Login error:', error);
      }
    });
  }
}
