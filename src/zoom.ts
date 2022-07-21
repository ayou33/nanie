import Point, { PointCoords } from './Point'
import Transform from "./Transform"

export type ZoomType = 'start' | 'zoom' | 'end'

export type ZoomEvent = {
  sourceEvent: Event;
  type: ZoomType;
  transform: Transform;
}

export type ZoomCallback = (e: ZoomEvent) => void

export const noDefaultAndPropagation =  (e: Event) => {
  e.preventDefault()
  e.stopImmediatePropagation()
}

export const pointer = (e: MouseEvent, element?: HTMLElement): PointCoords => {
  const target = element ?? e.currentTarget as HTMLElement

  if (!target || !target.getBoundingClientRect) {
    return [e.clientX, e.clientY]
  }

  const rect = target.getBoundingClientRect()
  return [e.clientX - rect.left - target.clientLeft, e.clientY - rect.top - target.clientTop]
}

export const centerOf = (e: HTMLElement): PointCoords => {
  const rect = e.getBoundingClientRect()
  return [rect.left + rect.width / 2, rect.top + rect.height / 2]
}

export const scale = (n: number, k: number) => n * Math.pow(2, k)

export const scaleDelta = (e: WheelEvent) => {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * (e.ctrlKey ? 10 : 1)
}

export const scaleViaWheel = (e: WheelEvent, k: number) => {
  return scale(k, scaleDelta(e))
}

export const translate = (transform: Transform, p0: Point, p1: Point) => {
  const x = p0.x - p1.x * transform.k
  const y = p0.y - p1.y * transform.k
  return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y)
}

export const zoom = (transform: Transform, k: number, p: Point, offset: PointCoords) => {
  const p0 = transform.invert(p.value())
  const p1 = Point.from(p0).translate([offset[0] / transform.k * k, offset[1] / transform.k * k])
  if (p1.x === p.x && p1.y === p.y) return transform
  return new Transform(k, p1.x, p1.y)
}
