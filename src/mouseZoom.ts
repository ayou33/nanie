/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 16:35:56
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:58:05
 */
import { ZoomCallback, noDefaultAndPopogation, ZoomType, translate, scale } from './zoom'
import Transform from './Transform'
import Point from './Point'

function mouseZoom (target: HTMLElement, callback: ZoomCallback) {
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
      transform = translate(transform, new Point(e.clientX, e.clientY), start)

      emit('zoom', e)

      noDefaultAndPopogation(e)
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
    const k = scale(e, transform.k)

    // 奇点
    const singularity = Point.from([e.clientX, e.clientY])

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()

    const center = Point.from([rect.left + rect.width / 2, rect.top + rect.height / 2])

    const offset = Point.from(singularity.offsetFrom(center))

    const scaledOffset = offset.scale((k - transform.k) / transform.k)

    transform = new Transform(k, transform.x + scaledOffset.x, transform.y + scaledOffset.y)

    emit('zoom', e)

    noDefaultAndPopogation(e)
  }

  target.addEventListener('mousedown', onMouseDown)
  target.addEventListener('wheel', onWheel)

  return () => {
    target.removeEventListener('mousedown', onMouseDown)
    target.removeEventListener('wheel', onWheel)
  }
}

export default mouseZoom
