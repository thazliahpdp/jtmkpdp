from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.auth import get_current_lecturer

router = APIRouter(prefix="/api/students", tags=["students"])


@router.get("/", response_model=List[schemas.StudentOut])
def list_students(db: Session = Depends(get_db), _=Depends(get_current_lecturer)):
    return db.query(models.Student).order_by(models.Student.index_number).all()


@router.post("/", response_model=schemas.StudentOut, status_code=201)
def create_student(
    payload: schemas.StudentCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    if db.query(models.Student).filter(models.Student.index_number == payload.index_number).first():
        raise HTTPException(status_code=400, detail="Index number already exists")
    student = models.Student(**payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("/{student_id}", response_model=schemas.StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db), _=Depends(get_current_lecturer)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.put("/{student_id}", response_model=schemas.StudentOut)
def update_student(
    student_id: int,
    payload: schemas.StudentUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}", status_code=204)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()


@router.post("/bulk", response_model=List[schemas.StudentOut], status_code=201)
def bulk_create_students(
    payload: List[schemas.StudentCreate],
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    students = []
    for item in payload:
        if db.query(models.Student).filter(models.Student.index_number == item.index_number).first():
            continue  # skip duplicates silently
        student = models.Student(**item.model_dump())
        db.add(student)
        students.append(student)
    db.commit()
    for s in students:
        db.refresh(s)
    return students
