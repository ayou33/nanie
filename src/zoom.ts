import Point from "./Point";
import Transform from "./Transform"

export type ZoomType = 'start' | 'zoom' | 'end'

export type ZoomEvent = {
  sourceEvent: Event;
  type: ZoomType;
  transform: Transform;
}

export type ZoomCallback = (e: ZoomEvent) => void

export const noDefaultAndPopogation =  (e: Event) => {
  e.preventDefault()
  e.stopImmediatePropagation()
}

export const pointMouse = (e: MouseEvent) => {}

export const scale = () => {}

export const translate = (t: Transform, p0: Point, p1: Point) => {
  const x = p0.x - p1.x * t.k
  const y = p0.y - p1.y * t.k
  return x === t.x && y === t.y ? t : new Transform(t.k, x, y)
}