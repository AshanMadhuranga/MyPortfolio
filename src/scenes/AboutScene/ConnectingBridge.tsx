import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Lantern } from '../../components/three/Environment'

export function ConnectingBridge({ reduced }: { reduced: boolean }) {
  const boards = useRef<THREE.InstancedMesh>(null)
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(8.6, .4, -4), new THREE.Vector3(16, .65, -7), new THREE.Vector3(25, .8, -8), new THREE.Vector3(32.8, .45, -10.6),
  ]), [])
  useLayoutEffect(() => {
    const object = new THREE.Object3D()
    for (let i = 0; i < 46; i++) {
      object.position.copy(curve.getPoint(i / 45))
      const tangent = curve.getTangent(i / 45)
      object.rotation.y = -Math.atan2(tangent.z, tangent.x)
      object.updateMatrix(); boards.current?.setMatrixAt(i, object.matrix)
    }
    if (boards.current) { boards.current.instanceMatrix.needsUpdate = true; boards.current.computeBoundingSphere() }
  }, [curve])
  return <group name="connecting-bridge">
    <instancedMesh ref={boards} args={[undefined, undefined, 46]} receiveShadow><boxGeometry args={[.5, .16, 1.3]} /><meshStandardMaterial color="#aa829e" roughness={.9} /></instancedMesh>
    {[.2, .5, .8].map(t => { const p = curve.getPoint(t); return <group key={t} position={[p.x, p.y, p.z]}>
      <mesh position={[0, -1.2, 0]}><cylinderGeometry args={[.13, .2, 2.5, 6]} /><meshStandardMaterial color="#766081" /></mesh>
      <Lantern position={[0, .1, -.8]} reduced={reduced} />
    </group> })}
  </group>
}
