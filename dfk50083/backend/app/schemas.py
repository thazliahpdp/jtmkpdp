from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ── Student ───────────────────────────────────────────────────────────────────

class StudentBase(BaseModel):
    index_number: str
    name: str
    seat_number: Optional[str] = None
    email: Optional[str] = None


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    seat_number: Optional[str] = None
    email: Optional[str] = None


class StudentOut(StudentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Question ──────────────────────────────────────────────────────────────────

class QuestionBase(BaseModel):
    number: int
    description: str
    max_marks: float
    topic: Optional[str] = None
    marking_scheme: Optional[str] = None


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(BaseModel):
    description: Optional[str] = None
    max_marks: Optional[float] = None
    topic: Optional[str] = None
    marking_scheme: Optional[str] = None


class QuestionOut(QuestionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Mark ──────────────────────────────────────────────────────────────────────

class MarkBase(BaseModel):
    question_id: int
    score: float = Field(ge=0)
    max_score: float
    feedback: Optional[str] = None


class MarkCreate(MarkBase):
    script_id: int


class MarkUpdate(BaseModel):
    score: Optional[float] = Field(default=None, ge=0)
    feedback: Optional[str] = None
    lecturer_override: Optional[bool] = None


class MarkOut(MarkBase):
    id: int
    script_id: int
    ai_score: Optional[float] = None
    ai_feedback: Optional[str] = None
    lecturer_override: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Answer Script ─────────────────────────────────────────────────────────────

class AnswerScriptOut(BaseModel):
    id: int
    student_id: int
    file_name: str
    is_marked: bool
    total_score: Optional[float] = None
    grade: Optional[str] = None
    remarks: Optional[str] = None
    uploaded_at: datetime
    marked_at: Optional[datetime] = None
    marks: List[MarkOut] = []

    class Config:
        from_attributes = True


class ScriptRemarksUpdate(BaseModel):
    remarks: Optional[str] = None


# ── Auth ──────────────────────────────────────────────────────────────────────

class LecturerCreate(BaseModel):
    username: str
    full_name: str
    email: str
    password: str


class LecturerOut(BaseModel):
    id: int
    username: str
    full_name: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# ── Reports ───────────────────���───────────────────────────────────────────────

class StudentReportItem(BaseModel):
    student_id: int
    index_number: str
    name: str
    total_score: Optional[float]
    grade: Optional[str]
    is_marked: bool


class GradeDistribution(BaseModel):
    grade: str
    count: int


class DashboardStats(BaseModel):
    total_students: int
    total_marked: int
    total_pending: int
    average_score: Optional[float]
    highest_score: Optional[float]
    lowest_score: Optional[float]
    grade_distribution: List[GradeDistribution]
