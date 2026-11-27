import { useState } from 'react'
import { scripts, students } from '../data/dummy'
import { Eye, FileText, CheckCircle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ScriptsPage() {
  const [selectedStudent, setSelectedStudent] = useState<number | ''>('')

  const filtered = selectedStudent
    ? scripts.filter(sc => sc.student_id === selectedStudent)
    : scripts

  const studentMap = Object.fromEntries(students.map(s => [s.id, s]))

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Answer Scripts</h1>
          <p className="text-gray-500 text-sm mt-1">{scripts.length} scripts uploaded · Session Nov 2026</p>
        </div>
        <div className="flex gap-3 items-center">
          <select
            className="input w-56"
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">— All students —</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.index_number} — {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">File</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Score</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Uploaded</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No scripts found</td></tr>
            ) : filtered.map(sc => {
              const student = studentMap[sc.student_id]
              return (
                <tr key={sc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{student?.name ?? '—'}</p>
                    <p className="text-xs text-gray-400 font-mono">{student?.index_number}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      {sc.file_name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {sc.is_marked ? (
                      <span className="badge bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" /> Marked
                      </span>
                    ) : (
                      <span className="badge bg-orange-100 text-orange-700 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {sc.total_score != null ? (
                      <span className="font-semibold">{sc.total_score} / 100</span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(sc.uploaded_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/marking/${sc.id}`} className="btn-secondary p-1.5" title="View marks">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 italic">Demo mode — data is read-only.</p>
    </div>
  )
}
