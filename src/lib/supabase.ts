import { createClient } from '@supabase/supabase-js';
import {
  type StudentData,
  type CourseData,
  type CourseStudentData,
  type EnrolledStudentRow,
  type StudentScheduleRow,
  type EnrollmentRow,
} from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type { StudentData, CourseData, CourseStudentData };

export async function getStudents(): Promise<StudentData[]> {
  const { data, error } = await supabase.from('students').select('*');

  if (error || !data) {
    console.error('Failed to fetch students:', error);
    return [];
  }

  return data;
}

export async function deleteStudent(id: string): Promise<boolean> {
  const { error } = await supabase.from('students').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete student:', error);
    return false;
  }

  return true;
}

export async function getCourses(): Promise<CourseData[]> {
  const { data, error } = await supabase.from('courses').select('*');

  if (error || !data) {
    console.error('Failed to fetch courses:', error);
    return [];
  }

  return data;
}

export async function deleteCourse(id: string): Promise<boolean> {
  const { error } = await supabase.from('courses').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete course:', error);
    return false;
  }

  return true;
}

export async function createStudent(
  student: Omit<StudentData, 'id' | 'created_at'>,
): Promise<{ data: StudentData | null; error: string | null }> {
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single();

  if (error) {
    console.error('Failed to create student:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function createCourse(
  course: Omit<CourseData, 'id' | 'created_at'>,
): Promise<{ data: CourseData | null; error: string | null }> {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { data: null, error: 'A course with this title already exists.' };
    }
    console.error('Failed to create course:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateCourse(
  id: string,
  course: Partial<Omit<CourseData, 'id' | 'created_at'>>,
): Promise<{ data: CourseData | null; error: string | null }> {
  const { data, error } = await supabase
    .from('courses')
    .update(course)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update course:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateStudent(
  id: string,
  student: Partial<Omit<StudentData, 'id' | 'created_at'>>,
): Promise<{ data: StudentData | null; error: string | null }> {
  const { data, error } = await supabase
    .from('students')
    .update(student)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update student:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getEnrolledStudents(
  courseId: string,
): Promise<StudentData[]> {
  const { data, error } = await supabase
    .from('course_students')
    .select('student_id, students (*)')
    .eq('course_id', courseId);

  if (error || !data) {
    console.error('Failed to fetch enrolled students:', error);
    return [];
  }

  return (data as unknown as EnrolledStudentRow[]).map((item) => item.students);
}

export async function enrollStudent(
  courseId: string,
  studentId: string,
): Promise<boolean> {
  const { error } = await supabase.from('course_students').insert({
    course_id: courseId,
    student_id: studentId,
  });

  if (error) {
    console.error('Failed to enroll student:', error);
    return false;
  }

  return true;
}

export async function unenrollStudent(
  courseId: string,
  studentId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from('course_students')
    .delete()
    .eq('course_id', courseId)
    .eq('student_id', studentId);

  if (error) {
    console.error('Failed to unenroll student:', error);
    return false;
  }

  return true;
}

export async function getStudentSchedule(
  studentId: string,
): Promise<CourseData[]> {
  const { data, error } = await supabase
    .from('course_students')
    .select('course_id, courses (*)')
    .eq('student_id', studentId);

  if (error || !data) {
    console.error('Failed to fetch student schedule:', error);
    return [];
  }

  return (data as unknown as StudentScheduleRow[]).map((item) => item.courses);
}

export async function getAllEnrollments(): Promise<
  Record<string, StudentData[]>
> {
  const { data, error } = await supabase
    .from('course_students')
    .select('course_id, students (*)');

  if (error || !data) {
    console.error('Failed to fetch all enrollments:', error);
    return {};
  }

  const enrollments: Record<string, StudentData[]> = {};
  (data as unknown as EnrollmentRow[]).forEach((item) => {
    if (!enrollments[item.course_id]) {
      enrollments[item.course_id] = [];
    }
    enrollments[item.course_id].push(item.students);
  });

  return enrollments;
}
