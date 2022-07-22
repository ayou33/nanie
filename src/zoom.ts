import Point, { Vector } from './Point'
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

export const centerOf = (e: HTMLElement): Vector => {
  const rect = e.getBoundingClientRect()
  return [rect.left + rect.width / 2, rect.top + rect.height / 2]
}

export const scaleDelta = (e: WheelEvent) => {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * (e.ctrlKey ? 10 : 1)
}

export const scaleViaWheel = (e: WheelEvent, k: number) => {
  return k * Math.pow(2, scaleDelta(e))
}

export const translate = (transform: Transform, p0: Point, p1: Point) => {
  const x = p0.x - p1.x * transform.k
  const y = p0.y - p1.y * transform.k
  return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y)
}

export const scale = (transform: Transform, k: number) => {
  return k === 1 ? transform : new Transform(k, transform.x, transform.y)
}
