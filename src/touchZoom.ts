/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 16:35:52
 * @Last Modified by:   阿佑
 * @Last Modified time: 2022-07-06 16:35:52
 */
import Fingers from './Fingers'
import { Bounding } from './Point'
import { ZoomModel, ZoomEmit } from './types'
import { noDefaultAndPropagation } from './zoom'

export function touchZoom (target: HTMLElement, model: ZoomModel, emit: ZoomEmit) {
  const fingers = new Fingers(model.transform)
  const rect = target.getBoundingClientRect()
  let bounding: Bounding = [[rect.x, rect.y], [rect.x + rect.width, rect.y + rect.height]]

  function onTouchStart (e: TouchEvent) {
    let dirty = false

    fingers.use(e)

    function onTouchMove (e: TouchEvent) {
      dirty = true

      model.transform = fingers.translate(e, bounding, model.limit)

      emit('zoom', e)

      noDefaultAndPropagation(e)
    }

    function onTouchEnd (e: TouchEvent) {
      fingers.release(e)

      emit('end', e, dirty)

      if (!dirty) emit('click', e)

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
