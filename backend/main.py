"""Portfolio API: serves projects from Postgres and saves contact messages."""
import os
from contextlib import asynccontextmanager

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row
from pydantic import BaseModel, Field

load_dotenv()


def get_conn():
    # One short-lived connection per request keeps the code easy to follow.
    return psycopg.connect(os.environ["DATABASE_URL"], row_factory=dict_row)


# Starter projects are used only when the projects table is empty.
SAMPLE_PROJECTS = [
    (
        "Haunted Terminal",
        "A Python terminal wrapper that runs normal commands and asks a local Ollama "
        "Gemma 3 model for a brief ghostly response based on the command and up to "
        "400 characters of output. Timestamped responses are saved to a local log.",
        "Oct 2026",
        "Developer tools",
        "dark",
    ),
    (
        "FinBuddy / Budgenix fork",
        "Fork of kaihere14/Budgenix; this branch adds no fork-specific code. "
        "The upstream app offers chat-based expense logging, rule-based budget "
        "advice, and spending charts.",
        "Forked Nov 2025",
        "Open-source fork",
        "green",
    ),
    (
        "My Developer Portfolio",
        "A notebook-style portfolio built with React, FastAPI, and PostgreSQL on "
        "Tiger Cloud, with projects loaded from the API and contact messages saved "
        "to the database.",
        "Updated Oct 2026",
        "Full-stack",
        "blue",
    ),
]


def setup_database():
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                date_label TEXT NOT NULL,
                tag TEXT NOT NULL,
                color TEXT NOT NULL DEFAULT 'yellow'
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                body TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT now()
            )
            """
        )
        count = conn.execute("SELECT count(*) AS n FROM projects").fetchone()["n"]
        if count == 0:
            for row in SAMPLE_PROJECTS:
                conn.execute(
                    "INSERT INTO projects (title, summary, date_label, tag, color) VALUES (%s,%s,%s,%s,%s)",
                    row,
                )


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_database()  # runs once when the server starts
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=200)
    body: str = Field(min_length=1, max_length=2000)


@app.get("/api/projects")
def list_projects():
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT *
            FROM projects
            WHERE is_featured = TRUE
            ORDER BY sort_order ASC, id ASC
            """
        ).fetchall()

    projects = [dict(row) for row in rows]
    for project in projects:
        project["category"] = project.get("category") or project.get("tag")
        project["technologies"] = project.get("technologies") or []
        project.setdefault("repository_url", None)
        project.setdefault("live_demo_url", None)
        project.setdefault("source_url", None)
        project.setdefault("image_url", None)
        project["sort_order"] = project.get("sort_order") or 0

    return projects


@app.post("/api/contact")
def send_message(msg: ContactMessage):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO messages (name, email, body) VALUES (%s,%s,%s)",
            (msg.name, msg.email, msg.body),
        )
    return {"ok": True}
