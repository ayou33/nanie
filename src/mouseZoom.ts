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
import Transform, { TransformLimit } from './Transform'
import Point, { Bound, Vector } from './Point'

export function mouseZoom (target: HTMLElement, callback: ZoomCallback, limit: TransformLimit) {
  const rect = target.getBoundingClientRect()
  let extent: Bound = [[rect.x, rect.y], [rect.x + rect.width, rect.y + rect.height]]
  let transform = new Transform()

  function emit (type: ZoomType, e: MouseEvent) {
    callback({
      sourceEvent: e,
      type,
      transform,
    })
  }

  function onMouseDown (e: MouseEvent) {

    const start = Point.from(transform.invert([e.clientX, e.clientY]))

    function onMouseMove (e: MouseEvent) {
      transform = constrain(translate(transform, new Point(e.clientX, e.clientY), start), extent, limit)

      emit('zoom', e)

      noDefaultAndPropagation(e)
    }

    function onMouseUp (e: MouseEvent) {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseleave', onMouseUp)

      emit('end', e)
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

    transform = constrain(translate(scale(transform, k, limit), Point.from(p), singularity), extent, limit)

    emit('zoom', e)

    noDefaultAndPropagation(e)
  }

  target.addEventListener('mousedown', onMouseDown)
  target.addEventListener('wheel', onWheel)

  return () => {
    target.removeEventListener('mousedown', onMouseDown)
    target.removeEventListener('wheel', onWheel)
  }
}

export default mouseZoom
