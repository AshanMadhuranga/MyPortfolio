import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { CatmullRomCurve3, CylinderGeometry, Group, InstancedMesh, MathUtils, MeshStandardMaterial, Object3D, OctahedronGeometry, TubeGeometry, Vector3 } from 'three'
import { Crystal, Grass, Island, Lantern, MeadowDetails, Tree, Water, Waterfall, random } from '../../components/three/Environment'
import { Portal } from '../../components/three/Portal'
import { Glow } from '../../components/three/Glow'
import { world } from '../../config/world'

const step = new CylinderGeometry(.65, .72, .18, 7)
const stone = new MeshStandardMaterial({ color: '#b9a3cf', roughness: .85, flatShading: true })
const fragment = new OctahedronGeometry(1)
const fragmentMaterial = new MeshStandardMaterial({ color: '#d1b5ec', emissive: '#b184cd', emissiveIntensity: .2, flatShading: true })

function Connection() {
  const ref = useRef<InstancedMesh>(null)
  const curve = useMemo(() => new CatmullRomCurve3([new Vector3(-24, .5, 20), new Vector3(-18, .9, 17), new Vector3(-10, 1, 11), new Vector3(-5, .6, 6), new Vector3(0, .5, 3)]), [])
  const line = useMemo(() => new TubeGeometry(curve, 64, .03, 5, false), [curve])
  useEffect(() => () => line.dispose(), [line])
  useLayoutEffect(() => {
    const dummy = new Object3D()
    for (let i = 0; i < 65; i++) { const t = i / 64, tangent = curve.getTangentAt(t); dummy.position.copy(curve.getPointAt(t)); dummy.rotation.y = Math.atan2(tangent.x, tangent.z); dummy.scale.set(1.1, 1, .85); dummy.updateMatrix(); ref.current?.setMatrixAt(i, dummy.matrix) }
    if (ref.current) { ref.current.instanceMatrix.needsUpdate = true; ref.current.computeBoundingSphere() }
  }, [curve])
  return <group><instancedMesh ref={ref} args={[step, stone, 65]} receiveShadow /><mesh geometry={line} position={[0, .12, 0]}><meshBasicMaterial color="#efc2fb" /></mesh>{[.1, .35, .6, .85].map(t => { const p = curve.getPointAt(t); return <Lantern key={t} position={[p.x + .8, p.y, p.z]} reduced /> })}</group>
}

function Fragments({ reduced, compact }: { reduced: boolean; compact: boolean }) {
  const ref = useRef<InstancedMesh>(null), time = useRef(0), initialized = useRef(false)
  const dummy = useMemo(() => new Object3D(), [])
  const count = compact ? 16 : 32
  useEffect(() => { initialized.current = false }, [count])
  useFrame((_, delta) => {
    if (!ref.current || reduced && initialized.current) return
    if (!reduced) time.current += Math.min(delta, .1)
    for (let i = 0; i < count; i++) {
      const angle = i * 2.399 + time.current * .035, large = i < 6
      dummy.position.set(Math.cos(angle) * (large ? 4.2 : 3.7), 1.2 + random(i + 20) * 5.4 + Math.sin(time.current * .4 + i) * .14, Math.sin(angle) * 2.5)
      dummy.rotation.set(i, time.current * .08, .3); dummy.scale.set(1, large ? 1 : .28, 1).multiplyScalar(large ? .17 + random(i) * .12 : .045); dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix)
    }
    initialized.current = true; ref.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh name="contact-fragments" ref={ref} args={[fragment, fragmentMaterial, count]} frustumCulled={false} />
}

export function ContactScene({ reduced, compact, interactive, activated, onOpen }: { reduced: boolean; compact: boolean; interactive: boolean; activated: boolean; onOpen: () => void }) {
  const [hover, setHover] = useState(false)
  const portal = useRef<Group>(null)
  const width = useThree(state => state.size.width), low = compact || width <= 1100
  useCursor(hover && interactive)
  useFrame((_, delta) => { if (portal.current) { const target = interactive && (hover || activated) ? 1.045 : 1; portal.current.scale.setScalar(reduced ? target : MathUtils.damp(portal.current.scale.x, target, 5, Math.min(delta, .1))) } })
  return <group>
    <group position={[180, 0, -180]}><Water reduced={reduced} /></group>
    <group name="contact-environment" position={world.contact}>
      <Connection /><Island position={[0, 0, 0]} scale={1.85} />
      <Grass position={[0, .32, 0]} radius={5.7} count={low ? 240 : 750} /><group scale={1.6}><MeadowDetails position={[0, .2, 0]} count={low ? 24 : 56} /></group>
      <mesh position={[0, .45, -.4]} receiveShadow><cylinderGeometry args={[3.5, 3.8, .35, 12]} /><meshStandardMaterial color="#b19ac7" /></mesh>
      {[0, 1, 2].map(i => <mesh key={i} position={[0, .4 + i * .14, 3 - i * .65]} receiveShadow><boxGeometry args={[3.4 - i * .18, .25, .85]} /><meshStandardMaterial color="#c3afd4" /></mesh>)}
      <group name="contact-portal" position={[0, .65, -.7]} ref={portal} onPointerOver={e => { if (interactive) { e.stopPropagation(); setHover(true) } }} onPointerOut={() => setHover(false)} onClick={e => { if (interactive) { e.stopPropagation(); onOpen() } }}>
        <Portal reduced={reduced} /><group position={[0, 2.6, .5]}><Glow size={8} color="#c9b6ff" opacity={activated ? .22 : .05} /></group>
      </group>
      <Tree position={[-4.5, .3, -2.4]} scale={.95} seed={470} reduced={reduced} /><Tree position={[4.5, .3, -2.7]} scale={.85} seed={480} lavender reduced={reduced} />
      {[-1, 1].map(side => <group key={side}><Crystal position={[side * 2.7, .65, .5]} scale={1.3} reduced={reduced} /><Crystal position={[side * 4.3, .3, 2.1]} scale={.7} reduced={reduced} /><Lantern position={[side * 2.1, .4, 3.3]} reduced={reduced} /></group>)}
      {!low && <Waterfall position={[3.6, .15, 3.5]} height={4.2} reduced={reduced} />}
      <Fragments reduced={reduced} compact={low} />
    </group>
  </group>
}
