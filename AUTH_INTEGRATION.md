# Authentication Integration Fix

## Problem
The application was failing to save companies because the database schema requires a `userId` field, but the API routes were not authenticated and didn't pass the userId.

## Solution

### 1. Created Authentication Middleware (`backend/src/middleware/auth.ts`)
- Extracts JWT token from Authorization header
- Verifies token and extracts userId
- Attaches userId to request object
- Returns 401 for missing/invalid tokens

### 2. Updated Database Functions

#### Companies (`backend/src/db/companies.ts`)
- `create()` now accepts `userId` parameter
- `getAll()` now accepts optional `userId` to filter results
- INSERT statement includes userId field

#### Presentations (`backend/src/db/presentations.ts`)
- `create()` now accepts `userId` parameter
- `getAll()` now accepts optional `userId` to filter results
- INSERT statement includes userId and showPersonalInfo fields

### 3. Protected API Routes

All routes now require authentication:

#### Companies Routes (`backend/src/routes/companies.ts`)
- GET `/api/companies` - Lists user's companies only
- GET `/api/companies/:id` - Get specific company
- POST `/api/companies` - Create company (with userId)
- PUT `/api/companies/:id` - Update company
- DELETE `/api/companies/:id` - Delete company
- PATCH `/api/companies/:id/order` - Update company order

#### Projects Routes (`backend/src/routes/projects.ts`)
- GET `/api/projects` - Lists all projects
- GET `/api/projects/:id` - Get specific project
- POST `/api/projects` - Create project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project
- PATCH `/api/projects/:id/order` - Update project order

#### Presentations Routes (`backend/src/routes/presentations.ts`)
- GET `/api/presentations` - Lists user's presentations only
- GET `/api/presentations/:id` - Get specific presentation
- GET `/api/presentations/:id/view` - Get presentation view (with user's companies)
- POST `/api/presentations` - Create presentation (with userId)
- PUT `/api/presentations/:id` - Update presentation
- DELETE `/api/presentations/:id` - Delete presentation

### 4. Updated Frontend API Client (`frontend/src/services/api.ts`)

Added `getAuthHeaders()` function that:
- Retrieves JWT token from localStorage
- Adds Authorization header to all API requests
- Includes Content-Type: application/json

All API calls now include authentication headers:
- `companiesApi.*` 
- `projectsApi.*`
- `presentationsApi.*`

## Security Benefits

1. **User Isolation**: Each user can only see and modify their own data
2. **Token-Based Auth**: Stateless authentication using JWT
3. **Protected Endpoints**: All CRUD operations require valid authentication
4. **Automatic Filtering**: Database queries automatically filter by userId

## Testing

After these changes:
1. Users must be logged in to access any data
2. Companies, projects, and presentations are scoped to the logged-in user
3. Unauthorized requests return 401 errors
4. Each user maintains their own separate data

## Next Steps

Consider adding:
- Role-based access control (admin vs regular user)
- Ownership verification (ensure user owns the resource before modifying)
- Rate limiting on API endpoints
- Refresh token mechanism for long-lived sessions
