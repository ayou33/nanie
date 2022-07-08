/*
 * @Author: 阿佑[ayooooo@petalmail.com] 
 * @Date: 2022-07-06 16:35:56 
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:58:05
 */
import { ZoomCallback, noDefaultAndPopogation, ZoomType } from "./zoom"
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
    e.stopImmediatePropagation()

    const dragFrom = new Point(-e.clientX, -e.clientY)

    function onMouseMove (e: MouseEvent) {
      noDefaultAndPopogation(e)

      console.log(e.clientX, e.clientX + dragFrom.value()[0])

      transform = transform.translate(...dragFrom.translate([e.clientX, e.clientY]).value())

      emit('zoom', e)
    }

    function onMouseUp (e: MouseEvent) {
      noDefaultAndPopogation(e)

      target.removeEventListener('mousemove', onMouseMove)
      target.removeEventListener('mouseup', onMouseUp)
      target.removeEventListener('mouseleave', onMouseUp)

      emit('end', e)
    }

    target.addEventListener('mousemove', onMouseMove)
    target.addEventListener('mouseup', onMouseUp)
    target.addEventListener('mouseleave', onMouseUp)

    emit('start', e)
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
