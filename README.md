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

## Deploy
Tiger Cloud only hosts the database. Host the backend (e.g. Render: start command
`uvicorn main:app --host 0.0.0.0 --port $PORT`, env vars DATABASE_URL + FRONTEND_URL)
and the frontend (Vercel/Netlify/S3+CloudFront, env var VITE_API_URL = backend URL).
