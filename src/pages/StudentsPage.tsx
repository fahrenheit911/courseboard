import { useEffect, useState } from 'react';
import { deleteStudent, getStudents } from '../lib/supabase';
import { type StudentData } from '../types/database';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import CreateButton from '../components/CreateButton';
import StudentModal from '../components/StudentModal';
import EditButton from '../components/EditButton';
import DeleteButton from '../components/DeleteButton';
import { truncate } from '../utils/format';

function StudentsPage() {
  const [students, setStudents] = useState<StudentData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentData | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentData | null>(null);

  async function handleDeleteStudent(id: string): Promise<void> {
    const isDeleted = await deleteStudent(id);

    if (isDeleted) {
      setStudents((prev) =>
        prev ? prev.filter((student) => student.id !== id) : prev,
      );
    }
  }

  async function handleConfirmDeleteStudent(): Promise<void> {
    if (!studentToDelete) {
      return;
    }

    await handleDeleteStudent(studentToDelete.id);
    setStudentToDelete(null);
  }

  function handleCreateSuccess(newStudent: StudentData) {
    setStudents((prev) => (prev ? [newStudent, ...prev] : [newStudent]));
  }

  function handleUpdateSuccess(updatedStudent: StudentData) {
    setStudents((prev) =>
      prev
        ? prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
        : prev,
    );
  }

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      const data = await getStudents();
      setStudents(data);
      setIsLoading(false);
    };

    fetchStudents();
  }, []);

  return (
    <>
      <div className="header-actions">
        <CreateButton
          label="Create Student"
          onClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      <ul className="list">
        {students?.map((student: StudentData) => (
          <li key={student.id} className="list-item">
            <div className="list-item__content">
              <div className="list-item__text">
                <span className="list-item__title">
                  {student.first_name} {student.last_name}
                </span>
                <span className="list-item__subtitle">Age: {student.age}</span>
              </div>
              <div className="list-item__actions">
                <EditButton onClick={() => setStudentToEdit(student)} />
                <DeleteButton
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setStudentToDelete(student);
                  }}
                  ariaLabel="Delete student"
                />
              </div>
            </div>
          </li>
        ))}
        {isLoading && <li className="list-item">Loading...</li>}
        {students && students.length === 0 && !isLoading && (
          <li className="list-item">No students found.</li>
        )}
      </ul>

      <ConfirmDeleteModal
        isOpen={studentToDelete !== null}
        title="Delete student"
        description={
          studentToDelete
            ? `Are you sure you want to delete ${truncate(`${studentToDelete.first_name} ${studentToDelete.last_name}`, 50)}?`
            : 'Are you sure you want to delete this student?'
        }
        onConfirm={handleConfirmDeleteStudent}
        onCancel={() => setStudentToDelete(null)}
      />

      <StudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {studentToEdit && (
        <StudentModal
          isOpen={studentToEdit !== null}
          onClose={() => setStudentToEdit(null)}
          onSuccess={handleUpdateSuccess}
          student={studentToEdit}
        />
      )}
    </>
  );
}

export default StudentsPage;
