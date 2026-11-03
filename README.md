# Portfolio (React + FastAPI + Postgres on Tiger Cloud)

## 1. Database
Create a service in Tiger Cloud and copy its connection string.

## 2. Backend
    cd backend
    python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env        # paste your DATABASE_URL
    uvicorn main:app --reload
Tables and 3 sample projects are created automatically on first start.
Check http://localhost:8000/api/projects

## 3. Frontend
    cd frontend
    npm install
    npm run dev                 # http://localhost:5173

## Make it yours
- Text, skills, links: frontend/src/content.js
- Colors and fonts: top of frontend/src/styles.css
- Projects: rows in the `projects` table (or edit SAMPLE_PROJECTS in backend/main.py before the first run)
- Messages from the contact form land in the `messages` table

## Deploy on Vercel + Tiger Cloud

The root `vercel.json` deploys the Vite frontend and FastAPI backend as two services
in one Vercel project. `/api/*` requests route to FastAPI; other paths route to the
frontend. The frontend uses same-origin API requests, so leave `VITE_API_URL` unset.

1. Import this repository into Vercel and keep the project root set to the repository
   root (do not set it to `frontend/` or `backend/`).
2. In the Vercel project's Environment Variables, set `DATABASE_URL` to the connection
   string for the existing Tiger Cloud service. Keep the password in Vercel's
   environment settings; do not commit it to the repository.
3. Deploy the project. The backend creates its tables on startup and seeds the sample
   projects only when the `projects` table is empty.

For local development, `frontend/.env.example` documents the optional API URL for a
separately hosted backend. The default empty value uses the Vite proxy to
`http://localhost:8000`.

## Featured projects database setup

For an existing database, run `backend/migrations/001_featured_project_fields.sql`
and then `backend/migrations/002_featured_projects_data.sql` in the Tiger Cloud SQL
Editor. The scripts add project links, technology stacks, preview image URLs, and
sorting without deleting existing project rows. They are provided for manual use
and are not run by the backend on startup.
