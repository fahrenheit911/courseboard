export interface StudentData {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  created_at: string;
}

export interface CourseData {
  id: string;
  title: string;
  start_time: string;
  description: string;
  duration_minutes: number;
  created_at: string;
}

export interface CourseStudentData {
  id: string;
  course_id: string;
  student_id: string;
  created_at: string;
  student?: StudentData;
}

// Join query result types
export interface EnrolledStudentRow {
  student_id: string;
  students: StudentData;
}

export interface StudentScheduleRow {
  course_id: string;
  courses: CourseData;
}

export interface EnrollmentRow {
  course_id: string;
  students: StudentData;
}
