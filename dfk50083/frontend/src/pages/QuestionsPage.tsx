import { questions } from '../data/dummy'

export default function QuestionsPage() {
  const totalMarks = questions.reduce((s, q) => s + q.max_marks, 0)

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Questions & Rubric</h1>
        <p className="text-gray-500 text-sm mt-1">{questions.length} questions · {totalMarks} total marks</p>
      </div>

      <div className="space-y-3">
        {questions.map(q => (
          <div key={q.id} className="card p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <span className="font-bold text-blue-700">Q{q.number}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {q.topic && (
                    <span className="badge bg-blue-50 text-blue-600">{q.topic}</span>
                  )}
                  <span className="ml-auto text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                    {q.max_marks} marks
                  </span>
                </div>
                <p className="text-sm text-gray-800 font-medium mb-2">{q.description}</p>
                {q.marking_scheme && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                    <span className="font-semibold">Marking Scheme: </span>{q.marking_scheme}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 italic">Demo mode — data is read-only.</p>
    </div>
  )
}
