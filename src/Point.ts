/*
 * @Author: 阿佑[ayooooo@petalmail.com]
 * @Date: 2022-07-08 15:16:05
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-08 18:47:09
 */
export type PointCoords = [x: number, y: number]

class Point {
  x: number
  y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  static from ([x, y]: PointCoords) {
    return new Point(x, y)
  }

  translate ([dx, dy]: PointCoords) {
    return new Point(this.x + dx, this.y + dy)
  }

  scale (k: number) {
    return new Point(this.x * k, this.y * k)
  }

  distance (p: Point) {
    return Math.sqrt(((this.x - p.x) ** 2) + ((this.y - p.y) ** 2))
  }

  offsetFrom (p: Point): PointCoords {
    return [p.x - this.x, p.y - this.y]
  }

  offsetXFrom (x: number) {
    return this.x - x
  }

  offsetYFrom (y: number) {
    return this.y - y
  }

  value (): PointCoords {
    return [this.x, this.y]
  }
}

export default Point
