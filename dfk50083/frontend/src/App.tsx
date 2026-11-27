import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import ScriptsPage from './pages/ScriptsPage'
import MarkingPage from './pages/MarkingPage'
import QuestionsPage from './pages/QuestionsPage'
import ReportsPage from './pages/ReportsPage'

export default function App() {
  return (
    <BrowserRouter basename="/jtmkpdp">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="scripts" element={<ScriptsPage />} />
          <Route path="marking" element={<ScriptsPage />} />
          <Route path="marking/:scriptId" element={<MarkingPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
