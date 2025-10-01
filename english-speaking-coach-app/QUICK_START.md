# Quick Start Guide - English Speaking Coach Frontend

## 🚀 Get Started in 5 Minutes

### Prerequisites

Ensure you have the following installed:

```bash
# Check Node.js version (must be 20.x or higher)
node --version
# v20.19.5

# Check npm version
npm --version
# 10.8.2
```

### Installation

```bash
# 1. Navigate to the frontend directory
cd english-speaking-coach-app

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open browser
# Navigate to http://localhost:4200
```

That's it! The application should now be running.

## 📂 Project Tour

### Key Directories

```bash
src/app/
├── core/           # Services, guards, interceptors
├── shared/         # Reusable components
├── features/       # Feature modules (auth, home, lesson, etc.)
└── environments/   # Configuration files
```

### Main Files

```bash
src/
├── main.ts              # Application bootstrap
├── app/
│   ├── app.config.ts    # App configuration (providers)
│   ├── app.routes.ts    # Route definitions
│   └── app.ts           # Root component
└── styles.scss          # Global styles
```

## 🎯 Common Tasks

### Running the Application

```bash
# Development server with live reload
npm start

# Development server on custom port
ng serve --port 4300

# Development server with production configuration
ng serve --configuration production
```

### Building

```bash
# Development build
npm run build

# Production build
ng build --configuration production

# Build and watch for changes
ng build --watch
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
ng test --code-coverage

# Run tests in headless mode
ng test --browsers=ChromeHeadless --watch=false
```

### Code Quality

```bash
# Lint code
ng lint

# Format code (if prettier is configured)
npm run format
```

## 🔑 Environment Configuration

### Development (default)

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api'  // Change to your backend URL
};
```

### Production

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api'  // Your production API
};
```

## 🎨 Making Changes

### Creating a New Component

```bash
# Generate a new component
ng generate component features/my-feature/components/my-component

# Or using shorthand
ng g c features/my-feature/components/my-component
```

### Creating a New Service

```bash
# Generate a new service
ng generate service core/services/my-service

# Or using shorthand
ng g s core/services/my-service
```

### Creating a New Guard

```bash
# Generate a new guard
ng generate guard core/guards/my-guard

# Or using shorthand
ng g g core/guards/my-guard
```

## 📱 Testing the Application

### Test User Credentials

For testing, you can use these credentials (if backend supports):

```
Email: test@example.com
Password: Test123!
```

Or create a new account using the Register page.

### Testing Features

1. **Login Flow**
   - Go to `/auth/login`
   - Enter credentials
   - Should redirect to `/home`

2. **Lesson Practice**
   - Click on any lesson card
   - View lesson content
   - Try recording audio
   - Submit for feedback

3. **Progress Dashboard**
   - Navigate to Progress
   - View charts and statistics

4. **Settings**
   - Update preferences
   - Save settings
   - Verify persistence

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find and kill process using port 4200
lsof -ti:4200 | xargs kill -9

# Or run on different port
ng serve --port 4300
```

#### 2. Node Modules Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Cache Issues

```bash
# Clear Angular cache
rm -rf .angular/cache

# Clear npm cache
npm cache clean --force
```

#### 4. Build Errors

```bash
# Check for TypeScript errors
ng build --configuration development

# Check console output for specific errors
```

#### 5. CORS Issues

If you see CORS errors:

1. Check backend CORS configuration
2. Ensure backend allows `http://localhost:4200`
3. Check if backend is running

```bash
# Backend should allow this origin:
AllowOrigin: http://localhost:4200
```

## 🔧 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/my-new-feature
```

### 2. Make Changes

Edit files, add components, etc.

### 3. Test Locally

```bash
npm start
# Test in browser
```

### 4. Build

```bash
npm run build
# Check for build errors
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 6. Push to Remote

```bash
git push origin feature/my-new-feature
```

## 📚 Useful Commands

```bash
# Generate module
ng g module features/my-module

# Generate interface
ng g interface core/models/my-model

# Generate pipe
ng g pipe shared/pipes/my-pipe

# Generate directive
ng g directive shared/directives/my-directive

# Show Angular CLI help
ng help

# Show Angular version
ng version

# Update Angular
ng update @angular/core @angular/cli

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## 🎓 Learning Resources

### Documentation

- Main README: `FRONTEND_README.md`
- Architecture: `FRONTEND_ARCHITECTURE.md`
- UI Guidelines: `UI_DESIGN_GUIDELINES.md`
- Examples: `COMPONENT_EXAMPLES.md`
- Best Practices: `BEST_PRACTICES.md`

### External Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Tailwind CSS](https://tailwindcss.com)
- [RxJS](https://rxjs.dev)

## 🌐 API Integration

### Backend Setup

Make sure the backend is running:

```bash
# Backend should be running on:
http://localhost:5001

# Test backend is accessible:
curl http://localhost:5001/api/lessons
```

### API Configuration

Update API URL in environment files:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api'  // Update this
};
```

### Testing API Connection

1. Open browser console
2. Look for network requests
3. Check if requests have proper headers
4. Verify responses

## 🚀 Deployment

### Build for Production

```bash
# Create optimized production build
ng build --configuration production

# Output will be in: dist/english-speaking-coach-app/
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist/english-speaking-coach-app
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

## 📊 Performance Tips

### Development

```bash
# Use production configuration for better performance
ng serve --configuration production

# Disable source maps
ng serve --source-map=false
```

### Production

```bash
# Enable Ahead-of-Time compilation
ng build --aot

# Enable optimization
ng build --optimization

# Enable build optimizer
ng build --build-optimizer
```

## 🎯 Next Steps

1. **Read Documentation**
   - Start with `FRONTEND_README.md`
   - Review `FRONTEND_ARCHITECTURE.md`
   - Check `COMPONENT_EXAMPLES.md` for code patterns

2. **Explore Code**
   - Look at service implementations
   - Review component structure
   - Understand routing setup

3. **Make Changes**
   - Try adding a new component
   - Modify existing features
   - Customize styles

4. **Test Integration**
   - Connect to backend API
   - Test authentication flow
   - Try all features

## 🆘 Getting Help

### Check Documentation

All documentation is in the project:

```
english-speaking-coach-app/
├── FRONTEND_README.md
├── FRONTEND_ARCHITECTURE.md
├── UI_DESIGN_GUIDELINES.md
├── COMPONENT_EXAMPLES.md
├── BEST_PRACTICES.md
└── QUICK_START.md (this file)
```

### Common Questions

**Q: Where do I add a new page?**  
A: Create component in `src/app/features/`, add route in `app.routes.ts`

**Q: How do I call an API?**  
A: Use services in `src/app/core/services/`, follow existing patterns

**Q: Where are the styles?**  
A: Global styles in `src/styles.scss`, component styles inline or in separate files

**Q: How do I add a new dependency?**  
A: `npm install package-name --save`

**Q: How do I update Angular version?**  
A: `ng update @angular/core @angular/cli`

## ✅ Checklist for New Developers

- [ ] Node.js 20+ installed
- [ ] npm 10+ installed
- [ ] Project cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm start`)
- [ ] Application opens in browser
- [ ] Backend API accessible
- [ ] Can login/register
- [ ] Read main documentation files
- [ ] Understand project structure
- [ ] Made first code change
- [ ] Built successfully

## 🎉 You're Ready!

You now have everything you need to start developing with the English Speaking Coach frontend. Happy coding!

---

**Need more help?** Check the other documentation files or contact the team.
