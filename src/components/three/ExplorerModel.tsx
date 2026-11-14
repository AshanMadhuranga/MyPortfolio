import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { ExplorerIdle } from '../../animations/ExplorerIdle'
import { Glow } from './Glow'

/** Interim model. Origin is the soles, facing -Z; a replacement GLB should use the same convention. */
export function ExplorerModel({ reduced }: { reduced: boolean }) {
  const assets = useMemo(() => ({
    box: new THREE.BoxGeometry(1, 1, 1),
    limb: new THREE.CylinderGeometry(1, .9, 1, 8),
    facet: new THREE.IcosahedronGeometry(1, 1),
    head: new THREE.SphereGeometry(1, 10, 8),
    jacket: new THREE.MeshStandardMaterial({ color: '#b4adcf', roughness: .85, flatShading: true }),
    seam: new THREE.MeshStandardMaterial({ color: '#74608e', roughness: .9 }),
    dark: new THREE.MeshStandardMaterial({ color: '#37364f', roughness: .9 }),
    pack: new THREE.MeshStandardMaterial({ color: '#4e3d6c', roughness: .8 }),
    leather: new THREE.MeshStandardMaterial({ color: '#654d6e', roughness: .95 }),
    sole: new THREE.MeshStandardMaterial({ color: '#e8d8dc', roughness: .9 }),
    skin: new THREE.MeshStandardMaterial({ color: '#d9a085', roughness: .95 }),
    hair: new THREE.MeshStandardMaterial({ color: '#302c40', roughness: 1, flatShading: true }),
    hairLight: new THREE.MeshStandardMaterial({ color: '#4b3d52', roughness: 1, flatShading: true }),
    glow: new THREE.MeshBasicMaterial({ color: '#ffc2f7', toneMapped: false }),
    mint: new THREE.MeshBasicMaterial({ color: '#a4e7e1', toneMapped: false }),
  }), [])
  useEffect(() => () => { Object.values(assets).forEach(asset => asset.dispose()) }, [assets])
  const { box, limb, facet, head, jacket, seam, dark, pack, leather, sole, skin, hair, hairLight, glow, mint } = assets

  return <group name="procedural-explorer-model">
    {[-1, 1].map(side => <group key={side} position={[side * .19, 0, side * .035]} rotation={[0, side * -.1, side * .025]}>
      <mesh geometry={limb} material={dark} position={[0, .76, 0]} scale={[.15, .55, .16]} castShadow />
      <mesh geometry={limb} material={dark} position={[0, .37, .025]} scale={[.13, .43, .14]} castShadow />
      <mesh geometry={box} material={seam} position={[0, .55, -.14]} scale={[.2, .16, .035]} />
      <mesh geometry={box} material={leather} position={[0, .13, -.075]} scale={[.3, .23, .45]} castShadow />
      <mesh geometry={box} material={sole} position={[0, .035, -.09]} scale={[.32, .07, .48]} />
      <mesh geometry={box} material={mint} position={[0, .17, .16]} scale={[.16, .035, .02]} />
    </group>)}
    <ExplorerIdle reduced={reduced}>
      <mesh geometry={limb} material={jacket} position={[0, .33, 0]} scale={[.36, .75, .29]} castShadow />
      <mesh geometry={box} material={seam} position={[0, -.025, .015]} scale={[.63, .09, .44]} />
      {[-1, 1].map(side => <group key={side} position={[side * .4, .57, 0]} rotation={[.06, 0, side * .1]}>
        <mesh geometry={facet} material={jacket} scale={[.19, .22, .22]} castShadow />
        <mesh geometry={limb} material={jacket} position={[0, -.2, 0]} scale={[.14, .38, .16]} castShadow />
        <group position={[0, -.38, 0]} rotation={[-.1, 0, 0]}>
          <mesh geometry={limb} material={jacket} position={[0, -.12, 0]} scale={[.12, .3, .13]} castShadow />
          <mesh geometry={limb} material={seam} position={[0, -.26, 0]} scale={[.125, .08, .135]} />
          <mesh geometry={facet} material={leather} position={[0, -.37, 0]} scale={[.12, .15, .11]} />
          <mesh geometry={box} material={mint} position={[0, -.24, .13]} scale={[.13, .025, .02]} />
        </group>
      </group>)}
      <group name="head-and-hood" position={[0, .78, 0]}>
        <mesh geometry={facet} material={jacket} position={[0, -.04, .12]} scale={[.34, .23, .32]} />
        <mesh geometry={head} material={skin} position={[0, .32, -.015]} scale={[.28, .34, .27]} castShadow />
        {[-1, 1].map(side => <mesh key={side} geometry={facet} material={skin} position={[side * .27, .3, 0]} scale={[.055, .085, .06]} />)}
        <mesh geometry={head} material={hair} position={[0, .45, .025]} scale={[.3, .23, .28]} castShadow />
        {Array.from({ length: 7 }, (_, i) => <mesh key={i} geometry={facet} material={i % 3 ? hair : hairLight} position={[(i % 3 - 1) * .16, .54 + (i % 2) * .055, -.11 + Math.floor(i / 3) * .13]} rotation={[.1, 0, -.25]} scale={[.16, .12, .17]} castShadow />)}
        <mesh geometry={box} material={hair} position={[0, .28, .23]} scale={[.38, .16, .045]} />
      </group>
      <group name="backpack">
        {[-1, 1].map(side => <group key={side}>
          <mesh geometry={box} material={pack} position={[side * .23, .38, .24]} scale={[.085, .76, .08]} />
          <mesh geometry={box} material={leather} position={[side * .34, .25, .35]} scale={[.12, .3, .21]} />
          <mesh geometry={box} material={sole} position={[side * .23, .12, .29]} scale={[.1, .075, .025]} />
        </group>)}
        <mesh geometry={box} material={pack} position={[0, .35, .37]} scale={[.6, .7, .25]} castShadow />
        <mesh geometry={facet} material={seam} position={[0, .67, .38]} scale={[.31, .09, .16]} />
        <mesh geometry={box} material={leather} position={[0, .15, .51]} scale={[.5, .23, .06]} />
        <mesh geometry={box} material={seam} position={[0, .42, .505]} scale={[.49, .29, .025]} />
        <mesh geometry={box} material={mint} position={[0, .6, .51]} scale={[.41, .022, .025]} />
        {[-1, 1].map(side => <group key={side} position={[side * .145, .42, .53]}>{[-1, 1].map(v => <mesh key={v} geometry={box} material={glow} rotation={[0, 0, side * v * .8]} position={[0, v * .048, 0]} scale={[.035, .145, .015]} />)}</group>)}
        <mesh geometry={box} material={glow} position={[0, .42, .53]} rotation={[0, 0, -.25]} scale={[.025, .19, .02]} />
        <group position={[0, .42, .55]}><Glow size={.85} opacity={.22} /></group>
      </group>
    </ExplorerIdle>
  </group>
}
