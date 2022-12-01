/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 15:48:38
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:56:12
 */
import { Transform as T, TransformExtent } from './Transform'
import { TransformReceiver as _TransformReceiver, ZoomCallback, ZoomEvent as _ZoomEvent } from './types'
import zoom from './zoom'

export type Transform = T

export type NaNieOptions = {
  limit: TransformExtent,
}

const defaultNaNieOptions: NaNieOptions = {
  limit: {
    translateExtent: [[-Infinity, -Infinity], [Infinity, Infinity]],
    scaleExtent: [0.1, Infinity],
  },
}

export type ZoomEvent = _ZoomEvent

export type TransformReceiver = _TransformReceiver

export type ZoomHandler = (this: HTMLElement, e: ZoomEvent, correct: (t: Transform) => void) => void

export type API = ReturnType<typeof zoom>

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

  const callback: ZoomCallback = (e: ZoomEvent, c) => {
    zoomHandler?.call(target, e, c)
  }

  if (target instanceof Element) {
    return zoom(target, callback, options.limit)
  } else {
    throw new Error('Invalid zoom target')
  }
}

export default nanie
