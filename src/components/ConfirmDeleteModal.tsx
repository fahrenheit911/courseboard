import type { ReactElement } from 'react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps): ReactElement | null {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onCancel} />
      <div className="modal__content" role="dialog" aria-modal="true" aria-label={title}>
        <h2 className="modal__title">{title}</h2>
        <p className="modal__description">{description}</p>
        <div className="modal__actions">
          <button
            type="button"
            className="modal__button modal__button--secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="modal__button modal__button--danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal

