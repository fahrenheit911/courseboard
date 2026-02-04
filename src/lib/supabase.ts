import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

export interface StudentData {
  id: string
  first_name: string
  last_name: string
  age: number
  created_at: string
}

export interface CourseData {
  id: string
  title: string
  start_time: string
  description: string
  duration_minutes: number
  created_at: string
}

export async function getStudents(): Promise<StudentData[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')

  if (error || !data) {
    console.error('Failed to fetch students:', error)
    return []
  }

  return data
}

export async function deleteStudent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete student:', error)
    return false
  }

  return true
}

export async function getCourses(): Promise<CourseData[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')

  if (error || !data) {
    console.error('Failed to fetch courses:', error)
    return []
  }

  return data
}

export async function deleteCourse(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete course:', error)
    return false
  }

  return true
}
