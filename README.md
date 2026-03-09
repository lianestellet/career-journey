# Career Timeline

A personal interview portfolio builder to help developers present their experience during job interviews.

## Features

- **Company Management**: Store companies you've worked at with context and descriptions
- **Project Portfolio**: Document projects within each company with technologies, keywords, and architecture diagrams
- **Custom Presentations**: Generate tailored interview presentations for specific job opportunities
- **Flexible Navigation**: Quickly navigate through your experience during interviews
- **Customizable Views**: Show/hide specific experiences based on the target role

## Tech Stack

- **Frontend**: React, TypeScript, Mantine UI, React Router
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (better-sqlite3)
- **Package Manager**: pnpm
- **Build Tool**: Vite

## Project Structure

```
career-timeline/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── db/           # Database layer
│   │   ├── routes/       # Express routes
│   │   └── types/        # TypeScript type definitions
│   └── package.json
└── package.json       # Root package.json for monorepo
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

1. Install dependencies:
```bash
pnpm install
```

### Running the Application

#### Development Mode

Run both frontend and backend concurrently:
```bash
pnpm dev
```

Or run them separately:

Frontend only (starts on http://localhost:5173):
```bash
pnpm dev:frontend
```

Backend only (starts on http://localhost:3001):
```bash
pnpm dev:backend
```

#### Production Build

Build both applications:
```bash
pnpm build
```

Or build separately:
```bash
pnpm build:frontend
pnpm build:backend
```

### Database

The application uses SQLite for data storage. The database file will be automatically created at `backend/data/career-timeline.db` when you first run the backend.

## Usage

### 1. Add Companies

Navigate to "Companies & Projects" and click "Add Company" to create entries for your work history:
- Company name
- Your role/position
- Employment dates
- Location
- Company description/context

### 2. Add Projects

Within each company, add projects you worked on:
- Project name and description
- Industry context
- Technologies used
- Keywords (for quick reference)
- Architecture diagram URLs
- Project timeline

### 3. Create Presentations

Navigate to "Presentations" and create custom presentations for specific interviews:
- Name your presentation
- Add target role and company
- Hide irrelevant companies or projects
- Customize the order of content

### 4. Present

Click "Present" on any presentation to enter presentation mode:
- Full-screen, clean layout optimized for sharing
- Easy navigation through your career timeline
- Highlight relevant experience for the interviewer

## API Endpoints

### Companies
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company details
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects?companyId=:id` - List projects by company
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Presentations
- `GET /api/presentations` - List all presentations
- `GET /api/presentations/:id` - Get presentation details
- `GET /api/presentations/:id/view` - Get presentation with filtered companies/projects
- `POST /api/presentations` - Create presentation
- `PUT /api/presentations/:id` - Update presentation
- `DELETE /api/presentations/:id` - Delete presentation

## Development

### Frontend Development

The frontend uses:
- **Vite** for fast development and building
- **Mantine** for UI components
- **React Router** for navigation
- **TypeScript** for type safety

### Backend Development

The backend uses:
- **Express** for API routing
- **better-sqlite3** for database operations
- **tsx** for TypeScript execution in development
- **CORS** enabled for local development

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

Update this if your backend runs on a different port or host.

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
