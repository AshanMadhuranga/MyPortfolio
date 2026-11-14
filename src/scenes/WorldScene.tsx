
import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'

import {
  Canvas,
  useFrame,
  useThree,
} from '@react-three/fiber'

import {
  AdaptiveDpr,
  PerformanceMonitor,
} from '@react-three/drei'

import {
  ACESFilmicToneMapping,
  SRGBColorSpace,
  type DirectionalLight,
} from 'three'

import { CameraRig } from '../animations/CameraRig'

import { ContactScene } from './ContactScene/ContactScene'
import { TerminalScene } from './TerminalScene/TerminalScene'
import { JourneyScene } from './JourneyScene/JourneyScene'
import { ProjectsScene } from './ProjectsScene/ProjectsScene'
import { HomeScene } from './HomeScene/HomeScene'
import { SkillsScene } from './SkillsScene/SkillsScene'
import { AboutScene } from './AboutScene/AboutScene'

import { Petals } from '../components/three/Environment'

import type { MilestoneId } from '../config/journey'
import type { ProjectId } from '../config/projects'

import type {
  AboutObject,
  SkillCategoryId,
} from '../config/portfolio'

// ======================================================
// WORLD LIFECYCLE
// ======================================================

function WorldLifecycle({
  onReady,
  onFailure,
}: {
  onReady: () => void
  onFailure: () => void
}) {
  const state = useThree()
  const gl = useThree(state => state.gl)

  useEffect(() => {
    Object.assign(globalThis, {
      __phase7: state,
    })

    return () => {
      Reflect.deleteProperty(
        globalThis,
        '__phase7'
      )
    }
  }, [state])

  useEffect(() => {
    const canvas = gl.domElement

    const handleContextLost = (event: Event) => {
      event.preventDefault()
      onFailure()
    }

    canvas.addEventListener(
      'webglcontextlost',
      handleContextLost
    )

    onReady()

    return () => {
      canvas.removeEventListener(
        'webglcontextlost',
        handleContextLost
      )
    }
  }, [gl, onReady, onFailure])

  return null
}

// ======================================================
// WORLD SUN / LIGHTING
// ======================================================

function Sun({
  shadows,
  progress,
}: {
  shadows: boolean
  progress: RefObject<number>
}) {
  const light = useRef<DirectionalLight>(null)

  useFrame(() => {
    if (!light.current) return

    const p = Math.min(
      1,
      progress.current
    )

    const next = Math.max(
      0,
      Math.min(1, progress.current - 1)
    )

    const last = Math.max(
      0,
      Math.min(1, progress.current - 2)
    )

    const final = Math.max(
      0,
      Math.min(1, progress.current - 3)
    )

    const terminal = Math.max(
      0,
      Math.min(1, progress.current - 4)
    )

    const contact = Math.max(
      0,
      progress.current - 5
    )

    const x =
      38 * p +
      26 * next +
      26 * last +
      32 * final +
      32 * terminal +
      30 * contact

    const z =
      -12 * p -
      16 * next -
      16 * last -
      18 * final -
      22 * terminal -
      20 * contact

    light.current.position.set(
      -8 + x,
      16,
      10 + z
    )

    light.current.target.position.set(
      x,
      0,
      z
    )

    light.current.target.updateMatrixWorld()
  })

  return (
    <directionalLight
      ref={light}
      position={[-8, 16, 10]}
      intensity={2.4}
      color="#ffd8e6"
      castShadow={shadows}
      shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-16}
      shadow-camera-right={16}
      shadow-camera-top={16}
      shadow-camera-bottom={-16}
      shadow-normalBias={0.04}
      shadow-bias={-0.0002}
    />
  )
}

// ======================================================
// WORLD SCENE PROPS
// ======================================================

type WorldSceneProps = {
  reduced: boolean
  mobile: boolean

  progress: RefObject<number>
  replay: number

  interactive: boolean

  onExplore: (object: AboutObject) => void

  // Home portal Easter egg
  onPortalSecret?: () => void

  // Skills
  skillsInteractive: boolean
  selectedSkill: SkillCategoryId | null
  onSkill: (id: SkillCategoryId) => void

  // Skills crystal Easter egg
  onCoreSecret?: () => void

  // Projects
  projectsInteractive: boolean
  selectedProject: ProjectId | null
  onProject: (id: ProjectId) => void

  // Journey
  journeyInteractive: boolean
  selectedMilestone: MilestoneId | null
  onMilestone: (id: MilestoneId) => void

  // Contact
  contactInteractive: boolean
  contactActivated: boolean
  onContact: () => void

  // Terminal
  terminalInteractive: boolean
  terminalFocused: boolean
  secretPulse: number
  onTerminal: () => void

  // Lifecycle
  onReady: () => void
  onFailure: () => void
}

// ======================================================
// MAIN SHARED WORLD CANVAS
// ======================================================

export default function WorldScene({
  reduced,
  mobile,
  progress,
  replay,
  interactive,
  onExplore,
  onPortalSecret,
  skillsInteractive,
  selectedSkill,
  onSkill,
  onCoreSecret,
  projectsInteractive,
  selectedProject,
  onProject,
  journeyInteractive,
  selectedMilestone,
  onMilestone,
  contactInteractive,
  contactActivated,
  onContact,
  terminalInteractive,
  terminalFocused,
  secretPulse,
  onTerminal,
  onReady,
  onFailure,
}: WorldSceneProps) {
  // Restore the original one-way quality reduction.
  const [lowQuality, setLowQuality] = useState(false)

  return (
    <Canvas
      shadows={!mobile && !lowQuality}
      dpr={[
        1,
        lowQuality
          ? 1
          : mobile
            ? 1.25
            : 1.75,
      ]}
      camera={{
        position: [10, 9, 30],
        fov: 43,
        near: 0.1,
        far: 180,
      }}
      gl={{
        antialias: !mobile,
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1,
        outputColorSpace: SRGBColorSpace,
      }}
    >
      {/* WORLD LIFECYCLE */}
      <WorldLifecycle
        onReady={onReady}
        onFailure={onFailure}
      />

      {/* BACKGROUND */}
      <color
        attach="background"
        args={['#afc8e6']}
      />

      {/* FOG */}
      <fog
        attach="fog"
        args={['#bcb9dd', 30, 100]}
      />

      {/* AMBIENT LIGHTING */}
      <ambientLight
        intensity={0.22}
        color="#c3b3ed"
      />

      <hemisphereLight
        args={[
          '#f7e1f1',
          '#51416f',
          0.85,
        ]}
      />

      {/* MAIN SUN */}
      <Sun
        shadows={!mobile && !lowQuality}
        progress={progress}
      />

      {/* SECONDARY LIGHT */}
      <directionalLight
        position={[12, 7, -12]}
        intensity={0.8}
        color="#c8a2f2"
      />

      {/* CAMERA */}
      <CameraRig
        reduced={reduced}
        mobile={mobile}
        progress={progress}
        replay={replay}
      />

      {/* ADAPTIVE RESOLUTION */}
      <AdaptiveDpr pixelated />

      {/* ORIGINAL PERFORMANCE MONITOR */}
      <PerformanceMonitor
        onDecline={() => {
          setLowQuality(true)
        }}
      />

      {/* HOME */}
      <HomeScene
        reduced={reduced}
        mobile={mobile}
        onPortalSecret={onPortalSecret}
      />

      {/* ABOUT */}
      <AboutScene
        reduced={reduced}
        mobile={mobile}
        interactive={interactive}
        onExplore={onExplore}
      />

      {/* SKILLS */}
      <SkillsScene
        reduced={reduced}
        mobile={mobile}
        interactive={skillsInteractive}
        selected={selectedSkill}
        onSelect={onSkill}
        onCoreSecret={onCoreSecret}
      />

      {/* PROJECTS */}
      <ProjectsScene
        reduced={reduced}
        mobile={mobile || lowQuality}
        interactive={projectsInteractive}
        selected={selectedProject}
        onSelect={onProject}
      />

      {/* JOURNEY */}
      <JourneyScene
        reduced={reduced}
        mobile={mobile || lowQuality}
        interactive={journeyInteractive}
        selected={selectedMilestone}
        onSelect={onMilestone}
      />

      {/* CONTACT */}
      <ContactScene
        reduced={reduced}
        compact={mobile || lowQuality}
        interactive={contactInteractive}
        activated={contactActivated}
        onOpen={onContact}
      />

      {/* TERMINAL */}
      <TerminalScene
        reduced={reduced}
        compact={mobile || lowQuality}
        interactive={terminalInteractive}
        focused={terminalFocused}
        secretPulse={secretPulse}
        onOpen={onTerminal}
      />

      {/* AMBIENT PETALS */}
      <Petals
        mobile={mobile}
        reduced={reduced}
      />

      <group position={[38, 0, -12]}>
        <Petals
          mobile
          reduced={reduced}
        />
      </group>
    </Canvas>
  )
}
