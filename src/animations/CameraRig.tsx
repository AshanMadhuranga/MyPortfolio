import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { world } from '../config/world'
import { cameraProgress } from '../utils/journey'

export function CameraRig({ reduced, mobile, progress, replay }: { reduced: boolean; mobile: boolean; progress: RefObject<number>; replay: number }) {
  const intro = useRef({ value: reduced ? 1 : 0 })
  const time = useRef(0)
  const blended = useRef(0)
  const firstFrame = useRef(true)
  const lastReplay = useRef(replay)
  const previous = useRef({ reduced, progress: -1, width: 0, height: 0 })
  const size = useThree(state => state.size)
  const vectors = useMemo(() => ({ position: new THREE.Vector3(), target: new THREE.Vector3(), home: new THREE.Vector3(), homeTarget: new THREE.Vector3() }), [])
  const shot = mobile ? world.cameras.mobile : world.cameras.desktop
  const journeyPosition = !mobile && size.width <= 1100 ? world.journeyTablet.position : shot.journey
  const journeyTarget = !mobile && size.width <= 1100 ? world.journeyTablet.target : shot.journeyTarget
  const terminalPosition = !mobile && size.width <= 1100 ? world.terminalTablet.position : shot.terminal
  const terminalTarget = !mobile && size.width <= 1100 ? world.terminalTablet.target : shot.terminalTarget
  const contactPosition = !mobile && size.width <= 1100 ? world.contactTablet.position : shot.contact
  const contactTarget = !mobile && size.width <= 1100 ? world.contactTablet.target : shot.contactTarget
  const curves = useMemo(() => ({
    position: new THREE.CubicBezierCurve3(new THREE.Vector3(...shot.home), new THREE.Vector3(...shot.controls[0]), new THREE.Vector3(...shot.controls[1]), new THREE.Vector3(...shot.about)),
    target: new THREE.CubicBezierCurve3(new THREE.Vector3(...shot.homeTarget), new THREE.Vector3(...shot.targetControls[0]), new THREE.Vector3(...shot.targetControls[1]), new THREE.Vector3(...shot.aboutTarget)),
    skillsPosition: new THREE.CubicBezierCurve3(new THREE.Vector3(...shot.about), new THREE.Vector3(...shot.skillsControls[0]), new THREE.Vector3(...shot.skillsControls[1]), new THREE.Vector3(...shot.skills)),
    skillsTarget: new THREE.CubicBezierCurve3(new THREE.Vector3(...shot.aboutTarget), new THREE.Vector3(...shot.skillsTargetControls[0]), new THREE.Vector3(...shot.skillsTargetControls[1]), new THREE.Vector3(...shot.skillsTarget)),
    contactPosition: new THREE.CubicBezierCurve3(new THREE.Vector3(...terminalPosition), new THREE.Vector3(...shot.contactControls[0]), new THREE.Vector3(...shot.contactControls[1]), new THREE.Vector3(...contactPosition)),
    contactTarget: new THREE.CubicBezierCurve3(new THREE.Vector3(...terminalTarget), new THREE.Vector3(...shot.contactTargetControls[0]), new THREE.Vector3(...shot.contactTargetControls[1]), new THREE.Vector3(...contactTarget)),
    terminalPosition: new THREE.CubicBezierCurve3(new THREE.Vector3(...journeyPosition), new THREE.Vector3(...shot.terminalControls[0]), new THREE.Vector3(...shot.terminalControls[1]), new THREE.Vector3(...terminalPosition)),
    terminalTarget: new THREE.CubicBezierCurve3(new THREE.Vector3(...journeyTarget), new THREE.Vector3(...shot.terminalTargetControls[0]), new THREE.Vector3(...shot.terminalTargetControls[1]), new THREE.Vector3(...terminalTarget)),
    journeyPosition: new THREE.CubicBezierCurve3(new THREE.Vector3(...shot.projects), new THREE.Vector3(...shot.journeyControls[0]), new THREE.Vector3(...shot.journeyControls[1]), new THREE.Vector3(...journeyPosition)),
    journeyTarget: new THREE.CubicBezierCurve3(new THREE.Vector3(...shot.projectsTarget), new THREE.Vector3(...shot.journeyTargetControls[0]), new THREE.Vector3(...shot.journeyTargetControls[1]), new THREE.Vector3(...journeyTarget)),
    projectsPosition: new THREE.CubicBezierCurve3(new THREE.Vector3(...shot.skills), new THREE.Vector3(...shot.projectsControls[0]), new THREE.Vector3(...shot.projectsControls[1]), new THREE.Vector3(...shot.projects)),
    projectsTarget: new THREE.CubicBezierCurve3(new THREE.Vector3(...shot.skillsTarget), new THREE.Vector3(...shot.projectsTargetControls[0]), new THREE.Vector3(...shot.projectsTargetControls[1]), new THREE.Vector3(...shot.projectsTarget)),
  }), [shot, journeyPosition, journeyTarget, terminalPosition, terminalTarget, contactPosition, contactTarget])
  useEffect(() => {
    if (lastReplay.current !== replay) { intro.current.value = 0; lastReplay.current = replay }
    if (reduced) return
    if (progress.current > .01) { intro.current.value = 1; return }
    const tween = gsap.to(intro.current, { value: 1, duration: 4 * (1 - intro.current.value), ease: 'power2.inOut' })
    return () => { tween.kill() }
  }, [replay, reduced, progress])
  useFrame(({ camera, pointer }, delta) => {
    const pauseStarted = reduced && !previous.current.reduced
    const unchanged = progress.current === previous.current.progress && size.width === previous.current.width && size.height === previous.current.height
    previous.current.reduced = reduced; previous.current.progress = progress.current
    previous.current.width = size.width; previous.current.height = size.height
    // Switching calm mode freezes the current composition; deliberate navigation still reaches either endpoint.
    if (reduced && !firstFrame.current && (pauseStarted || unchanged)) return
    const dt = Math.min(delta, .1)
    if (!reduced) time.current += dt
    const requested = cameraProgress(progress.current, reduced)
    if (firstFrame.current) { blended.current = requested; firstFrame.current = false }
    blended.current = reduced ? requested : THREE.MathUtils.damp(blended.current, requested, 6, dt)
    const sixth = blended.current > 5
    const fifth = blended.current > 4
    const fourth = blended.current > 3
    const third = blended.current > 2
    const second = blended.current > 1
    const p = THREE.MathUtils.smoothstep(sixth ? blended.current - 5 : fifth ? blended.current - 4 : fourth ? blended.current - 3 : third ? blended.current - 2 : second ? blended.current - 1 : blended.current, 0, 1)
    const positionCurve = sixth ? curves.contactPosition : fifth ? curves.terminalPosition : fourth ? curves.journeyPosition : third ? curves.projectsPosition : second ? curves.skillsPosition : curves.position
    const targetCurve = sixth ? curves.contactTarget : fifth ? curves.terminalTarget : fourth ? curves.journeyTarget : third ? curves.projectsTarget : second ? curves.skillsTarget : curves.target
    positionCurve.getPoint(p, vectors.position)
    targetCurve.getPoint(p, vectors.target)
    // At Home the approved opening shot remains exactly the same; its influence vanishes on departure.
    const entrance = (1 - intro.current.value) * (1 - p) * (second ? 0 : 1)
    vectors.position.x += (shot.wide[0] - shot.home[0]) * entrance
    vectors.position.y += (shot.wide[1] - shot.home[1]) * entrance
    vectors.position.z += (shot.wide[2] - shot.home[2]) * entrance
    const aspect = size.width / Math.max(1, size.height)
    vectors.position.z += mobile ? Math.max(0, .9 - aspect) * 6 : Math.max(0, 1.45 - aspect) * 7
    if (!reduced) {
      const stable = 1 - Math.sin(p * Math.PI) * .8
      vectors.position.x += (Math.sin(time.current * .18) * .045 + (mobile ? 0 : pointer.x * .24)) * stable
      vectors.position.y += (Math.sin(time.current * .18) * .018 + (mobile ? 0 : pointer.y * .1)) * stable
    }
    camera.position.copy(vectors.position)
    camera.lookAt(vectors.target)
  })
  return null
}
