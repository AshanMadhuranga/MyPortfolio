
import { useEffect, useRef } from 'react'
import { Sparkles, X } from 'lucide-react'

type PortalSecretDialogProps = {
  open: boolean
  onClose: () => void
}

export function PortalSecretDialog({
  open,
  onClose,
}: PortalSecretDialogProps) {
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
      aria-labelledby="portal-secret-title"
      aria-describedby="portal-secret-description"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="portal-secret-content">
        <button
          type="button"
          className="portal-secret-close"
          aria-label="Close secret message"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="portal-secret-symbol">
          <Sparkles size={38} />
        </div>

        <p className="portal-secret-eyebrow">
          A HIDDEN DISCOVERY
        </p>

        <h2 id="portal-secret-title">
          The Portal Remembers
        </h2>

        <p id="portal-secret-description">
          Every world begins with a single line of code.
        </p>

        <p className="portal-secret-footer">
          You found a secret hidden between imagination
          and reality.
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
