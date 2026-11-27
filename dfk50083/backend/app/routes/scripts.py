import os
import shutil
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.auth import get_current_lecturer
from app.config import get_settings

router = APIRouter(prefix="/api/scripts", tags=["scripts"])
settings = get_settings()


def _compute_grade(score: float, max_score: float) -> str:
    pct = (score / max_score * 100) if max_score > 0 else 0
    if pct >= 80:
        return "A"
    elif pct >= 70:
        return "B"
    elif pct >= 60:
        return "C"
    elif pct >= 50:
        return "D"
    elif pct >= 40:
        return "E"
    else:
        return "F"


@router.get("/", response_model=List[schemas.AnswerScriptOut])
def list_scripts(db: Session = Depends(get_db), _=Depends(get_current_lecturer)):
    return db.query(models.AnswerScript).order_by(models.AnswerScript.uploaded_at.desc()).all()


@router.get("/student/{student_id}", response_model=List[schemas.AnswerScriptOut])
def scripts_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    return (
        db.query(models.AnswerScript)
        .filter(models.AnswerScript.student_id == student_id)
        .all()
    )


@router.post("/upload/{student_id}", response_model=schemas.AnswerScriptOut, status_code=201)
async def upload_script(
    student_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    upload_dir = os.path.join(settings.upload_dir, str(student_id))
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    script = models.AnswerScript(
        student_id=student_id,
        file_path=file_path,
        file_name=file.filename,
    )
    db.add(script)
    db.commit()
    db.refresh(script)
    return script


@router.get("/{script_id}", response_model=schemas.AnswerScriptOut)
def get_script(script_id: int, db: Session = Depends(get_db), _=Depends(get_current_lecturer)):
    script = db.query(models.AnswerScript).filter(models.AnswerScript.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    return script


@router.get("/{script_id}/file")
def download_script(
    script_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    script = db.query(models.AnswerScript).filter(models.AnswerScript.id == script_id).first()
    if not script or not os.path.exists(script.file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(script.file_path, media_type="application/pdf", filename=script.file_name)


@router.patch("/{script_id}/remarks", response_model=schemas.AnswerScriptOut)
def update_remarks(
    script_id: int,
    payload: schemas.ScriptRemarksUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    script = db.query(models.AnswerScript).filter(models.AnswerScript.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    script.remarks = payload.remarks
    db.commit()
    db.refresh(script)
    return script


@router.post("/{script_id}/finalize", response_model=schemas.AnswerScriptOut)
def finalize_script(
    script_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    """Recalculate total score, grade, and mark script as fully marked."""
    script = db.query(models.AnswerScript).filter(models.AnswerScript.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")

    marks = db.query(models.Mark).filter(models.Mark.script_id == script_id).all()
    if not marks:
        raise HTTPException(status_code=400, detail="No marks recorded yet")

    total = sum(m.score for m in marks)
    max_total = sum(m.max_score for m in marks)

    script.total_score = total
    script.grade = _compute_grade(total, max_total)
    script.is_marked = True
    script.marked_at = datetime.utcnow()
    db.commit()
    db.refresh(script)
    return script


@router.delete("/{script_id}", status_code=204)
def delete_script(
    script_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    script = db.query(models.AnswerScript).filter(models.AnswerScript.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    if os.path.exists(script.file_path):
        os.remove(script.file_path)
    db.delete(script)
    db.commit()
