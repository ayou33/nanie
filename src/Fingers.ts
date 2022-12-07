/**
 *  Fingers.ts of project 拿捏
 *  @date 2022/7/21 14:11
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Point, { Bounding, Vector } from './Point'
import Transform, { TransformExtent } from './Transform'
import { centerOf, constrain, scale, translate } from './zoom'

export type Finger = {
  touch: Touch;
  id: number;
  start: Point;
}

const toList = (touches: TouchList): Touch[] => [].slice.call(touches)

function of (e: Touch): Vector {
  return [e.clientX, e.clientY]
}

export class Fingers {
  private transform: Transform
  private fingers: Finger[] = []
  private scaleRef = 1

  constructor (transform: Transform) {
    this.transform = transform
  }

  private updateScaleRef () {
    if (this.count() >= 2) {
      this.scaleRef = Point.from(of(this.fingers[0].touch))
                           .distance(Point.from(of(this.fingers[1].touch))) / this.transform.k
    }
  }

  apply (transform: Transform) {
    this.transform = transform
  }

  use (e: TouchEvent) {
    toList(e.changedTouches).map(touch => {
      this.fingers.push({
        touch,
        id: touch.identifier,
        start: Point.from(this.transform.invert([touch.clientX, touch.clientY])),
      })
    })

    this.updateScaleRef()
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

    this.updateScaleRef()
  }

  private zoom (fingers: Touch[], el: HTMLElement, bouding: Bounding, limit: TransformExtent) {
    const k = Point.from(of(fingers[0])).distance(Point.from(of(fingers[1]))) / this.scaleRef

    const p: Vector = [(fingers[0].clientX + fingers[1].clientX) / 2, (fingers[0].clientY + fingers[1].clientY) / 2]

    const offset = Point.from(p).offsetFrom(Point.from(centerOf(el)))

    const p0: Vector = [this.transform.x - offset[0], this.transform.y - offset[1]]

    const singularity = Point.from(this.transform.invert(p0))

    return constrain(translate(scale(this.transform, k, limit), Point.from(p0), singularity), bouding, limit)
  }

  translate (e: TouchEvent, bounding: Bounding, limit: TransformExtent) {
    if (this.fingers.length >= 2) {
      const touches = e.touches
      const activeFingers = this.fingers.map(f => f.id)
      const fingers: Touch[] = []

      for (let i = 0; i < e.touches.length && fingers.length < this.count(); i++) {
        const touch = touches[i]
        if (activeFingers.indexOf(touch.identifier) !== -1) {
          fingers.push(touch)
        }
      }

      return this.transform = this.zoom(fingers, e.currentTarget as HTMLElement, bounding, limit)
    }

    /**
     * pan
     */
    if (this.fingers.length === 1) {
      return this.transform = translate(this.transform, Point.from(of(e.changedTouches[0])), this.fingers[0].start)
    }

    return this.transform
  }

  count () {
    return this.fingers.length
  }
}

export default Fingers
