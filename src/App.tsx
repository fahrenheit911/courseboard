import { type ReactElement } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import CoursesPage from './pages/CoursesPage';
import StudentsPage from './pages/StudentsPage';
import './App.css';

function App(): ReactElement {
  return (
    <div className="app">
      <header className="app-header">
        <h1>courseboard</h1>
      </header>
      <main className="app-main">
        <div className="card-grid">
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `nav-card ${isActive ? 'nav-card--active' : ''}`
            }
          >
            <div className="nav-card__title">Courses</div>
            <div className="nav-card__subtitle">Manage courses</div>
          </NavLink>
          <NavLink
            to="/students"
            className={({ isActive }) =>
              `nav-card ${isActive ? 'nav-card--active' : ''}`
            }
          >
            <div className="nav-card__title">Students</div>
            <div className="nav-card__subtitle">Student list</div>
          </NavLink>
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
  );
}

export default App;
