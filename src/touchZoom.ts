/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 16:35:52
 * @Last Modified by:   阿佑
 * @Last Modified time: 2022-07-06 16:35:52
 */
import Point from './Point'
import Transform from './Transform'
import { noDefaultAndPopogation, translate, ZoomCallback, ZoomType } from './zoom'

function touchZoom (target: HTMLElement, callback: ZoomCallback) {
  let transform = new Transform()

  let s = 1

  function emit (type: ZoomType, e: TouchEvent) {
    callback({
      sourceEvent: e,
      type,
      transform,
    })
  }

  function onTouchStart (e: TouchEvent) {
    const figners: number[] = []
    const start = Point.from(transform.invert([e.touches[0].clientX, e.touches[0].clientY]))

    // e.currentTarget.textContent = ++s

    function onTouchMove (e: TouchEvent) {
      transform = translate(transform, Point.from([e.touches[0].clientX, e.touches[0].clientY]), start)
      e.currentTarget.textContent = e.touches.length
      console.log(e.touches)
      emit('zoom', e)

      noDefaultAndPopogation(e)
    }

    function onTouchEnd (e: TouchEvent) {
      target.removeEventListener('touchmove', onTouchMove)
      target.removeEventListener('touchend', onTouchEnd)
      target.removeEventListener('touchcancel', onTouchEnd)
      e.currentTarget.textContent = 'end'

      emit('end', e)
    }

    target.addEventListener('touchmove', onTouchMove)
    target.addEventListener('touchend', onTouchEnd)
    target.addEventListener('touchcancel', onTouchEnd)

    emit('start', e)

    e.stopImmediatePropagation()
  }

  target.addEventListener('touchstart', onTouchStart)

  return () => {
    target.removeEventListener('touchstart', onTouchStart)
  }
}

export default touchZoom
