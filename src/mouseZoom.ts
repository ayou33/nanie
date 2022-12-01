/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 16:35:56
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:58:05
 */
import { ZoomModel, ZoomEmit } from './types'
import {
  noDefaultAndPropagation, translate, scaleViaWheel,
  centerOf, scale, constrain,
} from './zoom'
import Point, { Bounding, Vector } from './Point'

export function mouseZoom (target: HTMLElement, model: ZoomModel, emit: ZoomEmit) {
  const rect = target.getBoundingClientRect()
  let bounding: Bounding = [[rect.x, rect.y], [rect.x + rect.width, rect.y + rect.height]]

  function onMouseDown (e: MouseEvent) {
    let dirty = false

    const start = Point.from(model.transform.invert([e.clientX, e.clientY]))

    function onMouseMove (e: MouseEvent) {
      model.transform = constrain(
        translate(model.transform, new Point(e.clientX, e.clientY), start), bounding, model.limit)

      dirty = true

      emit('zoom', e)

      noDefaultAndPropagation(e)
    }

    function onMouseUp (e: MouseEvent) {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseleave', onMouseUp)

      emit('end', e, dirty)

      if (!dirty) emit('click', e)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseleave', onMouseUp)

    emit('start', e)

    e.stopImmediatePropagation()
  }

  function onWheel (e: WheelEvent) {
    const k = scaleViaWheel(e, model.transform.k)

    const center = Point.from(centerOf(e.currentTarget as HTMLElement))

    const offset = new Point(e.clientX, e.clientY).offsetFrom(center)

    const p: Vector = [model.transform.x - offset[0], model.transform.y - offset[1]]

    // 奇点
    const singularity = Point.from(model.transform.invert(p))

    model.transform = constrain(
      translate(scale(model.transform, k, model.limit), Point.from(p), singularity), bounding, model.limit)

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
