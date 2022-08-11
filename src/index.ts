/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 15:48:38
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:56:12
 */
import touchZoom from './touchZoom'
import { Transform, TransformExtent } from './Transform'
import { ZoomCallback, ZoomEvent } from './zoom'
import mouseZoom from './mouseZoom'

function isPC () {
  const userAgentInfo = navigator.userAgent
  const Agents = [
    'Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod',
  ]

  let flag = true

  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }

  return flag
}

function isTouchable () {
  return navigator.maxTouchPoints || ('ontouchstart' in window)
}

export type NaNieOptions = {
  limit: TransformExtent,
}

const defaultNaNieOptions: NaNieOptions = {
  limit: {
    translateExtent: [[-Infinity, -Infinity], [Infinity, Infinity]],
    scaleExtent: [0.1, Infinity],
  },
}

export type ZoomHandler = (this: HTMLElement, e: ZoomEvent, correct?: (t: Transform) => void) => void

export function nanie (
  target: HTMLElement,
  mixed?: Partial<NaNieOptions> | ZoomHandler,
  onZoom?: ZoomHandler,
) {
  let options = defaultNaNieOptions
  let zoomHandler: ZoomHandler = e => e

  if ('function' === typeof mixed) {
    zoomHandler = mixed
  }

  if ('object' === typeof mixed) {
    options = Object.assign(defaultNaNieOptions, mixed)
    zoomHandler = onZoom ?? zoomHandler
  }

  let constrain: (limit?: TransformExtent) => void = () => {}

  const zoom: ZoomCallback = (e: ZoomEvent, c) => {
    zoomHandler?.call(target, e, c)
  }

  if (target instanceof Element) {
    if (!isPC() && isTouchable()) {
      constrain = touchZoom(target, zoom, options.limit)
    } else {
      constrain = mouseZoom(target, zoom, options.limit)
    }
  } else {
    throw new Error('Invalid zoom target')
  }

  return constrain
}

export default nanie
