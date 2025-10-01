# UI Design Guidelines - English Speaking Coach

## 🎨 Design System

### Color Palette

#### Primary Colors
```scss
// Blue - Primary
$primary-50:  #eff6ff;
$primary-100: #dbeafe;
$primary-200: #bfdbfe;
$primary-300: #93c5fd;
$primary-400: #60a5fa;
$primary-500: #3b82f6;  // Main Primary
$primary-600: #2563eb;
$primary-700: #1d4ed8;
$primary-800: #1e40af;
$primary-900: #1e3a8a;

// Purple - Accent
$accent-50:  #faf5ff;
$accent-100: #f3e8ff;
$accent-200: #e9d5ff;
$accent-300: #d8b4fe;
$accent-400: #c084fc;
$accent-500: #a855f7;
$accent-600: #9333ea;  // Main Accent
$accent-700: #7e22ce;
$accent-800: #6b21a8;
$accent-900: #581c87;
```

#### Semantic Colors
```scss
// Success
$success: #10b981;   // Green

// Warning
$warning: #f59e0b;   // Orange

// Error
$error: #ef4444;     // Red

// Info
$info: #06b6d4;      // Cyan
```

#### Neutral Colors
```scss
$gray-50:  #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$gray-800: #1f2937;
$gray-900: #111827;
```

### Typography

#### Font Family
```scss
font-family: 'Roboto', 'Helvetica Neue', sans-serif;
```

#### Font Sizes (Tailwind Scale)
```scss
xs:   0.75rem   (12px)
sm:   0.875rem  (14px)
base: 1rem      (16px)
lg:   1.125rem  (18px)
xl:   1.25rem   (20px)
2xl:  1.5rem    (24px)
3xl:  1.875rem  (30px)
4xl:  2.25rem   (36px)
5xl:  3rem      (48px)
```

#### Font Weights
```scss
light:    300
regular:  400
medium:   500
semibold: 600
bold:     700
```

#### Line Heights
```scss
tight:   1.25
normal:  1.5
relaxed: 1.75
loose:   2
```

### Spacing

#### Spacing Scale (Tailwind)
```scss
0:    0
1:    0.25rem  (4px)
2:    0.5rem   (8px)
3:    0.75rem  (12px)
4:    1rem     (16px)
6:    1.5rem   (24px)
8:    2rem     (32px)
12:   3rem     (48px)
16:   4rem     (64px)
```

### Border Radius
```scss
none:   0
sm:     0.125rem  (2px)
base:   0.25rem   (4px)
md:     0.375rem  (6px)
lg:     0.5rem    (8px)
xl:     0.75rem   (12px)
2xl:    1rem      (16px)
full:   9999px    (circle)
```

### Shadows
```scss
sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05)
base: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
md:   0 4px 6px -1px rgba(0, 0, 0, 0.1)
lg:   0 10px 15px -3px rgba(0, 0, 0, 0.1)
xl:   0 20px 25px -5px rgba(0, 0, 0, 0.1)
2xl:  0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

## 🎯 Component Patterns

### Buttons

#### Primary Button
```html
<button mat-raised-button color="primary" class="px-8 py-3">
  <mat-icon class="mr-2">check</mat-icon>
  Submit
</button>
```

#### Secondary Button
```html
<button mat-stroked-button color="primary" class="px-6 py-2">
  Cancel
</button>
```

#### Icon Button
```html
<button mat-icon-button>
  <mat-icon>more_vert</mat-icon>
</button>
```

### Cards

#### Standard Card
```html
<mat-card class="shadow-md hover:shadow-lg transition-shadow">
  <mat-card-header>
    <mat-card-title>Title</mat-card-title>
    <mat-card-subtitle>Subtitle</mat-card-subtitle>
  </mat-card-header>
  
  <mat-card-content class="space-y-4">
    Content here
  </mat-card-content>
  
  <mat-card-actions class="flex justify-end gap-2">
    <button mat-button>Action</button>
  </mat-card-actions>
</mat-card>
```

#### Stat Card
```html
<mat-card class="text-center hover:shadow-lg transition-shadow">
  <mat-card-content class="p-6">
    <mat-icon class="text-5xl text-primary mb-3">trending_up</mat-icon>
    <div class="text-3xl font-bold text-gray-900 mb-2">85%</div>
    <div class="text-sm text-gray-600">Average Score</div>
  </mat-card-content>
</mat-card>
```

### Forms

#### Text Input
```html
<mat-form-field class="w-full" appearance="outline">
  <mat-label>Email</mat-label>
  <mat-icon matPrefix>email</mat-icon>
  <input matInput type="email" formControlName="email">
  <mat-error *ngIf="form.get('email')?.hasError('required')">
    Email is required
  </mat-error>
</mat-form-field>
```

#### Select
```html
<mat-form-field class="w-full" appearance="outline">
  <mat-label>Level</mat-label>
  <mat-icon matPrefix>school</mat-icon>
  <mat-select formControlName="level">
    <mat-option value="beginner">Beginner</mat-option>
    <mat-option value="intermediate">Intermediate</mat-option>
    <mat-option value="advanced">Advanced</mat-option>
  </mat-select>
</mat-form-field>
```

#### Checkbox
```html
<mat-checkbox formControlName="agree" class="mb-4">
  I agree to the terms and conditions
</mat-checkbox>
```

### Navigation

#### Toolbar
```html
<mat-toolbar color="primary" class="shadow-md">
  <button mat-icon-button>
    <mat-icon>menu</mat-icon>
  </button>
  <span class="flex-1">App Title</span>
  <button mat-icon-button>
    <mat-icon>account_circle</mat-icon>
  </button>
</mat-toolbar>
```

#### Tabs
```html
<mat-tab-group>
  <mat-tab label="Overview">
    <div class="p-6">Overview content</div>
  </mat-tab>
  <mat-tab label="Details">
    <div class="p-6">Details content</div>
  </mat-tab>
</mat-tab-group>
```

## 📱 Responsive Layouts

### Grid System

#### Mobile First
```html
<!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

#### Responsive Container
```html
<div class="container mx-auto px-4 py-8 max-w-7xl">
  <!-- Content -->
</div>
```

### Breakpoints

```scss
// Mobile devices (default)
// < 640px

// Tablets
@media (min-width: 768px) {
  // md: prefix
}

// Laptops
@media (min-width: 1024px) {
  // lg: prefix
}

// Desktops
@media (min-width: 1280px) {
  // xl: prefix
}
```

## 🎭 States & Feedback

### Loading States

#### Spinner
```html
<div class="flex justify-center items-center h-64">
  <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
</div>
```

#### Skeleton
```html
<div class="animate-pulse space-y-4">
  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

### Empty States

```html
<div class="text-center py-12">
  <mat-icon class="text-6xl text-gray-400 mb-4">inbox</mat-icon>
  <h3 class="text-xl font-semibold text-gray-700 mb-2">
    No items found
  </h3>
  <p class="text-gray-600 mb-6">
    Get started by creating your first item
  </p>
  <button mat-raised-button color="primary">
    Create Item
  </button>
</div>
```

### Error States

```html
<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
  <div class="flex items-start">
    <mat-icon class="text-red-600 mr-3">error</mat-icon>
    <div>
      <h4 class="font-semibold text-red-800 mb-1">Error</h4>
      <p class="text-red-700 text-sm">Something went wrong</p>
    </div>
  </div>
</div>
```

### Success States

```html
<div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
  <div class="flex items-start">
    <mat-icon class="text-green-600 mr-3">check_circle</mat-icon>
    <div>
      <h4 class="font-semibold text-green-800 mb-1">Success</h4>
      <p class="text-green-700 text-sm">Action completed successfully</p>
    </div>
  </div>
</div>
```

## ✨ Animations

### Transitions

```scss
// Hover effects
.hover\:shadow-lg {
  transition: box-shadow 0.3s ease;
}

.hover\:scale-105 {
  transition: transform 0.2s ease;
}

// Page transitions
.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Angular Animations

```typescript
trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
  ])
])
```

## 🎯 Icons

### Icon Usage

```html
<!-- Material Icons -->
<mat-icon>home</mat-icon>
<mat-icon>settings</mat-icon>
<mat-icon>person</mat-icon>
<mat-icon>mic</mat-icon>
<mat-icon>trending_up</mat-icon>
```

### Common Icons

| Purpose | Icon Name |
|---------|-----------|
| Home | home |
| User | person, account_circle |
| Settings | settings |
| Logout | logout |
| Record | mic, fiber_manual_record |
| Play | play_arrow |
| Pause | pause |
| Stop | stop |
| Save | save |
| Edit | edit |
| Delete | delete |
| Add | add, add_circle |
| Close | close |
| Menu | menu |
| Search | search |
| Filter | filter_list |
| Sort | sort |
| Info | info |
| Warning | warning |
| Error | error |
| Success | check_circle |
| Charts | bar_chart, trending_up |
| Lessons | school, menu_book |
| Feedback | feedback, rate_review |

## 📐 Layout Patterns

### Dashboard Layout

```html
<div class="min-h-screen bg-gray-50">
  <mat-toolbar color="primary" class="shadow-md">
    <!-- Header -->
  </mat-toolbar>
  
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Dashboard
      </h1>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <!-- Stat cards -->
    </div>
    
    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Content -->
    </div>
  </div>
</div>
```

### Content Layout

```html
<div class="min-h-screen bg-gray-50">
  <mat-toolbar color="primary" class="shadow-md">
    <button mat-icon-button (click)="goBack()">
      <mat-icon>arrow_back</mat-icon>
    </button>
    <span>Page Title</span>
  </mat-toolbar>
  
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <mat-card>
      <mat-card-content>
        <!-- Content -->
      </mat-card-content>
    </mat-card>
  </div>
</div>
```

### Form Layout

```html
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
  <mat-card class="max-w-md w-full">
    <mat-card-header class="text-center">
      <mat-card-title>Form Title</mat-card-title>
    </mat-card-header>
    
    <mat-card-content>
      <form [formGroup]="form" class="space-y-4">
        <!-- Form fields -->
      </form>
    </mat-card-content>
  </mat-card>
</div>
```

## 🎨 Custom Utilities

### Spacing Utilities

```html
<!-- Margin -->
<div class="m-4">     <!-- margin: 1rem -->
<div class="mt-6">    <!-- margin-top: 1.5rem -->
<div class="mx-auto"> <!-- margin-left/right: auto -->

<!-- Padding -->
<div class="p-6">     <!-- padding: 1.5rem -->
<div class="py-8">    <!-- padding-top/bottom: 2rem -->
<div class="px-4">    <!-- padding-left/right: 1rem -->

<!-- Gap -->
<div class="gap-4">   <!-- gap: 1rem -->
<div class="space-y-4"> <!-- vertical spacing -->
```

### Text Utilities

```html
<!-- Size -->
<p class="text-sm">Small text</p>
<p class="text-base">Normal text</p>
<p class="text-lg">Large text</p>
<h1 class="text-3xl">Heading</h1>

<!-- Weight -->
<p class="font-light">Light</p>
<p class="font-normal">Normal</p>
<p class="font-semibold">Semibold</p>
<p class="font-bold">Bold</p>

<!-- Color -->
<p class="text-gray-600">Gray text</p>
<p class="text-primary">Primary color</p>
<p class="text-red-600">Red text</p>
```

### Display Utilities

```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
<div class="flex flex-col space-y-4">

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">

<!-- Visibility -->
<div class="hidden md:block">
<div class="block md:hidden">
```

## 🎯 Accessibility

### ARIA Labels

```html
<button 
  mat-icon-button 
  aria-label="Close dialog"
  [attr.aria-pressed]="isPressed">
  <mat-icon>close</mat-icon>
</button>
```

### Keyboard Navigation

- Tab: Navigate between interactive elements
- Enter/Space: Activate buttons
- Escape: Close dialogs/modals
- Arrow keys: Navigate lists/menus

### Color Contrast

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

## 📝 Best Practices

### DO ✅

- Use consistent spacing (multiples of 4px)
- Maintain visual hierarchy
- Provide loading states
- Show clear error messages
- Use icons consistently
- Follow Material Design guidelines
- Make interactive elements obvious
- Provide feedback for user actions

### DON'T ❌

- Use more than 3 font weights
- Mix different icon styles
- Ignore loading states
- Hide error messages
- Use too many colors
- Ignore accessibility
- Make users guess
- Forget mobile users

## 🎨 Theme Customization

### Custom Theme

```scss
// Define custom palette
$custom-primary: mat.m2-define-palette(mat.$blue-palette);
$custom-accent: mat.m2-define-palette(mat.$purple-palette);
$custom-warn: mat.m2-define-palette(mat.$red-palette);

// Create theme
$custom-theme: mat.m2-define-light-theme((
  color: (
    primary: $custom-primary,
    accent: $custom-accent,
    warn: $custom-warn,
  )
));

// Apply theme
@include mat.all-component-themes($custom-theme);
```

### Dark Mode (Future)

```scss
@media (prefers-color-scheme: dark) {
  // Dark theme styles
}
```

## 📚 Resources

- [Material Design 3](https://m3.material.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Angular Material](https://material.angular.io)
- [Material Icons](https://fonts.google.com/icons)
