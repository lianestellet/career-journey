# Quick Start Guide

Get Career Timeline up and running in 3 minutes!

## Prerequisites

Make sure you have:
- Node.js v18 or higher
- pnpm v8 or higher
- PostgreSQL 12+ (or Docker)

Check versions:
```bash
node --version
pnpm --version
```

## Installation & Setup

### 1. Install Dependencies

```bash
pnpm install
```

This installs all dependencies for both frontend and backend.

### 2. Set Up the Database

### Option A: Using Docker (Recommended)

Start all services (PostgreSQL, Backend, Frontend) with one command:

```bash
docker-compose up
```

This will:
- Start PostgreSQL database in a container
- Start the backend API in a container
- Start the frontend dev server in a container
- Automatically create the database schema on first run

All services will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

To run in background (detached mode):
```bash
docker-compose up -d
```

To stop all services:
```bash
docker-compose down
```

#### Option B: Using Local PostgreSQL

Install PostgreSQL if you haven't already:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

Create the database:
```bash
sudo -u postgres psql -c "CREATE DATABASE career_timeline;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### 3. Configure Environment

The backend needs a `.env` file. Copy the example:

```bash
cp backend/.env.example backend/.env
```

The default configuration works with both Docker and local PostgreSQL:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=career_timeline
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. Start the Application

```bash
pnpm dev
```

This starts both:
- **Backend API** at http://localhost:3001
- **Frontend** at http://localhost:5173

The backend will automatically create the database tables on first run.

### 5. Open Your Browser

Navigate to **http://localhost:5173**

You'll see the Career Timeline interface with two main sections:
- Companies & Projects
- Presentations

## Adding Sample Data (Optional)

Want to see the app with sample data?

1. Make sure the backend is running
2. In a new terminal:

```bash
cd backend
pnpm seed
```

This creates:
- 3 sample companies
- 6 sample projects
- 3 sample presentations

Refresh your browser to see the data!

## Next Steps

### Add Your First Company

1. Go to "Companies & Projects"
2. Click "Add Company"
3. Fill in:
   - Company name (e.g., "Acme Corp")
   - Your role (e.g., "Senior Developer")
   - Description
   - Start/End dates
4. Click "Create"

### Add a Project

1. Find your company in the list
2. Click to expand it
3. Click "Add Project"
4. Fill in:
   - Project name
   - Description
   - Technologies (press Enter after each)
   - Keywords
5. Click "Create"

### Create a Presentation

1. Go to "Presentations"
2. Click "Create Presentation"
3. Give it a name (e.g., "Senior Frontend - Meta")
4. Select companies/projects to hide (optional)
5. Click "Create"
6. Click "Present" to view in presentation mode!

## Troubleshooting

### Port Already in Use?

If port 3001 or 5173 is taken, stop other services or change ports:

```bash
# Backend on different port
PORT=3002 pnpm dev:backend

# Then update frontend/.env
VITE_API_URL=http://localhost:3002/api
```

### Can't Connect to API?

Make sure:
1. Backend is running (check terminal for "Server running on...")
2. No firewall blocking localhost:3001
3. Check `frontend/.env` has correct `VITE_API_URL`

### Need Help?

Check the full documentation:
- [README.md](./README.md) - Project overview
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide

## That's It!

You're ready to build your interview portfolio! 🚀

Add your companies, projects, and create custom presentations for each interview.
