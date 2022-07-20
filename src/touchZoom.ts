/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 16:35:52
 * @Last Modified by:   阿佑
 * @Last Modified time: 2022-07-06 16:35:52
 */
import Point, { PointCoords } from './Point'
import Transform from './Transform'
import { noDefaultAndPopogation, translate, ZoomCallback, ZoomType } from './zoom'

function toList (touchList: TouchList): Touch[] {
  return [].slice.call(touchList)
}

function of (e: Touch): PointCoords {
  return [e.clientX, e.clientY]
}

export type Finger = {
  touch: Touch;
  id: number;
  start: Point;
}

function touchZoom (target: HTMLElement, callback: ZoomCallback) {
  let transform = new Transform()

  function emit (type: ZoomType, e: TouchEvent) {
    callback({
      sourceEvent: e,
      type,
      transform,
    })
  }

  let fingers: Finger[] = []

  function useFingers (e: TouchEvent) {
    fingers.push(...toList(e.changedTouches).map(touch => ({
      touch,
      id: touch.identifier,
      start: Point.from(transform.invert([touch.clientX, touch.clientY])),
    })))
    document.querySelector('#start')!.textContent = fingers.map(f => f.id).toString()
  }

  function zoom (e: TouchEvent) {
    e.currentTarget.textContent = toList(e.changedTouches).map(f => f.identifier).toString()
    /**
     * scale
     */
    if (fingers.length > 1) {
      return transform
    }

    /**
     * pan
     */
    if (fingers.length === 1) {
      return translate(transform, Point.from(of(e.changedTouches[0])), fingers[0].start)
    }

    return transform
  }

  function releaseFingers (e: TouchEvent) {
    const touches = toList(e.touches)
    const releasedFingers = toList(e.changedTouches).map(t => t.identifier)

    let cursor = -1
    for (let i = 0, l = fingers.length; i < l; i++) {
      const finger = fingers[i]
      if (releasedFingers.indexOf(fingers[i].id) === -1) {
        const touch = touches.find(t => t.identifier === finger.id)
        if (touch) {
          fingers[++cursor] = {
            touch,
            id: touch.identifier,
            start: Point.from(transform.invert([touch.clientX, touch.clientY]))
          }
        }
      }
    }

    fingers.length = ++cursor

    // fingers = fingers.filter(finger => {
    //   return releasedFingers.indexOf(finger.id) === -1
    // })

    document.querySelector('#end')!.textContent = releasedFingers.toString()
  }

  function onTouchStart (e: TouchEvent) {
    useFingers(e)

    function onTouchMove (e: TouchEvent) {
      transform = zoom(e)

      emit('zoom', e)

      noDefaultAndPopogation(e)
    }

    function onTouchEnd (e: TouchEvent) {
      releaseFingers(e)

      emit('end', e)

      if (fingers.length === 0) {
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
