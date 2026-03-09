# Development Guide

## Project Setup

This is a pnpm monorepo containing a React frontend and Node.js backend.

## Development Workflow

### First Time Setup

1. Install dependencies:
```bash
pnpm install
```

2. The SQLite database will be created automatically on first backend run.

### Running the Application

**Option 1: Run everything together**
```bash
pnpm dev
```
This runs both frontend and backend concurrently.

**Option 2: Run separately (recommended for development)**

Terminal 1 - Backend:
```bash
pnpm dev:backend
```

Terminal 2 - Frontend:
```bash
pnpm dev:frontend
```

### Making Changes

#### Backend Changes
- Edit files in `backend/src/`
- The server will automatically restart (using tsx watch)
- Check terminal for any errors
- Test endpoints with browser or tools like curl/Postman

#### Frontend Changes
- Edit files in `frontend/src/`
- Vite will hot-reload changes automatically
- Check browser console for errors

### Database

The SQLite database is stored at `backend/data/career-timeline.db`.

To reset the database:
```bash
rm backend/data/career-timeline.db
```
It will be recreated on next backend start.

### Adding Dependencies

**Frontend:**
```bash
cd frontend
pnpm add <package-name>
```

**Backend:**
```bash
cd backend
pnpm add <package-name>
```

**Dev dependencies:**
```bash
pnpm add -D <package-name>
```

## Architecture

### Backend Structure

```
backend/src/
├── db/              # Database layer
│   ├── index.ts     # DB initialization & schema
│   ├── companies.ts # Company operations
│   ├── projects.ts  # Project operations
│   └── presentations.ts # Presentation operations
├── routes/          # Express routes
│   ├── companies.ts
│   ├── projects.ts
│   └── presentations.ts
├── types/           # TypeScript types
│   └── index.ts
└── index.ts         # Entry point
```

### Frontend Structure

```
frontend/src/
├── components/      # Reusable components
│   ├── AppShell.tsx      # Navigation layout
│   ├── ProjectCard.tsx   # Project display
│   └── ProjectModal.tsx  # Project form
├── pages/           # Route pages
│   ├── CompaniesPage.tsx      # Main management
│   ├── PresentationsPage.tsx  # Presentation list
│   └── PresentationViewPage.tsx # Presentation mode
├── services/        # API layer
│   └── api.ts       # API client
├── types/           # TypeScript types
│   └── index.ts
├── App.tsx          # App root with routing
└── main.tsx         # Entry point
```

## Common Tasks

### Add a New Field to Company

1. Update type in `backend/src/types/index.ts`
2. Update database schema in `backend/src/db/index.ts`
3. Update CRUD operations in `backend/src/db/companies.ts`
4. Copy type updates to `frontend/src/types/index.ts`
5. Update form in `frontend/src/pages/CompaniesPage.tsx`
6. Delete old database to recreate schema

### Add a New API Endpoint

1. Add route handler in appropriate `backend/src/routes/*.ts`
2. Add corresponding function in `frontend/src/services/api.ts`
3. Use the API function in your component

### Add a New Page

1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `frontend/src/components/AppShell.tsx`

## Code Style

- Use TypeScript for type safety
- Use async/await for async operations
- Handle errors with try/catch
- Show user feedback with Mantine notifications
- Follow existing code patterns

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is in use:

Backend:
```bash
PORT=3002 pnpm dev:backend
```
Then update frontend `.env` to match.

Frontend:
```bash
cd frontend
vite --port 5174
```

### Database Locked

If you see "database is locked" errors:
- Make sure only one backend instance is running
- Restart the backend

### CORS Errors

If you see CORS errors:
- Check backend is running on port 3001
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS is enabled in `backend/src/index.ts`

### Module Not Found

If you see module errors:
```bash
# Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
pnpm install
```

## Production Build

Build for production:
```bash
pnpm build
```

This creates:
- `frontend/dist/` - Static frontend files
- `backend/dist/` - Compiled JavaScript

To run production build:
```bash
# Backend
cd backend
node dist/index.js

# Frontend (serve static files with any web server)
cd frontend/dist
python3 -m http.server 5173
```
