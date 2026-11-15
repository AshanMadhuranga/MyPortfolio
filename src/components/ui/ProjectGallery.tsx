import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, Expand, ImageOff, Layers, X } from 'lucide-react'
import type { Project, ProjectImage } from '../../config/projects'
import { getNextGalleryIndex } from '../../utils/projectGallery'

function GalleryImage({ image, phone = false }: { image: ProjectImage; phone?: boolean }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  return (
    <div
      className={`showcase-media ${(image.portrait ?? phone) ? 'showcase-phone' : ''}`}
      aria-busy={status === 'loading'}
    >
      {status === 'loading' && <span className="showcase-loading" role="status">Loading image...</span>}
      {status === 'error' ? (
        <div className="showcase-fallback" role="status">
          <ImageOff size={30} />
          <strong>Image unavailable</strong>
          <span>You can still explore the other images and project details.</span>
        </div>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          decoding="async"
          className={status === 'ready' ? 'is-ready' : ''}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
        />
      )}
    </div>
  )
}

function GalleryThumbnail({
  image,
  position,
  active,
  onSelect,
}: {
  image: ProjectImage
  position: number
  active: boolean
  onSelect: () => void
}) {
  const [failed, setFailed] = useState(false)

  return (
    <button
      type="button"
      aria-label={`Show image ${position + 1}: ${image.alt}`}
      aria-pressed={active}
      onClick={onSelect}
    >
      <span className="showcase-thumbnail-preview">
        {failed ? (
          <ImageOff size={18} aria-hidden="true" />
        ) : (
          <img
            src={image.thumbnail || image.src}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        )}
      </span>
      <span className="showcase-thumbnail-index">{String(position + 1).padStart(2, '0')}</span>
    </button>
  )
}

export function ProjectGallery({ project }: { project: Project }) {
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const expand = useRef<HTMLButtonElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const images = project.gallery
  const active = images[index]
  const isMobileProject = project.id === 'food-ordering-mobile'
  const move = (direction: number) => {
    setIndex(current => getNextGalleryIndex(current, direction, images.length))
  }

  const handleGalleryKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (images.length < 2 || event.target instanceof HTMLElement &&
      (event.target.isContentEditable || event.target.matches('input, textarea, select'))) return
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    event.stopPropagation()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  }

  const handleLightboxKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    event.stopPropagation()
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    if (images.length > 1) move(event.key === 'ArrowLeft' ? -1 : 1)
  }

  useEffect(() => {
    const button = strip.current?.children[index] as HTMLElement | undefined
    if (button && strip.current) strip.current.scrollLeft = button.offsetLeft - strip.current.offsetLeft - strip.current.clientWidth / 2 + button.clientWidth / 2
  }, [index])

  useEffect(() => {
    if (!expanded) return
    const node = dialog.current
    const focusTarget = returnFocus.current
    if (node && !node.open) node.showModal()
    return () => {
      if (node?.open) node.close()
      if (focusTarget?.isConnected) focusTarget.focus({ preventScroll: true })
    }
  }, [expanded])

  const navigation = <>
    <button type="button" aria-label="Previous image" onClick={() => move(-1)}><ChevronLeft size={20} /></button>
    <span aria-live="polite" aria-atomic="true">{index + 1} / {images.length}</span>
    <button type="button" aria-label="Next image" onClick={() => move(1)}><ChevronRight size={20} /></button>
  </>

  return (
    <section
      className="project-showcase"
      aria-label={`${project.title} gallery`}
      onKeyDown={handleGalleryKeyDown}
    >
      <div className="showcase-browser-bar">
        <span><i /><i /><i /></span>
        <span>PROJECT SHOWCASE</span>
        <Layers size={15} />
      </div>
      <div className={`showcase-stage ${active && (active.portrait ?? isMobileProject) ? 'showcase-stage-portrait' : ''}`}>
        {active ? (
          <GalleryImage key={active.src} image={active} phone={isMobileProject} />
        ) : (
          <div className="showcase-fallback showcase-empty">
            <Layers size={38} />
            <span>BEHIND THE BUILD</span>
            <strong>{project.title}</strong>
            <p>Project screenshots are coming soon.</p>
            <small>{project.technologies.join(' · ') || project.category}</small>
          </div>
        )}
        {active && (
          <button
            ref={expand}
            type="button"
            className="showcase-expand"
            aria-label="Expand project image"
            onClick={event => {
              returnFocus.current = event.currentTarget
              setExpanded(true)
            }}
          >
            <Expand size={18} /><span>Expand</span>
          </button>
        )}
      </div>
      {active && (
        <>
          <div className="showcase-caption">
            <p>{active.concept && <strong>Concept artwork · </strong>}{active.caption || active.alt}</p>
            {images.length > 1 && <div className="showcase-navigation">{navigation}</div>}
          </div>
          {images.length > 1 && (
            <div ref={strip} className="showcase-thumbnails" aria-label="Choose an image">
              {images.map((image, position) => (
                <GalleryThumbnail
                  key={`${image.src}-${position}`}
                  image={image}
                  position={position}
                  active={position === index}
                  onSelect={() => setIndex(position)}
                />
              ))}
            </div>
          )}
          {expanded && (
            <dialog
              ref={dialog}
              className="showcase-lightbox"
              aria-label={`${project.title} image viewer`}
              onKeyDown={handleLightboxKeyDown}
              onCancel={event => {
                event.preventDefault()
                event.stopPropagation()
                setExpanded(false)
              }}
              onClick={event => event.stopPropagation()}
            >
              <header>
                <strong>{project.title}</strong>
                <button type="button" autoFocus aria-label="Close image viewer" onClick={() => setExpanded(false)}>
                  <X size={22} />
                </button>
              </header>
              <div className="showcase-lightbox-image">
                <GalleryImage key={active.src} image={active} phone={isMobileProject} />
              </div>
              <footer>
                <p>{active.concept && 'Concept artwork · '}{active.caption || active.alt}</p>
                {images.length > 1 && <div className="showcase-navigation">{navigation}</div>}
              </footer>
            </dialog>
          )}
        </>
      )}
    </section>
  )
}
