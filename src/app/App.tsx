
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useState,
  type ReactNode,
} from 'react'
import { motion, MotionConfig } from 'motion/react'
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Compass,
  Sparkles,
  RotateCcw,
  Leaf,
} from 'lucide-react'

import { Navigation } from '../components/layout/Navigation'
import { MusicPlayer } from '../components/ui/MusicPlayer'
import { ContactPanel, ContactDialog } from '../components/ui/ContactPanel'
import { AboutPanel } from '../components/ui/AboutPanel'
import { SkillsPanel, SkillsDialog } from '../components/ui/SkillsPanel'
import { ProjectsPanel, ProjectDialog } from '../components/ui/ProjectsPanel'
import { TerminalPanel } from '../components/ui/TerminalPanel'
import { JourneyPanel, JourneyDialog } from '../components/ui/JourneyPanel'
import { AboutDialog } from '../components/ui/AboutDialog'
import { PortalSecretDialog } from '../components/ui/PortalSecretDialog'
import { CrystalSecretDialog } from '../components/ui/CrystalSecretDialog'

import type { MilestoneId } from '../config/journey'
import type { ProjectId } from '../config/projects'
import {
  portfolio,
  type AboutObject,
  type SkillCategoryId,
  type Destination,
} from '../config/portfolio'

import { useWorldJourney } from '../hooks/useWorldJourney'
import { useMediaQuery } from '../hooks/useMediaQuery'

import '../styles/portal-secret.css'

const WorldScene = lazy(() => import('../scenes/WorldScene'))

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onFailure()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function App() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const mobile = useMediaQuery('(max-width: 760px)')

  const [calm, setCalm] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  // Contact
  const [contactOpen, setContactOpen] = useState(false)
  const openContact = useCallback(() => setContactOpen(true), [])

  // About, Skills, Projects and Journey selections
  const [object, setObject] = useState<AboutObject | null>(null)
  const [skill, setSkill] = useState<SkillCategoryId | null>(null)
  const [project, setProject] = useState<ProjectId | null>(null)
  const [milestone, setMilestone] = useState<MilestoneId | null>(null)

  // Terminal
  const [terminalFocused, setTerminalFocused] = useState(false)
  const [secretPulse, setSecretPulse] = useState(0)

  const focusTerminal = useCallback(() => {
    document.getElementById('terminal-command')?.focus({
      preventScroll: true,
    })
  }, [])

  const revealSecret = useCallback(() => {
    setSecretPulse(value => value + 1)
  }, [])

  // Home Portal Easter Egg
  const [portalSecretOpen, setPortalSecretOpen] = useState(false)

  const revealPortalSecret = useCallback(() => {
    setPortalSecretOpen(true)
  }, [])

  // Skills Codex Core Easter Egg
  const [crystalSecretOpen, setCrystalSecretOpen] = useState(false)

  const revealCrystalSecret = useCallback(() => {
    setCrystalSecretOpen(true)
  }, [])

  // Journey and world lifecycle
  const journey = useWorldJourney(reduced || calm)

  const onReady = useCallback(() => setReady(true), [])

  const onFailure = useCallback(() => {
    setFailed(true)
    setReady(true)
  }, [])

  function navigate(name: Destination) {
    if (
      name === 'Home' ||
      name === 'About' ||
      name === 'Skills' ||
      name === 'Projects' ||
      name === 'Journey' ||
      name === 'Terminal' ||
      name === 'Contact'
    ) {
      journey.navigate(
        name === 'Home'
          ? 'home'
          : name === 'About'
            ? 'about'
            : name === 'Skills'
              ? 'skills'
              : name === 'Projects'
                ? 'projects'
                : name === 'Journey'
                  ? 'journey'
                  : name === 'Terminal'
                    ? 'terminal'
                    : 'contact'
      )
    }
  }

  return (
    <MotionConfig
      reducedMotion={reduced || calm ? 'always' : 'never'}
    >
      <main id="portfolio-world" className="connected-world">
        <div
          className="world-frame"
          id="home"
          data-stage={journey.stage}
        >
          <div
            className={`scene ${failed ? 'scene-fallback' : ''}`}
            aria-label="Interactive fantasy world: portal island, developer cabin, crystal garden, project islands, developer journey terminal observatory and final contact portal"
          >
            {!failed && (
              <SceneBoundary onFailure={onFailure}>
                <Suspense fallback={null}>
                  <WorldScene
                    reduced={reduced || calm}
                    mobile={mobile}
                    progress={journey.progress}
                    replay={journey.replay}
                    interactive={journey.stage === 'about'}
                    onExplore={setObject}
                    onPortalSecret={revealPortalSecret}
                    skillsInteractive={journey.stage === 'skills'}
                    selectedSkill={skill}
                    onSkill={setSkill}
                    onCoreSecret={revealCrystalSecret}
                    projectsInteractive={journey.stage === 'projects'}
                    selectedProject={project}
                    onProject={setProject}
                    journeyInteractive={journey.stage === 'journey'}
                    selectedMilestone={milestone}
                    onMilestone={setMilestone}
                    contactInteractive={journey.stage === 'contact'}
                    contactActivated={contactOpen}
                    onContact={openContact}
                    terminalInteractive={journey.stage === 'terminal'}
                    terminalFocused={terminalFocused}
                    secretPulse={secretPulse}
                    onTerminal={focusTerminal}
                    onReady={onReady}
                    onFailure={onFailure}
                  />
                </Suspense>
              </SceneBoundary>
            )}
          </div>

          <div className="scene-wash" />

          <Navigation
            onNavigate={navigate}
            active={journey.active}
          />

          {/* HOME */}
          <motion.section
            className="hero"
            aria-hidden={journey.stage !== 'home'}
            inert={journey.stage !== 'home'}
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: journey.stage === 'home' ? 1 : 0,
              y: journey.stage === 'home' ? 0 : -12,
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="chapter-label">
              <span /> A DEVELOPER. A DREAMER. A WORLD BUILDER.
            </div>

            <p className="greeting">
              Hi, I’m Ashan <span className="wave">👋</span>
            </p>

            <h1>
              Full Stack
              <br />
              <em>Developer.</em>
            </h1>

            <p className="hero-description">
              I build modern, scalable, and immersive digital
              experiences through creativity, code, and
              problem-solving.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => navigate('Projects')}
              >
                Explore My Work <ArrowUpRight size={17} />
              </button>

              <button
                className="secondary-button"
                onClick={() => navigate('About')}
              >
                About Me <span>↗</span>
              </button>
            </div>

            <div className="social-row">
              {portfolio.cv ? (
                <a href={portfolio.cv} download>
                  <Download size={15} /> Download CV
                </a>
              ) : (
                <button
                  disabled
                  title="A CV has not been added yet"
                >
                  <Download size={15} />
                  Download CV <small>soon</small>
                </button>
              )}

              <span className="divider" />

              {[
                {
                  name: 'GitHub',
                  url: portfolio.github,
                  Icon: Github,
                },
                {
                  name: 'LinkedIn',
                  url: portfolio.linkedin,
                  Icon: Linkedin,
                },
              ].map(({ name, url, Icon }) =>
                url ? (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                  >
                    <Icon size={18} />
                  </a>
                ) : (
                  <button
                    key={name}
                    disabled
                    aria-label={`${name} link coming soon`}
                    title={`${name} link coming soon`}
                  >
                    <Icon size={18} />
                  </button>
                )
              )}
            </div>

            <div className="hero-note">
              <span className="note-line" />
              <span>
                A little imagination.
                <br />
                <strong>Endless possibilities.</strong>
              </span>
            </div>

            <button
              type="button"
              className="portal-secret-discovery"
              onClick={revealPortalSecret}
              aria-label="Discover the portal's hidden message"
              title="Discover the portal's hidden message"
            >
              ✧
            </button>
          </motion.section>

          {/* ABOUT */}
          <AboutPanel
            visible={journey.stage === 'about'}
            onExplore={setObject}
            onHome={() => journey.navigate('home')}
          />

          {/* SKILLS */}
          <SkillsPanel
            visible={journey.stage === 'skills'}
            onSelect={setSkill}
            onBack={() => journey.navigate('about')}
          />

          {journey.stage === 'skills' && (
            <button
              type="button"
              className="portal-secret-discovery"
              onClick={revealCrystalSecret}
              aria-label="Discover the Codex Core's hidden achievement"
              title="Discover the Codex Core's hidden achievement"
            >
              ✧
            </button>
          )}

          {/* PROJECTS */}
          <ProjectsPanel
            visible={journey.stage === 'projects'}
            onSelect={setProject}
            onBack={() => journey.navigate('skills')}
          />

          {/* JOURNEY */}
          <JourneyPanel
            visible={journey.stage === 'journey'}
            onSelect={setMilestone}
            onBack={() => journey.navigate('projects')}
          />

          {/* CONTACT */}
          <ContactPanel
            visible={journey.stage === 'contact'}
            onPortal={openContact}
            onBack={() => journey.navigate('terminal')}
          />

          {/* TERMINAL */}
          <TerminalPanel
            visible={journey.stage === 'terminal'}
            onFocusChange={setTerminalFocused}
            onSecret={revealSecret}
            onBack={() => journey.navigate('journey')}
          />

          <div
            className="travel-caption"
            aria-hidden={journey.stage !== 'travel'}
          >
            <span>FOLLOW THE LANTERNS</span>
            <p>
              {journey.active === 'contact'
                ? 'The next adventure begins with a hello.'
                : journey.active === 'terminal'
                  ? 'A workspace for curiosity, beneath the stars.'
                  : journey.active === 'journey'
                    ? 'Every step leads to another possibility.'
                    : journey.active === 'projects'
                      ? 'A constellation of ideas, built into worlds.'
                      : journey.active === 'skills'
                        ? 'Follow the light into the Crystal Garden.'
                        : 'A quieter corner of my world.'}
            </p>
          </div>

          <div className="world-caption">
            <Sparkles size={13} />
            <span>THE GATEWAY TO WHAT’S NEXT</span>
            <i />
          </div>

          <div className="location-label">
            <span className="location-icon">
              <Compass size={19} />
            </span>

            <div>
              <small>YOU ARE HERE</small>
              <strong>
                {journey.active === 'contact'
                  ? 'The Final Portal'
                  : journey.active === 'terminal'
                    ? 'The Neon Observatory'
                    : journey.active === 'journey'
                      ? 'The Path So Far'
                      : journey.active === 'projects'
                        ? 'The Project Archipelago'
                        : journey.active === 'skills'
                          ? portfolio.skills.location
                          : journey.active === 'about'
                            ? portfolio.about.location
                            : 'The Beginning'}
              </strong>
            </div>

            <span className="location-number">
              {journey.active === 'contact'
                ? '07'
                : journey.active === 'terminal'
                  ? '06'
                  : journey.active === 'journey'
                    ? '05'
                    : journey.active === 'projects'
                      ? '04'
                      : journey.active === 'skills'
                        ? '03'
                        : journey.active === 'about'
                          ? '02'
                          : '01'}{' '}
              / 07
            </span>

            <span className="location-progress" />
          </div>

          <footer className="world-footer">
            <div className="world-status">
              <span />
              {failed
                ? '3D unavailable · simplified view'
                : 'MADE OF CURIOSITY & CODE'}
              <small>
                © {new Date().getFullYear()} Ashan
              </small>
            </div>

            <a
              className="scroll-hint"
              href={
                journey.active === 'contact'
                  ? '#home'
                  : journey.active === 'terminal'
                    ? '#contact'
                    : journey.active === 'journey'
                      ? '#terminal'
                      : journey.active === 'projects'
                        ? '#journey'
                        : journey.active === 'skills'
                          ? '#projects'
                          : journey.active === 'about'
                            ? '#skills'
                            : '#about'
              }
              onClick={event => {
                event.preventDefault()
                journey.navigate(
                  journey.active === 'contact'
                    ? 'home'
                    : journey.active === 'terminal'
                      ? 'contact'
                      : journey.active === 'journey'
                        ? 'terminal'
                        : journey.active === 'projects'
                          ? 'journey'
                          : journey.active === 'skills'
                            ? 'projects'
                            : journey.active === 'about'
                              ? 'skills'
                              : 'about'
                )
              }}
            >
              <span>
                {journey.active === 'contact'
                  ? 'BACK TO THE BEGINNING'
                  : 'SCROLL TO WANDER'}
              </span>
              <ArrowDown size={15} />
            </a>

            <MusicPlayer />
          </footer>

          <div className="scene-controls">
            <button
              aria-label="Replay cinematic journey"
              title="Replay cinematic journey"
              disabled={failed || reduced || calm}
              onClick={journey.replayJourney}
            >
              <RotateCcw size={15} />
            </button>

            <button
              aria-label="Toggle calm mode"
              title="Reduce animation"
              aria-pressed={calm || reduced}
              disabled={reduced}
              onClick={() => setCalm(!calm)}
            >
              <Leaf size={15} />
            </button>
          </div>

          {!ready && (
            <div className="loading-screen" role="status">
              <div className="loading-portal" />
              <p>Entering My World...</p>
              <span>Preparing the landscape</span>
              <progress aria-label="Preparing 3D scene" />
            </div>
          )}
        </div>

        <div className="journey-track" aria-hidden="true" />

        <div id="about" className="about-marker" aria-hidden="true" />
        <div id="skills" className="skills-marker" aria-hidden="true" />
        <div id="projects" className="projects-marker" aria-hidden="true" />
        <div
          id="journey"
          className="developer-journey-marker"
          aria-hidden="true"
        />
        <div
          id="contact"
          className="contact-marker"
          aria-hidden="true"
        />
        <div
          id="terminal"
          className="terminal-marker"
          aria-hidden="true"
        />

        {/* DIALOGS */}
        <JourneyDialog
          selected={milestone}
          onClose={() => setMilestone(null)}
        />

        <ProjectDialog
          selected={project}
          onClose={() => setProject(null)}
        />

        <SkillsDialog
          selected={skill}
          onClose={() => setSkill(null)}
        />

        <AboutDialog
          object={object}
          onClose={() => setObject(null)}
        />

        <ContactDialog
          open={contactOpen}
          onClose={() => setContactOpen(false)}
        />

        <PortalSecretDialog
          open={portalSecretOpen}
          onClose={() => setPortalSecretOpen(false)}
        />

        <CrystalSecretDialog
          open={crystalSecretOpen}
          onClose={() => setCrystalSecretOpen(false)}
        />
      </main>
    </MotionConfig>
  )
}
