import { useState, type ReactElement } from 'react';
import { createStudent, updateStudent } from '../lib/supabase';
import { type StudentData } from '../types/database';
import StudentForm from './StudentForm';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (student: StudentData) => void;
  student?: StudentData;
}

function StudentModal({
  isOpen,
  onClose,
  onSuccess,
  student,
}: StudentModalProps): ReactElement | null {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!student;

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(formData: Partial<StudentData>) {
    setIsLoading(true);
    try {
      if (isEditMode && student) {
        const { data: updatedStudent, error } = await updateStudent(
          student.id,
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            age: formData.age,
          },
        );

        if (error) return { error };
        if (updatedStudent) {
          onSuccess(updatedStudent);
          onClose();
          return { error: null };
        }
      } else {
        const { data: newStudent, error } = await createStudent({
          first_name: formData.first_name!,
          last_name: formData.last_name!,
          age: formData.age!,
        });

        if (error) return { error };
        if (newStudent) {
          onSuccess(newStudent);
          onClose();
          return { error: null };
        }
      }
      return { error: 'Unknown error' };
    } catch (err) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} student:`,
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
        aria-label={`${isEditMode ? 'Edit' : 'Create'} Student`}
      >
        <h2 className="modal__title">
          {isEditMode ? 'Edit Student' : 'Create Student'}
        </h2>
        <StudentForm
          initialData={student}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          submitLabel={isEditMode ? 'Save Changes' : 'Create Student'}
        />
      </div>
    </div>
  );
}

export default StudentModal;
