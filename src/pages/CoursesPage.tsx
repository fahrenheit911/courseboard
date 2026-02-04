import { useEffect, useState } from 'react';
import { deleteCourse, getCourses, type CourseData } from '../lib/supabase';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import CreateButton from '../components/CreateButton';
import CreateCourseModal from '../components/CreateCourseModal';
import DeleteButton from '../components/DeleteButton';

function CoursesPage() {
  const [courses, setCourses] = useState<CourseData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<CourseData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  async function handleDeleteCourse(id: string): Promise<void> {
    const isDeleted = await deleteCourse(id);

    if (isDeleted) {
      setCourses((prev) =>
        prev ? prev.filter((course) => course.id !== id) : prev,
      );
    }
  }

  async function handleConfirmDeleteCourse(): Promise<void> {
    if (!courseToDelete) {
      return;
    }

    await handleDeleteCourse(courseToDelete.id);
    setCourseToDelete(null);
  }

  function handleCreateSuccess(newCourse: CourseData) {
    setCourses((prev) => (prev ? [newCourse, ...prev] : [newCourse]));
  }

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      const data = await getCourses();
      setCourses(data);
      setIsLoading(false);
    };

    fetchCourses();
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
          <li key={course.id} className="list-item">
            <div className="list-item__content">
              <div className="list-item__text">
                <span className="list-item__title">{course.title}</span>
                <span className="list-item__subtitle">
                  {course.start_time.slice(0, 5)}
                </span>
              </div>
              <DeleteButton
                onClick={() => setCourseToDelete(course)}
                ariaLabel="Delete course"
              />
            </div>
          </li>
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
            ? `Are you sure you want to delete the course "${courseToDelete.title}"?`
            : 'Are you sure you want to delete this course?'
        }
        onConfirm={handleConfirmDeleteCourse}
        onCancel={() => setCourseToDelete(null)}
      />

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}

export default CoursesPage;
