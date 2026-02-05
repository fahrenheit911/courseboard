import { useState, type ReactElement } from 'react';
import { createCourse, updateCourse } from '../lib/supabase';
import { type CourseData } from '../types/database';
import CourseForm from './CourseForm';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: CourseData) => void;
  course?: CourseData; // Optional, if provided then it's Edit mode
}

function CourseModal({
  isOpen,
  onClose,
  onSuccess,
  course,
}: CourseModalProps): ReactElement | null {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!course;

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(formData: Partial<CourseData>) {
    setIsLoading(true);
    try {
      if (isEditMode && course) {
        const { data: updatedCourse, error } = await updateCourse(course.id, {
          description: formData.description,
          start_time: formData.start_time,
          duration_minutes: formData.duration_minutes,
        });

        if (error) return { error };
        if (updatedCourse) {
          onSuccess(updatedCourse);
          onClose();
          return { error: null };
        }
      } else {
        const { data: newCourse, error } = await createCourse({
          title: formData.title!,
          description: formData.description!,
          start_time: formData.start_time!,
          duration_minutes: formData.duration_minutes!,
        });

        if (error) return { error };
        if (newCourse) {
          onSuccess(newCourse);
          onClose();
          return { error: null };
        }
      }
      return { error: 'Unknown error' };
    } catch (err) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} course:`,
        err,
      );
      return { error: 'An unexpected error occurred.' };
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div
        className="modal__content"
        role="dialog"
        aria-modal="true"
        aria-label={`${isEditMode ? 'Edit' : 'Create'} Course`}
      >
        <h2 className="modal__title">
          {isEditMode ? 'Edit Course' : 'Create Course'}
        </h2>
        <CourseForm
          initialData={course}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          submitLabel={isEditMode ? 'Save Changes' : 'Create Course'}
        />
      </div>
    </div>
  );
}

export default CourseModal;
