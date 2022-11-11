/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 16:35:56
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:58:05
 */
import { ZoomData, ZoomEmit } from './types'
import {
  noDefaultAndPropagation, translate, scaleViaWheel,
  centerOf, scale, constrain,
} from './zoom'
import Point, { Bounding, Vector } from './Point'

export function mouseZoom (target: HTMLElement, data: ZoomData, emit: ZoomEmit) {
  const rect = target.getBoundingClientRect()
  let bounding: Bounding = [[rect.x, rect.y], [rect.x + rect.width, rect.y + rect.height]]

  function onMouseDown (e: MouseEvent) {
    let dirty = false

    const start = Point.from(data.transform.invert([e.clientX, e.clientY]))

    function onMouseMove (e: MouseEvent) {
      data.transform = constrain(
        translate(data.transform, new Point(e.clientX, e.clientY), start), bounding, data.limit)

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
    const k = scaleViaWheel(e, data.transform.k)

    const center = Point.from(centerOf(e.currentTarget as HTMLElement))

    const offset = new Point(e.clientX, e.clientY).offsetFrom(center)

    const p: Vector = [data.transform.x - offset[0], data.transform.y - offset[1]]

    // 奇点
    const singularity = Point.from(data.transform.invert(p))

    data.transform = constrain(
      translate(scale(data.transform, k, data.limit), Point.from(p), singularity), bounding, data.limit)

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
