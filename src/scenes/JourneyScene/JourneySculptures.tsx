import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BoxGeometry, CylinderGeometry, Group, MeshStandardMaterial, OctahedronGeometry, TorusGeometry } from 'three'
import { Glow } from '../../components/three/Glow'
import { CodeSymbol } from './JourneyLabel'

const box = new BoxGeometry(1, 1, 1), gem = new OctahedronGeometry(1)
const database = new CylinderGeometry(.38, .38, .65, 12)
const ring = new TorusGeometry(1, .025, 6, 56)
const dark = new MeshStandardMaterial({ color: '#34273f', roughness: .65 })
const lavender = new MeshStandardMaterial({ color: '#b8a0cb', roughness: .8, flatShading: true })
const pink = new MeshStandardMaterial({ color: '#edc3fa', emissive: '#bd74d7', emissiveIntensity: .55, flatShading: true })
const cyan = new MeshStandardMaterial({ color: '#a9e8ed', emissive: '#72c3ca', emissiveIntensity: .35 })
const screen = new MeshStandardMaterial({ color: '#8ccbd1', emissive: '#66b4c0', emissiveIntensity: .22 })
type Position = [number, number, number]
function Block({ p, s, material = dark }: { p: Position; s: Position; material?: MeshStandardMaterial }) { return <mesh geometry={box} material={material} position={p} scale={s} /> }

function Orbits({ reduced, radius = 1, active }: { reduced: boolean; radius?: number; active: boolean }) {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => { if (ref.current && !reduced) ref.current.rotation.y += Math.min(delta, .1) * .12 })
  return <group name="journey-orbits" ref={ref} scale={radius}><mesh geometry={ring} rotation={[1.1, .25, 0]}><meshBasicMaterial color={active ? '#ffffff' : '#efd0fa'} transparent opacity={.8} /></mesh><mesh geometry={ring} rotation={[.4, -.45, .3]} scale={1.1}><meshBasicMaterial color="#b5eced" transparent opacity={.65} /></mesh></group>
}

export function JourneySculpture({ index, reduced, active }: { index: number; reduced: boolean; active: boolean }) {
  if (index === 0) return <group position={[0, 2.25, 0]}>
    <mesh geometry={gem} material={pink} scale={[.45, .76, .45]} />
    {[-1, 1].map(side => <mesh key={side} geometry={box} material={lavender} position={[side * .3, -.85, 0]} scale={[.85, .16, 1.05]} rotation={[0, 0, side * .2]} />)}
    <group position={[0, 0, .08]}><Glow color="#eab7ff" size={2.3} opacity={active ? .28 : .13} /></group>
  </group>
  if (index === 1) return <group position={[0, 2.35, 0]}>
    <Block p={[0, 0, 0]} s={[2.05, 1.35, .24]} /><Block p={[0, 0, .135]} s={[1.86, 1.16, .025]} material={lavender} />
    <Block p={[0, .05, .155]} s={[1.78, 1.02, .02]} /><CodeSymbol />
    <Block p={[0, -.85, -.03]} s={[.23, .4, .18]} material={lavender} /><Block p={[0, -1.08, .1]} s={[1.7, .12, .7]} material={lavender} />
    <Block p={[0, -1, .36]} s={[1.2, .04, .25]} material={cyan} />
  </group>
  if (index === 2) return <group position={[0, 2.35, 0]}>
    <Block p={[-.25, .1, 0]} s={[2.05, 1.45, .2]} /><Block p={[-.25, .1, .12]} s={[1.86, 1.25, .025]} material={screen} />
    <Block p={[-.25, .59, .15]} s={[1.86, .24, .035]} material={lavender} />
    {[-.98, -.83, -.68].map(x => <mesh key={x} geometry={gem} material={pink} position={[x, .59, .18]} scale={.045} />)}
    <Block p={[-.91, .04, .16]} s={[.35, .75, .035]} />
    {[0, 1, 2].map(i => <group key={i}><Block p={[-.35 + i * .4, .21, .16]} s={[.31, .3, .035]} material={i % 2 ? pink : lavender} /><Block p={[-.35 + i * .4, -.2, .16]} s={[.26, .08 + i * .1, .04]} /></group>)}
    <Block p={[-.65, -.82, .16]} s={[1, .33, .65]} /><Block p={[-.65, -.82, .5]} s={[.7, .045, .03]} material={cyan} />
    <mesh geometry={database} material={lavender} position={[1.05, -.55, .25]} />
    {[-.75, -.52, -.29].map(y => <mesh key={y} position={[1.05, y, .25]} geometry={ring} rotation={[Math.PI / 2, 0, 0]} scale={.38} material={cyan} />)}
    <Block p={[.27, -.92, .25]} s={[.8, .055, .055]} material={pink} />
  </group>
  if (index === 3) return <group position={[0, 2.45, 0]}>
    <mesh geometry={gem} material={pink} scale={[.47, .7, .47]} />
    {[0, 1, 2, 3, 4, 5].map(i => <group key={i} rotation={[0, 0, i * Math.PI / 3]}><Block p={[0, .68, 0]} s={[.035, .8, .035]} material={cyan} /><mesh geometry={gem} material={i % 2 ? cyan : pink} position={[0, 1.05, 0]} scale={.19} /></group>)}
    <Orbits reduced={reduced} radius={1.25} active={active} />
  </group>
  if (index === 4) return <group position={[0, 2.35, .15]} rotation={[0, .28, -.08]}>
    <Block p={[0, 0, 0]} s={[1.22, 2.15, .24]} material={lavender} /><Block p={[0, 0, .13]} s={[1.08, 2, .04]} />
    <Block p={[0, .02, .16]} s={[.94, 1.65, .025]} material={screen} /><Block p={[0, .89, .18]} s={[.32, .055, .025]} />
    <Block p={[0, .6, .19]} s={[.72, .15, .025]} material={pink} />
    {[-.3, .12].map(y => <group key={y}><Block p={[0, y, .19]} s={[.72, .32, .025]} material={lavender} /><Block p={[-.2, y, .215]} s={[.16, .18, .015]} material={pink} /><Block p={[.12, y, .215]} s={[.3, .04, .015]} /></group>)}
    {[-.28, 0, .28].map(x => <mesh key={x} geometry={gem} material={pink} position={[x, -.65, .2]} scale={.055} />)}
    <Block p={[0, -.93, .18]} s={[.32, .035, .02]} material={cyan} />
  </group>
  return <group position={[0, 2.5, 0]}><mesh geometry={gem} material={pink} scale={[.9, 1.9, .9]} /><Orbits reduced={reduced} radius={1.45} active={active} /><group position={[0, 0, .12]}><Glow size={3.3} color="#e2b7ff" opacity={active ? .25 : .12} /></group></group>
}
