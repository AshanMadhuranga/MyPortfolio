import { useLayoutEffect, useMemo, useRef } from 'react'
import { CatmullRomCurve3, InstancedMesh, Object3D, Vector3 } from 'three'
import { Lantern } from '../../components/three/Environment'
export function SkillsPath({ reduced }: { reduced: boolean }) {
  const ref = useRef<InstancedMesh>(null)
  const curve = useMemo(() => new CatmullRomCurve3([new Vector3(42, .4, -13), new Vector3(48, .55, -16), new Vector3(51, .6, -23), new Vector3(57, .5, -26)]), [])
  useLayoutEffect(() => {
    const dummy = new Object3D()
    for (let i = 0; i < 38; i++) {
      dummy.position.copy(curve.getPoint(i / 37)); dummy.rotation.y = i * .65; dummy.updateMatrix(); ref.current?.setMatrixAt(i, dummy.matrix)
    }
    if (ref.current) { ref.current.instanceMatrix.needsUpdate = true; ref.current.computeBoundingSphere() }
  }, [curve])
  return <group name="skills-path"><instancedMesh ref={ref} args={[undefined, undefined, 38]} receiveShadow><cylinderGeometry args={[.66, .72, .22, 6]} /><meshStandardMaterial color="#c0a3cf" emissive="#b25ed7" emissiveIntensity={.14} /></instancedMesh>
    {[.16, .45, .74].map(t => { const p = curve.getPoint(t); return <Lantern key={t} position={[p.x + .7, p.y, p.z]} reduced={reduced} /> })}
  </group>
}
