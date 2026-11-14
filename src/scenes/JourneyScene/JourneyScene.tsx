import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { BoxGeometry, CatmullRomCurve3, Color, CylinderGeometry, Group, IcosahedronGeometry, InstancedMesh, MathUtils, MeshStandardMaterial, Object3D, OctahedronGeometry, SphereGeometry, TubeGeometry, Vector3 } from 'three'
import { Crystal, Grass, Island, Lantern, MeadowDetails, Tree, Waterfall, random } from '../../components/three/Environment'
import { Glow } from '../../components/three/Glow'
import { JourneyLabel } from './JourneyLabel'
import { JourneySculpture } from './JourneySculptures'
import { milestones, type MilestoneId } from '../../config/journey'
import { world } from '../../config/world'

type Position = [number, number, number]
// An ascending S-shaped ridge: islands meet the path, monuments sit beside it.
const stops: Position[] = [[-6, .7, 8], [1, 1.7, 5], [-4, 2.8, 0], [4, 3.9, -3], [-1, 5, -8], [5, 6.1, -12]]
const stone = new MeshStandardMaterial({ color: '#b8a0cb', roughness: .85, flatShading: true })
const dark = new MeshStandardMaterial({ color: '#453851', roughness: .75 })
const bright = new MeshStandardMaterial({ color: '#f3c0fa', emissive: '#d98fea', emissiveIntensity: .65 })
const box = new BoxGeometry(1, 1, 1)
const gem = new OctahedronGeometry(1)
const rock = new IcosahedronGeometry(1, 0)
const step = new CylinderGeometry(.65, .72, .18, 7)
const mushroomStem = new CylinderGeometry(.035, .055, .24, 5)
const mushroomCap = new SphereGeometry(.16, 7, 3, 0, Math.PI * 2, 0, Math.PI / 2)
const cream = new MeshStandardMaterial({ color: '#f0dcec', roughness: .9 })
const rose = new MeshStandardMaterial({ color: '#ce86b4', roughness: .8 })
const labelLines = [['The Beginning'], ['Foundations'], ['Full-Stack Apps'], ['Artificial', 'Intelligence'], ['Mobile', 'Development'], ['The Road Ahead']] as const
const pedestal = new CylinderGeometry(1.15, 1.35, .3, 8)

function Block({ position, scale, light = false }: { position: Position; scale: Position; light?: boolean }) {
  return <mesh geometry={box} material={light ? bright : dark} position={position} scale={scale} />
}

function MilestoneIsland({ index, reduced, compact, interactive, selected, onSelect }: { index: number; reduced: boolean; compact: boolean; interactive: boolean; selected: boolean; onSelect: (id: MilestoneId) => void }) {
  const milestone = milestones[index]
  const monument = useRef<Group>(null)
  const [hover, setHover] = useState(false)
  const active = interactive && (hover || selected)
  useCursor(hover && interactive)
  useFrame((_, delta) => {
    if (!monument.current) return
    const scale = active ? 1.06 : 1
    monument.current.scale.setScalar(reduced ? scale : MathUtils.damp(monument.current.scale.x, scale, 8, Math.min(delta, .1)))
  })
  return <group position={stops[index]}>
    <Island position={[0, -.2, 0]} scale={1.13} />
    <Grass position={[0, 0, 0]} count={compact ? 110 : 320} radius={3.2} />
    <MeadowDetails position={[0, 0, 0]} count={compact ? 18 : 40} />
    <Tree position={[-2.65, .05, -1.6]} scale={index === 5 ? .65 : .43 + index % 3 * .065} lavender={index % 2 === 0} seed={160 + index} reduced={reduced} />
    {!compact && <Tree position={[2.7, .05, -1.9]} scale={.32 + index % 2 * .1} lavender={index % 2 !== 0} seed={200 + index} reduced={reduced} />}
    <Lantern position={[2.9, .05, 1.35]} reduced={reduced} /><Crystal position={[-2.3, 0, 1]} scale={.8} reduced={reduced} />
    {!compact && index % 2 === 0 && <Waterfall position={[-1.65, -.04, 2.25]} height={stops[index][1] + 1.96} reduced={reduced} />}
    <mesh geometry={rock} material={stone} position={[2.7, .25, .4]} scale={[.55, .4, .55]} />
    <group name={`milestone-${milestone.id}`} position={[0, 0, -.7]} onPointerOver={e => { if (interactive) { e.stopPropagation(); setHover(true) } }} onPointerOut={() => setHover(false)} onClick={e => { if (interactive) { e.stopPropagation(); onSelect(milestone.id) } }}>
      <mesh geometry={pedestal} material={stone} position={[0, .12, 0]} scale={[1.16, .8, 1.16]} />
      <mesh geometry={pedestal} material={bright} position={[0, .29, 0]} scale={[.93, .18, .93]} />
      <mesh geometry={pedestal} material={dark} position={[0, .42, 0]} scale={[.82, .65, .82]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .54, 0]}><torusGeometry args={[.88, .04, 6, 32]} /><meshBasicMaterial color={milestone.theme.color} /></mesh>
      <group ref={monument} name={`journey-monument-${milestone.id}`}>
        <mesh visible={index === 0 || index === 3} scale={[index === 0 ? .8 : 1, index === 4 ? .9 : 1, 1]} position={[0, 2.15, -.52]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[1.25, 1.25, .15, 6]} /><meshStandardMaterial color="#544164" emissive={milestone.theme.color} emissiveIntensity={active ? .25 : .06} /></mesh>
        <mesh visible={index === 0 || index === 3} scale={[index === 0 ? .8 : 1, index === 4 ? .9 : 1, 1]} position={[0, 2.15, -.41]} rotation={[0, 0, Math.PI / 6]}><torusGeometry args={[1.25, .045, 6, 6]} /><meshBasicMaterial color={milestone.theme.color} /></mesh>
        <JourneySculpture index={index} reduced={reduced} active={active} />
        <group position={[0, 2.1, -.35]}><Glow color={milestone.theme.color} size={3.7} opacity={interactive && (hover || selected) ? .35 : .16} /></group>

      </group>
      {/* Sign stays fixed to the island while the sculpture scales independently. */}
      <Block position={[.2, .08, 3]} scale={[3.5, .15, .45]} />
      {[-1.25, 1.25].map(x => <Block key={x} position={[x + .2, .35, 3]} scale={[.1, .55, .12]} light={active} />)}
      <JourneyLabel number={index + 1} lines={labelLines[index]} active={active} reduced={reduced} />
    </group>
  </group>
}

function Pathway() {
  const mesh = useRef<InstancedMesh>(null)
  const curve = useMemo(() => new CatmullRomCurve3([
    new Vector3(-24, 1.25, 18), new Vector3(-19, 1.1, 15), new Vector3(-13, .9, 13),
    ...stops.map(p => new Vector3(p[0], p[1] + .12, p[2] + 1.2)),
  ], false, 'centripetal'), [])
  const ribbons = useMemo(() => [-1, 1].map(side => {
    const points = Array.from({ length: 161 }, (_, i) => {
      const t = i / 160, p = curve.getPointAt(t), tangent = curve.getTangentAt(t)
      return p.add(new Vector3(tangent.z, 0, -tangent.x).normalize().multiplyScalar(side * .61)).add(new Vector3(0, .13, 0))
    })
    return new TubeGeometry(new CatmullRomCurve3(points), 160, .025, 5, false)
  }), [curve])
  useEffect(() => () => ribbons.forEach(ribbon => ribbon.dispose()), [ribbons])
  useLayoutEffect(() => {
    const dummy = new Object3D()
    for (let i = 0; i < 110; i++) {
      const t = i / 109, p = curve.getPointAt(t), tangent = curve.getTangentAt(t)
      dummy.position.copy(p); dummy.rotation.set(0, Math.atan2(tangent.x, tangent.z), 0); dummy.scale.set(1.2 + random(i + 60) * .1, 1, .84 + random(i + 80) * .08); dummy.updateMatrix()
      mesh.current?.setMatrixAt(i, dummy.matrix)
    }
    if (mesh.current) { mesh.current.instanceMatrix.needsUpdate = true; mesh.current.computeBoundingSphere() }
  }, [curve])
  return <group><instancedMesh ref={mesh} args={[step, stone, 110]} receiveShadow />{ribbons.map((ribbon, i) => <mesh key={i} geometry={ribbon}><meshBasicMaterial color={i ? "#eac5ff" : "#ffc5e9"} /></mesh>)}{[.12, .23, .36, .49, .62, .75, .88].map(t => { const p = curve.getPointAt(t); return <Lantern key={t} position={[p.x + .8, p.y, p.z]} reduced /> })}</group>
}

function Atmosphere({ reduced, compact }: { reduced: boolean; compact: boolean }) {
  const ref = useRef<InstancedMesh>(null)
  const time = useRef(0)
  const initialized = useRef(false)
  const dummy = useMemo(() => new Object3D(), [])
  const count = compact ? 18 : 40
  useEffect(() => { initialized.current = false }, [count])
  useFrame((_, delta) => {
    if (!ref.current || (reduced && initialized.current)) return
    if (!reduced) time.current += Math.min(delta, .1)
    for (let i = 0; i < count; i++) {
      dummy.position.set((random(i + 40) - .5) * 17, 1.5 + random(i + 90) * 8 + Math.sin(time.current * .4 + i) * .2, 10 - random(i + 10) * 26)
      dummy.rotation.set(i, time.current * .15 + i, 0); if (i % 3) dummy.scale.set(.1, .025, .065); else dummy.scale.setScalar(.06); dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix)
    }
    if (!initialized.current) {
      for (let i = 0; i < count; i++) ref.current.setColorAt(i, new Color(i % 3 ? '#ffbbdf' : '#c8eefa'))
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    }
    initialized.current = true
    ref.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={ref} args={[gem, bright, count]} frustumCulled={false} />
}

function LavenderFlowers({ compact }: { compact: boolean }) {
  const ref = useRef<InstancedMesh>(null)
  const count = compact ? 72 : 180
  useLayoutEffect(() => {
    const dummy = new Object3D()
    for (let i = 0; i < count; i++) {
      const stop = stops[i % stops.length], angle = random(i + 400) * Math.PI * 2, radius = 2 + random(i + 300) * .9
      dummy.position.set(stop[0] + Math.cos(angle) * radius, stop[1] + .2, stop[2] + Math.sin(angle) * radius * .75)
      dummy.scale.set(.09, .16 + random(i) * .16, .09); dummy.rotation.set(.1, i, .15); dummy.updateMatrix(); ref.current?.setMatrixAt(i, dummy.matrix)
    }
    if (ref.current) { ref.current.instanceMatrix.needsUpdate = true; ref.current.computeBoundingSphere() }
  }, [count])
  return <instancedMesh ref={ref} args={[gem, undefined, count]}><meshStandardMaterial color="#d0acff" emissive="#aa71da" emissiveIntensity={.2} /></instancedMesh>
}


function Mushrooms({ compact }: { compact: boolean }) {
  const stems = useRef<InstancedMesh>(null), caps = useRef<InstancedMesh>(null)
  const count = compact ? 18 : 36
  useLayoutEffect(() => {
    const dummy = new Object3D()
    for (let i = 0; i < count; i++) {
      const p = stops[i % 6], a = random(i + 700) * Math.PI * 2, radius = 2.3 + random(i + 900) * .5, scale = .65 + random(i) * .7
      dummy.position.set(p[0] + Math.cos(a) * radius, p[1] + .12 * scale, p[2] + Math.sin(a) * radius * .7)
      dummy.rotation.set(0, i, 0); dummy.scale.setScalar(scale); dummy.updateMatrix(); stems.current?.setMatrixAt(i, dummy.matrix)
      dummy.position.y += .12 * scale; dummy.updateMatrix(); caps.current?.setMatrixAt(i, dummy.matrix)
    }
    for (const mesh of [stems.current, caps.current]) if (mesh) { mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere() }
  }, [count])
  return <group><instancedMesh ref={stems} args={[mushroomStem, cream, count]} /><instancedMesh ref={caps} args={[mushroomCap, rose, count]} /></group>
}

export function JourneyScene({ reduced, mobile, interactive, selected, onSelect }: { reduced: boolean; mobile: boolean; interactive: boolean; selected: MilestoneId | null; onSelect: (id: MilestoneId) => void }) {
  const width = useThree(state => state.size.width)
  const compact = mobile || width <= 1100
  return <group name="journey-environment" position={world.journey}>
    <Pathway />
    <Island position={[-16, -.2, 14]} scale={.6} /><Tree position={[-16.8, -.1, 13.5]} scale={.43} lavender reduced={reduced} />
    <Island position={[-10, -.2, 11]} scale={.6} /><Crystal position={[-10.8, 0, 10.2]} reduced={reduced} />
    {milestones.map((m, index) => <MilestoneIsland key={m.id} index={index} reduced={reduced} compact={compact} interactive={interactive} selected={selected === m.id} onSelect={onSelect} />)}
    <Atmosphere reduced={reduced} compact={compact} />
    <LavenderFlowers compact={compact} />
    <Mushrooms compact={compact} />
  </group>
}
