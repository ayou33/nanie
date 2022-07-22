/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-06 13:38:45
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-06 15:02:37
 */
import { Vector } from './Point'

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
   * 对指定点应用变换
   * @param p
   */
  apply ([x, y]: Vector): Vector {
    return [this.applyX(x), this.applyY(y)]
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

  /**
   * 对指定点撤销变换
   * @param location
   */
  invert ([x, y]: Vector): Vector {
    return [this.invertX(x), this.invertY(y)]
  }

  identity () {
    return new Transform(1, 0, 0)
  }

  clone () {
    return new Transform(this.k, this.x, this.y)
  }
}

export default Transform
