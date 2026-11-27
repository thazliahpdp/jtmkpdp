import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.database import create_tables
from app.routes import auth, students, questions, scripts, marks, ai, reports

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Marking dashboard API for DFK50083 Python Programming Final Assessment",
    version="1.0.0",
)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://thazliahpdp.github.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(questions.router)
app.include_router(scripts.router)
app.include_router(marks.router)
app.include_router(ai.router)
app.include_router(reports.router)


@app.on_event("startup")
def startup():
    os.makedirs(settings.upload_dir, exist_ok=True)
    create_tables()


@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.app_name}
