import Point, { PointCoords } from './Point'
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

export const pointMouse = (e: MouseEvent, element?: HTMLElement): PointCoords => {
  const target = element ?? e.currentTarget as HTMLElement

  if (!target || !target.getBoundingClientRect) {
    return [e.clientX, e.clientY]
  }

  const rect = target.getBoundingClientRect()
  return [e.clientX - rect.left - target.clientLeft, e.clientY - rect.top - target.clientTop]
}

export const scaleDelta = (e: WheelEvent) => {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * (e.ctrlKey ? 10 : 1)

}

export const scaleTo = (e: WheelEvent, k: number) => {
  return k * Math.pow(2, scaleDelta(e))
}

export const translate = (t: Transform, p0: Point, p1: Point) => {
  const x = p0.x - p1.x * t.k
  const y = p0.y - p1.y * t.k
  return x === t.x && y === t.y ? t : new Transform(t.k, x, y)
}


export const scale = (t: Transform, k: number) => {
  return k === t.k ? t : new Transform(k, t.x, t.y)
}
