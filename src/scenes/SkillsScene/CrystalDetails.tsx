import { useEffect, useMemo } from 'react'
import { BufferGeometry, CanvasTexture, Color, Float32BufferAttribute, SRGBColorSpace } from 'three'

/** Labels live in WebGL; equivalent keyboard controls live in the main React root. */
export function CrystalLabel({ text, position, width = 1.5, badge = false }: { text: string; position: [number, number, number]; width?: number; badge?: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128
    const ctx = canvas.getContext('2d')!
    if (badge) { ctx.fillStyle = '#534064'; ctx.strokeStyle = '#e8b9ff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(3, 3, 506, 122, 56); ctx.fill(); ctx.stroke() }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff1ff'; ctx.font = badge ? '500 49px sans-serif' : 'bold 86px monospace'; ctx.shadowColor = '#d475ff'; ctx.shadowBlur = badge ? 0 : 16; ctx.fillText(text, 256, 66)
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map
  }, [text, badge])
  useEffect(() => () => texture.dispose(), [texture])
  return <sprite position={position} scale={[width, width / 4, 1]} raycast={() => {}}><spriteMaterial map={texture} transparent depthWrite={false} toneMapped={false} /></sprite>
}
export function useCrystalGeometry() {
  const geometry = useMemo(() => {
    const vertices: number[] = [], colors: number[] = []
    const palette = ['#bba4fa', '#d48eed', '#83cddd', '#9b87d5', '#edb6f3', '#a0b3f0'].map(c => new Color(c))
    const rings = [-1.15, 0, 1.15].map((y, row) => Array.from({ length: 6 }, (_, i) => { const angle = i * Math.PI / 3 + (row === 1 ? .22 : 0); const radius = row === 1 ? 1.35 : .8; return [Math.cos(angle) * radius, y, Math.sin(angle) * radius] }))
    const triangle = (a: number[], b: number[], c: number[], color: Color) => { vertices.push(...a, ...c, ...b); for (let i = 0; i < 3; i++) colors.push(color.r, color.g, color.b) }
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6
      triangle([0, -2.9, 0], rings[0][next], rings[0][i], palette[i])
      triangle([0, 2.9, 0], rings[2][i], rings[2][next], palette[(i + 2) % 6])
      for (let row = 0; row < 2; row++) { triangle(rings[row][i], rings[row][next], rings[row + 1][i], palette[(i + row) % 6]); triangle(rings[row][next], rings[row + 1][next], rings[row + 1][i], palette[(i + row + 1) % 6]) }
    }
    const result = new BufferGeometry(); result.setAttribute('position', new Float32BufferAttribute(vertices, 3)); result.setAttribute('color', new Float32BufferAttribute(colors, 3)); result.computeVertexNormals(); return result
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}
