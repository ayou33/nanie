/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 15:48:38
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:56:12
 */
import touchZoom from './touchZoom'
import { TransformLimit } from './Transform'
import { ZoomEvent } from './zoom'
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

const defaultNaNieOptions: TransformLimit = {
  translateExtent: [[-Infinity, -Infinity], [Infinity, Infinity]],
  scaleExtent: [0.1, Infinity],
}

export type ZoomHandler = (this: HTMLElement, e: ZoomEvent) => void

export function nanie (
  target: HTMLElement,
  mixed?: Partial<TransformLimit> | ZoomHandler,
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

  let stop = () => {}

  function zoom (e: ZoomEvent) {
    zoomHandler?.call(target, e)
  }

  if (target instanceof Element) {
    if (!isPC() && isTouchable()) {
      stop = touchZoom(target, zoom, options)
    } else {
      stop = mouseZoom(target, zoom, options)
    }
  } else {
    throw new Error('Invalid zoom target')
  }

  return stop
}

export default nanie
