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


# Starter projects. Edit these, or change rows directly in the database later.
SAMPLE_PROJECTS = [
    ("Wayline", "Making a whole city's transit app feel less like decoding a puzzle.", "Mar 2026", "mobility", "yellow"),
    ("Tandem", "From 'who owes who' to money that finally feels shared.", "Feb 2026", "fintech", "dark"),
    ("Forge", "Getting a new engineer from day one to shipping without the panic.", "Jan 2026", "devtools", "yellow"),
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
        return conn.execute("SELECT * FROM projects ORDER BY id").fetchall()


@app.post("/api/contact")
def send_message(msg: ContactMessage):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO messages (name, email, body) VALUES (%s,%s,%s)",
            (msg.name, msg.email, msg.body),
        )
    return {"ok": True}
