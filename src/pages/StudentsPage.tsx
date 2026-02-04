import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface StudentData {
  id: string
  first_name: string
  last_name: string
  age: number
  created_at: string
}

function StudentsPage() {
  const [students, setStudents] = useState<StudentData[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)


  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('students')
        .select('*')

      if (!error) {
        setStudents(data)
      }
      setIsLoading(false)
    }

    fetchStudents()
  }, [])

  return (
    <ul className="list">
      {students?.map((student: StudentData) => (
        <li key={student.id} className="list-item">
          {student.first_name} {student.last_name}
        </li>
      ))}
      {isLoading && <li className="list-item">Loading...</li>}
    </ul>
  )
}

export default StudentsPage
