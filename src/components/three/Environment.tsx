import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Glow } from './Glow'

type Position = [number, number, number]
export function random(seed: number) { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
const rockGeometry = new THREE.IcosahedronGeometry(1, 0)
const leafGeometry = new THREE.IcosahedronGeometry(1, 1)
const trunkGeometry = new THREE.CylinderGeometry(.1, .22, 1, 6)
const pink = new THREE.MeshStandardMaterial({ color: '#e952ac', flatShading: true, roughness: .95 })
const pinkTip = new THREE.MeshStandardMaterial({ color: '#ff9fd4', flatShading: true })
const lilac = new THREE.MeshStandardMaterial({ color: '#9c58d3', flatShading: true })
const lilacTip = new THREE.MeshStandardMaterial({ color: '#c193f0', flatShading: true })
const bark = new THREE.MeshStandardMaterial({ color: '#49314f', roughness: 1 })
const stone = new THREE.MeshStandardMaterial({ color: '#78629c', flatShading: true })
const stoneLight = new THREE.MeshStandardMaterial({ color: '#a080b9', flatShading: true })
const turf = new THREE.MeshStandardMaterial({ color: '#cb509c', flatShading: true })
const grassGeometry = new THREE.ConeGeometry(.055, .34, 3)
const grassMaterial = new THREE.MeshStandardMaterial({ roughness: 1 })
const flowerGeometry = new THREE.IcosahedronGeometry(.09, 0)
const flowerMaterial = new THREE.MeshStandardMaterial({ color: '#ffe1ab', emissive: '#f3a786', emissiveIntensity: .12 })
const islandTop = new THREE.CylinderGeometry(3.4, 3.1, .35, 11)
// Subtle shared shoreline asymmetry; keep the planted area inside the rim.
const shorePositions = islandTop.attributes.position
for (let i = 0; i < shorePositions.count; i++) {
  const x = shorePositions.getX(i), z = shorePositions.getZ(i)
  const angle = Math.atan2(z, x)
  const factor = 1 + .045 * Math.sin(angle * 3) + .025 * Math.cos(angle * 5)
  shorePositions.setXYZ(i, x * factor, shorePositions.getY(i), z * factor)
}
islandTop.computeVertexNormals()

export function Tree({ position, scale = 1, lavender = false, reduced = false, seed = 1 }: { position: Position; scale?: number; lavender?: boolean; reduced?: boolean; seed?: number }) {
  const crown = useRef<THREE.Group>(null)
  useFrame(({ clock }) => { if (crown.current && !reduced) crown.current.rotation.z = Math.sin(clock.elapsedTime * .65 + position[0]) * .022 })
  return <group position={position} scale={scale}>
    <mesh geometry={trunkGeometry} material={bark} castShadow scale={[1, 2.8, 1]} position={[0, 1.3, 0]} />
    <mesh geometry={trunkGeometry} material={bark} castShadow scale={[.6, 1.8, .6]} position={[-.4, 2, 0]} rotation={[0, 0, .65]} />
    <mesh geometry={trunkGeometry} material={bark} castShadow scale={[.6, 1.7, .6]} position={[.45, 2.1, 0]} rotation={[0, 0, -.7]} />
    <group ref={crown} position={[0, 2.7, 0]} scale={[1 + random(seed) * .3, .8 + random(seed + 6) * .35, 1]}>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} castShadow geometry={leafGeometry} material={lavender ? i % 4 ? lilac : lilacTip : i % 4 ? pink : pinkTip} position={[(random(i + seed + 2) - .5) * 2.8, random(i + seed + 10) * 1.1, (random(i + seed + 30) - .5) * 2]} scale={[.85 + random(i + seed) * .5, .55 + random(i + 5) * .4, .75]} />)}
    </group>
  </group>
}

export function Island({ position, scale = 1, children }: { position: Position; scale?: number; children?: ReactNode }) {
  return <group position={position} scale={scale}>
    <mesh geometry={rockGeometry} material={stone} position={[0, -1.6, 0]} scale={[3.8, 1.7, 2.8]} rotation={[0, .3, 0]} />
    <mesh geometry={islandTop} material={turf} scale={[1, 1, .83]} receiveShadow />
    {Array.from({ length: 7 }, (_, i) => { const angle = i / 7 * Math.PI * 2; return <mesh key={i} geometry={rockGeometry} material={i % 2 ? stone : stoneLight} position={[Math.cos(angle) * 2.6, -1.15 - random(i) * .4, Math.sin(angle) * 2.1]} scale={[1.25, .65 + random(i + 4) * .35, .95]} rotation={[.2, i, .3]} /> })}
    <mesh geometry={rockGeometry} material={stone} position={[.4, -3, -.2]} scale={[1.3, 2, 1]} rotation={[0, .6, .15]} />
    {children}
  </group>
}

export function Grass({ position, radius = 3, count = 200, pathX = 0 }: { position: Position; radius?: number; count?: number; pathX?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!ref.current) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const angle = random(i + 90) * Math.PI * 2, r = Math.sqrt(random(i + 23)) * radius
      const x = Math.cos(angle) * r, z = Math.sin(angle) * r * .8
      // Leave a clear central walking corridor through the meadow.
      dummy.position.set(x, .12, z)
      dummy.rotation.set(0, random(i) * Math.PI, (random(i + 45) - .5) * .4)
      dummy.scale.setScalar(Math.abs(x - pathX) < .5 ? 0 : .55 + random(i + 55) * .8); dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
      ref.current.setColorAt(i, new THREE.Color(i % 3 ? '#ed4ea6' : '#ff9bd0'))
    }
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [count, radius, pathX])
  return <instancedMesh ref={ref} args={[grassGeometry, grassMaterial, count]} position={position} />
}

export function MeadowDetails({ position, count = 55, pathX = 0 }: { position: Position; count?: number; pathX?: number }) {
  const flowers = useRef<THREE.InstancedMesh>(null)
  const rocks = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const a = random(i + 33) * Math.PI * 2, r = 1 + random(i + 81) * 1.8
      dummy.position.set(Math.cos(a) * r, .34, Math.sin(a) * r * .8)
      dummy.rotation.set(0, 0, 0); dummy.scale.set(1, .5, 1); if (Math.abs(dummy.position.x - pathX) < .5) dummy.scale.setScalar(0); dummy.updateMatrix(); flowers.current?.setMatrixAt(i, dummy.matrix)
      if (i < 12) {
        dummy.position.y = .12; dummy.scale.set(.12 + random(i) * .2, .12, .2); dummy.rotation.y = i; if (Math.abs(dummy.position.x - pathX) < .5) dummy.scale.setScalar(0); dummy.updateMatrix(); rocks.current?.setMatrixAt(i, dummy.matrix)
      }
    }
    for (const mesh of [flowers.current, rocks.current]) if (mesh) { mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere() }
  }, [count, pathX])
  return <group position={position}><instancedMesh ref={flowers} args={[flowerGeometry, flowerMaterial, count]} /><instancedMesh ref={rocks} args={[rockGeometry, stoneLight, 12]} /></group>
}

export function Crystal({ position, scale = 1, reduced }: { position: Position; scale?: number; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => { if (ref.current && !reduced) ref.current.rotation.y += delta * .14 })
  return <group ref={ref} position={position} scale={scale}>
    <group position={[0, .5, 0]}><Glow size={2.5} opacity={.2} /></group>
    <mesh position={[0, .6, 0]} scale={[.27, .9, .27]}><octahedronGeometry /><meshStandardMaterial color="#e6bcff" emissive="#b14fe3" emissiveIntensity={.65} /></mesh>
    <mesh position={[.3, .3, .1]} rotation={[0, 0, -.4]} scale={[.15, .5, .15]}><octahedronGeometry /><meshStandardMaterial color="#addfff" emissive="#69cbec" emissiveIntensity={.4} /></mesh>
    <mesh position={[-.24, .28, .16]} rotation={[0, 0, .4]} scale={[.15, .48, .15]}><octahedronGeometry /><meshStandardMaterial color="#bfa2ff" emissive="#9c48d9" emissiveIntensity={.6} /></mesh>
  </group>
}

export function Lantern({ position, reduced = false }: { position: Position; reduced?: boolean }) {
  const glow = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(({ clock }) => { if (glow.current) glow.current.emissiveIntensity = reduced ? 1.3 : 1.3 + Math.sin(clock.elapsedTime * 1.4 + position[0]) * .2 })
  return <group position={position}>
    <mesh position={[0, .55, 0]}><cylinderGeometry args={[.035, .04, 1.1, 5]} /><meshStandardMaterial color="#695976" /></mesh>
    <mesh position={[0, 1.12, 0]}><boxGeometry args={[.24, .3, .24]} /><meshStandardMaterial ref={glow} color="#fff0be" emissive="#ffc877" emissiveIntensity={1.3} /></mesh>
    <mesh position={[0, 1.34, 0]}><coneGeometry args={[.24, .16, 4]} /><meshStandardMaterial color="#77648f" /></mesh>
    <group position={[0, 1.12, .05]}><Glow color="#ffbd65" size={1.7} opacity={.5} /></group>
  </group>
}

const waterVertex = `
#include <fog_pars_vertex>
uniform float time; varying vec3 world;
void main(){
  vec3 p=position; p.z+=sin(p.x*1.5+time*.6)*.035+cos(p.y*1.8+time*.4)*.025;
  vec4 wp=modelMatrix*vec4(p,1.); world=wp.xyz;
  vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`
const waterFragment = `
#include <fog_pars_fragment>
uniform float time; varying vec3 world;
void main(){
  vec3 n=normalize(vec3(-cos(world.x*1.5+time*.6)*.05,1.,sin(world.z*1.8-time*.4)*.045));
  vec3 viewDir=normalize(cameraPosition-world);
  vec3 halfDir=normalize(viewDir+normalize(vec3(-.4,.9,.3)));
  float spec=pow(max(dot(n,halfDir),0.),110.);
  float ripple=pow(max(0.,sin(world.x*2.1+world.z*3.8+time*.5)*sin(world.z*6.-time*.35)),18.);
  float fresnel=pow(1.-max(dot(n,viewDir),0.),3.);
  vec3 col=mix(vec3(.012,.26,.31),vec3(.028,.46,.43),sin(world.z*.13)*.5+.5);
  col=mix(col,vec3(.35,.36,.52),fresnel*.28);
  col+=vec3(1.,.77,.78)*spec*.3+vec3(.3,.65,.63)*ripple*.18;
  gl_FragColor=vec4(col,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}`
export function Water({ reduced }: { reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { time: { value: 0 } }]), [])
  useFrame(({ clock }) => { if (material.current && !reduced) material.current.uniforms.time.value = clock.elapsedTime })
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -8]}><planeGeometry args={[180, 180, 60, 60]} /><shaderMaterial ref={material} vertexShader={waterVertex} fragmentShader={waterFragment} uniforms={uniforms} fog /></mesh>
}

export function Waterfall({ position, height = 6, reduced }: { position: Position; height?: number; reduced: boolean }) {
  const ref = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ time: { value: 0 } }), [])
  useFrame(({ clock }) => { if (ref.current && !reduced) ref.current.uniforms.time.value = clock.elapsedTime })
  return <group position={position}>
    <mesh position={[0, -height / 2, 0]}><planeGeometry args={[1.1, height]} /><shaderMaterial ref={ref} uniforms={uniforms} transparent side={THREE.DoubleSide} depthWrite={false}
      vertexShader="varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }"
      fragmentShader="varying vec2 vUv; uniform float time; void main(){ float streak=pow(.5+.5*sin(vUv.x*65.+sin(vUv.y*8.+time)*.5),4.); float flow=.5+.5*sin(vUv.y*38.+time*5.+vUv.x*15.); vec3 c=mix(vec3(.18,.73,.82),vec3(.78,1.,.96),streak*.7+flow*.2); float edge=smoothstep(0.,.12,vUv.x)*smoothstep(0.,.12,1.-vUv.x); gl_FragColor=vec4(c,edge*.85); }" /></mesh>
    {[0, 1, 2].map(i => <mesh key={i} position={[(i - 1) * .35, -height + .08, .08]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, .5, 1]}><ringGeometry args={[.3 + i * .15, .35 + i * .15, 28]} /><meshBasicMaterial color="#c5fff3" transparent opacity={.4} depthWrite={false} /></mesh>)}
  </group>
}

// Keep complete cloud silhouettes below the navigation in both opening and settled shots.
// The old 13-17m altitude left two outer lobes visible below the bar, resembling loose shoes.
export function Clouds({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => { if (ref.current && !reduced) ref.current.position.x = Math.sin(clock.elapsedTime * .025) * 2 })
  return <group name="cloud-layer" ref={ref}>{Array.from({ length: 8 }, (_, i) => <group key={i} position={[(random(i + 100) - .5) * 65, 10.5 + random(i + 160) * 1.2, -44 - random(i + 180) * 20]}>{[0, 1, 2].map(j => <mesh key={j} geometry={leafGeometry} position={[j * 2, j === 1 ? .5 : 0, 0]} scale={[2.6, .95, 1.4]}><meshStandardMaterial color="#fae9f5" roughness={1} /></mesh>)}</group>)}</group>
}

export function Petals({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = mobile ? 35 : 100
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = reduced ? 0 : clock.elapsedTime
    for (let i = 0; i < count; i++) {
      dummy.position.set((random(i + 800) - .5) * 35 + Math.sin(t * .2 + i), (random(i + 900) * 17 - t * .25 % 17 + 17) % 17 - 1, -20 + random(i + 700) * 32)
      dummy.rotation.set(t * .3 + i, i, t * .2); dummy.scale.set(.055, .025, .08); dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={ref} args={[undefined, undefined, count]}><octahedronGeometry /><meshBasicMaterial color="#ffe5f5" /></instancedMesh>
}

export function Mountains() {
  return <group>{[0, 1].map(layer => <group key={layer}>{Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-42 + i * 10 + layer * 4, -1, -36 - layer * 24 - random(i + 14) * 8]} rotation={[0, random(i) * 3, 0]}><coneGeometry args={[10 + random(i) * 6, 10 + random(i + 8) * 12, 5]} /><meshStandardMaterial color={layer ? '#acafd4' : i % 2 ? '#8278ad' : '#9984ba'} flatShading /></mesh>)}</group>)}</group>
}
