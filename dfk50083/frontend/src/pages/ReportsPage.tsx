import { gradeReport, dashboardStats } from '../data/dummy'
import { Download } from 'lucide-react'
import GradeBadge from '../components/GradeBadge'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e', B: '#3b82f6', C: '#eab308', D: '#f97316', E: '#ef4444', F: '#6b7280',
}

export default function ReportsPage() {
  const stats = dashboardStats
  const gradeData = [...stats.grade_distribution]
    .filter(g => g.count > 0)
    .sort((a, b) => a.grade.localeCompare(b.grade))

  const handleExport = () => {
    // Build CSV from dummy data
    const header = ['Index Number', 'Name', 'Total Score', 'Grade', 'Status']
    const rows = gradeReport.map(r => [
      r.index_number,
      r.name,
      r.total_score ?? '',
      r.grade ?? '',
      r.is_marked ? 'Marked' : 'Pending',
    ])
    const csv = [header, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dfk50083_grades.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Grades</h1>
          <p className="text-gray-500 text-sm mt-1">Final assessment results · Session Nov 2026</p>
        </div>
        <button className="btn-primary" onClick={handleExport}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Pie chart */}
        <div className="col-span-2 card p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={gradeData}
                dataKey="count"
                nameKey="grade"
                cx="50%" cy="50%"
                outerRadius={90}
                label={({ grade, count }) => `${grade}: ${count}`}
              >
                {gradeData.map((entry) => (
                  <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] ?? '#6b7280'} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} students`, `Grade ${n}`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="col-span-3 card p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Summary Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Students',  value: stats.total_students },
              { label: 'Scripts Marked',  value: stats.total_marked },
              { label: 'Pending',         value: stats.total_pending },
              { label: 'Average Score',   value: stats.average_score ?? '—' },
              { label: 'Highest Score',   value: stats.highest_score ?? '—' },
              { label: 'Lowest Score',    value: stats.lowest_score ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grade table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Grade List ({gradeReport.length} students)</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Index Number</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Total Score</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Grade</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {gradeReport.map((r, i) => (
              <tr key={r.student_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 font-mono font-medium text-blue-700">{r.index_number}</td>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-center font-semibold">
                  {r.total_score != null ? `${r.total_score} / 100` : '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <GradeBadge grade={r.grade} />
                </td>
                <td className="px-4 py-3 text-center">
                  {r.is_marked
                    ? <span className="badge bg-green-100 text-green-700">Marked</span>
                    : <span className="badge bg-orange-100 text-orange-700">Pending</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
