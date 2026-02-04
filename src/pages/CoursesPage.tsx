import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface CourseData {
  id: string
  title: string
  start_time: string
  description: string
  duration_minutes: number
  created_at: string
}

function CoursesPage() {
  const [courses, setCourses] = useState<CourseData[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('courses')
        .select('*')

      if (!error) {
        setCourses(data)
      }
      setIsLoading(false)
    }

    fetchCourses()
  }, [])

  return (
    <ul className="list">
      {courses?.map((course: CourseData) => (
        <li key={course.id} className="list-item">
          {course.title}
        </li>
      ))}
      {isLoading && <li className="list-item">Loading...</li>}
    </ul>
  )
}

export default CoursesPage
