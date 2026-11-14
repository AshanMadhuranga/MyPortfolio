import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { BoxGeometry, CanvasTexture, CatmullRomCurve3, CylinderGeometry, Group, InstancedMesh, MathUtils, Mesh, MeshStandardMaterial, Object3D, OctahedronGeometry, ShaderMaterial, SRGBColorSpace, TubeGeometry, Vector3 } from 'three'
import { Crystal, Grass, Island, Lantern, MeadowDetails, Tree, Waterfall, random } from '../../components/three/Environment'
import { Glow } from '../../components/three/Glow'
import { world } from '../../config/world'

type Position = [number, number, number]
const box = new BoxGeometry(1, 1, 1)
const octahedron = new OctahedronGeometry(1)
const step = new CylinderGeometry(.6, .7, .18, 7)
const materials = {
  stone: new MeshStandardMaterial({ color: '#a78bbb', roughness: .8, flatShading: true }),
  casing: new MeshStandardMaterial({ color: '#76518c', roughness: .65 }),
  screen: new MeshStandardMaterial({ color: '#38244f', emissive: '#66348e', emissiveIntensity: .22 }),
  keys: new MeshStandardMaterial({ color: '#c8b7df', roughness: .8 }),
  pink: new MeshStandardMaterial({ color: '#ebbaed', emissive: '#bc7cd7', emissiveIntensity: .55 }),
  cyan: new MeshStandardMaterial({ color: '#b6f4e9', emissive: '#6ebdbf', emissiveIntensity: .65 }),
}
function Block({ position, scale, material = 'casing' }: { position: Position; scale: Position; material?: keyof typeof materials }) {
  return <mesh geometry={box} material={materials[material]} position={position} scale={scale} castShadow receiveShadow />
}

function Keys() {
  const ref = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    const dummy = new Object3D()
    for (let i = 0; i < 40; i++) {
      dummy.position.set(-.9 + i % 10 * .2, 1.82, .45 + Math.floor(i / 10) * .18)
      dummy.scale.set(.16, .035, .12); dummy.updateMatrix(); ref.current?.setMatrixAt(i, dummy.matrix)
    }
    if (ref.current) { ref.current.instanceMatrix.needsUpdate = true; ref.current.computeBoundingSphere() }
  }, [])
  return <instancedMesh ref={ref} args={[box, materials.keys, 40]} />
}

function Hologram({ side }: { side: number }) {
  return <group position={[side * 3.7, 2.6, .1]} rotation={[0, -side * .3, side * -.08]}>
    <Block position={[0, 0, 0]} scale={[1.65, 1.7, .1]} material="screen" />
    {[-.87, .87].map(x => <Block key={x} position={[x, 0, .05]} scale={[.035, 1.85, .035]} material="cyan" />)}
    {[0, 1, 2, 3, 4].map(i => <Block key={i} position={[-.15 + i % 2 * .12, .55 - i * .25, .07]} scale={[.9 + i % 3 * .2, .045, .02]} material={i % 2 ? 'cyan' : 'pink'} />)}
    <group position={[0, 0, -.1]}><Glow size={2.7} opacity={.12} color="#a6d9f5" /></group>
  </group>
}

function ScreenLegend() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512
    const ctx = canvas.getContext('2d')!
    ctx.textAlign = 'center'; ctx.fillStyle = '#f5d8ff'; ctx.font = 'bold 144px monospace'; ctx.fillText('>_', 512, 260)
    ctx.fillStyle = '#b8eee9'; ctx.font = '32px monospace'; ctx.fillText('ASHAN / DEVELOPER TERMINAL', 512, 400)
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={[0, 0, .2]}><planeGeometry args={[4.9, 2.4]} /><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} /></mesh>
}

function Workstation({ reduced, interactive, focused, onOpen }: { reduced: boolean; interactive: boolean; focused: boolean; onOpen: () => void }) {
  const [hover, setHover] = useState(false)
  const screen = useRef<Group>(null)
  useCursor(hover && interactive)
  useFrame((_, delta) => {
    if (screen.current) {
      const scale = interactive && (hover || focused) ? 1.025 : 1
      screen.current.scale.setScalar(reduced ? scale : MathUtils.damp(screen.current.scale.x, scale, 7, Math.min(delta, .1)))
    }
  })
  return <group name="terminal-workstation" onPointerOver={e => { if (interactive) { e.stopPropagation(); setHover(true) } }} onPointerOut={() => setHover(false)} onClick={e => { if (interactive) { e.stopPropagation(); onOpen() } }}>
    <Block position={[0, 1.65, .15]} scale={[5.4, .25, 2.2]} material="stone" />
    {[-2.1, 2.1].map(x => <group key={x}><Block position={[x, 1.05, .15]} scale={[.2, 1.2, 1.5]} /><Block position={[x, .45, .15]} scale={[.65, .12, 1.7]} material="pink" /></group>)}
    <Block position={[0, 2, -.85]} scale={[.3, .7, .3]} />
    <group ref={screen} position={[0, 3.25, -.65]}>
      <Block position={[0, 0, 0]} scale={[5.3, 2.7, .28]} />
      <Block position={[0, 0, .16]} scale={[5.05, 2.46, .05]} material="screen" />
      {[-2.7, 2.7].map(x => <Block key={x} position={[x, 0, .12]} scale={[.055, 2.85, .08]} material="pink" />)}
      {[-1.4, 1.4].map(y => <Block key={y} position={[0, y, .12]} scale={[5.45, .055, .08]} material="cyan" />)}
      <ScreenLegend />
      <group position={[0, 0, -.2]}><Glow size={6.8} color="#c08be8" opacity={interactive && (hover || focused) ? .3 : .14} /></group>
    </group>
    <Block position={[0, 1.78, .7]} scale={[2.2, .08, .85]} material="screen" /><Keys />
    <Block position={[1.65, 1.8, .7]} scale={[.3, .12, .44]} material="cyan" />
    <group position={[0, .6, 2]}><Block position={[0, .45, 0]} scale={[1.15, .25, 1]} /><Block position={[0, .9, .4]} scale={[1.15, .9, .16]} /><Block position={[0, .05, 0]} scale={[.18, .8, .18]} material="stone" /></group>
    <Hologram side={-1} /><Hologram side={1} />
  </group>
}

function Approach() {
  const ref = useRef<InstancedMesh>(null)
  const curve = useMemo(() => new CatmullRomCurve3([new Vector3(-27, 4.22, 11.2), new Vector3(-20, 3.8, 9), new Vector3(-12, 2.1, 6), new Vector3(-6, .7, 4), new Vector3(0, .6, 3)]), [])
  const ribbon = useMemo(() => new TubeGeometry(curve, 80, .035, 5, false), [curve])
  useEffect(() => () => ribbon.dispose(), [ribbon])
  useLayoutEffect(() => {
    const dummy = new Object3D()
    for (let i = 0; i < 65; i++) {
      const t = i / 64, p = curve.getPointAt(t), tangent = curve.getTangentAt(t)
      dummy.position.copy(p); dummy.rotation.y = Math.atan2(tangent.x, tangent.z); dummy.scale.set(1.15, 1, .85); dummy.updateMatrix(); ref.current?.setMatrixAt(i, dummy.matrix)
    }
    if (ref.current) { ref.current.instanceMatrix.needsUpdate = true; ref.current.computeBoundingSphere() }
  }, [curve])
  return <group><instancedMesh ref={ref} args={[step, materials.stone, 65]} receiveShadow /><mesh geometry={ribbon} position={[0, .13, 0]}><meshBasicMaterial color="#eeb9fb" /></mesh>{[.15, .38, .62, .84].map(t => { const p = curve.getPointAt(t); return <Lantern key={t} position={[p.x + .8, p.y, p.z]} reduced /> })}<Island position={[-15, .7, 7]} scale={.7} /><Crystal position={[-15.8, .9, 6.5]} reduced /></group>
}

function ObservatoryMagic({ reduced, compact, secretPulse, interactive }: { reduced: boolean; compact: boolean; secretPulse: number; interactive: boolean }) {
  const rings = useRef<Group>(null), particles = useRef<InstancedMesh>(null), halo = useRef<Group>(null)
  const time = useRef(0), pulse = useRef(0), initialized = useRef(false)
  const lastSecret = useRef(secretPulse)
  const count = compact ? 16 : 32
  const dummy = useMemo(() => new Object3D(), [])
  useEffect(() => {
    if (secretPulse !== lastSecret.current && !reduced && interactive) pulse.current = 1
    lastSecret.current = secretPulse
  }, [secretPulse, reduced, interactive])
  useEffect(() => { initialized.current = false }, [count])
  useFrame((_, delta) => {
    const dt = Math.min(delta, .1)
    if (!reduced) time.current += dt
    pulse.current = reduced || !interactive ? 0 : Math.max(0, pulse.current - dt / 5)
    if (halo.current) {
      const envelope = Math.sin(pulse.current * Math.PI)
      halo.current.visible = pulse.current > 0; halo.current.scale.setScalar(1 + envelope * .15)
      halo.current.traverse(object => { if (object instanceof Mesh && object.material instanceof ShaderMaterial) object.material.uniforms.strength.value = envelope * .3 })
    }
    if (rings.current && !reduced) rings.current.rotation.y = Math.sin(time.current * .14) * .08
    if (!particles.current || (reduced && initialized.current)) return
    for (let i = 0; i < count; i++) {
      const angle = random(i + 70) * Math.PI * 2 + time.current * .04
      dummy.position.set(Math.cos(angle) * (3 + random(i) * 2), .8 + random(i + 10) * 4 + Math.sin(time.current * .3 + i) * .15, Math.sin(angle) * 3)
      dummy.rotation.set(i, time.current * .12, .3); dummy.scale.setScalar(.04 + random(i + 40) * .06); dummy.updateMatrix(); particles.current.setMatrixAt(i, dummy.matrix)
    }
    initialized.current = true; particles.current.instanceMatrix.needsUpdate = true
  })
  return <group>
    <group ref={rings} position={[0, 3, -1.8]}><mesh rotation={[.2, .1, 0]}><torusGeometry args={[3.7, .035, 6, 64]} /><meshBasicMaterial color="#d9a8ed" transparent opacity={.65} /></mesh><mesh rotation={[Math.PI / 2.8, 0, .25]}><torusGeometry args={[3.9, .025, 6, 64]} /><meshBasicMaterial color="#b4e8ec" transparent opacity={.55} /></mesh></group>
    <group ref={halo} name="terminal-secret-glow" visible={false}>{[-3.7, 4].map(x => <group key={x} position={[x, 1.2, 2.7]}><Glow size={3.5} color="#c7f3ee" opacity={.3} /></group>)}</group>
    <instancedMesh ref={particles} args={[octahedron, materials.pink, count]} frustumCulled={false} />
  </group>
}

export function TerminalScene({ reduced, compact, interactive, focused, secretPulse, onOpen }: { reduced: boolean; compact: boolean; interactive: boolean; focused: boolean; secretPulse: number; onOpen: () => void }) {
  const width = useThree(state => state.size.width)
  const low = compact || width <= 1100
  return <group name="terminal-environment" position={world.terminal}>
    <Approach />
    <Island position={[0, 0, 0]} scale={1.8} />
    <Grass position={[0, .33, 0]} radius={5.7} count={low ? 260 : 800} /><group scale={1.7}><MeadowDetails position={[0, .2, 0]} count={low ? 24 : 60} /></group>
    <mesh position={[0, .4, 0]} receiveShadow><cylinderGeometry args={[3.3, 3.6, .25, 12]} /><meshStandardMaterial color="#b7a0c8" roughness={.8} /></mesh>
    <mesh position={[0, .55, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[3.2, .04, 6, 64]} /><meshBasicMaterial color="#e8b9f5" /></mesh>
    <Tree position={[-4.5, .3, -2.8]} scale={.85} lavender seed={360} reduced={reduced} /><Tree position={[4.5, .3, -3]} scale={1} lavender seed={380} reduced={reduced} />
    {!low && <Tree position={[-5.2, .3, 1.4]} scale={.5} seed={370} reduced={reduced} />}
    <Crystal position={[-3.7, .3, 2.8]} scale={1.3} reduced={reduced} /><Crystal position={[4, .3, 2.6]} scale={1.1} reduced={reduced} />
    <Lantern position={[-2.5, .4, 3.4]} reduced={reduced} /><Lantern position={[2.8, .4, 3.2]} reduced={reduced} />
    {!low && <Waterfall position={[-3.4, .25, 3.4]} height={4.25} reduced={reduced} />}
    <Workstation reduced={reduced} interactive={interactive} focused={focused} onOpen={onOpen} />
    <ObservatoryMagic reduced={reduced} compact={low} secretPulse={secretPulse} interactive={interactive} />
  </group>
}
