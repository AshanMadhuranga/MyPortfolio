
import { useEffect, useRef } from 'react'
import { Gem, X } from 'lucide-react'

type CrystalSecretDialogProps = {
  open: boolean
  onClose: () => void
}

export function CrystalSecretDialog({
  open,
  onClose,
}: CrystalSecretDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="portal-secret-dialog"
      aria-labelledby="crystal-secret-title"
      aria-describedby="crystal-secret-description"
      onClose={onClose}
    >
      <div className="portal-secret-content">
        <button
          type="button"
          className="portal-secret-close"
          aria-label="Close crystal achievement"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="portal-secret-symbol">
          <Gem size={38} />
        </div>

        <p className="portal-secret-eyebrow">
          SECRET ACHIEVEMENT UNLOCKED
        </p>

        <h2 id="crystal-secret-title">
          Keeper of the Codex
        </h2>

        <p id="crystal-secret-description">
          The strongest magic is knowledge shared.
        </p>

        <p className="portal-secret-footer">
          You awakened the heart of the Crystal Garden.
          Keep exploring. There are always more secrets
          hidden in the code.
        </p>

        <button
          type="button"
          className="portal-secret-action"
          onClick={onClose}
        >
          Continue Exploring
        </button>
      </div>
    </dialog>
  )
}
