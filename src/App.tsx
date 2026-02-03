import { type ReactElement } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import CoursesPage from './pages/CoursesPage'
import StudentsPage from './pages/StudentsPage'
import './App.css'

function App(): ReactElement {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isCourses = pathname === '/courses'
  const isStudents = pathname === '/students'

  return (
    <div className="app">
      <header className="app-header">
        <h1>courseboard</h1>
      </header>
      <main className="app-main">
        <div className="card-grid">
          <button
            type="button"
            className={`nav-card ${isCourses ? 'nav-card--active' : ''}`}
            onClick={() => navigate('/courses')}
          >
            <div className="nav-card__title">Courses</div>
            <div className="nav-card__subtitle">Manage courses</div>
          </button>
          <button
            type="button"
            className={`nav-card ${isStudents ? 'nav-card--active' : ''}`}
            onClick={() => navigate('/students')}
          >
            <div className="nav-card__title">Students</div>
            <div className="nav-card__subtitle">Student list</div>
          </button>
        </div>

        <div className="tab-content">
          <Routes>
            <Route path="/" element={<Navigate to="/courses" />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/students" element={<StudentsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
