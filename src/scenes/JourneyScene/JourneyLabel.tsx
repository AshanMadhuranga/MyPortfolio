import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, Color, SRGBColorSpace, SpriteMaterial } from 'three'

const resting = new Color('#e6dcf0')
const highlighted = new Color('#ffffff')

/** Journey-only signs: stable world dimensions, camera-facing text and real support posts. */
export function JourneyLabel({ number, lines, active, reduced }: { number: number; lines: readonly string[]; active: boolean; reduced: boolean }) {
  const material = useRef<SpriteMaterial>(null)
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 384
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#291b3b'; ctx.strokeStyle = '#dfb5ee'; ctx.lineWidth = 9
    ctx.beginPath(); ctx.roundRect(8, 8, 1520, 368, 42); ctx.fill(); ctx.stroke()
    ctx.fillStyle = '#463058'; ctx.beginPath(); ctx.roundRect(30, 30, 235, 324, 26); ctx.fill()
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#f4cfff'; ctx.font = '700 126px sans-serif'; ctx.fillText(String(number).padStart(2, '0'), 147, 198)
    ctx.fillStyle = '#fff5ff'
    const size = lines.length > 1 ? 98 : 116
    lines.forEach((line, i) => {
      let fontSize = size
      do { ctx.font = `600 ${fontSize}px sans-serif`; if (ctx.measureText(line).width <= 1180) break; fontSize -= 2 } while (fontSize > 30)
      ctx.fillText(line, 893, 192 + (i - (lines.length - 1) / 2) * 122)
    })
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; map.anisotropy = 4
    return map
  }, [number, lines])
  useEffect(() => () => texture.dispose(), [texture])
  useFrame((_, delta) => {
    if (!material.current) return
    const target = active ? highlighted : resting
    if (reduced) material.current.color.copy(target)
    else material.current.color.lerp(target, 1 - Math.exp(-8 * Math.min(delta, .1)))
  })
  return <sprite name={`journey-label-${number}`} position={[.2, .93, 3]} scale={[4.1, 1.025, 1]}><spriteMaterial ref={material} map={texture} transparent depthWrite={false} toneMapped={false} /></sprite>
}

export function CodeSymbol() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#c9fff5'; ctx.font = 'bold 168px monospace'; ctx.fillText('</>', 256, 132)
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={[0, .08, .18]}><planeGeometry args={[1.7, .85]} /><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} /></mesh>
}
