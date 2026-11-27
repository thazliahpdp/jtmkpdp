from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.auth import get_current_lecturer

router = APIRouter(prefix="/api/marks", tags=["marks"])


@router.get("/script/{script_id}", response_model=List[schemas.MarkOut])
def get_marks_for_script(
    script_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    return db.query(models.Mark).filter(models.Mark.script_id == script_id).all()


@router.post("/", response_model=schemas.MarkOut, status_code=201)
def create_or_update_mark(
    payload: schemas.MarkCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    # Upsert: one mark per (script, question)
    existing = (
        db.query(models.Mark)
        .filter(
            models.Mark.script_id == payload.script_id,
            models.Mark.question_id == payload.question_id,
        )
        .first()
    )
    if existing:
        existing.score = payload.score
        existing.max_score = payload.max_score
        existing.feedback = payload.feedback
        existing.lecturer_override = True
        db.commit()
        db.refresh(existing)
        return existing

    mark = models.Mark(**payload.model_dump(), lecturer_override=True)
    db.add(mark)
    db.commit()
    db.refresh(mark)
    return mark


@router.put("/{mark_id}", response_model=schemas.MarkOut)
def update_mark(
    mark_id: int,
    payload: schemas.MarkUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    mark = db.query(models.Mark).filter(models.Mark.id == mark_id).first()
    if not mark:
        raise HTTPException(status_code=404, detail="Mark not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(mark, field, value)
    db.commit()
    db.refresh(mark)
    return mark


@router.delete("/{mark_id}", status_code=204)
def delete_mark(
    mark_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    mark = db.query(models.Mark).filter(models.Mark.id == mark_id).first()
    if not mark:
        raise HTTPException(status_code=404, detail="Mark not found")
    db.delete(mark)
    db.commit()
