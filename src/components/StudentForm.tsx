import React, { useState, useEffect } from 'react';
import { type StudentData } from '../types/database';

interface StudentFormProps {
  initialData?: StudentData;
  onSubmit: (
    formData: Partial<StudentData>,
  ) => Promise<{ error: string | null }>;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
}

function StudentForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
}: StudentFormProps) {
  const [firstName, setFirstName] = useState(initialData?.first_name || '');
  const [lastName, setLastName] = useState(initialData?.last_name || '');
  const [age, setAge] = useState(initialData?.age || 20);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.first_name);
      setLastName(initialData.last_name);
      setAge(initialData.age);
    }
  }, [initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      setError('Name fields cannot be empty or contain only spaces.');
      return;
    }

    const result = await onSubmit({
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      age: age,
    });

    if (result.error) {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="form-error">{error}</div>}
      <div className="form-group">
        <label htmlFor="student-first-name">
          First Name <span className="label-required-star">*</span>
        </label>
        <input
          id="student-first-name"
          type="text"
          className="form-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          required
          maxLength={50}
        />
      </div>
      <div className="form-group">
        <label htmlFor="student-last-name">
          Last Name <span className="label-required-star">*</span>
        </label>
        <input
          id="student-last-name"
          type="text"
          className="form-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
          required
          maxLength={50}
        />
      </div>
      <div className="form-group">
        <label htmlFor="student-age">
          Age <span className="label-required-star">*</span>
        </label>
        <input
          id="student-age"
          type="number"
          className="form-input"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
          min="1"
          max="100"
          step="1"
          required
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

export default StudentForm;
