/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 16:35:56
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:58:05
 */
import {
  ZoomCallback,
  noDefaultAndPropagation,
  ZoomType,
  translate,
  scaleViaWheel,
  centerOf,
  scale,
  constrain,
} from './zoom'
import Transform, { TransformExtent } from './Transform'
import Point, { Bounding, Vector } from './Point'

export function mouseZoom (target: HTMLElement, callback: ZoomCallback, limit: TransformExtent) {
  const rect = target.getBoundingClientRect()
  let bounding: Bounding = [[rect.x, rect.y], [rect.x + rect.width, rect.y + rect.height]]
  let transform = new Transform()
  let transformLimit = limit

  function emit (type: ZoomType, e: MouseEvent) {
    callback({
      sourceEvent: e,
      type,
      transform,
    }, t => transform = t)
  }

  function onMouseDown (e: MouseEvent) {
    let zoomed = false

    const start = Point.from(transform.invert([e.clientX, e.clientY]))

    function onMouseMove (e: MouseEvent) {
      transform = constrain(translate(transform, new Point(e.clientX, e.clientY), start), bounding, transformLimit)

      zoomed = true
      emit('zoom', e)

      noDefaultAndPropagation(e)
    }

    function onMouseUp (e: MouseEvent) {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseleave', onMouseUp)

      emit(zoomed ? 'end' : 'click', e)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseleave', onMouseUp)

    emit('start', e)

    e.stopImmediatePropagation()
  }

  function onWheel (e: WheelEvent) {
    const k = scaleViaWheel(e, transform.k)

    const center = Point.from(centerOf(e.currentTarget as HTMLElement))

    const offset = new Point(e.clientX, e.clientY).offsetFrom(center)

    const p: Vector = [transform.x - offset[0], transform.y - offset[1]]

    // 奇点
    const singularity = Point.from(transform.invert(p))

    transform = constrain(translate(scale(transform, k, limit), Point.from(p), singularity), bounding, transformLimit)

    emit('zoom', e)

    noDefaultAndPropagation(e)
  }

  target.addEventListener('mousedown', onMouseDown)
  target.addEventListener('wheel', onWheel)

  return {
    constrain (limit: TransformExtent) {
      transformLimit = limit
    },
    apply (nextTransform: Transform) {
      transform = nextTransform
    },
    stop () {
      target.removeEventListener('mousedown', onMouseDown)
      target.removeEventListener('wheel', onWheel)
    },
  }
}

export default mouseZoom
