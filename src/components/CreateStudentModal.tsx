import React, { useState, useEffect, type ReactElement } from 'react';
import { createStudent, type StudentData } from '../lib/supabase';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (student: StudentData) => void;
}

function CreateStudentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateStudentModalProps): ReactElement | null {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setFirstName('');
      setLastName('');
      setAge(20);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: newStudent, error: createError } = await createStudent({
        first_name: firstName,
        last_name: lastName,
        age: age,
      });

      if (createError) {
        setError(createError);
        return;
      }

      if (newStudent) {
        onSuccess(newStudent);
        onClose();
      }
    } catch (err) {
      console.error('Error creating student:', err);
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
        aria-label="Create Student"
      >
        <h2 className="modal__title">Create Student</h2>
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
              required
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
              {isLoading ? 'Creating...' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStudentModal;
