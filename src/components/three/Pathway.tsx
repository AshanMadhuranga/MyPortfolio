import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'

export function Pathway() {
  const stones = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!stones.current) return
    const transform = new THREE.Object3D()
    for (let i = 0; i < 11; i++) {
      transform.position.set(5.8 + Math.sin(i / 10 * Math.PI) * .55, .38 + i * .004, 6.3 - i * .8)
      transform.rotation.y = i * .3
      transform.scale.set(1 + Math.sin(i * 2) * .07, 1, .85)
      transform.updateMatrix()
      stones.current.setMatrixAt(i, transform.matrix)
    }
    stones.current.instanceMatrix.needsUpdate = true
    stones.current.computeBoundingSphere()
  }, [])
  return <instancedMesh ref={stones} args={[undefined, undefined, 11]} receiveShadow>
    <cylinderGeometry args={[.53, .62, .25, 6]} />
    <meshStandardMaterial color="#cfb4d2" flatShading roughness={.92} />
  </instancedMesh>
}
