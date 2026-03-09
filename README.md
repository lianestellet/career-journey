# Career Timeline

A modern, containerized personal interview portfolio builder that helps developers showcase their experience during job interviews.

## Features

- **🔐 User Authentication**: Secure JWT-based authentication with email/password
- **🏢 Company Management**: Store companies you've worked at with context and descriptions
- **💼 LinkedIn Import**: Quickly import your work experience from LinkedIn with automatic parsing
- **📊 Project Portfolio**: Document projects within each company with technologies, keywords, and architecture diagrams
- **🎯 Custom Presentations**: Generate tailored interview presentations for specific job opportunities
- **🔄 Flexible Navigation**: Quickly navigate through your experience during interviews
- **👁️ Customizable Views**: Show/hide specific experiences based on the target role
- **🐳 Docker Ready**: Fully containerized with Docker Compose for easy deployment

## Tech Stack

- **Frontend**: React 18, TypeScript, Mantine UI, React Router
- **Backend**: Node.js, Express, TypeScript, JWT Authentication
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pnpm
- **Build Tool**: Vite

## Project Structure

```
career-timeline/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions (LinkedIn parser, etc.)
│   │   └── types/         # TypeScript type definitions
│   ├── Dockerfile
│   └── package.json
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── db/           # Database layer
│   │   ├── middleware/   # Express middleware (auth, etc.)
│   │   ├── routes/       # Express routes
│   │   └── types/        # TypeScript type definitions
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml # Docker Compose configuration
└── package.json       # Root package.json for monorepo
```

## Quick Start with Docker (Recommended)

### Prerequisites

- Docker Desktop or Docker Engine + Docker Compose
- That's it! No Node.js or database installation needed.

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd career-timeline
```

2. **Start all services**
```bash
docker-compose up
```

This single command will:
- Start PostgreSQL database
- Start the backend API server
- Start the frontend development server
- Automatically create database tables
- Set up networking between services

3. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

4. **Create your account**
- Navigate to http://localhost:5173/register
- Create your account with email and password
- Start building your portfolio!

### Managing Docker Services

```bash
# Start all services in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart backend

# Rebuild after code changes
docker-compose up --build
```

## Alternative: Local Development (Without Docker)

If you prefer running services locally without Docker:

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL 12+ installed and running

### Installation

1. **Install dependencies**
```bash
pnpm install
```

2. **Set up PostgreSQL database**
```bash
# Create database
createdb career_timeline

# Or using psql
psql -U postgres -c "CREATE DATABASE career_timeline;"
```

3. **Configure environment variables**

Create `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=career_timeline
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

4. **Start the application**
```bash
pnpm dev
```

This starts both frontend and backend concurrently.

## Usage

### 1. Authentication

First-time users:
1. Navigate to http://localhost:5173/register
2. Create an account with your email, name, and password
3. You'll be automatically logged in

Returning users:
1. Navigate to http://localhost:5173/login
2. Sign in with your email and password

### 2. Add Companies

Navigate to "Your Journey" and click "Add Experience" to create entries for your work history:
- Company name
- Your role/position
- Employment dates
- Location
- Company description/context

**💡 Pro Tip**: Use the "Import from LinkedIn" button to quickly add experiences by copying and pasting from your LinkedIn profile!

### 3. Add Projects

Within each company, add projects you worked on:
- Project name and description
- Industry context
- Technologies used (displayed as colored badges)
- Keywords/highlights (for quick reference)
- Architecture diagram URLs
- Project timeline

### 4. Create Presentations

Navigate to "Presentations" and create custom presentations for specific interviews:
- Name your presentation
- Add target role and company
- Optionally show/hide personal information
- Hide irrelevant companies or projects
- Customize the order of content

### 5. Present

Click "Present" on any presentation to enter presentation mode:
- Full-screen, clean layout optimized for sharing
- Easy navigation through your career timeline
- Highlight relevant experience for the interviewer

## Key Features in Detail

### 🔗 LinkedIn Import

The LinkedIn import feature allows you to quickly populate your work experience:

1. Go to your LinkedIn profile
2. Copy the text of a work experience (company, role, dates, location, description)
3. Click "Import from LinkedIn" button
4. Paste the text and click "Parse & Import"
5. Review and save the auto-filled form

Supported formats:
- Date formats: "Jan 2020", "January 2020", "2020-01"
- Current positions: "Present", "Current"
- Automatic extraction of company, role, dates, location, and description

See [LINKEDIN_IMPORT.md](./LINKEDIN_IMPORT.md) for detailed instructions.

### 🎨 Modern UI/UX

- Beautiful gradient designs and animations
- Timeline visualization for your career journey
- Color-coded technology badges
- Responsive and mobile-friendly
- Light mode optimized for presentations

### 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- User data isolation (you only see your own data)
- Protected API endpoints

## API Endpoints

All endpoints require authentication (JWT token in Authorization header) except auth routes.

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Companies
- `GET /api/companies` - List user's companies
- `GET /api/companies/:id` - Get company details
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Projects
- `GET /api/projects` - List all user's projects
- `GET /api/projects?companyId=:id` - List projects by company
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Presentations
- `GET /api/presentations` - List user's presentations
- `GET /api/presentations/:id` - Get presentation details
- `GET /api/presentations/:id/view` - Get presentation with filtered companies/projects
- `POST /api/presentations` - Create presentation
- `PUT /api/presentations/:id` - Update presentation
- `DELETE /api/presentations/:id` - Delete presentation

## Development

### Docker Development Workflow

The Docker setup supports hot-reloading for both frontend and backend:

1. Make changes to your code
2. Changes are automatically detected and applied
3. No need to rebuild containers for code changes

Frontend changes reload instantly via Vite HMR.
Backend changes reload automatically via tsx watch mode.

### Frontend Development

The frontend uses:
- **Vite** for fast development and building
- **Mantine UI** for beautiful components
- **React Router** for navigation
- **TypeScript** for type safety
- **Context API** for state management (Auth)

### Backend Development

The backend uses:
- **Express** for API routing
- **PostgreSQL** with `pg` driver for database operations
- **JWT** for authentication
- **bcrypt** for password hashing
- **tsx** for TypeScript execution in development
- **CORS** enabled for local development

### Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts with authentication
- `companies` - Work experience entries (linked to users)
- `projects` - Project details (linked to companies)
- `presentations` - Custom presentation configurations (linked to users)

### Environment Variables

#### Backend (.env)
```env
DB_HOST=postgres              # or localhost for local dev
DB_PORT=5432
DB_NAME=career_timeline
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Troubleshooting

### Docker Issues

**Containers won't start:**
```bash
docker-compose down -v  # Remove volumes
docker-compose up --build  # Rebuild and start
```

**Database connection errors:**
```bash
# Check if PostgreSQL is healthy
docker-compose ps

# View backend logs
docker-compose logs backend
```

**Port conflicts:**
- Make sure ports 5173, 3001, and 5432 are not in use
- Or modify the ports in docker-compose.yml

### Authentication Issues

**"No token provided" errors:**
- Make sure you're logged in
- Check browser localStorage for 'token' key
- Try logging out and logging back in

**"Failed to save company":**
- This was fixed! Make sure containers are running the latest code
- Run: `docker-compose restart backend`

## Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Step-by-step getting started guide
- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Comprehensive Docker documentation
- [LINKEDIN_IMPORT.md](./LINKEDIN_IMPORT.md) - LinkedIn import feature guide
- [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md) - Authentication setup and usage
- [AUTH_INTEGRATION.md](./AUTH_INTEGRATION.md) - Technical details of auth implementation

## Roadmap

- [ ] User profile management page with avatar upload
- [ ] Display personal information in presentations
- [ ] Export presentations as PDF
- [ ] Share presentations via unique URLs
- [ ] Import from resume/CV files
- [ ] Dark mode support
- [ ] Mobile app version
- [ ] Analytics on presentation views

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Docker
5. Submit a pull request

## Support

If you encounter any issues or have questions:

1. Check the documentation files listed above
2. Review existing GitHub issues
3. Create a new issue with detailed information

---

Made with ❤️ for developers preparing for interviews
