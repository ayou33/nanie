import './style.css'
import nanie from '../src/index'

const zoom = nanie(document.querySelector('#app')!, {
  limit: {
    translateExtent: [[100, 100], [500, 500]],
    scaleExtent: [1, 4],
  },
}, function (e) {
  const transform = e.transform
  this.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`
})

zoom.interrupt(e => {
  console.log('receiver', e.type, e.transform)
  if (e.transform.k >= 2) {
    zoom.continue()
  }
})
