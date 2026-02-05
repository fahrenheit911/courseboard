import React, { useState, useEffect, type ReactElement } from 'react';
import { type CourseData } from '../types/database';
import TimePicker from './TimePicker';

interface CourseFormProps {
  initialData?: CourseData;
  onSubmit: (data: Partial<CourseData>) => Promise<{ error: string | null }>;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
}

function CourseForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
}: CourseFormProps): ReactElement {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [startTime, setStartTime] = useState(
    initialData?.start_time || '12:00',
  );
  const [duration] = useState(initialData?.duration_minutes || 45);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStartTime(initialData.start_time);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setError('Title and description cannot be empty or contain only spaces.');
      return;
    }

    const { error: submitError } = await onSubmit({
      title: trimmedTitle,
      description: trimmedDescription,
      start_time: startTime,
      duration_minutes: duration,
    });
    if (submitError) {
      setError(submitError);
    }
  };

  return (
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
          disabled={!!initialData}
          maxLength={100}
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
          maxLength={200}
        />
      </div>
      <div className="form-group">
        <label htmlFor="course-start">
          Start Time <span className="label-required-star">*</span>
        </label>
        <TimePicker
          id="course-start"
          value={startTime}
          onChange={setStartTime}
          disabled={isLoading}
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
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="button button--primary"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default CourseForm;
