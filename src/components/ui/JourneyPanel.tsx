import { useEffect, useRef } from 'react'
import { Sparkles, Code2, Layers, Brain, Network, Smartphone, Compass, X } from 'lucide-react'
import { journeyContent, milestones, type MilestoneId } from '../../config/journey'
import { projects } from '../../config/projects'

const icons = { spark: Sparkles, code: Code2, layers: Layers, brain: Brain, network: Network, mobile: Smartphone, compass: Compass }

export function JourneyPanel({ visible, onSelect, onBack }: { visible: boolean; onSelect: (id: MilestoneId) => void; onBack: () => void }) {
  return <section className="journey-panel" aria-hidden={!visible} inert={!visible} aria-labelledby="journey-heading">
    <div className="chapter-label"><span />CHAPTER FIVE / AN UNFOLDING STORY</div>
    <h1 id="journey-heading">{journeyContent.title}</h1>
    <p className="skills-subtitle">{journeyContent.subtitle}</p>
    <p className="skills-description">{journeyContent.introduction}</p>
    <div className="milestone-selectors">{milestones.map((m, i) => { const Icon = icons[m.icon]; return <button id={`milestone-control-${m.id}`} key={m.id} aria-haspopup="dialog" onClick={() => onSelect(m.id)}><Icon size={18} /><span><small>CHAPTER {i + 1}</small><strong>{m.title}</strong></span></button> })}</div>
    <p className="journey-note">A story in chapters, not a dated timeline.</p>
    <button className="about-home" onClick={onBack}>Back to the Project Islands</button>
  </section>
}

export function JourneyDialog({ selected, onClose }: { selected: MilestoneId | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const milestone = milestones.find(m => m.id === selected)
  useEffect(() => {
    const dialog = ref.current
    if (!selected) { dialog?.close(); return }
    const previous = document.activeElement as HTMLElement | null
    dialog?.showModal()
    return () => {
      dialog?.close()
      if (previous?.isConnected && previous !== document.body && previous.tagName !== 'CANVAS' && !previous.closest('[inert]')) previous.focus({ preventScroll: true })
      else document.getElementById(`milestone-control-${selected}`)?.focus({ preventScroll: true })
    }
  }, [selected])
  const related = milestone?.relatedProjects ?? (milestone?.relatedProject ? [milestone.relatedProject] : [])
  return <dialog ref={ref} className="upcoming-dialog journey-dialog" aria-labelledby="milestone-title" aria-describedby="milestone-description" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
    <button autoFocus className="dialog-close" aria-label="Close milestone details" onClick={onClose}><X size={20} /></button>
    <span className="eyebrow">{milestone?.category}</span>
    <h2 id="milestone-title">{milestone?.title}</h2>
    <p className="milestone-subtitle">{milestone?.subtitle}</p>
    {milestone?.date && <p>{milestone.date}</p>}
    <p id="milestone-description">{milestone?.description}</p>
    {!!milestone?.technologies.length && <><h3>{selected === 'ahead' ? 'Areas to explore' : 'Technologies & ideas'}</h3><ul className="skill-technologies">{milestone.technologies.map(t => <li key={t}>{t}</li>)}</ul></>}
    {!!related.length && <><h3>Connected projects</h3><ul className="journey-related">{related.map(id => <li key={id}>{projects.find(p => p.id === id)?.title}</li>)}</ul></>}
    <button className="primary-button" onClick={onClose}>Return to the path</button>
  </dialog>
}
