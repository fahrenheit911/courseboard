import { type ReactElement } from 'react'

const students: { id: string; name: string }[] = []

function StudentsPage(): ReactElement {
  return (
    <ul className="list">
      {students.map((student: { id: string; name: string }) => (
        <li key={student.id} className="list-item">
          {student.name}
        </li>
      ))}
    </ul>
  )
}

export default StudentsPage
