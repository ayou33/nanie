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