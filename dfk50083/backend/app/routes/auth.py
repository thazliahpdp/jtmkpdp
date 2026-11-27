from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app import models, schemas
from app.auth import verify_password, get_password_hash, create_access_token, get_current_lecturer
from app.config import get_settings

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()


@router.post("/register", response_model=schemas.LecturerOut, status_code=201)
def register(payload: schemas.LecturerCreate, db: Session = Depends(get_db)):
    if db.query(models.Lecturer).filter(models.Lecturer.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    lecturer = models.Lecturer(
        username=payload.username,
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(lecturer)
    db.commit()
    db.refresh(lecturer)
    return lecturer


@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    lecturer = db.query(models.Lecturer).filter(
        models.Lecturer.username == form_data.username
    ).first()
    if not lecturer or not verify_password(form_data.password, lecturer.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": lecturer.username})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.LecturerOut)
def me(current: models.Lecturer = Depends(get_current_lecturer)):
    return current
