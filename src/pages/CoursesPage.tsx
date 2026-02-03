import { type ReactElement } from 'react'

const courses: { id: string; name: string }[] = []

function CoursesPage(): ReactElement {
  return (
    <ul className="list">
      {courses.map((course: { id: string; name: string }) => (
        <li key={course.id} className="list-item">
          {course.name}
        </li>
      ))}
    </ul>
  )
}

export default CoursesPage
