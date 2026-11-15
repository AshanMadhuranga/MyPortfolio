
import { useEffect, useRef } from 'react'
import { ProjectGallery } from './ProjectGallery'

import {
  Dumbbell,
  UtensilsCrossed,
  LayoutDashboard,
  Shirt,
  BrainCircuit,
  Smartphone,
  MapPinned,
  X,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'

import {
  projects,
  type ProjectId,
} from '../../config/projects'

// ======================================================
// PROJECT ICONS
// ======================================================

// Icons are linked to project IDs instead of array
// positions, so adding or rearranging projects is safe.

const projectIcons: Record<ProjectId, LucideIcon> = {
  'gym-management': Dumbbell,
  'food-ordering-web': UtensilsCrossed,
  ctms: LayoutDashboard,
  'ai-clothing-shop': Shirt,
  'ageios-ai': BrainCircuit,
  'food-ordering-mobile': Smartphone,
  landhub: MapPinned,
}

// ======================================================
// PROJECTS PANEL
// ======================================================

type ProjectsPanelProps = {
  visible: boolean
  onSelect: (id: ProjectId) => void
  onBack: () => void
}

export function ProjectsPanel({
  visible,
  onSelect,
  onBack,
}: ProjectsPanelProps) {
  return (
    <section
      className="projects-panel"
      aria-hidden={!visible}
      inert={!visible}
      aria-labelledby="projects-heading"
    >
      <div className="chapter-label">
        <span />
        CHAPTER FOUR / SELECTED WORK
      </div>

      <h1 id="projects-heading">
        Worlds I've Built
      </h1>

      <p className="skills-subtitle">
        From ideas to interactive experiences.
      </p>

      <p className="skills-description">
        Explore web applications, AI projects,
        and mobile experiences I've worked on,
        including a collaborative university
        project.
      </p>

      <div className="project-selectors">
        {projects.map(project => {
          const Icon = projectIcons[project.id]

          return (
            <button
              key={project.id}
              id={`project-control-${project.id}`}
              aria-haspopup="dialog"
              onClick={() => onSelect(project.id)}
            >
              <Icon size={18} />

              <span>
                <strong>
                  {project.title}
                </strong>

                <small>
                  {project.summary}
                </small>
              </span>

              <ArrowUpRight size={14} />
            </button>
          )
        })}
      </div>

      <button
        className="about-home"
        onClick={onBack}
      >
        Back to the Crystal Garden
      </button>
    </section>
  )
}
// ======================================================
// PROJECT DETAILS DIALOG
// ======================================================

type ProjectDialogProps = {
  selected: ProjectId | null
  onClose: () => void
}

export function ProjectDialog({
  selected,
  onClose,
}: ProjectDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  const project = projects.find(
    item => item.id === selected
  )

  useEffect(() => {
    const dialog = ref.current

    if (!selected) {
      if (dialog?.open) {
        dialog.close()
      }
      return
    }

    const previous =
      document.activeElement as HTMLElement | null

    const overflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    if (dialog && !dialog.open) {
      dialog.showModal()
    }

    return () => {
      document.documentElement.style.overflow = overflow
      if (dialog?.open) {
        dialog.close()
      }

      if (
        previous?.isConnected &&
        previous !== document.body &&
        previous.tagName !== 'CANVAS' &&
        !previous.closest('dialog')
      ) {
        previous.focus({ preventScroll: true })
      } else {
        document
          .getElementById(
            `project-control-${selected}`
          )
          ?.focus({ preventScroll: true })
      }
    }
  }, [selected])

  const links = project
    ? [
        { label: 'GitHub', url: project.github },
        { label: 'Live demo', url: project.demo },
        {
          label: 'Documentation',
          url: project.documentation,
        },
      ].filter(link =>
        /^https?:\/\//i.test(link.url)
      )
    : []

  return (
    <dialog
      ref={ref}
      className="upcoming-dialog project-dialog" data-project={selected}
      aria-labelledby="project-title"
      aria-describedby="project-description"
      onCancel={onClose}
      onKeyDown={event => {
        if (event.key !== 'Escape') return
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }}
      onClick={event => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <button
        autoFocus
        className="dialog-close"
        aria-label="Close project details"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      <span className="eyebrow">
        {project?.category}
      </span>

      <h2 id="project-title">
        {project?.title}
      </h2>

      <p id="project-description">
        {project?.description}
      </p>

      <h3>Technologies & methods</h3>

      <ul className="skill-technologies">
        {project?.technologies.map(technology => (
          <li key={technology}>
            {technology}
          </li>
        ))}
      </ul>

      {project && <ProjectGallery key={project.id} project={project} />}

      <h3>Key features</h3>

      <ul className="project-features">
        {project?.features.map(feature => (
          <li key={feature}>
            {feature}
          </li>
        ))}
      </ul>

      <h3>
        {project?.id === 'landhub' ? 'Project context' : 'My contribution'}
      </h3>

      <p>{project?.contribution}</p>

      <h3>Status</h3>

      <p>{project?.status}</p>


      {links.length > 0 && (
        <div className="project-links">
          {links.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
      )}

      <button
        className="primary-button"
        onClick={onClose}
      >
        Return to the islands
      </button>
    </dialog>
  )
}
