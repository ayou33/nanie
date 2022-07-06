/*
 * @Author: 阿佑[ayooooo@petalmail.com] 
 * @Date: 2022-07-06 15:48:38 
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-06 18:41:17
 */
import { ZoomEvent } from './zoom'
import mouseZoom from './mouseZoom'

function isTouchable () {
  return navigator.maxTouchPoints || ("ontouchstart" in window)
}

class NaNie {
  constructor (target: HTMLElement | null) {
    if (target instanceof Element) {

      if (isTouchable()) {
        mouseZoom(target, this.zoom.bind(this))
      } else {
        mouseZoom(target, this.zoom.bind(this))
      }

    }
  }

  easeOut () {}

  scale () {}

  zoom (e: ZoomEvent) {
    console.log(e)
  }

  apply () {}
}

export default NaNie
