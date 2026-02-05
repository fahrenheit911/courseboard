import { type ReactElement } from 'react';
import { Pencil } from 'lucide-react';

interface EditButtonProps {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
}

function EditButton({
  onClick,
  label = 'Edit',
}: EditButtonProps): ReactElement {
  return (
    <button
      type="button"
      className="button button--ghost button--xs"
      onClick={onClick}
    >
      <Pencil size={12} />
      {label}
    </button>
  );
}

export default EditButton;
