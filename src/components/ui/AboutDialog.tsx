import { useEffect, useRef } from 'react'
import { X, Sparkles } from 'lucide-react'
import { portfolio, type AboutObject } from '../../config/portfolio'

export function AboutDialog({ object, onClose }: { object: AboutObject | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!object) { dialog.current?.close(); return }
    const previous = document.activeElement as HTMLElement | null
    const element = dialog.current
    element?.showModal()
    return () => {
      element?.close()
      if (previous?.isConnected && previous !== document.body && previous.tagName !== 'CANVAS') previous.focus()
      else document.getElementById(`explore-${object}`)?.focus()
    }
  }, [object])
  const area = portfolio.about.areas.find(item => item.id === object)
  return <dialog ref={dialog} className="upcoming-dialog about-dialog" aria-labelledby="about-dialog-title" aria-describedby="about-dialog-description"
    onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <button autoFocus className="dialog-close" onClick={onClose} aria-label="Close detail"><X size={20} /></button>
    <Sparkles size={26} /><span className="eyebrow">A NOTE FROM THE SANCTUARY</span>
    <h2 id="about-dialog-title">{area?.dialogTitle}</h2><p id="about-dialog-description">{area?.detail}</p>
    <ul>{area?.items.map(item => <li key={item}>{item}</li>)}</ul>
    <button className="primary-button" onClick={onClose}>Return to the cabin</button>
  </dialog>
}
