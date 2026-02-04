import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { deleteCourse, getCourses, type CourseData } from '../lib/supabase'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

function CoursesPage() {
  const [courses, setCourses] = useState<CourseData[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [courseToDelete, setCourseToDelete] = useState<CourseData | null>(null)

  async function handleDeleteCourse(id: string): Promise<void> {
    const isDeleted = await deleteCourse(id)

    if (isDeleted) {
      setCourses((prev) =>
        prev ? prev.filter((course) => course.id !== id) : prev
      )
    }
  }

  async function handleConfirmDeleteCourse(): Promise<void> {
    if (!courseToDelete) {
      return
    }

    await handleDeleteCourse(courseToDelete.id)
    setCourseToDelete(null)
  }

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      const data = await getCourses()
      setCourses(data)
      setIsLoading(false)
    }

    fetchCourses()
  }, [])

  return (
    <>
      <ul className="list">
        {courses?.map((course: CourseData) => (
          <li key={course.id} className="list-item">
            <div className="list-item__content">
              <span className="list-item__title">{course.title}</span>
              <button
                type="button"
                className="list-item__delete-button"
                onClick={() => setCourseToDelete(course)}
                aria-label="Delete course"
              >
                <X className="list-item__delete-icon" />
              </button>
            </div>
          </li>
        ))}
        {isLoading && <li className="list-item">Loading...</li>}
      </ul>

      <ConfirmDeleteModal
        isOpen={courseToDelete !== null}
        title="Delete course"
        description={
          courseToDelete
            ? `Are you sure you want to delete the course "${courseToDelete.title}"?`
            : 'Are you sure you want to delete this course?'
        }
        onConfirm={handleConfirmDeleteCourse}
        onCancel={() => setCourseToDelete(null)}
      />
    </>
  )
}

export default CoursesPage
