import clsx from 'clsx'

const gradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-800',
  B: 'bg-blue-100 text-blue-800',
  C: 'bg-yellow-100 text-yellow-800',
  D: 'bg-orange-100 text-orange-800',
  E: 'bg-red-100 text-red-800',
  F: 'bg-gray-100 text-gray-800',
}

export default function GradeBadge({ grade }: { grade: string | null }) {
  if (!grade) return <span className="badge bg-gray-100 text-gray-500">—</span>
  return (
    <span className={clsx('badge', gradeColors[grade] ?? 'bg-gray-100 text-gray-800')}>
      {grade}
    </span>
  )
}
