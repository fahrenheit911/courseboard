import type { ReactElement } from 'react';
import { Plus } from 'lucide-react';

interface CreateButtonProps {
  onClick: () => void;
  label: string;
}

function CreateButton({ onClick, label }: CreateButtonProps): ReactElement {
  return (
    <button type="button" className="button button--primary" onClick={onClick}>
      <Plus size={18} />
      {label}
    </button>
  );
}

export default CreateButton;
