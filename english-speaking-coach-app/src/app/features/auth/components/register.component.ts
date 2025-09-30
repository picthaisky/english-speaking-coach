import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <mat-card class="max-w-md w-full">
        <mat-card-header class="flex flex-col items-center pb-6">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <mat-icon class="text-white text-4xl">person_add</mat-icon>
          </div>
          <mat-card-title class="text-2xl font-bold text-center">
            Create Account
          </mat-card-title>
          <mat-card-subtitle class="text-center mt-2">
            Start your English speaking journey
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Full Name</mat-label>
              <mat-icon matPrefix>person</mat-icon>
              <input 
                matInput 
                formControlName="fullName"
                placeholder="John Doe"
                autocomplete="name">
              <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">
                Full name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input 
                matInput 
                type="email" 
                formControlName="email"
                placeholder="your@email.com"
                autocomplete="email">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
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
                autocomplete="new-password">
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword.set(!hidePassword())"
                [attr.aria-label]="'Hide password'" 
                [attr.aria-pressed]="hidePassword()">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field class="w-full" appearance="outline">
              <mat-label>English Level</mat-label>
              <mat-icon matPrefix>school</mat-icon>
              <mat-select formControlName="level">
                <mat-option value="Beginner">Beginner</mat-option>
                <mat-option value="Intermediate">Intermediate</mat-option>
                <mat-option value="Advanced">Advanced</mat-option>
              </mat-select>
            </mat-form-field>

            <div *ngIf="errorMessage()" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {{ errorMessage() }}
            </div>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              class="w-full py-3"
              [disabled]="registerForm.invalid || isLoading()">
              <mat-spinner *ngIf="isLoading()" diameter="20" class="mr-2 inline-block"></mat-spinner>
              <span *ngIf="!isLoading()">Create Account</span>
              <span *ngIf="isLoading()">Creating account...</span>
            </button>
          </form>

          <div class="text-center mt-6">
            <p class="text-sm text-gray-600">
              Already have an account?
              <a routerLink="/auth/login" class="text-primary font-semibold hover:underline ml-1">
                Sign in
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
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      level: ['Beginner']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Registration failed. Please try again.');
        console.error('Registration error:', error);
      }
    });
  }
}
