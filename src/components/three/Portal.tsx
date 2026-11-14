
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  useFrame,
  type ThreeEvent,
} from '@react-three/fiber'

import * as THREE from 'three'

import { Glow } from './Glow'

// ======================================================
// PORTAL MATERIALS
// ======================================================

const archMaterial = new THREE.MeshStandardMaterial({
  color: '#79618f',
  roughness: 0.9,
  flatShading: true,
})

const archHighlight = new THREE.MeshStandardMaterial({
  color: '#b39cc9',
  roughness: 0.8,
  flatShading: true,
})

// ======================================================
// PORTAL ARCH GEOMETRY
// ======================================================

const wedge = new THREE.Shape()

wedge.absarc(
  0,
  0,
  2.48,
  0,
  Math.PI / 10 - 0.025,
  false
)

wedge.absarc(
  0,
  0,
  1.95,
  Math.PI / 10 - 0.025,
  0,
  true
)

wedge.closePath()

const wedgeGeometry = new THREE.ExtrudeGeometry(
  wedge,
  {
    depth: 0.65,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.035,
    curveSegments: 2,
  }
)

// ======================================================
// VORTEX SHADER
// ======================================================

const vortexFragment = `
varying vec2 vUv;

uniform float time;
uniform float power;

void main() {
  vec2 p = (vUv - 0.5) * 2.0;

  float r = length(p);
  float a = atan(p.y, p.x);

  float spiral = pow(
    0.5 + 0.5 *
    sin(a * 3.0 - r * 19.0 + time * 1.5),
    3.0
  );

  float core = exp(-r * 5.0);

  float rim = exp(
    -pow((r - 0.94) * 27.0, 2.0)
  );

  vec3 col = mix(
    vec3(0.19, 0.025, 0.38),
    vec3(0.82, 0.12, 0.75),
    spiral * 0.8
  );

  col += vec3(0.9, 0.45, 0.75) * core;
  col += vec3(0.8, 0.45, 0.85) * rim;

  // Stronger activation brightness.
  col += vec3(1.4, 0.8, 1.6)
    * power * 2.0;

  // Brighten the entire portal interior
  // instead of only the center.
  float innerGlow =
    1.0 - smoothstep(0.15, 0.95, r);

  col += vec3(1.0, 0.45, 1.2)
    * innerGlow * power;

  gl_FragColor = vec4(
    col,
    (1.0 - smoothstep(0.94, 1.0, r))
      * 0.94
  );
}
`

// ======================================================
// PORTAL PROPS
// ======================================================

type PortalProps = {
  reduced: boolean
  onSecret?: () => void
}

// ======================================================
// PORTAL COMPONENT
// ======================================================

export function Portal({
  reduced,
  onSecret,
}: PortalProps) {
  const energy = useRef<THREE.Group>(null)

  const vortex =
    useRef<THREE.ShaderMaterial>(null)

  const burstLight =
    useRef<THREE.PointLight>(null)

  const flashMaterial =
    useRef<THREE.MeshBasicMaterial>(null)

  const flashMesh =
    useRef<THREE.Mesh>(null)

  const ringMaterials = useRef<
    Array<THREE.MeshBasicMaterial | null>
  >([])

  // ====================================================
  // EASTER EGG STATE
  // ====================================================

  const clickCount = useRef(0)
  const lastClick = useRef(0)

  const activationTime =
    useRef(-Infinity)

  const pendingSecret =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    )

  const [burstActive, setBurstActive] =
    useState(false)

  const secretCallback = useRef(onSecret)

  // ====================================================
  // CALLBACK MANAGEMENT
  // ====================================================

  useEffect(() => {
    secretCallback.current = onSecret
  }, [onSecret])

  useEffect(() => {
    return () => {
      if (pendingSecret.current !== null) {
        clearTimeout(pendingSecret.current)
      }

      document.body.style.cursor = ''
    }
  }, [])

  // ====================================================
  // SHADER UNIFORMS
  // ====================================================

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      power: { value: 0 },
    }),
    []
  )

  // ====================================================
  // ACTIVATE SECRET
  // ====================================================

  const activateSecret = () => {
    if (pendingSecret.current !== null) {
      return
    }

    clickCount.current = 0

    activationTime.current =
      performance.now()

    setBurstActive(true)

    pendingSecret.current = setTimeout(
      () => {
        pendingSecret.current = null

        secretCallback.current?.()
      },
      reduced ? 250 : 1200
    )
  }

  // ====================================================
  // THREE-CLICK DETECTION
  // ====================================================

  const handlePortalClick = (
    event: ThreeEvent<MouseEvent>
  ) => {
    event.stopPropagation()

    if (pendingSecret.current !== null) {
      return
    }

    const now = performance.now()

    if (now - lastClick.current > 1800) {
      clickCount.current = 0
    }

    lastClick.current = now
    clickCount.current += 1

    if (clickCount.current >= 3) {
      activateSecret()
    }
  }

  // ====================================================
  // FRAME ANIMATION
  // ====================================================

  useFrame(({ clock }, delta) => {
    const elapsed = clock.elapsedTime

    const activeFor =
      (performance.now() -
        activationTime.current) / 1000

    // Fast initial flash, followed by a slower fade.
    const burst = reduced
      ? 0
      : Math.max(
          0,
          1 - activeFor / 2.5
        )

    // A pronounced flash during the first second.
    const flash = reduced
      ? 0
      : Math.max(
          0,
          1 - activeFor / 1.15
        )

    // ================================================
    // VORTEX BRIGHTNESS
    // ================================================

    if (vortex.current) {
      vortex.current.uniforms.power.value =
        burst

      if (!reduced) {
        vortex.current.uniforms.time.value =
          elapsed
      }
    }

    // ================================================
    // ROTATING ENERGY RINGS
    // ================================================

    if (energy.current) {
      if (!reduced) {
        energy.current.rotation.z =
          elapsed * 0.16 +
          burst * 0.65

        energy.current.scale.setScalar(
          1 + burst * 0.18
        )
      } else {
        energy.current.scale.setScalar(1)
      }
    }

    // ================================================
    // BRIGHTER ENERGY RING MATERIALS
    // ================================================

    ringMaterials.current.forEach(material => {
      if (!material) return

      material.opacity =
        0.65 + burst * 0.35
    })

    // ================================================
    // FRONT-FACING FLASH DISC
    // ================================================

    if (flashMaterial.current) {
      flashMaterial.current.opacity =
        flash * 0.85
    }

    if (flashMesh.current) {
      const targetScale =
        1 + burst * 0.12

      const currentScale =
        flashMesh.current.scale.x

      const nextScale = THREE.MathUtils.damp(
        currentScale,
        targetScale,
        9,
        Math.min(delta, 0.1)
      )

      flashMesh.current.scale.setScalar(
        nextScale
      )
    }

    // ================================================
    // LIGHT BURST
    // ================================================

    if (burstLight.current) {
      burstLight.current.intensity =
        16 + burst * 40
    }

    // ================================================
    // RESTORE NORMAL AURA
    // ================================================

    if (
      burstActive &&
      activeFor >= 2.5
    ) {
      setBurstActive(false)
    }
  })

  // ====================================================
  // PORTAL GEOMETRY
  // ====================================================

  return (
    <group position={[0, 2.65, 0]}>
      {/* STONE ARCH */}

      {Array.from(
        { length: 20 },
        (_, i) => (
          <mesh
            key={i}
            geometry={wedgeGeometry}
            material={
              i % 4
                ? archMaterial
                : archHighlight
            }
            rotation={[
              0,
              0,
              i * Math.PI / 10,
            ]}
            position={[0, 0, -0.32]}
            castShadow
          />
        )
      )}

      {/* SURROUNDING MAGICAL AURA */}

      <group position={[0, 0, 0.38]}>
        <Glow
          color="#f4a4ff"
          size={7.8}
          opacity={
            burstActive ? 0.95 : 0.32
          }
        />
      </group>

      {/* PORTAL VORTEX */}

      <mesh
        position={[0, 0, 0.05]}
        onClick={handlePortalClick}
        onPointerOver={() => {
          document.body.style.cursor =
            'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor =
            ''
        }}
      >
        <circleGeometry args={[1.94, 64]} />

        <shaderMaterial
          ref={vortex}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          vertexShader={`
            varying vec2 vUv;

            void main() {
              vUv = uv;

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
            }
          `}
          fragmentShader={vortexFragment}
        />
      </mesh>

      {/* NEW FRONT-FACING FLASH DISC */}
      {/* It does not intercept portal clicks. */}

      <mesh
        ref={flashMesh}
        position={[0, 0, 0.48]}
        raycast={() => null}
      >
        <circleGeometry args={[1.9, 64]} />

        <meshBasicMaterial
          ref={flashMaterial}
          color="#ffd6ff"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* OUTER PORTAL RIM */}

      <mesh
        position={[0, 0, 0.12]}
      >
        <torusGeometry
          args={[1.9, 0.045, 6, 80]}
        />

        <meshBasicMaterial
          color="#ffc7fb"
          toneMapped={false}
        />
      </mesh>

      {/* ROTATING ENERGY RINGS */}

      <group
        ref={energy}
        position={[0, 0, 0.16]}
      >
        {[1.72, 1.4, 1.08, 0.75].map(
          (r, i) => (
            <mesh
              key={r}
              rotation={[
                0,
                0,
                i * 1.4,
              ]}
            >
              <torusGeometry
                args={[
                  r,
                  0.014,
                  5,
                  56,
                  Math.PI * 1.35,
                ]}
              />

              <meshBasicMaterial
                ref={material => {
                  ringMaterials.current[i] =
                    material
                }}
                color="#ffb3fa"
                transparent
                opacity={0.65}
                toneMapped={false}
              />
            </mesh>
          )
        )}

        {/* FLOATING PORTAL SPARKS */}

        {Array.from(
          { length: 18 },
          (_, i) => {
            const a = i * 2.399

            const r =
              1.95 +
              (i % 3) * 0.16

            return (
              <mesh
                key={i}
                position={[
                  Math.cos(a) * r,
                  Math.sin(a) * r,
                  0.1,
                ]}
                scale={
                  0.018 +
                  (i % 3) * 0.008
                }
              >
                <octahedronGeometry />

                <meshBasicMaterial
                  color="#ffd6ff"
                  toneMapped={false}
                />
              </mesh>
            )
          }
        )}
      </group>

      {/* PORTAL DECORATIVE CRYSTALS */}

      {[0, 1, 2, 3, 4].map(i => (
        <mesh
          key={i}
          position={[
            Math.sin(
              i * Math.PI / 3
            ) * 2.2,
            Math.cos(
              i * Math.PI / 3
            ) * 2.2,
            0.43,
          ]}
          scale={[0.09, 0.22, 0.05]}
        >
          <octahedronGeometry />

          <meshBasicMaterial
            color="#fca4f9"
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* PORTAL LIGHT */}

      <pointLight
        ref={burstLight}
        color="#e86aff"
        intensity={16}
        distance={9}
        decay={2}
      />
    </group>
  )
}


