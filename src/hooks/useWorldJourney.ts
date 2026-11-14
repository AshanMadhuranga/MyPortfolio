import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorldSection, WorldStage } from '../config/world'
import { gsap } from 'gsap'
import { journeyProgress, journeyStage } from '../utils/journey'

/** One scroll source for camera, URL, navigation and HTML. React updates only at stage boundaries. */
export function useWorldJourney(reduced: boolean) {
  const progress = useRef(0)
  const [stage, setStage] = useState<WorldStage>('home')
  const [active, setActive] = useState<WorldSection>('home')
  const [replay, setReplay] = useState(0)
  const initialized = useRef(false)
  const currentStage = useRef<WorldStage>('home')
  const currentSection = useRef<WorldSection>('home')
  const navigationTarget = useRef<WorldSection | null>(null)
  const playback = useRef<gsap.core.Timeline | null>(null)
  const navigate = useCallback((section: WorldSection, push = true) => {
    playback.current?.kill()
    navigationTarget.current = section
    const marker = document.getElementById(section)
    const top = section === 'home' ? 0 : (marker?.getBoundingClientRect().top ?? 0) + window.scrollY
    if (push && location.hash !== `#${section}`) history.pushState(null, '', `#${section}`)
    window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' })
  }, [reduced])
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const marker = document.getElementById('about')
      const distance = (marker?.getBoundingClientRect().top ?? innerHeight * 2) + scrollY
      const p = journeyProgress(scrollY, distance, 6)
      progress.current = p
      const next = journeyStage(p)
      if (currentStage.current !== next) { currentStage.current = next; setStage(next) }
      const section: WorldSection = p >= 5.5 ? 'contact' : p >= 4.5 ? 'terminal' : p >= 3.5 ? 'journey' : p >= 2.5 ? 'projects' : p >= 1.5 ? 'skills' : p >= .5 ? 'about' : 'home'
      if (currentSection.current !== section) { currentSection.current = section; setActive(section) }
      document.documentElement.style.setProperty('--world-progress', `${p / 6 * 100}%`)
      // Preserve the destination hash during a smooth navigation; synchronize at either endpoint.
      const reachedTarget = navigationTarget.current === 'home' ? p < .005 : navigationTarget.current === 'about' ? Math.abs(p - 1) < .005 : navigationTarget.current === 'skills' ? Math.abs(p - 2) < .005 : navigationTarget.current === 'projects' ? Math.abs(p - 3) < .005 : navigationTarget.current === 'journey' ? Math.abs(p - 4) < .005 : navigationTarget.current === 'terminal' ? Math.abs(p - 5) < .005 : navigationTarget.current === 'contact' ? p > 5.995 : true
      if ((p < .005 || Math.abs(p - 1) < .005 || Math.abs(p - 2) < .005 || Math.abs(p - 3) < .005 || Math.abs(p - 4) < .005 || Math.abs(p - 5) < .005 || p > 5.995) && reachedTarget) {
        navigationTarget.current = null
        const hash = p > 5.995 ? '#contact' : p > 4.995 ? '#terminal' : p > 3.995 ? '#journey' : p > 2.995 ? '#projects' : p > 1.995 ? '#skills' : p > .995 ? '#about' : '#home'
        if (location.hash !== hash) history.replaceState(null, '', hash)
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const restore = () => navigate(location.hash === '#contact' ? 'contact' : location.hash === '#terminal' ? 'terminal' : location.hash === '#journey' ? 'journey' : location.hash === '#projects' ? 'projects' : location.hash === '#skills' ? 'skills' : location.hash === '#about' ? 'about' : 'home', false)
    const first = requestAnimationFrame(() => {
      if (!initialized.current) {
        initialized.current = true
        const marker = document.getElementById(location.hash === '#contact' ? 'contact' : location.hash === '#terminal' ? 'terminal' : location.hash === '#journey' ? 'journey' : location.hash === '#projects' ? 'projects' : location.hash === '#skills' ? 'skills' : 'about')
        window.scrollTo({ top: (location.hash === '#contact' || location.hash === '#terminal' || location.hash === '#journey' || location.hash === '#about' || location.hash === '#skills' || location.hash === '#projects') ? (marker?.getBoundingClientRect().top ?? 0) + scrollY : 0, behavior: 'instant' })
      }
      schedule()
    })
    const interrupt = () => { playback.current?.kill(); navigationTarget.current = null }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', restore)
    window.addEventListener('popstate', restore)
    window.addEventListener('wheel', interrupt, { passive: true })
    window.addEventListener('touchstart', interrupt, { passive: true })
    window.addEventListener('keydown', interrupt)
    window.addEventListener('resize', interrupt)
    return () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(first)
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', restore); window.removeEventListener('popstate', restore)
      window.removeEventListener('wheel', interrupt); window.removeEventListener('touchstart', interrupt)
      window.removeEventListener('keydown', interrupt); window.removeEventListener('resize', interrupt)
      playback.current?.kill()
    }
  }, [navigate])
  const replayJourney = useCallback(() => {
    if (progress.current < .01) { setReplay(value => value + 1); return }
    playback.current?.kill()
    const marker = document.getElementById(progress.current > 5.5 ? 'contact' : progress.current > 4.5 ? 'terminal' : progress.current > 3.5 ? 'journey' : progress.current > 2.5 ? 'projects' : progress.current > 1.5 ? 'skills' : 'about')
    const end = (marker?.getBoundingClientRect().top ?? 0) + scrollY
    const position = { y: scrollY }
    playback.current = gsap.timeline({ onUpdate: () => window.scrollTo({ top: position.y, behavior: 'instant' }) })
      .to(position, { y: 0, duration: reduced ? 0 : 1.6, ease: 'power2.inOut' })
      .to(position, { y: end, duration: reduced ? 0 : 3.4, ease: 'power2.inOut' }, '+=.35')
  }, [reduced])
  return { progress, stage, active, navigate, replay, replayJourney }
}
