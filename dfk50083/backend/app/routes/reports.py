from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.database import get_db
from app import models, schemas
from app.auth import get_current_lecturer

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/dashboard", response_model=schemas.DashboardStats)
def dashboard_stats(db: Session = Depends(get_db), _=Depends(get_current_lecturer)):
    total_students = db.query(models.Student).count()
    total_marked = (
        db.query(models.AnswerScript).filter(models.AnswerScript.is_marked == True).count()
    )
    total_pending = (
        db.query(models.AnswerScript).filter(models.AnswerScript.is_marked == False).count()
    )

    scored = (
        db.query(models.AnswerScript.total_score)
        .filter(models.AnswerScript.is_marked == True, models.AnswerScript.total_score != None)
        .all()
    )
    scores = [s[0] for s in scored]
    avg = round(sum(scores) / len(scores), 2) if scores else None
    high = max(scores) if scores else None
    low = min(scores) if scores else None

    grade_rows = (
        db.query(models.AnswerScript.grade, func.count(models.AnswerScript.id))
        .filter(models.AnswerScript.is_marked == True)
        .group_by(models.AnswerScript.grade)
        .all()
    )
    grade_dist = [
        schemas.GradeDistribution(grade=g or "N/A", count=c) for g, c in grade_rows
    ]

    return schemas.DashboardStats(
        total_students=total_students,
        total_marked=total_marked,
        total_pending=total_pending,
        average_score=avg,
        highest_score=high,
        lowest_score=low,
        grade_distribution=grade_dist,
    )


@router.get("/grades", response_model=List[schemas.StudentReportItem])
def grade_report(db: Session = Depends(get_db), _=Depends(get_current_lecturer)):
    students = db.query(models.Student).order_by(models.Student.index_number).all()
    report = []
    for student in students:
        script = (
            db.query(models.AnswerScript)
            .filter(models.AnswerScript.student_id == student.id)
            .order_by(models.AnswerScript.uploaded_at.desc())
            .first()
        )
        report.append(
            schemas.StudentReportItem(
                student_id=student.id,
                index_number=student.index_number,
                name=student.name,
                total_score=script.total_score if script else None,
                grade=script.grade if script else None,
                is_marked=script.is_marked if script else False,
            )
        )
    return report


@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db), _=Depends(get_current_lecturer)):
    """Export grades as CSV."""
    import csv
    import io
    from fastapi.responses import StreamingResponse

    students = db.query(models.Student).order_by(models.Student.index_number).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Index Number", "Name", "Seat Number", "Total Score", "Grade", "Status"])

    for student in students:
        script = (
            db.query(models.AnswerScript)
            .filter(models.AnswerScript.student_id == student.id)
            .order_by(models.AnswerScript.uploaded_at.desc())
            .first()
        )
        writer.writerow([
            student.index_number,
            student.name,
            student.seat_number or "",
            script.total_score if script else "",
            script.grade if script else "",
            "Marked" if (script and script.is_marked) else "Pending",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=dfk50083_grades.csv"},
    )
