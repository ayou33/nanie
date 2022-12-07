/**
 *  @file         src/types.d.ts created by WebStorm
 *  @project      拿捏
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/11 15:33
 *  @description
 */
export type ZoomType = 'start' | 'zoom' | 'end' | 'click'

export type ZoomEvent = {
  sourceEvent: Event;
  type: ZoomType;
  transform: Transform;
  dirty: boolean;
}

export type ZoomCallback = (e: ZoomEvent, correct: (t: Transform) => void) => void

export type TransformReceiver = (e: ZoomEvent) => void

type ModelValues = {
  limit: TransformExtent;
  transform: Transform;
  receiver: TransformReceiver | null;
}

export type ModelKeys = keyof ModelValues

type T = keyof ModelValues

export type ZoomModel = ModelValues & {
  sync<T extends ModelKeys>(name: T, onSync: (v: ModelValues[T]) => void): void;
}

export type ZoomEmit = (type: ZoomType, e: Event, dirty?: boolean) => void
