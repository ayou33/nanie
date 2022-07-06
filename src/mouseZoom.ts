/*
 * @Author: 阿佑[ayooooo@petalmail.com] 
 * @Date: 2022-07-06 16:35:56 
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-06 18:54:29
 */
import { ZoomCallback, noDefaultAndPopogation, ZoomType } from "./zoom"
import Transform from './Transform'

function mouseZoom (target: HTMLElement, callback: ZoomCallback) {
  const transform = new Transform()

  function emit (type: ZoomType, e: MouseEvent) {
    callback({
      sourceEvent: e,
      type,
      transform,
    })
  }

  function onMouseDown (e: MouseEvent) {
    e.stopImmediatePropagation()

    target.addEventListener('mousemove', onMouseMove)
    target.addEventListener('mouseup', onMouseUp)

    emit('start', e)
  }

  function onMouseMove (e: MouseEvent) {
    noDefaultAndPopogation(e)

    emit('zoom', e)
  }

  function onMouseUp (e: MouseEvent) {
    noDefaultAndPopogation(e)

    target.removeEventListener('mousemove', onMouseMove)
    target.removeEventListener('mouseup', onMouseUp)

    emit('end', e)
  }

  function onWheel (e: MouseEvent) {
    noDefaultAndPopogation(e)

    emit('zoom', e)
  }

  target.addEventListener('mousedown', onMouseDown)
  target.addEventListener('wheel', onWheel)

  return () => {
    target.removeEventListener('mousedown', onMouseDown)
    target.removeEventListener('wheel', onWheel)
  }
}

export default mouseZoom
