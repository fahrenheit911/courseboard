import { ChevronRight } from 'lucide-react';
import { type ReactElement } from 'react';
import { type CourseData, type StudentData } from '../types/database';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';

interface CourseCardProps {
  course: CourseData;
  enrolledStudents: StudentData[];
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onDelete: (course: CourseData) => void;
  onEdit: (course: CourseData) => void;
  onEnroll: (course: CourseData) => void;
  onUnenroll: (courseId: string, student: StudentData) => void;
}

function CourseCard({
  course,
  enrolledStudents,
  isExpanded,
  onToggleExpand,
  onDelete,
  onEdit,
  onEnroll,
  onUnenroll,
}: CourseCardProps): ReactElement {
  return (
    <li className="list-item">
      <div
        className="list-item__content list-item__content--clickable"
        onClick={() => onToggleExpand(course.id)}
      >
        <div className="list-item__text">
          <div className="list-item__title-wrapper">
            <ChevronRight
              className={`list-item__chevron ${isExpanded ? 'list-item__chevron--expanded' : ''}`}
              size={16}
              strokeWidth={2.5}
            />
            <span className="list-item__title">{course.title}</span>
          </div>
        </div>
        <div className="list-item__actions">
          <span className="student-count">
            {enrolledStudents?.length || 0} students
          </span>
          <DeleteButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDelete(course);
            }}
            ariaLabel="Delete course"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="list-item__details">
          <div className="course-info">
            <div className="course-info__header">
              <p className="course-info__description">{course.description}</p>
              <EditButton onClick={() => onEdit(course)} />
            </div>
            <div className="course-info__meta">
              <span className="course-info__tag">
                Time: {course.start_time.slice(0, 5)}
              </span>
              <span className="course-info__tag">
                Duration: {course.duration_minutes} min
              </span>
            </div>
          </div>

          <div className="enrolled-header">
            <h4>Students</h4>
            <button
              type="button"
              className="button button--ghost button--xs"
              onClick={() => onEnroll(course)}
            >
              + Enroll
            </button>
          </div>

          <ul className="enrolled-students">
            {enrolledStudents?.length > 0 ? (
              enrolledStudents.map((student) => (
                <li key={student.id} className="enrolled-student">
                  <span className="enrolled-student__name">
                    {student.first_name} {student.last_name}
                  </span>
                  <DeleteButton
                    onClick={() => onUnenroll(course.id, student)}
                    ariaLabel="Unenroll student"
                  />
                </li>
              ))
            ) : (
              <li className="enrolled-student enrolled-student--empty">
                No students enrolled.
              </li>
            )}
          </ul>
        </div>
      )}
    </li>
  );
}

export default CourseCard;
