# CourseBoard 🚀

CourseBoard is a modern, high-performance web application designed for educational institutions to manage courses and student enrollments efficiently. Built with a focus on speed, type safety, and a premium user experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

## ✨ Key Features

- 📚 **Course Management**: Full CRUD operations for courses, including unique titles, descriptions, and scheduling.
- 🎓 **Student Directory**: centralized database of students with age tracking and personal details.
- 🔗 **Smart Enrollment**: Intuitive system to link students with courses, ensuring organized lecture groups.
- ⚡ **Conflict Detection**: Built-in logic to prevent student scheduling overlaps, automatically checking course durations and start times.
- 🎨 **Premium UI/UX**:
  - Deep dark theme with glassmorphism elements.
  - Fully responsive grid-based layouts.
  - Custom-built Time Picker for precise scheduling.
  - BEM-based CSS architecture for maintainable and scalable styling.

## 🛠 Tech Stack

- **Frontend**: [React 19](https://react.dev/) — Latest features and optimization.
- **Language**: [TypeScript](https://www.typescriptlang.org/) — End-to-end type safety.
- **Build Tool**: [Vite](https://vitejs.dev/) — Hot Module Replacement (HMR) and ultra-fast builds.
- **Backend & Database**: [Supabase](https://supabase.com/) — PostgreSQL with Real-time capabilities and Row Level Security (RLS).
- **Icons**: [Lucide React](https://lucide.dev/) — Sharp, minimalist icon set.
- **Styling**: Vanilla CSS with **BEM (Block Element Modifier)** methodology for modular design.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase project

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/courseboard.git
   cd courseboard
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the project root based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```text
src/
├── components/     # Atomic and composite UI components
├── hooks/          # Custom React hooks
├── lib/            # External service configurations (Supabase)
├── pages/          # Full-page components and routing logic
├── styles/         # Global styles and BEM modules
├── types/          # TypeScript interfaces and types
└── utils/          # Helper functions and formatters
```

## 📊 Database Schema

The platform is powered by a relational PostgreSQL schema with the following core tables:

- **`students`**: Stores student profiles (`first_name`, `last_name`, `age`).
- **`courses`**: Manages academic offerings (`title`, `start_time`, `duration_minutes`, `description`).
- **`course_students`**: Junction table for many-to-many relationships, enforcing enrollment constraints.

## 🛡 Security

Data integrity and privacy are prioritized using Supabase **Row Level Security (RLS)**, ensuring that data access is restricted and validated at the database level.

---
