/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 15:48:38
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:56:12
 */
import touchZoom from './touchZoom'
import { ZoomEvent } from './zoom'
import mouseZoom from './mouseZoom'

function isPC () {
  const userAgentInfo = navigator.userAgent
  const Agents = [
    'Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod',
  ]

  let flag = true

  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }

  return flag
}

function isTouchable () {
  return navigator.maxTouchPoints || ('ontouchstart' in window)
}

class NaNie {
  target: HTMLElement

  constructor (target: HTMLElement | null) {
    if (target instanceof Element) {
      this.target = target

      if (!isPC() && isTouchable()) {
        touchZoom(target, this.zoom.bind(this))
      } else {
        mouseZoom(target, this.zoom.bind(this))
      }
    } else {
      throw new Error('Invalid zoom target')
    }
  }

  easeOut () {
  }

  scale () {
  }

  zoom (e: ZoomEvent) {
    console.log(e.type)
    const transform = e.transform
    this.target.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`
  }

  apply () {
  }
}

export default NaNie
