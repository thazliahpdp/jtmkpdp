import { dashboardStats } from '../data/dummy'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, FileCheck, Clock, TrendingUp, Award, AlertCircle } from 'lucide-react'

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e', B: '#3b82f6', C: '#eab308', D: '#f97316', E: '#ef4444', F: '#6b7280',
}

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: React.ElementType; color: string
}) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const stats = dashboardStats
  const gradeData = [...stats.grade_distribution].sort((a, b) => a.grade.localeCompare(b.grade))
  const totalScripts = stats.total_marked + stats.total_pending

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">DFK50083 — Final Assessment Overview · Session Nov 2026</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard label="Total Students"  value={stats.total_students}  icon={Users}         color="bg-blue-500" />
        <StatCard label="Scripts Marked"  value={stats.total_marked}    icon={FileCheck}     color="bg-green-500" />
        <StatCard label="Pending Marking" value={stats.total_pending}   icon={Clock}         color="bg-orange-500" />
        <StatCard label="Average Score"   value={stats.average_score ?? '—'} icon={TrendingUp} color="bg-purple-500" />
        <StatCard label="Highest Score"   value={stats.highest_score ?? '—'} icon={Award}     color="bg-indigo-500" />
        <StatCard label="Lowest Score"    value={stats.lowest_score  ?? '—'} icon={AlertCircle} color="bg-red-500" />
      </div>

      {/* Grade distribution */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={gradeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="grade" tick={{ fontSize: 13 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
            <Tooltip formatter={(v) => [`${v} students`, 'Count']} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {gradeData.map((entry) => (
                <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] ?? '#6b7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Marking progress */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Marking Progress</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: totalScripts > 0 ? `${(stats.total_marked / totalScripts) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 w-28 text-right">
            {stats.total_marked} / {totalScripts} marked
          </span>
        </div>
      </div>
    </div>
  )
}
