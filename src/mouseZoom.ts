/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 16:35:56
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:58:05
 */
import { ZoomCallback, noDefaultAndPropagation, ZoomType, translate, scaleViaWheel, centerOf } from './zoom'
import Transform from './Transform'
import Point, { PointCoords } from './Point'

function mouseZoom (target: HTMLElement, callback: ZoomCallback) {
  let transform = new Transform()

  function emit (type: ZoomType, e: MouseEvent) {
    callback({
      sourceEvent: e,
      type,
      transform: transform.clone(),
    })
  }

  function onMouseDown (e: MouseEvent) {

    const start = Point.from(transform.invert([e.clientX, e.clientY]))

    function onMouseMove (e: MouseEvent) {
      transform = translate(transform, new Point(e.clientX, e.clientY), start)

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

    const p: PointCoords = [transform.x - offset[0], transform.y - offset[1]]

    // 奇点
    const singularity = Point.from(transform.invert(p))

    transform = translate(
      new Transform(k, transform.x, transform.y),
      Point.from(p),
      singularity,
    )

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
