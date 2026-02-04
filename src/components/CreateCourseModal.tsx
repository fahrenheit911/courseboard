import React, { useState, useEffect, type ReactElement } from 'react';
import { createCourse, type CourseData } from '../lib/supabase';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: CourseData) => void;
}

function CreateCourseModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCourseModalProps): ReactElement | null {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setStartTime('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: newCourse, error: createError } = await createCourse({
        title,
        description,
        start_time: startTime,
        duration_minutes: duration,
      });

      if (createError) {
        setError(createError);
        return;
      }

      if (newCourse) {
        onSuccess(newCourse);
        onClose();
      }
    } catch (err) {
      console.error('Error creating course:', err);
      setError('An unexpected error occurred.');
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
        aria-label="Create Course"
      >
        <h2 className="modal__title">Create Course</h2>
        <form onSubmit={handleSubmit} className="form">
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="course-title">
              Title <span className="label-required-star">*</span>
            </label>
            <input
              id="course-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="course-desc">
              Description <span className="label-required-star">*</span>
            </label>
            <input
              id="course-desc"
              type="text"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="course-start">
              Start Time <span className="label-required-star">*</span>
            </label>
            <input
              id="course-start"
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="course-duration">Duration (minutes)</label>
            <input
              id="course-duration"
              type="number"
              className="form-input"
              value={duration}
              disabled
            />
          </div>
          <div className="modal__actions">
            <button
              type="button"
              className="modal__button modal__button--secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button--primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourseModal;
