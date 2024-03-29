import mouseZoom from './mouseZoom'
import Point, {Bounding, Vector} from './Point'
import touchZoom from './touchZoom'
import Transform, {TransformExtent} from './Transform'
import {ModelKeys, ModelValues, TransformReceiver, ZoomCallback, ZoomModel, ZoomType} from './types'

export const noDefaultAndPropagation = (e: Event) => {
  e.preventDefault()
  e.stopImmediatePropagation()
}

export const centerOf = (e: HTMLElement): Vector => {
  const rect = e.getBoundingClientRect()
  return [rect.left + rect.width / 2, rect.top + rect.height / 2]
}

export const scaleDelta = (e: WheelEvent) => {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * (e.ctrlKey ? 10 : 1)
}

export const scaleViaWheel = (e: WheelEvent, k: number) => {
  return k * Math.pow(2, scaleDelta(e))
}

export const translate = (transform: Transform, p0: Point, p1: Point) => {
  const x = p0.x - p1.x * transform.k
  const y = p0.y - p1.y * transform.k
  return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y)
}

export const scale = (transform: Transform, scale: number, limit: TransformExtent) => {
  const k = Math.max(limit.scaleExtent[0], Math.min(limit.scaleExtent[1], scale))
  return k === transform.k ? transform : new Transform(k, transform.x, transform.y)
}

export const constrain = (transform: Transform, extent: Bounding, limit: TransformExtent) => {
  const translateExtent = limit.translateExtent

  let dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
    dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
    dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
    dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1]

  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1),
  )
}

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

export const zoom = (target: HTMLElement, callback: ZoomCallback, limit: TransformExtent) => {
  let __transform = new Transform()
  let __limit = limit
  let __receiver: TransformReceiver | null = null
  let _backup: Transform | null = null
  let _hijack = false
  let _animating = false
  let receiver: {
    [K in ModelKeys]?: Array<(v: ModelValues[K]) => void>;
  } = {}

  const model: ZoomModel = {
    get limit () {
      return __limit
    },
    set limit (v) {
      __limit = v
    },
    get transform () {
      return __transform
    },
    set transform (v) {
      __transform = v
    },
    get receiver () {
      return __receiver
    },
    set receiver (v) {
      __receiver = v
    },
    sync: (name: ModelKeys, cb) => {
      (receiver[name] ??= []).push(cb)
    }
  }

  function emit (type: ZoomType, e: Event, dirty = false) {
    // 用户的mouse或者touch事件中断现有的动画队列
    if (type === 'start' && e.isTrusted) _animating = false

    const event = {
      sourceEvent: e,
      type,
      transform: __transform,
      dirty,
    }

    if (_hijack) {
      __receiver?.(event)

      return
    }

    callback(event, t => __transform = t)
  }

  function translateTo (to: Transform) {
    __transform = to
    receiver['transform']?.map(f => f(to))
    emit('zoom', new CustomEvent('zoom'))
  }

  function animateTo (to: Transform, deadline: number) {
    if (_animating) {
      requestAnimationFrame(time => {
        const diff = to.diff(__transform)
        const next = new Transform(Math.sqrt(diff.k), diff.x / 2, diff.y / 2)
        if (time < deadline) {
          translateTo(next)
          animateTo(to, deadline)
        } else {
          translateTo(to)
          _animating = false
        }
      })
    }
  }

  function apply (transform: Transform, duration = 0) {
    if (duration === 0 || __transform.equal(transform)) {
      translateTo(transform)
    } else {
      _animating = true
      animateTo(transform, performance.now() + duration)
    }
  }

  const destroy = (!isPC() && isTouchable() ? touchZoom : mouseZoom)(target, model, emit)

  return {
    apply,
    reset (duration = 0) {
      apply(new Transform(), duration)
    },
    constrain (limit: TransformExtent) {
      __limit = limit
      apply(__transform)
    },
    interrupt (receiver?: TransformReceiver) {
      _backup = __transform
      _hijack = true

      if (receiver) {
        __receiver = receiver
      }
    },
    continue () {
      if (_backup) __transform = _backup

      __receiver = null
      _backup = null
      _hijack = false
    },
    destroy () {
      destroy()
      receiver = {}
    }
  }
}

export default zoom
