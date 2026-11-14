import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, InstancedMesh, Object3D } from 'three'
import { random } from '../../components/three/Environment'

/** One draw call for the drifting fragments; its local clock pauses in calm mode. */
export function CrystalMotes({ reduced, sparse }: { reduced: boolean; sparse: boolean }) {
  const ref = useRef<InstancedMesh>(null)
  const time = useRef(0)
  const dummy = useMemo(() => new Object3D(), [])
  const count = sparse ? 18 : 36
  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) ref.current?.setColorAt(i, new Color(i % 3 ? '#efbaff' : '#b3f5fa'))
    if (ref.current?.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [count])
  useFrame((_, delta) => {
    if (!ref.current) return
    if (!reduced) time.current += Math.min(delta, .1)
    const t = time.current
    for (let i = 0; i < count; i++) {
      const angle = i * 2.399 + t * (.035 + random(i) * .025), radius = 1.8 + random(i + 3) * 1.25
      dummy.position.set(Math.cos(angle) * radius, 1.2 + random(i + 22) * 5.5 + Math.sin(t * .5 + i) * .18, Math.sin(angle) * radius)
      dummy.rotation.set(i + t * .1, angle, .3)
      const size = .035 + random(i + 10) * .045
      dummy.scale.set(size, size * (1.4 + .3 * Math.sin(t + i)), size)
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh name="crystal-motes" ref={ref} args={[undefined, undefined, count]} frustumCulled={false} raycast={() => {}}><octahedronGeometry /><meshBasicMaterial toneMapped={false} /></instancedMesh>
}

/** Plant small flower beds around the open approach instead of filling the walking corridor. */
export function LavenderBeds({ sparse }: { sparse: boolean }) {
  const stems = useRef<InstancedMesh>(null), blooms = useRef<InstancedMesh>(null)
  const count = sparse ? 28 : 60
  useLayoutEffect(() => {
    const dummy = new Object3D()
    for (let i = 0; i < count; i++) {
      const side = i % 2 ? 1 : -1, x = side * (2.7 + random(i + 400) * 2.8), z = 2.2 + random(i + 500) * 2.4, height = .18 + random(i + 600) * .18
      dummy.position.set(x, .55 + height / 2, z); dummy.rotation.set(0, 0, side * .1); dummy.scale.set(1, height, 1); dummy.updateMatrix(); stems.current?.setMatrixAt(i, dummy.matrix)
      dummy.position.y = .55 + height; dummy.scale.set(.075, .13, .075); dummy.updateMatrix(); blooms.current?.setMatrixAt(i, dummy.matrix)
      blooms.current?.setColorAt(i, new Color(i % 3 ? '#ceaff1' : '#f0cefa'))
    }
    for (const mesh of [stems.current, blooms.current]) if (mesh) { mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; mesh.computeBoundingSphere() }
  }, [count])
  return <group name="lavender-beds"><instancedMesh ref={stems} args={[undefined, undefined, count]}><cylinderGeometry args={[.012, .018, 1, 4]} /><meshStandardMaterial color="#7c9d9c" /></instancedMesh><instancedMesh ref={blooms} args={[undefined, undefined, count]}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial emissive="#9d70bd" emissiveIntensity={.18} roughness={.8} /></instancedMesh></group>
}
