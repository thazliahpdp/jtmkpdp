import api from './client'
import type { Student, Question, AnswerScript, Mark, DashboardStats, StudentReportItem, Lecturer } from '../types'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = async (username: string, password: string) => {
  const form = new FormData()
  form.append('username', username)
  form.append('password', password)
  const res = await api.post<{ access_token: string; token_type: string }>('/auth/login', form)
  return res.data
}

export const getMe = async () => {
  const res = await api.get<Lecturer>('/auth/me')
  return res.data
}

export const register = async (data: { username: string; full_name: string; email: string; password: string }) => {
  const res = await api.post<Lecturer>('/auth/register', data)
  return res.data
}

// ── Students ──────────────────────────────────────────────────────────────────
export const getStudents = async () => {
  const res = await api.get<Student[]>('/students/')
  return res.data
}

export const createStudent = async (data: Omit<Student, 'id' | 'created_at'>) => {
  const res = await api.post<Student>('/students/', data)
  return res.data
}

export const updateStudent = async (id: number, data: Partial<Student>) => {
  const res = await api.put<Student>(`/students/${id}`, data)
  return res.data
}

export const deleteStudent = async (id: number) => {
  await api.delete(`/students/${id}`)
}

export const bulkCreateStudents = async (data: Omit<Student, 'id' | 'created_at'>[]) => {
  const res = await api.post<Student[]>('/students/bulk', data)
  return res.data
}

// ── Questions ─────────────────────────────────────────────────────────────────
export const getQuestions = async () => {
  const res = await api.get<Question[]>('/questions/')
  return res.data
}

export const createQuestion = async (data: Omit<Question, 'id' | 'created_at'>) => {
  const res = await api.post<Question>('/questions/', data)
  return res.data
}

export const updateQuestion = async (id: number, data: Partial<Question>) => {
  const res = await api.put<Question>(`/questions/${id}`, data)
  return res.data
}

export const deleteQuestion = async (id: number) => {
  await api.delete(`/questions/${id}`)
}

// ── Scripts ───────────────────────────────────────────────────────────────────
export const getScripts = async () => {
  const res = await api.get<AnswerScript[]>('/scripts/')
  return res.data
}

export const getStudentScripts = async (studentId: number) => {
  const res = await api.get<AnswerScript[]>(`/scripts/student/${studentId}`)
  return res.data
}

export const uploadScript = async (studentId: number, file: File) => {
  const form = new FormData()
  form.append('file', file)
  const res = await api.post<AnswerScript>(`/scripts/upload/${studentId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const getScript = async (scriptId: number) => {
  const res = await api.get<AnswerScript>(`/scripts/${scriptId}`)
  return res.data
}

export const finalizeScript = async (scriptId: number) => {
  const res = await api.post<AnswerScript>(`/scripts/${scriptId}/finalize`)
  return res.data
}

export const updateRemarks = async (scriptId: number, remarks: string) => {
  const res = await api.patch<AnswerScript>(`/scripts/${scriptId}/remarks`, { remarks })
  return res.data
}

export const deleteScript = async (scriptId: number) => {
  await api.delete(`/scripts/${scriptId}`)
}

const getApiBase = () =>
  import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : '/api'

export const getScriptFileUrl = (scriptId: number) => `${getApiBase()}/scripts/${scriptId}/file`

// ── Marks ─────────────────────────────────────────────────────────────────────
export const getMarksForScript = async (scriptId: number) => {
  const res = await api.get<Mark[]>(`/marks/script/${scriptId}`)
  return res.data
}

export const saveMark = async (data: {
  script_id: number
  question_id: number
  score: number
  max_score: number
  feedback?: string
}) => {
  const res = await api.post<Mark>('/marks/', data)
  return res.data
}

export const updateMark = async (markId: number, data: { score?: number; feedback?: string; lecturer_override?: boolean }) => {
  const res = await api.put<Mark>(`/marks/${markId}`, data)
  return res.data
}

// ── AI ────────────────────────────────────────────────────────────────────────
export const autoMarkScript = async (scriptId: number) => {
  const res = await api.post(`/ai/auto-mark/${scriptId}`)
  return res.data
}

export const autoMarkQuestion = async (scriptId: number, questionId: number) => {
  const res = await api.post(`/ai/auto-mark-question/${scriptId}/${questionId}`)
  return res.data
}

// ── Reports ───────────────────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  const res = await api.get<DashboardStats>('/reports/dashboard')
  return res.data
}

export const getGradeReport = async () => {
  const res = await api.get<StudentReportItem[]>('/reports/grades')
  return res.data
}

export const exportCsv = () => {
  window.open(`${getApiBase()}/reports/export/csv`)
}
