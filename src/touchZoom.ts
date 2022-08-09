/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 16:35:52
 * @Last Modified by:   阿佑
 * @Last Modified time: 2022-07-06 16:35:52
 */
import Fingers from './Fingers'
import Transform, { TransformLimit } from './Transform'
import { noDefaultAndPropagation, ZoomCallback, ZoomType } from './zoom'

export function touchZoom (target: HTMLElement, callback: ZoomCallback, limit: TransformLimit) {
  let transform = new Transform()
  const fingers = new Fingers(transform)

  function emit (type: ZoomType, e: TouchEvent) {
    callback({
      sourceEvent: e,
      type,
      transform,
    })
  }

  function onTouchStart (e: TouchEvent) {
    fingers.use(e)

    function onTouchMove (e: TouchEvent) {
      transform = fingers.translate(e, limit)

      emit('zoom', e)

      noDefaultAndPropagation(e)
    }

    function onTouchEnd (e: TouchEvent) {
      fingers.release(e)

      emit('end', e)

      if (fingers.count() === 0) {
        target.removeEventListener('touchmove', onTouchMove)
        target.removeEventListener('touchend', onTouchEnd)
        target.removeEventListener('touchcancel', onTouchEnd)
      }
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
