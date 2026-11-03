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

## Deploy separately: Render + Vercel + Tiger Cloud

The API and frontend are deployed as separate services. Render hosts FastAPI,
Vercel builds and hosts the Vite frontend, and Tiger Cloud hosts PostgreSQL.

### Backend on Render

1. Create a Render Web Service from this repository and set its Root Directory to
   `backend`.
2. Set the Build Command to `pip install -r requirements.txt`.
3. Set the Start Command to
   `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Add `DATABASE_URL` in the Render service's environment settings using the
   connection string for your Tiger Cloud database. Do not put this value in
   Vercel or frontend environment variables.
5. Add `FRONTEND_URL` with the deployed Vercel site's exact origin, such as
   `https://your-portfolio.vercel.app`, then deploy. This origin is used by the
   existing CORS configuration.
6. Confirm the service responds at `https://<your-render-service>.onrender.com/api/projects`.

### Frontend on Vercel

1. Import the repository as a separate Vercel project and set the Root Directory
   to `frontend`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Add `VITE_API_URL` with the Render backend origin, for example
   `https://your-portfolio-api.onrender.com` (no trailing slash), and redeploy.
   The frontend appends `/api/...` to this origin.
4. Add the final Vercel site's exact origin to Render's `FRONTEND_URL` if the
   assigned Vercel domain changes. Vercel environment variables are public to
   frontend code; only set the API origin there, never credentials.

For local development, leave `VITE_API_URL` unset: Vite proxies `/api` requests
to `http://localhost:8000`. Configure backend secrets only in the backend's
local environment or Render's environment settings.

## Featured projects database setup

For an existing database, run `backend/migrations/001_featured_project_fields.sql`
and then `backend/migrations/002_featured_projects_data.sql` in the Tiger Cloud SQL
Editor. The scripts add project links, technology stacks, preview image URLs, and
sorting without deleting existing project rows. They are provided for manual use
and are not run by the backend on startup. If this is a new database, start the
backend once first so it creates the base `projects` table, then run migrations 001
and 002 in that order before relying on `/api/projects`.
