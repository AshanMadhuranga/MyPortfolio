import { useState } from 'react'
import { useCursor } from '@react-three/drei'
import { world } from '../../config/world'
import type { AboutObject } from '../../config/portfolio'
import { Island, Tree, Grass, MeadowDetails, Crystal, Lantern, Waterfall } from '../../components/three/Environment'
import { Cabin } from './Cabin'
import { ConnectingBridge } from './ConnectingBridge'

export function AboutScene({ reduced, mobile, interactive, onExplore }: { reduced: boolean; mobile: boolean; interactive: boolean; onExplore: (object: AboutObject) => void }) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && interactive)
  return <group name="about-environment">
    <ConnectingBridge reduced={reduced} />
    <group position={world.cabin}>
      <Island position={[0, 0, 0]} scale={1.8} />
      <Cabin interactive={interactive} onExplore={onExplore} />
      <Tree position={[-4, .3, -1.5]} scale={1.1} seed={51} reduced={reduced} />
      <Tree position={[2.4, .3, -3.5]} scale={.95} seed={62} lavender reduced={reduced} />
      {!mobile && <Tree position={[-2.5, .3, -3]} scale={.7} seed={24} reduced={reduced} />}
      <Grass position={[-3.7, .3, 1]} radius={1.3} count={mobile ? 160 : 420} />
      <Grass position={[3.6, .3, -.7]} radius={1.6} count={mobile ? 180 : 450} />
      <MeadowDetails position={[-3.2, .3, .7]} count={mobile ? 25 : 45} />
      <Grass position={[-1.5, .3, 4]} radius={.7} count={mobile ? 60 : 140} />
      <MeadowDetails position={[2.7, .3, 2]} count={mobile ? 12 : 22} />
      {[-2.3, 1.8].map(x => <group key={x} position={[x, .4, 2.6]}>
        <mesh position={[0, .18, 0]} castShadow><cylinderGeometry args={[.24, .17, .35, 7]} /><meshStandardMaterial color="#b980a9" /></mesh>
        {[0, 1, 2].map(i => <group key={i} position={[(i - 1) * .12, .4 + (i % 2) * .12, 0]}>
          <mesh><cylinderGeometry args={[.018, .02, .35, 4]} /><meshStandardMaterial color="#7aa9a6" /></mesh>
          <mesh position={[0, .19, 0]}><icosahedronGeometry args={[.12, 0]} /><meshStandardMaterial color="#d5a7e7" /></mesh>
        </group>)}
      </group>)}
      <Lantern position={[-1.9, .3, 3]} reduced={reduced} /><Lantern position={[2.5, .3, 2.1]} reduced={reduced} />
      <group name="crystal-interaction" position={[3.5, .35, 2.5]} scale={hovered ? 1.1 : 1} onPointerOver={event => { event.stopPropagation(); if (interactive) setHovered(true) }} onPointerOut={() => setHovered(false)} onClick={event => { if (interactive) { event.stopPropagation(); onExplore('crystal') } }}>
        <Crystal position={[0, 0, 0]} reduced={reduced} scale={1.1} />
        <mesh position={[0, -.05, 0]}><cylinderGeometry args={[.65, .75, .18, 7]} /><meshStandardMaterial color="#9474ad" /></mesh>
      </group>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-4.8 + i * .58, .35, 1.4 + Math.sin(i / 7 * Math.PI / 2) * 2.25]} rotation={[0, i * .7, 0]} receiveShadow><cylinderGeometry args={[.4, .48, .16, 6]} /><meshStandardMaterial color="#cfb4d2" roughness={.95} /></mesh>)}
      <Waterfall position={[3, .1, -3.5]} height={2.2} reduced={reduced} />
    </group>
  </group>
}
