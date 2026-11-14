import { AdditiveBlending, DoubleSide } from 'three'

// Local additive halo: no full-screen bloom pass or extra render target.
export function Glow({ color = '#ed61ff', size = 5, opacity = .35 }: { color?: string; size?: number; opacity?: number }) {
  return <mesh>
    <planeGeometry args={[size, size]} />
    <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} side={DoubleSide}
      uniforms={{ tint: { value: colorToVector(color) }, strength: { value: opacity } }}
      vertexShader="varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }"
      fragmentShader="varying vec2 vUv; uniform vec3 tint; uniform float strength; void main(){float r=length(vUv-.5)*2.; float a=pow(max(0.,1.-r),2.5)*strength; gl_FragColor=vec4(tint,a);}" />
  </mesh>
}
function colorToVector(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]
}
