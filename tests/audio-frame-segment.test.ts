import { describe, test, expect } from 'vitest'
import { AudioFrameSegment } from '../src/audio-frame-segment'

describe('AudioFrameSegment', () => {
  const channelCount = 2
  const frameCount = 5
  const sampleData = new Float32Array(channelCount * frameCount)
  const segment = new AudioFrameSegment(sampleData, channelCount, 0, frameCount)

  test('should throw RangeError if accessing out-of-bounds frame index in get', () => {
    expect(() => segment.get(-1, 0)).toThrow(RangeError) // frame < 0
    expect(() => segment.get(frameCount, 0)).toThrow(RangeError) // frame >= frameCount
  })

  test('should throw RangeError if accessing out-of-bounds channel index in get', () => {
    expect(() => segment.get(0, -1)).toThrow(RangeError) // channel < 0
    expect(() => segment.get(0, channelCount)).toThrow(RangeError) // channel >= channelCount
  })

  test('should throw RangeError if accessing out-of-bounds frame index in set', () => {
    expect(() => segment.set(-1, 0, 1)).toThrow(RangeError) // frame < 0
    expect(() => segment.set(frameCount, 0, 1)).toThrow(RangeError) // frame >= frameCount
  })

  test('should throw RangeError if accessing out-of-bounds channel index in set', () => {
    expect(() => segment.set(0, -1, 1)).toThrow(RangeError) // channel < 0
    expect(() => segment.set(0, channelCount, 1)).toThrow(RangeError) // channel >= channelCount
  })
})
