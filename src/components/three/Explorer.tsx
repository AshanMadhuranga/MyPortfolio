import { ExplorerModel } from './ExplorerModel'

// All model parts remain in this grounded local frame; replace only ExplorerModel with a GLB.
export function Explorer({ reduced }: { reduced: boolean }) {
  return <group name="explorer" position={[5.8, .35, 8]} rotation={[0, -.02, 0]} scale={1.12}>
    <ExplorerModel reduced={reduced} />
  </group>
}
