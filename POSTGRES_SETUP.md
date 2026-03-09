# Career Timeline - PostgreSQL Migration

## Database Setup

### Option 1: Using Docker (Recommended)

The easiest way to run the entire application with all three services (PostgreSQL, Backend, Frontend).

1. Make sure Docker Desktop is installed and WSL integration is enabled
2. Start all services:
   ```bash
   docker-compose up
   ```

   Or run in detached mode:
   ```bash
   docker-compose up -d
   ```

3. Services will be available at:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001
   - **PostgreSQL**: localhost:5432

4. To stop all services:
   ```bash
   docker-compose down
   ```

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. Start PostgreSQL service:
   ```bash
   sudo service postgresql start
   ```

3. Create the database:
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE career_timeline;"
   sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
   ```

4. Copy environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```

5. Start the backend and frontend:
   ```bash
   pnpm dev
   ```

## Running the Application

### With Docker (All Services):
```bash
docker-compose up
```

This starts:
- PostgreSQL database
- Backend API (Node.js/Express)
- Frontend (React/Vite)

### Without Docker:
```bash
# Make sure PostgreSQL is running first
sudo service postgresql start

# Then start backend and frontend
pnpm dev
```

## Seeding Sample Data

### With Docker:
```bash
docker-compose exec backend pnpm seed
```

### Without Docker:
```bash
cd backend
pnpm seed
```

## Environment Variables

### Backend (`backend/.env`):
```
DB_HOST=localhost         # Use 'postgres' when running backend in Docker
DB_PORT=5432
DB_NAME=career_timeline
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
```

### Frontend (`frontend/.env`):
```
VITE_API_URL=http://localhost:3001/api
```

## Docker Services

The `docker-compose.yml` defines three services:

1. **postgres**: PostgreSQL 16 database with persistent volume
2. **backend**: Node.js Express API connected to PostgreSQL
3. **frontend**: React + Vite dev server

All services have hot-reload enabled via volume mounts for development.

## Migration from SQLite

The application has been migrated from SQLite to PostgreSQL:
- ✅ All queries converted to PostgreSQL syntax
- ✅ Parameterized queries using `$1, $2` instead of `?`
- ✅ Async/await throughout the codebase
- ✅ Connection pooling with `pg` library
- ✅ Full Docker support for all services
- ✅ Docker Compose orchestration

## Troubleshooting

### Cannot connect to database
- Ensure PostgreSQL is running: `sudo service postgresql status`
- Check credentials in `backend/.env`
- Verify database exists: `psql -U postgres -l`

### Port already in use
- Change the PORT in `backend/.env`
- Update `VITE_API_URL` in `frontend/.env` if needed
- Or stop conflicting services: `docker-compose down`

### Docker issues
- Ensure Docker Desktop is running
- Enable WSL integration in Docker Desktop settings
- Check logs: `docker-compose logs -f`
- Rebuild containers: `docker-compose up --build`

### Frontend can't reach backend
- Verify backend is running: `curl http://localhost:3001/api/companies`
- Check CORS settings in backend
- Ensure `VITE_API_URL` points to correct backend URL
