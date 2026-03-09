# Authentication & Google OAuth Setup Guide

## Features Added ✅

1. **User Authentication**
   - Email/password registration and login
   - JWT token-based authentication
   - Secure password hashing with bcrypt

2. **Google OAuth Integration**
   - "Continue with Google" button
   - Automatic account creation from Google profile
   - Avatar import from Google

3. **Protected Routes**
   - All main pages require authentication
   - Automatic redirect to login if not authenticated
   - Loading states during auth check

4. **User Profile**
   - Avatar display in header
   - Profile dropdown menu
   - Logout functionality

## Setup Instructions

### 1. Update Environment Variables

Copy the new `.env.example` and add your Google OAuth credentials:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=career_timeline
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret** to your `.env` file

### 3. Database Migration

The database schema has been updated with a `users` table. If you have an existing database:

```bash
# Drop and recreate the database (WARNING: This deletes all data!)
sudo -u postgres psql -c "DROP DATABASE career_timeline;"
sudo -u postgres psql -c "CREATE DATABASE career_timeline;"

# Or use a migration tool to add the users table
```

The new schema includes:
- `users` table with profile fields
- Foreign keys linking companies and presentations to users
- `showPersonalInfo` field in presentations

### 4. Start the Application

```bash
# Start PostgreSQL (if not running)
sudo service postgresql start

# Start the application
pnpm dev
```

### 5. First Time Usage

1. Visit `http://localhost:5173`
2. You'll be redirected to the login page
3. Options:
   - **Sign up with email**: Create a new account
   - **Continue with Google**: Use your Google account
4. After login, you'll see the home page

## How It Works

### Authentication Flow

**Email/Password:**
1. User registers → Password hashed with bcrypt → Stored in database
2. User logs in → Password verified → JWT token issued
3. Token stored in localStorage
4. Token sent with every API request

**Google OAuth:**
1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. Google redirects back with user data
4. Backend creates/finds user account
5. JWT token issued and sent to frontend
6. User logged in automatically

### Protected Routes

All main routes are wrapped with `ProtectedRoute` component:
- Checks if user is authenticated
- Shows loading spinner during check
- Redirects to `/login` if not authenticated

### User Avatar

- Displays in header with dropdown menu
- Shows user's first initial if no avatar
- Imported automatically from Google profile
- Can be customized in profile settings (coming soon)

## User Profile Fields

Available in the database (ready for profile page):
- `name` - Full name
- `email` - Email address
- `bio` - Personal bio
- `location` - Where they live
- `hobbies` - Personal interests
- `avatar` - Profile picture URL
- `linkedIn` - LinkedIn profile
- `github` - GitHub profile
- `website` - Personal website
- `phone` - Contact number

## Next Steps

To complete the authentication feature:

1. **Profile Management Page**
   - Edit personal info
   - Upload custom avatar
   - Update bio, hobbies, location

2. **Show Profile in Presentations**
   - Display personal info on presentation slides
   - Toggle to show/hide personal details
   - Professional introduction section

3. **Password Reset**
   - Forgot password flow
   - Email verification
   - Password reset tokens

## Troubleshooting

### "Continue with Google" doesn't work
- Check Google OAuth credentials in `.env`
- Verify redirect URI matches exactly
- Ensure Google+ API is enabled

### Redirected to login immediately
- Check JWT token in browser localStorage
- Verify backend is running
- Check browser console for errors

### User profile not saving
- Ensure users table exists in database
- Check backend logs for errors
- Verify JWT token is valid

## Security Notes

⚠️ **Important for Production:**
1. Change `JWT_SECRET` to a strong random string
2. Use environment variables, never commit secrets
3. Enable HTTPS
4. Set secure cookie flags
5. Add rate limiting
6. Implement CSRF protection

## Files Modified/Created

**Backend:**
- `backend/src/db/index.ts` - Added users table schema
- `backend/src/db/users.ts` - User database operations
- `backend/src/routes/auth.ts` - Authentication routes + Google OAuth
- `backend/src/index.ts` - Added passport initialization
- `backend/.env.example` - Added Google OAuth variables

**Frontend:**
- `frontend/src/contexts/AuthContext.tsx` - Authentication state management
- `frontend/src/components/ProtectedRoute.tsx` - Route protection
- `frontend/src/components/AppShell.tsx` - User avatar and menu
- `frontend/src/pages/LoginPage.tsx` - Login with Google button
- `frontend/src/pages/RegisterPage.tsx` - Registration page
- `frontend/src/pages/AuthCallbackPage.tsx` - OAuth callback handler
- `frontend/src/App.tsx` - Auth routes and protection

Your authentication system is now fully functional! 🎉
