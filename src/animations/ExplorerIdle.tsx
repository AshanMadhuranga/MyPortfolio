import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

/** Animate the upper body only: the feet remain planted on the island. */
export function ExplorerIdle({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const body = useRef<Group>(null)
  const time = useRef(0)
  useFrame((_, delta) => {
    if (!body.current) return
    if (!reduced) time.current += Math.min(delta, .05)
    const t = time.current
    body.current.position.y = 1.05 + Math.sin(t * 1.55) * .009
    body.current.rotation.z = Math.sin(t * .65) * .009
    body.current.rotation.y = Math.sin(t * .4) * .015
    body.current.scale.y = 1 + Math.sin(t * 1.55) * .006
  })
  return <group ref={body} position={[0, 1.05, 0]}>{children}</group>
}
