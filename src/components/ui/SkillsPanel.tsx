import { useEffect, useRef } from 'react'
import { Gem, X, ArrowUpRight } from 'lucide-react'
import { portfolio, type SkillCategoryId } from '../../config/portfolio'
export function SkillsPanel({ visible, onSelect, onBack }: { visible: boolean; onSelect: (id: SkillCategoryId) => void; onBack: () => void }) {
  return <section className="skills-panel" aria-labelledby="skills-heading" aria-hidden={!visible} inert={!visible}>
    <div className="chapter-label"><span /> CHAPTER THREE / MY ABILITIES</div>
    <h1 id="skills-heading">{portfolio.skills.heading}</h1>
    <p className="skills-subtitle">{portfolio.skills.subtitle}</p>
    <p className="skills-description">{portfolio.skills.introduction}</p>
    <p className="skills-hint"><Gem size={14} /> Select a crystal to explore my skills.</p>
    <div className="skill-categories">{portfolio.skills.categories.map((category, i) => <button key={category.id} id={`skill-control-${category.id}`} onClick={() => onSelect(category.id)} aria-haspopup="dialog"><span className="skill-index">0{i + 1}</span><span>{category.short}</span><ArrowUpRight size={14} /></button>)}</div>
    <button className="about-home" onClick={onBack}>Back to the developer cabin</button>
  </section>
}
export function SkillsDialog({ selected, onClose }: { selected: SkillCategoryId | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const category = portfolio.skills.categories.find(item => item.id === selected)
  useEffect(() => {
    const dialog = ref.current
    if (!selected) { dialog?.close(); return }
    const previous = document.activeElement as HTMLElement | null
    dialog?.showModal()
    return () => {
      dialog?.close()
      if (previous?.isConnected && previous !== document.body && previous.tagName !== 'CANVAS') previous.focus()
      else document.getElementById(`skill-control-${selected}`)?.focus()
    }
  }, [selected])
  return <dialog ref={ref} className="upcoming-dialog skills-dialog" aria-labelledby="skill-dialog-title" aria-describedby="skill-dialog-description" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
    <button autoFocus className="dialog-close" aria-label="Close skills detail" onClick={onClose}><X size={20} /></button>
    <Gem size={26} /><span className="eyebrow">THE CRYSTAL CODEX</span>
    <h2 id="skill-dialog-title">{category?.title}</h2><p id="skill-dialog-description">{category?.description}</p>
    <ul className="skill-technologies">{category?.technologies.map(technology => <li key={technology.name}><strong>{technology.name}</strong>{technology.status !== 'Not specified' && <small>{technology.status}</small>}</li>)}</ul>
    {category?.technologies.every(item => item.status === 'Not specified') && <p className="skill-status-note">Technologies of interest; proficiency levels are not specified.</p>}
    <button className="primary-button" onClick={onClose}>Return to the garden</button>
  </dialog>
}
