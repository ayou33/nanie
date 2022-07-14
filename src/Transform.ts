/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 13:38:45
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-06 15:02:37
 */
import { PointCoords } from './Point'

class Transform {
  k = 1
  x = 0
  y = 0

  constructor (k = 1, x = 0, y = 0) {
    this.k = k
    this.x = x
    this.y = y
  }

  /**
   * 缩放
   * @param k
   */
  scale (k: number) {
    return k === 1 ? this : new Transform(k, this.x, this.y)
  }

  /**
   * 偏移
   * @param x
   * @param y
   */
  translate (x: number, y: number) {
    return x === 0 && y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y)
  }

  /**
   * x轴偏移
   * @param x
   */
  translateX (x: number) {
    return x === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y)
  }

  /**
   * y轴偏移
   * @param y
   */
  translateY (y: number) {
    return y === 0 ? this : new Transform(this.k, this.x, this.y + this.k * y)
  }

  /**
   * 对指定点应用变换
   * @param p
   */
  apply ([x, y]: PointCoords): PointCoords {
    return [this.x + this.k * x, this.y + this.k * y]
  }

  /**
   * 对指定值做x轴变换
   * @param x
   */
  applyX (x: number) {
    return this.x * this.k * x
  }

  /**
   * 对指定值做y轴变换
   * @param y
   */
  applyY (y: number) {
    return this.y + this.k * y
  }

  /**
   * 对指定点撤销变换
   * @param location
   */
  invert ([x, y]: PointCoords): PointCoords {
    return [(x - this.x) / this.k, (y - this.y) / this.k]
  }

  /**
   * 对指定值撤销x轴变换
   * @param x
   */
  invertX (x: number) {
    return (x - this.x) / this.k
  }

  /**
   * 对指定值撤销y轴变换
   * @param y
   */
  invertY (y: number) {
    return (y - this.y) / this.k
  }

  identity () {
    return new Transform(1, 0, 0)
  }
}

export default Transform
