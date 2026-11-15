export function getNextGalleryIndex(index: number, direction: number, imageCount: number): number {
  if (imageCount <= 0) return 0

  return ((index + direction) % imageCount + imageCount) % imageCount
}