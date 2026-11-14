
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import {
  BoxGeometry,
  MeshStandardMaterial,
  Group,
  MathUtils,
  CatmullRomCurve3,
  Vector3,
  InstancedMesh,
  Object3D,
  CanvasTexture,
  SRGBColorSpace,
  LinearMipmapLinearFilter,
  LinearFilter,
  DoubleSide,
} from 'three'

import {
  Island,
  Tree,
  Grass,
  Lantern,
  Waterfall,
  Crystal,
  Water,
  MeadowDetails,
} from '../../components/three/Environment'
import { Glow } from '../../components/three/Glow'
import { CrystalLabel } from '../SkillsScene/CrystalDetails'
import { projects, type ProjectId } from '../../config/projects'
import { world } from '../../config/world'

type V = [number, number, number]

const box = new BoxGeometry(1, 1, 1)

const materials = {
  stone: new MeshStandardMaterial({
    color: '#9278ac',
    roughness: 0.8,
  }),
  pink: new MeshStandardMaterial({
    color: '#ce87b7',
    roughness: 0.65,
  }),
  dark: new MeshStandardMaterial({
    color: '#352846',
    emissive: '#62377e',
    emissiveIntensity: 0.12,
  }),
  window: new MeshStandardMaterial({
    color: '#ffd2a6',
    emissive: '#ffb876',
    emissiveIntensity: 0.5,
  }),
  glow: new MeshStandardMaterial({
    color: '#e9b5ff',
    emissive: '#cd7ae9',
    emissiveIntensity: 0.8,
  }),
}

function Block({
  p,
  s,
  m = 'stone',
  r = [0, 0, 0],
}: {
  p: V
  s: V
  m?: keyof typeof materials
  r?: V
}) {
  return (
    <mesh
      position={p}
      scale={s}
      rotation={r}
      geometry={box}
      material={materials[m]}
      castShadow
      receiveShadow
    />
  )
}

// Locations relative to the central Projects island.
const locations: V[] = [
  [-8.4, 0.8, 4],
  [-8.8, 2.1, -3.5],
  [-5, 3.2, -9],
  [8.8, 2.1, -3.5],
  [8.4, 0.8, 4],
  [5, 3.2, -9],
]

const shortTitles = [
  'Gym Management',
  'Food Ordering',
  'CTMS',
  'AI Clothing Shop',
  'AgeiosAI',
  'Food Mobile App',
]

// ======================================================
// CRISP ILLUMINATED SIGN
// ======================================================

function ProjectSign({
  title,
  active,
  reduced,
}: {
  title: string
  active: boolean
  reduced: boolean
}) {
  const group = useRef<Group>(null)

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 512

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas 2D is unavailable')
    }

    ctx.fillStyle = '#24172f'
    ctx.beginPath()
    ctx.roundRect(24, 26, 2000, 460, 72)
    ctx.fill()

    ctx.strokeStyle = '#dca8ff'
    ctx.lineWidth = 13
    ctx.stroke()

    ctx.strokeStyle = '#795396'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.roundRect(48, 50, 1952, 412, 56)
    ctx.stroke()

    const gradient = ctx.createLinearGradient(220, 0, 1828, 0)
    gradient.addColorStop(0, '#9561be')
    gradient.addColorStop(0.5, '#ffe1ff')
    gradient.addColorStop(1, '#9561be')

    ctx.fillStyle = gradient
    ctx.fillRect(220, 78, 1608, 8)

    let fontSize = 180
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    while (fontSize > 75) {
      ctx.font = `bold ${fontSize}px Arial, sans-serif`
      if (ctx.measureText(title).width <= 1790) break
      fontSize -= 5
    }

    ctx.shadowColor = '#a65cf5'
    ctx.shadowBlur = 12
    ctx.fillStyle = '#ffffff'
    ctx.fillText(title, 1024, 275)

    ctx.shadowBlur = 0
    ctx.fillStyle = '#e5baff'

    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.arc(986 + i * 38, 412, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    const map = new CanvasTexture(canvas)
    map.colorSpace = SRGBColorSpace
    map.minFilter = LinearMipmapLinearFilter
    map.magFilter = LinearFilter
    map.generateMipmaps = true
    map.anisotropy = 8

    return map
  }, [title])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame(({ clock }, delta) => {
    if (!group.current) return

    const pulse =
      active && !reduced
        ? Math.sin(clock.elapsedTime * 2.4) * 0.018
        : 0

    const target = active ? 1.1 : 1

    const scale = reduced
      ? target
      : MathUtils.damp(
          group.current.scale.x,
          target,
          7,
          Math.min(delta, 0.1)
        )

    group.current.scale.setScalar(scale + pulse)
  })

  return (
    <group ref={group}>
      <Glow
        color="#c28aff"
        size={5.1}
        opacity={active ? 0.4 : 0.12}
      />

      <sprite
        scale={[4.8, 1.2, 1]}
        renderOrder={20}
        raycast={() => {}}
      >
        <spriteMaterial
          map={texture}
          transparent
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  )
}

// ======================================================
// MINIATURE 1: GYM EQUIPMENT
// ======================================================

function GymMiniature() {
  return (
    <group position={[0, 0.65, 0.6]}>
      {/* Exercise bench */}
      <Block p={[0, 0.2, 0]} s={[1.5, 0.15, 0.55]} m="dark" />
      <Block p={[-0.48, -0.15, 0]} s={[0.13, 0.65, 0.13]} />
      <Block p={[0.48, -0.15, 0]} s={[0.13, 0.65, 0.13]} />

      {/* Barbell */}
      <mesh position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 2.5, 8]} />
        <meshStandardMaterial color="#e7b8ff" />
      </mesh>

      {[-1.05, -0.85, 0.85, 1.05].map(x => (
        <mesh
          key={x}
          position={[x, 0.95, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.35, 0.35, 0.14, 12]} />
          <meshStandardMaterial color="#50345f" />
        </mesh>
      ))}

      <Block p={[-0.9, 0.35, -0.2]} s={[0.12, 1.3, 0.12]} m="glow" />
      <Block p={[0.9, 0.35, -0.2]} s={[0.12, 1.3, 0.12]} m="glow" />
    </group>
  )
}

// ======================================================
// MINIATURE 2: FOOD ORDERING
// ======================================================

function FoodMiniature() {
  return (
    <group position={[0, 0.55, 0.7]}>
      {/* Restaurant counter */}
      <Block p={[0, -0.18, -0.3]} s={[2.3, 0.65, 0.8]} m="pink" />

      {/* Plate */}
      <mesh position={[0, 0.25, 0.1]}>
        <cylinderGeometry args={[0.9, 0.9, 0.13, 24]} />
        <meshStandardMaterial color="#ffe7dc" />
      </mesh>

      {/* Food */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh
          key={i}
          position={[
            Math.cos(i * 1.26) * 0.48,
            0.42,
            0.1 + Math.sin(i * 1.26) * 0.4,
          ]}
        >
          <sphereGeometry args={[0.2, 10, 8]} />
          <meshStandardMaterial
            color={i % 2 ? '#9cc78c' : '#df879d'}
          />
        </mesh>
      ))}

      {/* Small ordering display */}
      <Block p={[1.25, 0.6, -0.45]} s={[0.65, 0.9, 0.15]} m="dark" />
      <Block p={[1.25, 0.65, -0.34]} s={[0.48, 0.55, 0.04]} m="window" />
    </group>
  )
}

// ======================================================
// MINIATURE 3: CTMS DASHBOARD
// ======================================================

function CTMSMiniature() {
  return (
    <group position={[0, 0.85, 0.7]}>
      {/* Monitor */}
      <Block p={[0, 0.25, 0]} s={[2.2, 1.5, 0.2]} m="dark" />
      <Block p={[0, 0.25, 0.12]} s={[1.95, 1.25, 0.04]} m="stone" />

      {/* Dashboard cards */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <group key={i}>
          <Block
            p={[x, 0.48, 0.17]}
            s={[0.48, 0.42, 0.05]}
            m={i % 2 ? 'pink' : 'glow'}
          />
          <Block
            p={[x, -0.12, 0.17]}
            s={[0.48, 0.12, 0.05]}
            m="dark"
          />
        </group>
      ))}

      {/* Monitor stand */}
      <Block p={[0, -0.7, 0]} s={[0.18, 0.48, 0.18]} m="dark" />
      <Block p={[0, -0.95, 0]} s={[0.95, 0.1, 0.45]} m="dark" />
    </group>
  )
}

// ======================================================
// MINIATURE 4: AI CLOTHING SHOP
// ======================================================

function ClothingMiniature() {
  return (
    <group position={[0, 0.65, 0.7]}>
      {/* Shop facade */}
      <Block p={[0, 0.35, -0.3]} s={[2.4, 1.75, 0.4]} m="dark" />
      <Block p={[0, 1.28, -0.1]} s={[2.55, 0.15, 0.55]} m="glow" />

      {/* Clothing displays */}
      {[-0.7, 0, 0.7].map((x, i) => (
        <group key={i} position={[x, 0.45, 0]}>
          <mesh position={[0, 0.23, 0]}>
            <coneGeometry args={[0.28, 0.65, 4]} />
            <meshStandardMaterial
              color={i === 1 ? '#ffe0f1' : '#c58bdc'}
            />
          </mesh>
          <Block p={[0, -0.2, 0]} s={[0.5, 0.1, 0.3]} m="stone" />
        </group>
      ))}

      {/* AI recommendation crystal */}
      <mesh position={[1.28, 1.15, 0.2]}>
        <octahedronGeometry args={[0.28]} />
        <meshBasicMaterial color="#b9f1ff" toneMapped={false} />
      </mesh>
    </group>
  )
}

// ======================================================
// MINIATURE 5: AGEIOS AI
// ======================================================

function AIMiniature({ reduced }: { reduced: boolean }) {
  const core = useRef<Group>(null)

  useFrame((_, delta) => {
    if (core.current && !reduced) {
      core.current.rotation.y += Math.min(delta, 0.1) * 0.3
    }
  })

  return (
    <group position={[0, 1.05, 0.7]}>
      <group ref={core}>
        <mesh>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial
            color="#bd8eff"
            emissive="#a96bea"
            emissiveIntensity={0.7}
            wireframe
          />
        </mesh>

        <mesh>
          <icosahedronGeometry args={[0.43, 0]} />
          <meshStandardMaterial
            color="#e9c5ff"
            emissive="#b88cff"
            emissiveIntensity={1.5}
          />
        </mesh>

        {[0, 1, 2].map(i => (
          <mesh key={i} rotation={[i * 0.65, i * 0.8, 0]}>
            <torusGeometry args={[1.05, 0.025, 6, 48]} />
            <meshBasicMaterial color="#c9a2ff" />
          </mesh>
        ))}
      </group>

      <pointLight color="#b88cff" intensity={4} distance={5} />
    </group>
  )
}

// ======================================================
// MINIATURE 6: FOOD ORDERING MOBILE
// ======================================================

function MobileMiniature() {
  return (
    <group position={[0, 1.05, 0.7]}>
      {/* Smartphone */}
      <Block p={[0, 0, 0]} s={[1.3, 2.2, 0.18]} m="dark" />
      <Block p={[0, 0.03, 0.12]} s={[1.08, 1.85, 0.05]} m="pink" />

      {/* App header */}
      <Block p={[0, 0.65, 0.17]} s={[0.85, 0.25, 0.04]} m="glow" />

      {/* Food cards */}
      {[0, 1, 2].map(i => (
        <group key={i}>
          <Block
            p={[-0.3, 0.17 - i * 0.42, 0.17]}
            s={[0.28, 0.26, 0.04]}
            m="window"
          />
          <Block
            p={[0.2, 0.2 - i * 0.42, 0.17]}
            s={[0.55, 0.09, 0.04]}
            m="dark"
          />
        </group>
      ))}

      <mesh position={[0, -0.95, 0.16]}>
        <circleGeometry args={[0.065, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function ProjectMiniature({
  index,
  reduced,
}: {
  index: number
  reduced: boolean
}) {
  switch (index) {
    case 0:
      return <GymMiniature />
    case 1:
      return <FoodMiniature />
    case 2:
      return <CTMSMiniature />
    case 3:
      return <ClothingMiniature />
    case 4:
      return <AIMiniature reduced={reduced} />
    default:
      return <MobileMiniature />
  }
}

// ======================================================
// INDIVIDUAL PROJECT ISLAND
// ======================================================

function ProjectIsland({
  index,
  reduced,
  mobile,
  interactive,
  selected,
  onSelect,
}: {
  index: number
  reduced: boolean
  mobile: boolean
  interactive: boolean
  selected: boolean
  onSelect: (id: ProjectId) => void
}) {
  const [hover, setHover] = useState(false)
  const miniature = useRef<Group>(null)
  const signGroup = useRef<Group>(null)

  useCursor(hover && interactive)

  const project = projects[index]
  const active = interactive && (hover || selected)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)

    if (miniature.current) {
      const target = active ? 1.2 : 1

      const scale = reduced
        ? target
        : MathUtils.damp(miniature.current.scale.x, target, 7, dt)

      miniature.current.scale.setScalar(scale)

      if (!reduced) {
        miniature.current.rotation.y =
          Math.sin(performance.now() * 0.0006) * 0.06
      }
    }

    if (signGroup.current) {
      const targetY = active ? 0.14 : 0

      signGroup.current.position.y = reduced
        ? targetY
        : MathUtils.damp(
            signGroup.current.position.y,
            targetY,
            5,
            dt
          )
    }
  })

  if (!project) return null

  // Rear signs are now closer to their islands.
  const rear = index === 2 || index === 5
  const signHeight = rear ? 3.25 : 3.1

  return (
    <group
      name={`project-${project.id}`}
      position={locations[index]}
      onPointerOver={event => {
        if (!interactive) return
        event.stopPropagation()
        setHover(true)
      }}
      onPointerOut={() => setHover(false)}
      onClick={event => {
        if (!interactive) return
        event.stopPropagation()
        onSelect(project.id)
      }}
    >
      <Island position={[0, 0, 0]} scale={0.82} />

      <Grass
        position={[0, 0.2, 0]}
        radius={2.3}
        count={mobile ? 100 : 260}
      />

      <Tree
        position={[1.9, 0.2, -1.7]}
        scale={0.38}
        lavender={index % 2 === 0}
        seed={index + 90}
        reduced={reduced}
      />

      <Tree
        position={[-1.9, 0.2, -1.3]}
        scale={0.4}
        lavender={index % 2 !== 0}
        seed={120 + index}
        reduced={reduced}
      />

      <Lantern position={[-1.7, 0.2, 1]} reduced={reduced} />
      <Lantern position={[1.9, 0.2, 0.7]} reduced={reduced} />

      <MeadowDetails
        position={[0, 0.2, 0.4]}
        count={mobile ? 12 : 24}
      />

      <Crystal
        position={[1.8, 0.2, 1.2]}
        scale={0.48}
        reduced={reduced}
      />

      {/* Dedicated raised miniature platform */}
      <mesh position={[0, 0.35, 0.7]}>
        <cylinderGeometry args={[1.5, 1.7, 0.22, 12]} />
        <meshStandardMaterial
          color="#806097"
          emissive="#8b4baa"
          emissiveIntensity={active ? 0.65 : 0.2}
        />
      </mesh>

      <mesh
        position={[0, 0.48, 0.7]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.25, 1.31, 32]} />
        <meshBasicMaterial
          color={active ? '#ffffff' : '#e9baff'}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>

      {/* RESTORED PROJECT ILLUSTRATION */}
      <group ref={miniature} position={[0, 0.55, 0.7]}>
        <ProjectMiniature index={index} reduced={reduced} />
      </group>

      {/* BRIGHT PROJECT NAME ABOVE THE ILLUSTRATION */}
      <group position={[0, signHeight, -1.15]}>
        <group ref={signGroup}>
          <ProjectSign
            title={shortTitles[index] ?? project.title}
            active={active}
            reduced={reduced}
          />
        </group>
      </group>

      {!mobile && (
        <Waterfall
          position={[-0.9, 0.1, 2.4]}
          height={locations[index][1] + 2}
          reduced={reduced}
        />
      )}
    </group>
  )
}

// ======================================================
// CENTRAL PROJECTS GATEWAY
// ======================================================

function StoneGateway({ reduced }: { reduced: boolean }) {
  return (
    <group name="projects-stone-arch">
      {[-1, 1].map(side => (
        <group key={side}>
          {[0, 1, 2, 3].map(i => (
            <Block
              key={i}
              p={[side * 2.4, 1.25 + i * 0.85, 0]}
              s={[0.85, 0.78, 1]}
              r={[0, side * 0.03 * (i % 2), side * 0.025]}
            />
          ))}

          <Block
            p={[side * 2.4, 2.6, 0.54]}
            s={[0.055, 3.3, 0.04]}
            m="glow"
          />

          <Crystal
            position={[side * 2.9, 0.8, 0.5]}
            scale={0.9}
            reduced={reduced}
          />

          <Lantern
            position={[side * 2.4, 0.8, 2]}
            reduced={reduced}
          />
        </group>
      ))}

      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 8) * Math.PI

        return (
          <group
            key={i}
            position={[
              Math.cos(a) * 2.4,
              3.8 + Math.sin(a) * 2.2,
              0,
            ]}
            rotation={[0, 0, a - Math.PI / 2]}
          >
            <Block
              p={[0, 0, 0]}
              s={[0.9, 0.88, 1.05]}
              m={i % 2 ? 'stone' : 'pink'}
            />
            <Block
              p={[0, -0.45, 0.55]}
              s={[0.75, 0.04, 0.04]}
              m="glow"
            />
          </group>
        )
      })}

      <Block
        p={[0, 4.9, 0.18]}
        s={[3.7, 0.76, 0.35]}
        m="dark"
      />

      <CrystalLabel
        text="PROJECTS"
        position={[0, 4.9, 1.3]}
        width={3.7}
      />

      <group position={[0, 4.9, 0.6]}>
        <Glow size={5.5} color="#e391ff" opacity={0.22} />
      </group>
    </group>
  )
}

// ======================================================
// CONNECTING PATHS
// ======================================================

function Paths() {
  const ref = useRef<InstancedMesh>(null)

  const points = useMemo(() => {
    const curve = new CatmullRomCurve3([
      new Vector3(70, 0.5, -29),
      new Vector3(76, 1, -32),
      new Vector3(80, 1.4, -38),
      new Vector3(86, 1, -43),
    ])

    const items = Array.from(
      { length: 35 },
      (_, i) => curve.getPoint(i / 34)
    )

    for (const p of locations) {
      for (let i = 1; i < 12; i++) {
        const t = i / 12

        items.push(
          new Vector3(
            world.projects[0] + p[0] * t,
            1 + (p[1] - 0.2) * t,
            world.projects[2] + p[2] * t
          )
        )
      }
    }

    return items
  }, [])

  useLayoutEffect(() => {
    const dummy = new Object3D()

    points.forEach((p, i) => {
      dummy.position.copy(p)
      dummy.rotation.y = i * 0.4
      dummy.updateMatrix()
      ref.current?.setMatrixAt(i, dummy.matrix)
    })

    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true
      ref.current.computeBoundingSphere()
    }
  }, [points])

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, points.length]}
    >
      <cylinderGeometry args={[0.55, 0.65, 0.18, 6]} />
      <meshStandardMaterial
        color="#c4a1cf"
        emissive="#b568cb"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  )
}

// ======================================================
// MAIN PROJECTS SCENE
// ======================================================

export function ProjectsScene({
  reduced,
  mobile,
  interactive,
  selected,
  onSelect,
}: {
  reduced: boolean
  mobile: boolean
  interactive: boolean
  selected: ProjectId | null
  onSelect: (id: ProjectId) => void
}) {
  const width = useThree(state => state.size.width)
  const compact = mobile || width <= 1100

  return (
    <group name="projects-environment">
      <Paths />

      <group position={[180, 0, 0]}>
        <Water reduced={reduced} />
      </group>

      <group position={world.projects}>
        <Island position={[0, 0.5, 0]} scale={1.25} />

        <Grass
          position={[0, 0.75, 0]}
          count={compact ? 180 : 500}
        />

        <MeadowDetails
          position={[0, 0.75, 0]}
          count={compact ? 18 : 36}
        />

        <Tree
          position={[-2.6, 0.75, -1.8]}
          scale={0.45}
          reduced={reduced}
        />

        <Tree
          position={[2.6, 0.75, -1.8]}
          scale={0.4}
          lavender
          reduced={reduced}
        />

        <StoneGateway reduced={reduced} />

        <mesh position={[0, 0.9, 0.5]}>
          <cylinderGeometry args={[1.6, 1.9, 0.3, 12]} />
          <meshStandardMaterial color="#a383b6" />
        </mesh>

        <mesh
          position={[0, 1.08, 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[1.4, 0.04, 6, 48]} />
          <meshBasicMaterial color="#ffc8fa" />
        </mesh>

        <Crystal
          position={[0, 1.3, 0.5]}
          scale={1.5}
          reduced={reduced}
        />

        <CrystalLabel
          text="</>"
          position={[0, 2.5, 1]}
          width={1.8}
        />

        {projects.map((project, index) => (
          <ProjectIsland
            key={project.id}
            index={index}
            reduced={reduced}
            mobile={compact}
            interactive={interactive}
            selected={selected === project.id}
            onSelect={onSelect}
          />
        ))}
      </group>
    </group>
  )
}


