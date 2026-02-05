import { useState, useEffect, type ReactElement } from 'react';
import {
  getStudents,
  enrollStudent,
  getStudentSchedule,
} from '../lib/supabase';
import { type StudentData, type CourseData } from '../types/database';

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course: CourseData;
  alreadyEnrolledIds: string[];
}

function EnrollStudentModal({
  isOpen,
  onClose,
  onSuccess,
  course,
  alreadyEnrolledIds,
}: EnrollStudentModalProps): ReactElement | null {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      setSelectedStudentId('');
      setError(null);
    }
  }, [isOpen]);

  async function fetchStudents() {
    setIsLoading(true);
    try {
      const data = await getStudents();
      // Filter out students who are already enrolled in this course
      const availableStudents = data.filter(
        (student) => !alreadyEnrolledIds.includes(student.id),
      );
      setStudents(availableStudents);
      if (availableStudents.length > 0) {
        setSelectedStudentId(availableStudents[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError('Failed to load students.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudentId) return;

    setIsEnrolling(true);
    setError(null);

    try {
      // Helper function to convert "HH:mm" to minutes since midnight
      const timeToMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const newCourseStart = timeToMinutes(course.start_time);
      const newCourseEnd = newCourseStart + course.duration_minutes;

      // Check for time conflicts on the frontend
      const studentSchedule = await getStudentSchedule(selectedStudentId);
      const conflictingCourse = studentSchedule.find((c) => {
        const existingStart = timeToMinutes(c.start_time);
        const existingEnd = existingStart + c.duration_minutes;

        // Overlap logic: (StartA < EndB) and (StartB < EndA)
        return newCourseStart < existingEnd && existingStart < newCourseEnd;
      });

      if (conflictingCourse) {
        setError(
          `Conflict: This overlaps with "${conflictingCourse.title}" (${conflictingCourse.start_time.slice(0, 5)} - ${conflictingCourse.duration_minutes} min).`,
        );
        setIsEnrolling(false);
        return;
      }

      const success = await enrollStudent(course.id, selectedStudentId);

      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('Failed to enroll student. Please try again.');
      }
    } catch (err) {
      console.error('Error enrolling student:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsEnrolling(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div
        className="modal__content"
        role="dialog"
        aria-modal="true"
        aria-label="Enroll Student"
      >
        <h2 className="modal__title">Enroll Student in "{course.title}"</h2>
        <form onSubmit={handleSubmit} className="form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="student-select">
              Select Student <span className="label-required-star">*</span>
            </label>
            {isLoading ? (
              <div className="list-item">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="list-item">No students available to enroll.</div>
            ) : (
              <select
                id="student-select"
                className="form-input"
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setError(null);
                }}
                required
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className="modal__button modal__button--secondary"
              onClick={onClose}
              disabled={isEnrolling}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button--primary"
              disabled={isEnrolling || students.length === 0}
            >
              {isEnrolling ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnrollStudentModal;
