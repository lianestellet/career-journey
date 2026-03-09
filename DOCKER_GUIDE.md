# Docker Setup for Career Timeline

Complete containerized setup with PostgreSQL, Backend, and Frontend.

## Prerequisites

- Docker Desktop installed on Windows
- WSL 2 integration enabled in Docker Desktop settings

## Quick Start

Start all services:
```bash
docker-compose up
```

Access the application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **PostgreSQL**: localhost:5432

## Services

### 1. PostgreSQL (Database)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Database**: career_timeline
- **User**: postgres
- **Password**: postgres
- **Volume**: Persistent data storage

### 2. Backend (Node.js API)
- **Build**: ./backend/Dockerfile
- **Port**: 3001
- **Dependencies**: PostgreSQL
- **Hot Reload**: Enabled via volume mount
- **Environment**: Connected to postgres service

### 3. Frontend (React + Vite)
- **Build**: ./frontend/Dockerfile
- **Port**: 5173
- **Dependencies**: Backend
- **Hot Reload**: Enabled via volume mount
- **API**: Configured to connect to backend

## Docker Commands

### Start all services
```bash
docker-compose up
```

### Start in background (detached)
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild containers
```bash
docker-compose up --build
```

### Restart a specific service
```bash
docker-compose restart backend
```

### Execute commands in containers
```bash
# Run seed script
docker-compose exec backend pnpm seed

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d career_timeline

# Access backend shell
docker-compose exec backend sh
```

### Clean up everything
```bash
# Stop and remove containers, networks
docker-compose down

# Also remove volumes (deletes database data!)
docker-compose down -v
```

## Development Workflow

### Making Code Changes

Code changes are automatically detected via volume mounts:
- `./backend/src` → `/app/src` (hot reload)
- `./frontend/src` → `/app/src` (hot reload)

Just edit your code and the dev servers will reload automatically!

### Installing New Dependencies

If you add new npm packages:

```bash
# Rebuild the affected service
docker-compose up --build backend
# or
docker-compose up --build frontend
```

### Database Management

#### Seed the database
```bash
docker-compose exec backend pnpm seed
```

#### Access PostgreSQL directly
```bash
docker-compose exec postgres psql -U postgres -d career_timeline
```

#### Run SQL queries
```bash
docker-compose exec postgres psql -U postgres -d career_timeline -c "SELECT * FROM companies;"
```

#### Backup database
```bash
docker-compose exec postgres pg_dump -U postgres career_timeline > backup.sql
```

#### Restore database
```bash
cat backup.sql | docker-compose exec -T postgres psql -U postgres career_timeline
```

## Troubleshooting

### Port conflicts
If ports 3001, 5173, or 5432 are in use:

Edit `docker-compose.yml` and change the host port (left side):
```yaml
ports:
  - "3002:3001"  # Maps host 3002 to container 3001
```

### Services won't start
```bash
# Check Docker Desktop is running
# Check WSL integration is enabled

# View detailed logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Database connection errors
```bash
# Check postgres is healthy
docker-compose ps

# Wait for health check to pass
# Backend depends on postgres health check
```

### Frontend can't reach backend
- Verify backend is running: `docker-compose logs backend`
- Check `VITE_API_URL` in frontend service environment
- Ensure backend is listening on 0.0.0.0 (not just localhost)

### Permission errors in WSL
```bash
# Fix file permissions
chmod -R 755 backend frontend
```

### Container disk space
```bash
# Clean up unused Docker resources
docker system prune -a
```

## Environment Variables

### Backend Environment
Set in `docker-compose.yml` under `backend.environment`:
```yaml
DB_HOST: postgres          # Service name for inter-container communication
DB_PORT: 5432
DB_NAME: career_timeline
DB_USER: postgres
DB_PASSWORD: postgres
PORT: 3001
```

### Frontend Environment
Set in `docker-compose.yml` under `frontend.environment`:
```yaml
VITE_API_URL: http://localhost:3001/api
```

## Production Deployment

For production, create a separate `docker-compose.prod.yml`:

1. Use production builds instead of dev servers
2. Remove volume mounts for source code
3. Use environment variables for secrets
4. Configure proper networking
5. Add reverse proxy (nginx)
6. Enable HTTPS

Example production configuration:
```yaml
backend:
  command: pnpm start  # Production start script
  volumes: []          # Remove dev volumes
  environment:
    NODE_ENV: production
```

## File Structure

```
career-timeline/
├── docker-compose.yml          # Multi-service orchestration
├── backend/
│   ├── Dockerfile              # Backend container definition
│   ├── .dockerignore           # Files to exclude from build
│   ├── .env.example            # Environment template
│   └── src/                    # Source code (mounted)
├── frontend/
│   ├── Dockerfile              # Frontend container definition
│   ├── .dockerignore           # Files to exclude from build
│   └── src/                    # Source code (mounted)
└── volumes/
    └── postgres_data/          # Persistent database storage
```

## Benefits of Docker Setup

✅ **Consistent Environment**: Everyone runs the same setup  
✅ **Easy Onboarding**: New developers run one command  
✅ **Isolated Services**: No port conflicts or system pollution  
✅ **Production Parity**: Dev matches production architecture  
✅ **Easy Cleanup**: Remove everything with one command  
✅ **Cross-Platform**: Works on Windows, Mac, Linux  

## Next Steps

1. Start Docker Desktop
2. Enable WSL 2 integration
3. Run `docker-compose up`
4. Open http://localhost:5173
5. Enjoy! 🎉
