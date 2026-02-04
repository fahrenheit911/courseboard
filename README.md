# CourseBoard

Web application for managing courses and students, built with React, TypeScript, and Vite.

## Technologies

- **React 19** — UI library
- **TypeScript** — type safety
- **Vite** — build tool and dev server
- **React Router DOM** — routing
- **Supabase** — backend (database and API)

## Installation

```bash
npm install
```

## Environment variables

Create `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

## Development

Start the dev server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── App.tsx              # Main component with navigation
├── pages/
│   ├── CoursesPage.tsx  # Courses management page
│   └── StudentsPage.tsx # Students list page
└── main.tsx             # Entry point
```

## Features

- **Courses** (`/courses`) — manage courses
- **Students** (`/students`) — student list

## Database Schema

The database consists of three tables:

### `students`
- `id` (uuid, primary key) — unique identifier
- `first_name` (text) — student's first name
- `last_name` (text) — student's last name
- `age` (integer) — age (must be greater than 0)
- `created_at` (timestamp) — creation date

### `courses`
- `id` (uuid, primary key) — unique identifier
- `title` (text, unique) — course title
- `start_time` (time) — start time
- `description` (text) — course description
- `duration_minutes` (integer) — duration in minutes (default: 45)
- `created_at` (timestamp) — creation date

### `course_students`
- `id` (uuid, primary key) — unique identifier
- `course_id` (uuid) — reference to course (cascade delete)
- `student_id` (uuid) — reference to student (cascade delete)
- `created_at` (timestamp) — creation date
- Unique constraint on `(course_id, student_id)` pair

All tables use Row Level Security (RLS) for access control.

## Version

0.0.0
