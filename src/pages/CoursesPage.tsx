import { useEffect, useState } from 'react';
import {
  deleteCourse,
  getCourses,
  getEnrolledStudents,
  getAllEnrollments,
  unenrollStudent,
} from '../lib/supabase';
import { type CourseData, type StudentData } from '../types/database';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import CreateButton from '../components/CreateButton';
import CourseModal from '../components/CourseModal';
import CourseCard from '../components/CourseCard';
import EnrollStudentModal from '../components/EnrollStudentModal';
import { truncate } from '../utils/format';

function CoursesPage() {
  const [courses, setCourses] = useState<CourseData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<CourseData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [courseToEdit, setCourseToEdit] = useState<CourseData | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<
    Record<string, StudentData[]>
  >({});
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [courseToEnroll, setCourseToEnroll] = useState<CourseData | null>(null);
  const [studentToUnenroll, setStudentToUnenroll] = useState<{
    courseId: string;
    student: StudentData;
  } | null>(null);

  async function handleConfirmDeleteCourse(): Promise<void> {
    if (!courseToDelete) {
      return;
    }

    const isDeleted = await deleteCourse(courseToDelete.id);

    if (isDeleted) {
      setCourses((prev) =>
        prev ? prev.filter((course) => course.id !== courseToDelete.id) : prev,
      );
    }
    setCourseToDelete(null);
  }

  async function handleConfirmUnenroll(): Promise<void> {
    if (!studentToUnenroll) return;

    const { courseId, student } = studentToUnenroll;
    try {
      const success = await unenrollStudent(courseId, student.id);
      if (success) {
        await fetchEnrolledStudents(courseId);
      }
    } catch (error) {
      console.error('Failed to unenroll student:', error);
    } finally {
      setStudentToUnenroll(null);
    }
  }

  function handleCreateSuccess(newCourse: CourseData) {
    setCourses((prev) => (prev ? [newCourse, ...prev] : [newCourse]));
  }

  function handleUpdateSuccess(updatedCourse: CourseData) {
    setCourses((prev) =>
      prev
        ? prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
        : prev,
    );
  }

  async function fetchEnrolledStudents(courseId: string) {
    const data = await getEnrolledStudents(courseId);
    setEnrolledStudents((prev) => ({ ...prev, [courseId]: data }));
  }

  function toggleExpand(courseId: string) {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  }

  function handleUnenrollClick(courseId: string, student: StudentData) {
    setStudentToUnenroll({ courseId, student });
  }

  function handleEnrollSuccess() {
    if (courseToEnroll) {
      fetchEnrolledStudents(courseToEnroll.id);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [coursesData, enrollmentsData] = await Promise.all([
          getCourses(),
          getAllEnrollments(),
        ]);
        setCourses(coursesData);
        setEnrolledStudents(enrollmentsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="header-actions">
        <CreateButton
          label="Create Course"
          onClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      <ul className="list">
        {courses?.map((course: CourseData) => (
          <CourseCard
            key={course.id}
            course={course}
            enrolledStudents={enrolledStudents[course.id] || []}
            isExpanded={expandedCourseId === course.id}
            onToggleExpand={toggleExpand}
            onDelete={setCourseToDelete}
            onEdit={setCourseToEdit}
            onEnroll={setCourseToEnroll}
            onUnenroll={handleUnenrollClick}
          />
        ))}
        {isLoading && <li className="list-item">Loading...</li>}
        {courses && courses.length === 0 && !isLoading && (
          <li className="list-item">No courses found.</li>
        )}
      </ul>

      <ConfirmDeleteModal
        isOpen={courseToDelete !== null}
        title="Delete course"
        description={
          courseToDelete
            ? `Are you sure you want to delete the course "${truncate(courseToDelete.title, 60)}"?`
            : 'Are you sure you want to delete this course?'
        }
        onConfirm={handleConfirmDeleteCourse}
        onCancel={() => setCourseToDelete(null)}
      />

      <CourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {courseToEdit && (
        <CourseModal
          isOpen={courseToEdit !== null}
          onClose={() => setCourseToEdit(null)}
          onSuccess={handleUpdateSuccess}
          course={courseToEdit}
        />
      )}

      <ConfirmDeleteModal
        isOpen={studentToUnenroll !== null}
        title="Unenroll student"
        description={
          studentToUnenroll
            ? `Are you sure you want to unenroll ${truncate(`${studentToUnenroll.student.first_name} ${studentToUnenroll.student.last_name}`, 50)} from this course?`
            : 'Are you sure you want to unenroll this student?'
        }
        onConfirm={handleConfirmUnenroll}
        onCancel={() => setStudentToUnenroll(null)}
      />

      {courseToEnroll && (
        <EnrollStudentModal
          isOpen={courseToEnroll !== null}
          onClose={() => setCourseToEnroll(null)}
          onSuccess={handleEnrollSuccess}
          course={courseToEnroll}
          alreadyEnrolledIds={
            enrolledStudents[courseToEnroll.id]?.map((s) => s.id) || []
          }
        />
      )}
    </>
  );
}

export default CoursesPage;
