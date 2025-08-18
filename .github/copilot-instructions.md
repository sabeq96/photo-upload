# Photo Upload Application - AI Coding Instructions

## Architecture Overview

This is a **dual-service photo upload application** with clear separation of concerns:

- **Backend**: Directus CMS (`/directus/`) - Headless CMS handling file uploads, storage, and API
- **Frontend**: React SPA (`/photo-upload-ui/`) - User interface for photo uploading

### Service Communication

- Frontend connects to Directus via `@directus/sdk` (already installed)
- Directus exposes REST/GraphQL APIs on port 8055
- File uploads stored in `directus/uploads/` directory
- CORS configured for localhost development in `.env.example`

## Development Workflows

### Backend (Directus)

```bash
cd directus
# Setup environment (copy .env.example to .env first)
docker compose up -d
# Access admin panel: http://localhost:8055
```

### Frontend (React + Vite)

```bash
cd photo-upload-ui
npm run dev     # Development server
npm run build   # Production build
npm run lint    # ESLint check
```

## Tech Stack Specifics

### Frontend Stack

- **React 19** with TypeScript
- **Vite** for development/build tooling
- **Tailwind CSS 4.x** + **DaisyUI** for styling
- **@directus/sdk** for backend communication

### Key Configuration Points

- Tailwind CSS imports via `@import "tailwindcss"` in `src/index.css`
- DaisyUI plugin loaded via `@plugin "daisyui"`
- Vite config includes Tailwind CSS plugin: `tailwindcss()` from `@tailwindcss/vite`

### Environment Configuration

- Directus uses extensive environment variables (see `directus/.env.example`)
- Frontend connects to `http://localhost:8055` by default
- CORS origin supports multiple development ports: `3000,4321,5173`

## Project Conventions

### File Structure

- Keep React components in `photo-upload-ui/src/`
- Directus extensions go in `directus/extensions/`
- Uploaded files automatically stored in `directus/uploads/`

### Development Patterns

- Use Directus SDK for all backend communication
- Leverage DaisyUI components for consistent UI
- Follow React 19 patterns (no legacy hooks needed)
- **ALWAYS use named exports/imports in the frontend UI** - Never use default exports or imports
  - Components: `export function ComponentName() {}` and `import { ComponentName } from './path'`
  - Index files: `export { ComponentName } from './ComponentName'`
  - Avoid: `export default` and `import ComponentName from './path'`
- **Execute prompts precisely** - Only implement what is explicitly requested, do not add unasked features or functionality

### Database Integration

- Directus uses PostgreSQL with PostGIS extensions
- Database files persist in `directus/data/database/`
- Admin credentials: `admin@example.com` / `d1r3ctu5` (from .env.example)

## Critical Commands

```bash
# Start full stack
cd directus && docker compose up -d
cd ../photo-upload-ui && npm run dev

# Reset Directus (development only)
cd directus && docker compose down -v && docker compose up -d
```

When implementing photo upload features, integrate with Directus file endpoints using the SDK rather than building custom upload logic.
