export interface Student {
  id: number
  index_number: string
  name: string
  seat_number: string | null
  email: string | null
  created_at: string
}

export interface Question {
  id: number
  number: number
  description: string
  max_marks: number
  topic: string | null
  marking_scheme: string | null
  created_at: string
}

export interface Mark {
  id: number
  script_id: number
  question_id: number
  score: number
  max_score: number
  ai_score: number | null
  ai_feedback: string | null
  lecturer_override: boolean
  feedback: string | null
  created_at: string
}

export interface AnswerScript {
  id: number
  student_id: number
  file_name: string
  is_marked: boolean
  total_score: number | null
  grade: string | null
  remarks: string | null
  uploaded_at: string
  marked_at: string | null
  marks: Mark[]
}

export interface DashboardStats {
  total_students: number
  total_marked: number
  total_pending: number
  average_score: number | null
  highest_score: number | null
  lowest_score: number | null
  grade_distribution: { grade: string; count: number }[]
}

export interface StudentReportItem {
  student_id: number
  index_number: string
  name: string
  total_score: number | null
  grade: string | null
  is_marked: boolean
}

export interface Lecturer {
  id: number
  username: string
  full_name: string
  email: string
  is_active: boolean
}
