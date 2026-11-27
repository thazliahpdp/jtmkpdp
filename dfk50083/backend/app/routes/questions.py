from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.auth import get_current_lecturer

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.get("/", response_model=List[schemas.QuestionOut])
def list_questions(db: Session = Depends(get_db), _=Depends(get_current_lecturer)):
    return db.query(models.Question).order_by(models.Question.number).all()


@router.post("/", response_model=schemas.QuestionOut, status_code=201)
def create_question(
    payload: schemas.QuestionCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    question = models.Question(**payload.model_dump())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.put("/{question_id}", response_model=schemas.QuestionOut)
def update_question(
    question_id: int,
    payload: schemas.QuestionUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(question, field, value)
    db.commit()
    db.refresh(question)
    return question


@router.delete("/{question_id}", status_code=204)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(question)
    db.commit()
