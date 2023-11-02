import {type Ref} from 'vue'
import type { ImgData } from './type'

export default  class Slider {
  timer: any  = null
  constructor(
    public cur: Ref<number>,
    public dataList: ImgData[],
    public cycle = 3000
  ) {
    this.cur.value = 0
  }

  start() {
    this.stop()
    this.timer = setInterval(() => {
      this.slideNext()
    }, this.cycle)
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  slideNext() {
    const next = (this.cur.value + 1) % this.dataList.length
    this.slideTo(next)
  }
  slidePrevious() {
    const previous = (this.cur.value - 1 + this.dataList.length) % this.dataList.length
    this.slideTo(previous)
  }
  slideTo(idx: number) {
    this.cur.value = idx
  }
}