import { Tree, Island, Grass, Water, Waterfall, Crystal, Lantern, Clouds, Mountains, MeadowDetails } from '../../components/three/Environment'
import { Portal } from '../../components/three/Portal'
import { Pathway } from '../../components/three/Pathway'
import { Explorer } from '../../components/three/Explorer'

/** The approved Home geometry, rendered inside the shared world Canvas. */
type HomeSceneProps = {
  reduced: boolean
  mobile: boolean
  onPortalSecret?: () => void
}

export function HomeScene({
  reduced,
  mobile,
  onPortalSecret,
}: HomeSceneProps) {
  return <group name="home-environment">
    <Water reduced={reduced} /><Clouds reduced={reduced} /><Mountains />
    <Island position={[6, .1, -2]} scale={1.3}>
      <Portal reduced={reduced} onSecret={onPortalSecret} />
      <Grass position={[0, .3, 0]} count={mobile ? 250 : 1100} /><Crystal position={[-2, .2, 1.3]} reduced={reduced} /><Lantern position={[2.2, .2, 1.7]} reduced={reduced} />
      <Waterfall position={[.5, -.1, 2.7]} height={1.52} reduced={reduced} />
    </Island>
    <Island position={[5, .1, 8]} scale={1.4}><Grass pathX={.57} position={[0, .3, 0]} count={mobile ? 350 : 1500} /><MeadowDetails pathX={.57} position={[0, .2, 0]} count={mobile ? 35 : 85} /><Tree position={[3, .1, 1.4]} scale={.49} seed={24} reduced={reduced} /><Crystal position={[-1.8, .2, .7]} scale={.8} reduced={reduced} /><Lantern position={[1.4, .2, -1.3]} reduced={reduced} /></Island>
    <Explorer reduced={reduced} />
    <Pathway />
    <Island position={[-11, -1, -8]} scale={1.8}><Tree position={[-.8, .1, 0]} scale={.72} seed={33} reduced={reduced} /><Tree position={[1.9, .2, -.5]} scale={.58} seed={19} lavender reduced={reduced} /><Grass position={[0, .3, 0]} count={mobile ? 220 : 900} /><Waterfall position={[1, -.1, 2.7]} height={.46} reduced={reduced} /></Island>
    <Island position={[14, 3.5, -15]} scale={.9}><Tree position={[0, .2, 0]} scale={1.2} reduced={reduced} /><Waterfall position={[0, 0, 3]} height={6.1} reduced={reduced} /></Island>
    <Island position={[-1, 5, -20]} scale={.65}><Tree position={[0, .2, 0]} lavender reduced={reduced} /><Crystal position={[1.7, .3, 0]} reduced={reduced} /><Waterfall position={[1, 0, 2.8]} height={10.75} reduced={reduced} /></Island>
    {!mobile && <Island position={[-17, 6, -24]} scale={.75}><Tree position={[0, .2, 0]} reduced={reduced} /></Island>}
  </group>
}
