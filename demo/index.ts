import './style.css'
import nanie from '../src/index'

nanie(document.querySelector('#app')!, {
  scaleExtent: [1, 4],
  translateExtent: [[80, 80], [400, 400]],
}, function (e) {
  const transform = e.transform
  this.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`
})
