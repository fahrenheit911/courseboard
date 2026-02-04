import type { ReactElement } from 'react';
import { X } from 'lucide-react';

interface DeleteButtonProps {
  onClick: () => void;
  ariaLabel: string;
}

function DeleteButton({ onClick, ariaLabel }: DeleteButtonProps): ReactElement {
  return (
    <button
      type="button"
      className="list-item__delete-button"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <X className="list-item__delete-icon" />
    </button>
  );
}

export default DeleteButton;
