from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database import Base


class GradeEnum(str, enum.Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"
    F = "F"


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    index_number = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    seat_number = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    scripts = relationship("AnswerScript", back_populates="student", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    max_marks = Column(Float, nullable=False)
    topic = Column(String(100), nullable=True)
    marking_scheme = Column(Text, nullable=True)  # AI uses this for auto-marking
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    marks = relationship("Mark", back_populates="question", cascade="all, delete-orphan")


class AnswerScript(Base):
    __tablename__ = "answer_scripts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    file_path = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    is_marked = Column(Boolean, default=False)
    total_score = Column(Float, nullable=True)
    grade = Column(String(2), nullable=True)
    remarks = Column(Text, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    marked_at = Column(DateTime(timezone=True), nullable=True)

    student = relationship("Student", back_populates="scripts")
    marks = relationship("Mark", back_populates="script", cascade="all, delete-orphan")


class Mark(Base):
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True, index=True)
    script_id = Column(Integer, ForeignKey("answer_scripts.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    score = Column(Float, nullable=False, default=0)
    max_score = Column(Float, nullable=False)
    ai_score = Column(Float, nullable=True)
    ai_feedback = Column(Text, nullable=True)
    lecturer_override = Column(Boolean, default=False)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    script = relationship("AnswerScript", back_populates="marks")
    question = relationship("Question", back_populates="marks")


class Lecturer(Base):
    __tablename__ = "lecturers"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
