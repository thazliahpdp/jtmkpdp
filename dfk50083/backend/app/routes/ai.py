import os
import PyPDF2
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from openai import OpenAI

from app.database import get_db
from app import models, schemas
from app.auth import get_current_lecturer
from app.config import get_settings

router = APIRouter(prefix="/api/ai", tags=["ai"])
settings = get_settings()


def _extract_pdf_text(file_path: str) -> str:
    text = ""
    try:
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ""
    except Exception:
        text = ""
    return text.strip()


def _build_prompt(question: models.Question, answer_text: str) -> str:
    return f"""You are an experienced lecturer marking a Python programming exam for DFK50083.

Question {question.number}: {question.description}
Maximum Marks: {question.max_marks}

Marking Scheme:
{question.marking_scheme or "Award marks based on correctness, logic, and code quality."}

Student's Answer:
{answer_text or "(No answer text extracted — script may be handwritten or image-based)"}

Instructions:
1. Evaluate the student's answer strictly against the marking scheme.
2. Award a score between 0 and {question.max_marks}.
3. Provide brief, constructive feedback (2–4 sentences).
4. Respond ONLY in this exact JSON format:
{{
  "score": <number>,
  "feedback": "<string>"
}}"""


@router.post("/auto-mark/{script_id}")
def auto_mark_script(
    script_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    """Use OpenAI to auto-mark all questions for a given script."""
    if not settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")

    script = db.query(models.AnswerScript).filter(models.AnswerScript.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")

    questions = db.query(models.Question).order_by(models.Question.number).all()
    if not questions:
        raise HTTPException(status_code=400, detail="No questions configured yet")

    answer_text = _extract_pdf_text(script.file_path)
    client = OpenAI(api_key=settings.openai_api_key)
    results = []

    for question in questions:
        prompt = _build_prompt(question, answer_text)
        try:
            response = client.chat.completions.create(
                model=settings.openai_model,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.2,
            )
            import json
            data = json.loads(response.choices[0].message.content)
            ai_score = min(float(data.get("score", 0)), question.max_marks)
            ai_feedback = data.get("feedback", "")
        except Exception as e:
            ai_score = 0.0
            ai_feedback = f"AI marking failed: {str(e)}"

        # Upsert mark with AI suggestion
        existing = (
            db.query(models.Mark)
            .filter(
                models.Mark.script_id == script_id,
                models.Mark.question_id == question.id,
            )
            .first()
        )
        if existing:
            existing.ai_score = ai_score
            existing.ai_feedback = ai_feedback
            if not existing.lecturer_override:
                existing.score = ai_score
            db.commit()
            db.refresh(existing)
            results.append(existing)
        else:
            mark = models.Mark(
                script_id=script_id,
                question_id=question.id,
                score=ai_score,
                max_score=question.max_marks,
                ai_score=ai_score,
                ai_feedback=ai_feedback,
                lecturer_override=False,
            )
            db.add(mark)
            db.commit()
            db.refresh(mark)
            results.append(mark)

    return {
        "script_id": script_id,
        "questions_marked": len(results),
        "marks": [
            {
                "question_id": m.question_id,
                "score": m.score,
                "ai_score": m.ai_score,
                "ai_feedback": m.ai_feedback,
            }
            for m in results
        ],
    }


@router.post("/auto-mark-question/{script_id}/{question_id}")
def auto_mark_single_question(
    script_id: int,
    question_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_lecturer),
):
    """Auto-mark a single question for a script."""
    if not settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")

    script = db.query(models.AnswerScript).filter(models.AnswerScript.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")

    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    answer_text = _extract_pdf_text(script.file_path)
    client = OpenAI(api_key=settings.openai_api_key)
    prompt = _build_prompt(question, answer_text)

    try:
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        import json
        data = json.loads(response.choices[0].message.content)
        ai_score = min(float(data.get("score", 0)), question.max_marks)
        ai_feedback = data.get("feedback", "")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI marking failed: {str(e)}")

    existing = (
        db.query(models.Mark)
        .filter(models.Mark.script_id == script_id, models.Mark.question_id == question_id)
        .first()
    )
    if existing:
        existing.ai_score = ai_score
        existing.ai_feedback = ai_feedback
        if not existing.lecturer_override:
            existing.score = ai_score
        db.commit()
        db.refresh(existing)
        return existing

    mark = models.Mark(
        script_id=script_id,
        question_id=question_id,
        score=ai_score,
        max_score=question.max_marks,
        ai_score=ai_score,
        ai_feedback=ai_feedback,
        lecturer_override=False,
    )
    db.add(mark)
    db.commit()
    db.refresh(mark)
    return mark
