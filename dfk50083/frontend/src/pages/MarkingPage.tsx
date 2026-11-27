import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { scripts, students, questions } from '../data/dummy'
import { ArrowLeft, ChevronDown, ChevronUp, Bot, CheckCircle } from 'lucide-react'
import GradeBadge from '../components/GradeBadge'

function QuestionMarkRow({ question, mark }: {
  question: typeof questions[0]
  mark?: typeof scripts[0]['marks'][0]
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-blue-700">Q{question.number}</span>
            {question.topic && <span className="badge bg-blue-50 text-blue-600">{question.topic}</span>}
            <span className="text-xs text-gray-400 ml-auto">{question.max_marks} marks</span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{question.description}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600" onClick={() => setExpanded(e => !e)}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && mark?.ai_feedback && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
          <p className="font-medium text-purple-700 flex items-center gap-1 mb-1">
            <Bot className="w-4 h-4" /> AI Feedback (suggested: {mark.ai_score} / {question.max_marks})
          </p>
          <p className="text-purple-600">{mark.ai_feedback}</p>
        </div>
      )}

      {expanded && question.marking_scheme && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          <p className="font-medium mb-1">Marking Scheme</p>
          <p>{question.marking_scheme}</p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Score:</span>
          <span className="text-lg font-bold text-blue-700">
            {mark !== undefined ? mark.score : '—'}
          </span>
          <span className="text-sm text-gray-400">/ {question.max_marks}</span>
          {mark?.lecturer_override && (
            <span className="badge bg-green-100 text-green-700 text-xs">Lecturer override</span>
          )}
        </div>
        {mark?.feedback && (
          <p className="text-sm text-gray-500 italic ml-auto">"{mark.feedback}"</p>
        )}
      </div>
    </div>
  )
}

export default function MarkingPage() {
  const { scriptId } = useParams<{ scriptId: string }>()
  const id = Number(scriptId)

  const script = scripts.find(s => s.id === id)
  const student = students.find(s => s.id === script?.student_id)

  if (!script || !student) {
    return (
      <div className="p-8 text-center text-red-500">
        Script not found. <Link to="/scripts" className="underline text-blue-600">Go back</Link>
      </div>
    )
  }

  const markMap = Object.fromEntries(script.marks.map(m => [m.question_id, m]))
  const totalMax = questions.reduce((s, q) => s + q.max_marks, 0)
  const currentTotal = script.marks.reduce((s, m) => s + m.score, 0)

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/scripts" className="btn-secondary p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-sm text-gray-500 font-mono">{student.index_number} · Seat {student.seat_number} · {script.file_name}</p>
        </div>
        {script.is_marked && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                {script.total_score} / {totalMax} marks
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600">Final Grade:</span>
                <GradeBadge grade={script.grade} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* PDF placeholder (static — no real file) */}
        <div className="col-span-2">
          <div className="card overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
            <div className="bg-gray-800 px-3 py-2 text-xs text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              {script.file_name}
            </div>
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-400 gap-3 px-6 text-center"
              style={{ height: 'calc(100% - 32px)' }}>
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium">{script.file_name}</p>
              <p className="text-xs">PDF viewer available in live mode.<br />This is a static demo.</p>
            </div>
          </div>
        </div>

        {/* Marking panel */}
        <div className="col-span-3 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {/* Summary bar */}
          <div className="card p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                {script.marks.length} / {questions.length} questions marked · Total: {currentTotal} / {totalMax}
              </p>
              <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: questions.length ? `${(script.marks.length / questions.length) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Per-question rows */}
          {questions.map(q => (
            <QuestionMarkRow
              key={q.id}
              question={q}
              mark={markMap[q.id]}
            />
          ))}

          {/* Remarks */}
          {script.remarks && (
            <div className="card p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Overall Remarks</p>
              <p className="text-sm text-gray-600 italic">{script.remarks}</p>
            </div>
          )}

          <p className="text-xs text-gray-400 italic pb-2">Demo mode — marks are read-only.</p>
        </div>
      </div>
    </div>
  )
}
