
import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import {
  Group,
  MathUtils,
  MeshStandardMaterial,
} from 'three'

import {
  portfolio,
  type SkillCategory,
  type SkillCategoryId,
} from '../../config/portfolio'

import { world } from '../../config/world'

import {
  Island,
  Tree,
  Grass,
  MeadowDetails,
  Lantern,
  Waterfall,
  Petals,
  Crystal,
} from '../../components/three/Environment'

import { Glow } from '../../components/three/Glow'

import {
  CrystalLabel,
  useCrystalGeometry,
} from './CrystalDetails'

import {
  CrystalMotes,
  LavenderBeds,
} from './GardenAccents'

import { SkillsPath } from './SkillsPath'

const positions: [number, number, number][] = [
  [-3.3, 6.3, 0],
  [3.3, 6.3, 0],
  [4.3, 3.8, 0.5],
  [3.2, 1.9, 1],
  [-3.2, 1.9, 1],
  [-4.3, 3.8, 0.5],
]

// ======================================================
// SIX SKILL CRYSTALS
// ======================================================

function SkillCrystal({
  category,
  index,
  reduced,
  interactive,
  selected,
  onSelect,
}: {
  category: SkillCategory
  index: number
  reduced: boolean
  interactive: boolean
  selected: boolean
  onSelect: (id: SkillCategoryId) => void
}) {
  const [hovered, setHovered] = useState(false)

  const group = useRef<Group>(null)
  const material = useRef<MeshStandardMaterial>(null)

  useCursor(hovered && interactive)

  useFrame(({ clock }, delta) => {
    if (!group.current || !material.current) return

    const highlight =
      interactive && (selected || hovered)

    const scale = highlight ? 1.1 : 1

    group.current.scale.setScalar(
      reduced
        ? scale
        : MathUtils.damp(
            group.current.scale.x,
            scale,
            8,
            Math.min(delta, 0.1)
          )
    )

    group.current.position.y =
      positions[index][1] +
      (reduced
        ? 0
        : Math.sin(
            clock.elapsedTime * 0.65 + index
          ) * 0.09)

    material.current.emissiveIntensity =
      highlight ? 0.85 : 0.28
  })

  return (
    <group
      ref={group}
      position={positions[index]}
      name={`skill-${category.id}`}
      onPointerOver={event => {
        if (interactive) {
          event.stopPropagation()
          setHovered(true)
        }
      }}
      onPointerOut={() => setHovered(false)}
      onClick={event => {
        if (interactive) {
          event.stopPropagation()
          onSelect(category.id)
        }
      }}
    >
      <mesh
        scale={[0.83, 1.05, 0.72]}
        rotation={[0.1, index * 0.4, 0.12]}
        castShadow
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          ref={material}
          color={category.color}
          emissive={category.color}
          emissiveIntensity={0.28}
          roughness={0.28}
          metalness={0.25}
          flatShading
        />
      </mesh>

      <mesh
        scale={[0.84, 1.06, 0.73]}
        rotation={[0.1, index * 0.4, 0.12]}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#f2cfff"
          wireframe
          transparent
          opacity={0.24}
        />
      </mesh>

      <group position={[0, 0, 0.15]}>
        <Glow
          color={category.color}
          size={2.7}
          opacity={
            selected || hovered ? 0.35 : 0.13
          }
        />
      </group>

      <CrystalLabel
        text={category.symbol}
        position={[0, 0.12, 0.82]}
        width={1.65}
      />

      <CrystalLabel
        text={category.short}
        position={[0, -0.75, 0.82]}
        width={1.65}
        badge
      />
    </group>
  )
}

// ======================================================
// SECRET CODEX CORE
// ======================================================

function Core({
  reduced,
  sparse,
  interactive,
  onSecret,
}: {
  reduced: boolean
  sparse: boolean
  interactive: boolean
  onSecret?: () => void
}) {
  const geometry = useCrystalGeometry()

  const crystal = useRef<Group>(null)
  const rings = useRef<Group>(null)
  const material = useRef<MeshStandardMaterial>(null)

  const [hovered, setHovered] = useState(false)
  const [burstActive, setBurstActive] = useState(false)

  const clickCount = useRef(0)
  const firstClick = useRef(0)
  const activatedAt = useRef(-Infinity)

  const pendingSecret =
    useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetBurst =
    useRef<ReturnType<typeof setTimeout> | null>(null)

  const secretCallback = useRef(onSecret)

  useCursor(hovered && interactive)

  useEffect(() => {
    secretCallback.current = onSecret
  }, [onSecret])

  useEffect(() => {
    return () => {
      if (pendingSecret.current !== null) {
        clearTimeout(pendingSecret.current)
      }

      if (resetBurst.current !== null) {
        clearTimeout(resetBurst.current)
      }
    }
  }, [])

  // ====================================================
  // CRYSTAL SECRET ACTIVATION
  // Five clicks within four seconds
  // ====================================================

  const activate = () => {
    if (!interactive) return
    if (pendingSecret.current !== null) return

    const now = performance.now()

    if (
      clickCount.current === 0 ||
      now - firstClick.current > 4000
    ) {
      firstClick.current = now
      clickCount.current = 0
    }

    clickCount.current += 1

    if (clickCount.current >= 5) {
      clickCount.current = 0
      activatedAt.current = now

      setBurstActive(true)

      if (resetBurst.current !== null) {
        clearTimeout(resetBurst.current)
      }

      // Give the glow time to appear before the card.
      pendingSecret.current = setTimeout(() => {
        pendingSecret.current = null
        secretCallback.current?.()
      }, reduced ? 250 : 1200)

      // Restore the normal aura after the animation.
      resetBurst.current = setTimeout(() => {
        resetBurst.current = null
        setBurstActive(false)
      }, reduced ? 400 : 3000)
    }
  }

  // ====================================================
  // CRYSTAL ANIMATION
  // ====================================================

  useFrame((_, delta) => {
    const elapsed =
      (performance.now() - activatedAt.current) / 1000

    const burst = reduced
      ? 0
      : Math.max(0, 1 - elapsed / 3)

    if (crystal.current) {
      if (!reduced) {
        crystal.current.rotation.y +=
          Math.min(delta, 0.1) *
          (0.12 + burst * 1.6)
      }

      crystal.current.scale.setScalar(
        reduced ? 1 : 1 + burst * 0.16
      )
    }

    if (rings.current && !reduced) {
      rings.current.rotation.y -=
        Math.min(delta, 0.1) *
        (0.08 + burst * 2)
    }

    if (material.current) {
      material.current.emissiveIntensity =
        0.55 + burst * 1.8
    }
  })

  return (
    <group name="codex-core">
      {[0, 1, 2].map(i => (
        <group
          key={i}
          position={[0, 0.5 + i * 0.25, 0]}
        >
          <mesh receiveShadow>
            <cylinderGeometry
              args={[
                2.5 - i * 0.4,
                2.7 - i * 0.4,
                0.27,
                12,
              ]}
            />
            <meshStandardMaterial
              color={
                i % 2
                  ? '#ad8cc6'
                  : '#8773a5'
              }
              roughness={0.8}
            />
          </mesh>

          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.15, 0]}
          >
            <ringGeometry
              args={[
                2.35 - i * 0.4,
                2.4 - i * 0.4,
                48,
              ]}
            />
            <meshBasicMaterial
              color="#ffc6f4"
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      <group position={[0, 4.35, 0]}>
        <group
          ref={crystal}
          onPointerOver={event => {
            if (!interactive) return
            event.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => {
            setHovered(false)
          }}
          onClick={event => {
            if (!interactive) return
            event.stopPropagation()
            activate()
          }}
        >
          <mesh geometry={geometry}>
            <meshStandardMaterial
              ref={material}
              vertexColors
              emissive="#ad6bd2"
              emissiveIntensity={0.55}
              metalness={0.2}
              roughness={0.25}
              flatShading
            />
          </mesh>

          <mesh
            geometry={geometry}
            scale={1.006}
          >
            <meshBasicMaterial
              color="#f3c1ff"
              wireframe
              transparent
              opacity={0.42}
            />
          </mesh>
        </group>

        {/* Animated activation aura */}
        <Glow
          color="#db9aff"
          size={6.2}
          opacity={burstActive ? 0.85 : 0.28}
        />

        <group
          ref={rings}
          rotation={[0.15, 0, -0.25]}
        >
          {[0, 1].map(i => (
            <group
              key={i}
              rotation={[
                Math.PI / 2 + i * 0.3,
                i * 0.4,
                0,
              ]}
            >
              <mesh>
                <torusGeometry
                  args={[
                    2 + i * 0.35,
                    0.026,
                    5,
                    72,
                  ]}
                />
                <meshBasicMaterial
                  color={
                    i
                      ? '#b9f8ff'
                      : '#ffe0ff'
                  }
                  toneMapped={false}
                />
              </mesh>

              <mesh>
                <torusGeometry
                  args={[
                    2 + i * 0.35,
                    0.065,
                    5,
                    72,
                  ]}
                />
                <meshBasicMaterial
                  color={
                    i
                      ? '#8de9ff'
                      : '#ed9cff'
                  }
                  transparent
                  opacity={0.12}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            </group>
          ))}
        </group>

        <CrystalLabel
          text="</>"
          position={[0, 0, 1.4]}
          width={2.6}
        />
      </group>

      <CrystalMotes
        reduced={reduced}
        sparse={sparse}
      />
    </group>
  )
}

// ======================================================
// MAIN SKILLS SCENE
// ======================================================

type SkillsSceneProps = {
  reduced: boolean
  mobile: boolean
  interactive: boolean
  selected: SkillCategoryId | null
  onSelect: (id: SkillCategoryId) => void
  onCoreSecret?: () => void
}

export function SkillsScene({
  reduced,
  mobile,
  interactive,
  selected,
  onSelect,
  onCoreSecret,
}: SkillsSceneProps) {
  const width = useThree(state => state.size.width)
  const sparse = mobile || width <= 1100

  return (
    <group name="skills-environment">
      <SkillsPath reduced={reduced} />

      <group position={world.skills}>
        <Island
          position={[0, 0, 0]}
          scale={2.5}
        />

        <mesh
          position={[0, 0.47, 0]}
          receiveShadow
        >
          <cylinderGeometry
            args={[6.8, 7, 0.1, 12]}
          />
          <meshStandardMaterial
            color="#78b9b9"
            roughness={1}
          />
        </mesh>

        <Core
          reduced={reduced}
          sparse={sparse}
          interactive={interactive}
          onSecret={onCoreSecret}
        />

        <LavenderBeds sparse={sparse} />

        <Crystal
          position={[-5.1, 0.5, 3.5]}
          scale={0.7}
          reduced={reduced}
        />

        <Crystal
          position={[4.7, 0.5, 3.8]}
          scale={0.8}
          reduced={reduced}
        />

        <Crystal
          position={[2.4, 0.5, -2.2]}
          scale={0.65}
          reduced={reduced}
        />

        {portfolio.skills.categories.map(
          (category, index) => (
            <SkillCrystal
              key={category.id}
              category={category}
              index={index}
              reduced={reduced}
              interactive={interactive}
              selected={selected === category.id}
              onSelect={onSelect}
            />
          )
        )}

        <Tree
          position={[-5.8, 0.5, -2]}
          scale={1.1}
          seed={89}
          reduced={reduced}
        />

        <Tree
          position={[5.4, 0.5, -3]}
          scale={0.95}
          seed={73}
          lavender
          reduced={reduced}
        />

        {[-1, 1].map(side => (
          <group key={side}>
            <Grass
              position={[
                side * 5,
                0.5,
                1.4,
              ]}
              radius={2}
              count={sparse ? 220 : 700}
            />

            <MeadowDetails
              position={[
                side * 4.8,
                0.5,
                1.5,
              ]}
              count={sparse ? 18 : 35}
            />

            <Lantern
              position={[
                side * 3.6,
                0.5,
                4,
              ]}
              reduced={reduced}
            />
          </group>
        ))}

        <Grass
          position={[-3.9, 0.5, 4.1]}
          radius={1.65}
          count={sparse ? 180 : 600}
        />

        <Grass
          position={[3.9, 0.5, 4.1]}
          radius={1.65}
          count={sparse ? 180 : 600}
        />

        {Array.from(
          { length: 7 },
          (_, i) => (
            <mesh
              key={`arrival-${i}`}
              position={[
                -0.7 +
                  Math.sin(i) * 0.12,
                0.59,
                1.8 + i * 0.57,
              ]}
              rotation={[0, i, 0]}
            >
              <cylinderGeometry
                args={[
                  0.38,
                  0.44,
                  0.12,
                  6,
                ]}
              />
              <meshStandardMaterial
                color="#c6b5d7"
                emissive="#c17bdc"
                emissiveIntensity={0.12}
              />
            </mesh>
          )
        )}

        <pointLight
          position={[0, 4, 1]}
          color="#df91ff"
          intensity={9}
          distance={12}
          decay={2}
        />

        <Waterfall
          position={[5.7, 0.4, 3.3]}
          height={2.5}
          reduced={reduced}
        />

        <Petals
          mobile
          reduced={reduced}
        />
      </group>

      <Island
        position={[71, 2.4, -36]}
        scale={0.8}
      >
        <Tree
          position={[0, 0.2, 0]}
          scale={0.85}
          seed={43}
          reduced={reduced}
        />

        <Waterfall
          position={[0, 0, 2.5]}
          height={4.5}
          reduced={reduced}
        />
      </Island>
    </group>
  )
}
