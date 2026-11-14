import { useEffect, useRef } from 'react'
import { ArrowUpRight, Sparkles, X } from 'lucide-react'
export function UpcomingDialog({ destination, onClose }: { destination: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (destination) ref.current?.showModal(); else ref.current?.close() }, [destination])
  return <dialog ref={ref} className="upcoming-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="dialog-title">
    <button autoFocus className="dialog-close" onClick={onClose} aria-label="Close dialog"><X size={20} /></button><Sparkles size={30} />
    <span className="eyebrow">THE NEXT CHAPTER</span><h2 id="dialog-title">{destination} is on the horizon.</h2>
    <p>You’ve arrived at the beginning of my world. This destination is being built for a future chapter of the portfolio.</p>
    <button className="primary-button" onClick={onClose}>Back to the world <ArrowUpRight size={17} /></button>
  </dialog>
}
