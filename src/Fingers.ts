/**
 *  Fingers.ts of project 拿捏
 *  @date 2022/7/21 14:11
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Point, { PointCoords } from './Point'
import Transform from './Transform'
import { translate } from './zoom'

export type Finger = {
  touch: Touch;
  id: number;
  start: Point;
}

const toList = (touches: TouchList): Touch[] => [].slice.call(touches)

function of (e: Touch): PointCoords {
  return [e.clientX, e.clientY]
}

class Fingers {
  private readonly transform: Transform
  private fingers: Finger[] = []

  constructor (transform: Transform) {
    this.transform = transform
  }

  use (e: TouchEvent) {
    toList(e.changedTouches).map(touch => {
      this.fingers.push({
        touch,
        id: touch.identifier,
        start: Point.from([touch.clientX, touch.clientY]),
      })
    })
  }

  release (e: TouchEvent) {
    const touches = toList(e.touches)
    const releasedFingers = toList(e.changedTouches).map(t => t.identifier)

    let cursor = -1
    for (let i = 0, l = this.fingers.length; i < l; i++) {
      const finger = this.fingers[i]
      if (releasedFingers.indexOf(this.fingers[i].id) === -1) {
        const touch = touches.find(t => t.identifier === finger.id)
        if (touch) {
          this.fingers[++cursor] = {
            touch,
            id: touch.identifier,
            start: Point.from(this.transform.invert([touch.clientX, touch.clientY])),
          }
        }
      }
    }

    this.fingers.length = ++cursor
  }

  transfer (e: TouchEvent) {
    if (this.fingers.length > 1) {
      // e.currentTarget.textContent = scale(1, 0.3)
      return this.transform
    }

    /**
     * pan
     */
    if (this.fingers.length === 1) {
      return translate(this.transform, Point.from(of(e.changedTouches[0])), this.fingers[0].start)
    }

    return this.transform
  }

  count () {
    return this.fingers.length
  }
}

export default Fingers
