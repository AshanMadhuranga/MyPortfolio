import type { WorldStage } from '../config/world'

export function journeyProgress(scrollY: number, destinationY: number, segments = 1) {
  return Math.max(0, Math.min(segments, scrollY / Math.max(1, destinationY)))
}
export function journeyStage(progress: number): WorldStage {
  return progress > 5.84 ? 'contact' : progress > 4.84 && progress < 5.16 ? 'terminal' : progress > 3.84 && progress < 4.16 ? 'journey' : progress > 2.84 && progress < 3.16 ? 'projects' : progress > 1.84 && progress < 2.16 ? 'skills' : progress > .84 && progress < 1.16 ? 'about' : progress < .09 ? 'home' : 'travel'
}
export function cameraProgress(progress: number, reduced: boolean) {
  return reduced ? Math.round(Math.max(0, Math.min(6, progress))) : progress
}
