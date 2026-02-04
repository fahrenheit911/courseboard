import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { deleteStudent, getStudents, type StudentData } from '../lib/supabase'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

function StudentsPage() {
  const [students, setStudents] = useState<StudentData[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [studentToDelete, setStudentToDelete] = useState<StudentData | null>(null)

  async function handleDeleteStudent(id: string): Promise<void> {
    const isDeleted = await deleteStudent(id)

    if (isDeleted) {
      setStudents((prev) =>
        prev ? prev.filter((student) => student.id !== id) : prev
      )
    }
  }

  async function handleConfirmDeleteStudent(): Promise<void> {
    if (!studentToDelete) {
      return
    }

    await handleDeleteStudent(studentToDelete.id)
    setStudentToDelete(null)
  }


  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)
      const data = await getStudents()
      setStudents(data)
      setIsLoading(false)
    }

    fetchStudents()
  }, [])

  return (
    <>
      <ul className="list">
        {students?.map((student: StudentData) => (
          <li key={student.id} className="list-item">
            <div className="list-item__content">
              <span className="list-item__title">
                {student.first_name} {student.last_name}
              </span>
              <button
                type="button"
                className="list-item__delete-button"
                onClick={() => setStudentToDelete(student)}
                aria-label="Delete student"
              >
                <X className="list-item__delete-icon" />
              </button>
            </div>
          </li>
        ))}
        {isLoading && <li className="list-item">Loading...</li>}
      </ul>

      <ConfirmDeleteModal
        isOpen={studentToDelete !== null}
        title="Delete student"
        description={
          studentToDelete
            ? `Are you sure you want to delete ${studentToDelete.first_name} ${studentToDelete.last_name}?`
            : 'Are you sure you want to delete this student?'
        }
        onConfirm={handleConfirmDeleteStudent}
        onCancel={() => setStudentToDelete(null)}
      />
    </>
  )
}

export default StudentsPage
