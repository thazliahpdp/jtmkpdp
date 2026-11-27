import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, PenLine, BarChart3, GraduationCap, ClipboardList } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/',          label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students',  label: 'Students',  icon: Users },
  { to: '/questions', label: 'Questions', icon: ClipboardList },
  { to: '/scripts',   label: 'Scripts',   icon: FileText },
  { to: '/marking',   label: 'Marking',   icon: PenLine },
  { to: '/reports',   label: 'Reports',   icon: BarChart3 },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-300" />
          <div>
            <p className="font-bold text-sm leading-tight">DFK50083</p>
            <p className="text-xs text-blue-300 leading-tight">Python Programming</p>
            <p className="text-xs text-blue-400 leading-tight">Final Assessment</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer label */}
      <div className="px-5 py-4 border-t border-blue-800">
        <p className="text-xs text-blue-400">Session Nov 2026</p>
        <p className="text-xs text-blue-500 mt-0.5">Demo / Static Mode</p>
      </div>
    </aside>
  )
}
