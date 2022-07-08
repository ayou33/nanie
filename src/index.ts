/*
 * @Author: 阿佑[ayooooo@petalmail.com] 
 * @Date: 2022-07-06 15:48:38 
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:56:12
 */
import { ZoomEvent } from './zoom'
import mouseZoom from './mouseZoom'

function isTouchable () {
  return navigator.maxTouchPoints || ("ontouchstart" in window)
}

class NaNie {
  target: HTMLElement

  constructor (target: HTMLElement | null) {
    if (target instanceof Element) {
      this.target = target

      if (isTouchable()) {
        mouseZoom(target, this.zoom.bind(this))
      } else {
        mouseZoom(target, this.zoom.bind(this))
      }

    } else {
      throw new Error('Invalid zoom target')
    }
  }

  easeOut () {}

  scale () {}

  zoom (e: ZoomEvent) {
    const transform = e.transform
    this.target.style.transform = `translate(${transform.x}px, ${transform.y}px)`
  }

  apply () {}
}

export default NaNie
