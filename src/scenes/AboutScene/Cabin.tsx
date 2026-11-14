import { useEffect, useMemo, useState } from 'react'
import { useCursor } from '@react-three/drei'
import { BoxGeometry, MeshStandardMaterial, MeshBasicMaterial, type Material } from 'three'
import type { AboutObject } from '../../config/portfolio'
import { Glow } from '../../components/three/Glow'

type Vec3 = [number, number, number]
export function Cabin({ onExplore, interactive }: { onExplore: (object: AboutObject) => void; interactive: boolean }) {
  const [hovered, setHovered] = useState<AboutObject | null>(null)
  useCursor(Boolean(hovered) && interactive)
  const kit = useMemo(() => ({
    box: new BoxGeometry(1, 1, 1),
    plaster: new MeshStandardMaterial({ color: '#deb4cb', roughness: .95 }),
    wood: new MeshStandardMaterial({ color: '#785270', roughness: .9 }),
    trim: new MeshStandardMaterial({ color: '#b38aab', roughness: .9 }),
    roof: new MeshStandardMaterial({ color: '#666886', roughness: .85 }),
    tile: new MeshStandardMaterial({ color: '#8587a1', roughness: .9 }),
    floor: new MeshStandardMaterial({ color: '#a87994', roughness: 1 }),
    window: new MeshStandardMaterial({ color: '#ffd4ab', emissive: '#f4a66c', emissiveIntensity: 1.1 }),
    screen: new MeshBasicMaterial({ color: '#7b4c9c', toneMapped: false }),
    code: new MeshBasicMaterial({ color: '#d7bafa', toneMapped: false }),
    mint: new MeshStandardMaterial({ color: '#86c1ba', roughness: .8 }),
    book: new MeshStandardMaterial({ color: '#d293b1', roughness: 1 }),
  }), [])
  useEffect(() => () => Object.values(kit).forEach(item => item.dispose()), [kit])
  const block = (key: string, position: Vec3, scale: Vec3, material: Material, rotation: Vec3 = [0, 0, 0]) =>
    <mesh key={key} geometry={kit.box} material={material} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
  const enter = (id: AboutObject) => { if (interactive) setHovered(id) }
  return <group name="developer-cabin">
    {block('floor', [0, .2, 0], [4.8, .28, 3.8], kit.floor)}
    {block('back-wall', [0, 1.75, -1.8], [4.6, 3, .16], kit.plaster)}
    {block('left-wall', [-2.3, 1.75, 0], [.16, 3, 3.6], kit.plaster)}
    {/* Front facade stays intact; the right wall opens onto the visible studio. */}
    {block('front-wall', [-.85, 1.75, 1.8], [2.9, 3, .16], kit.plaster)}
    {block('door', [-.75, 1.15, 1.91], [.95, 1.9, .12], kit.wood)}
    {[0, 1, 2, 3].map(i => block(`door-slat-${i}`, [-1.1 + i * .24, 1.15, 1.99], [.018, 1.75, .018], kit.trim))}
    {block('handle', [-.44, 1.2, 2.01], [.06, .14, .04], kit.window)}
    {[-2.3, .6, 2.3].map((x, i) => block(`post-${i}`, [x, 1.8, 1.87], [.16, 3.35, .2], kit.wood))}
    {block('front-beam', [0, 3.28, 1.87], [4.8, .18, .22], kit.wood)}
    {block('middle-beam', [-.85, 2.25, 1.91], [2.9, .12, .12], kit.wood)}
    {block('back-beam', [0, 3.28, -1.86], [4.8, .18, .2], kit.wood)}
    {/* A steep half-gable and shorter studio roof leave an intentional cutaway. */}
    {block('roof-left', [-1.2, 3.9, 0], [2.95, .18, 4.25], kit.roof, [0, 0, .48])}
    {block('roof-right-rear', [1.2, 3.9, -1.1], [2.95, .18, 2], kit.roof, [0, 0, -.48])}
    {block('ridge', [0, 4.6, -.05], [.22, .22, 4.4], kit.wood)}
    {Array.from({ length: 8 }, (_, i) => block(`roof-seam-${i}`, [-1.2, 4.02, -1.8 + i * .51], [2.95, .045, .035], kit.tile, [0, 0, .48]))}
    {Array.from({ length: 4 }, (_, i) => block(`roof-row-${i}`, [-2.2 + i * .58, 3.56 + i * .3, -.05], [.035, .045, 4.2], kit.tile))}
    {block('chimney', [-1.3, 4.65, -.8], [.52, 1.5, .62], kit.roof)}
    {block('chimney-cap', [-1.3, 5.4, -.8], [.7, .14, .78], kit.trim)}
    {[.65, 1.4, 2.15].map((y, i) => block(`back-siding-${i}`, [0, y, -1.7], [4.4, .035, .02], kit.trim))}
    {[-1.8, .95].map((x, i) => <group key={x} position={[x, 2.65, i === 0 ? 1.94 : -1.69]}>
      {block('frame', [0, 0, 0], [.62, .8, .1], kit.wood)}
      {block('glass', [0, 0, .06], [.48, .65, .025], kit.window)}
      {block('cross-v', [0, 0, .08], [.035, .7, .03], kit.trim)}
      {block('cross-h', [0, 0, .08], [.5, .035, .03], kit.trim)}
      <group position={[0, 0, .1]}><Glow color="#ffc09e" size={1.7} opacity={.2} /></group>
    </group>)}
    {/* Projecting front gable, fascia and exposed braces retain the studio cutaway. */}
    {block('gable-left', [-.62, 3.94, 2.08], [1.8, .16, .38], kit.roof, [0, 0, .72])}
    {block('gable-right', [.62, 3.94, 2.08], [1.8, .16, .38], kit.roof, [0, 0, -.72])}
    {block('gable-tie', [0, 3.35, 2.09], [2.6, .12, .16], kit.wood)}
    {block('gable-kingpost', [0, 3.95, 2.09], [.12, 1.25, .16], kit.trim)}
    {block('eave-left', [-2.5, 3.23, 0], [.14, .18, 4.4], kit.wood)}
    {[-2.1, .4].map((x, i) => block(`brace-${i}`, [x, 2.99, 1.99], [.12, .65, .12], kit.wood, [0, 0, i ? -.65 : .65]))}
    {Array.from({ length: 6 }, (_, i) => block(`porch-board-${i}`, [-1.55 + i * .5, .56, 2.4], [.025, .02, 1.15], kit.trim))}
    {[-1.8, 1.2].map(x => <group key={`balusters-${x}`}>
      {[2.05, 2.35, 2.65].map(z => block(`baluster-${z}`, [x, .78, z], [.055, .5, .055], kit.trim))}
    </group>)}
    {/* Porch, steps and a short railing keep the entrance legible. */}
    {block('porch', [-.3, .43, 2.4], [3.2, .24, 1.2], kit.floor)}
    {block('step', [-.75, .34, 3.15], [1.6, .18, .6], kit.trim)}
    {[-1.8, 1.2].map(x => <group key={x}>{block('rail-post', [x, .65, 2.85], [.12, 1, .12], kit.wood)}{block('rail', [x, .95, 2.35], [.1, .1, 1.2], kit.trim)}</group>)}
    {/* Workspace is real geometry, revealed through the open studio wall. */}
    <group name="laptop-interaction" position={[1.15, 0, .3]} onPointerOver={event => { event.stopPropagation(); enter('laptop') }} onPointerOut={() => setHovered(null)} onClick={event => { if (interactive) { event.stopPropagation(); onExplore('laptop') } }}>
      {block('desk', [0, 1, 0], [1.65, .12, .8], kit.wood)}
      {[-.65, .65].map(x => block(`leg-${x}`, [x, .65, 0], [.09, .7, .6], kit.trim))}
      {block('laptop-base', [0, 1.1, .05], [.9, .045, .5], kit.roof)}
      {block('laptop-frame', [0, 1.43, -.17], [.95, .65, .07], kit.wood, [-.12, 0, 0])}
      {block('laptop-screen', [0, 1.43, -.12], [.83, .53, .02], kit.screen, [-.12, 0, 0])}
      {Array.from({ length: 5 }, (_, i) => block(`code-${i}`, [-.08 + (i % 2) * .05, 1.61 - i * .085, -.07], [.45 - (i % 3) * .08, .018, .012], i % 2 ? kit.code : kit.mint))}
      <group position={[0, 1.4, .05]}><Glow color="#cda4ff" size={hovered === 'laptop' ? 2.2 : 1.3} opacity={.25} /></group>
      {block('monitor-stand', [.2, 1.2, -.28], [.08, .25, .1], kit.roof)}
      {block('monitor', [.2, 1.65, -.3], [1.2, .78, .08], kit.roof)}
      {block('monitor-glass', [.2, 1.65, -.25], [1.08, .65, .02], kit.screen)}
      {Array.from({ length: 5 }, (_, i) => block(`monitor-code-${i}`, [.12, 1.87 - i * .1, -.23], [.63 - (i % 3) * .12, .025, .012], i % 2 ? kit.code : kit.mint))}
      {block('trackpad', [0, 1.13, .19], [.22, .012, .12], kit.trim)}
      {[0, 1, 2].map(i => block(`keyboard-${i}`, [0, 1.13, -.01 + i * .05], [.63, .012, .018], kit.code))}
      {[0, 1].map(i => block(`desk-book-${i}`, [-.64, 1.12 + i * .075, .03], [.28, .065, .38], i ? kit.book : kit.mint, [0, i * .15, 0]))}
      {block('mug', [.6, 1.2, .1], [.13, .2, .13], kit.mint)}
    </group>
    {block('chair-seat', [1.15, .65, 1.15], [.6, .12, .6], kit.roof)}
    {block('chair-back', [1.15, 1, 1.42], [.6, .65, .1], kit.wood)}
    {block('chair-base', [1.15, .44, 1.15], [.12, .4, .12], kit.wood)}
    <group name="bookshelf-interaction" position={[1.1, 0, -1.35]} onPointerOver={event => { event.stopPropagation(); enter('bookshelf') }} onPointerOut={() => setHovered(null)} onClick={event => { if (interactive) { event.stopPropagation(); onExplore('bookshelf') } }}>
      {[-.55, .55].map(x => block(`side-${x}`, [x, 1.25, 0], [.1, 1.9, .45], kit.wood))}
      {[.4, 1, 1.6, 2.2].map((y, row) => <group key={y}>
        {block('shelf', [0, y, 0], [1.2, .08, .48], hovered === 'bookshelf' ? kit.trim : kit.wood)}
        {row < 3 && Array.from({ length: 5 }, (_, i) => block(`book-${i}`, [-.4 + i * .18, y + .24, 0], [.12, .35 + (i % 2) * .1, .29], i % 2 ? kit.book : kit.mint, [0, 0, i === 4 ? -.1 : 0]))}
      </group>)}
    </group>
    <pointLight position={[.3, 2.2, .5]} color="#ffc29f" intensity={4} distance={5} decay={2} />
  </group>
}
