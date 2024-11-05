import { describe, beforeEach, test, expect, vi } from 'vitest'
import { AudioFrameBuffer } from '../src/audio-frame-buffer'
import { type AudioFrameBufferContext, createAudioFrameBufferContext } from '../src/audio-frame-buffer-context'
import type { AudioFrameSegment } from '../src/audio-frame-segment'

describe.each([1, 2, 4])('AudioFrameBuffer with channelCount = %i', (channelCount) => {
  let context: AudioFrameBufferContext
  let frameBuffer: AudioFrameBuffer

  beforeEach(() => {
    context = createAudioFrameBufferContext({
      frameCount: 1024,
      channelCount,
    })
    frameBuffer = new AudioFrameBuffer(context)
  })

  test('should correctly process segments in enumFrameSegments', () => {
    const frameIndex = 0
    const availableFrames = 10

    // Mock callback function
    const processFrameSegment = vi.fn((segment: AudioFrameSegment, _offset: number) => segment.frameCount)

    const result = frameBuffer.enumFrameSegments(frameIndex, availableFrames, processFrameSegment)

    expect(processFrameSegment).toHaveBeenCalled()
    expect(result.totalProcessedFrames).toBe(availableFrames)
    expect(result.nextFrameIndex).toBe((frameIndex + availableFrames) % frameBuffer.frameCount)
  })

  test('should throw RangeError if processed frames exceed segment length', () => {
    const frameIndex = 0
    const availableFrames = 10

    // Callback that returns more frames than available in segment
    const processFrameSegment = vi.fn((segment: AudioFrameSegment) => segment.frameCount + 1)

    expect(() => {
      frameBuffer.enumFrameSegments(frameIndex, availableFrames, processFrameSegment)
    }).toThrow(RangeError)
  })

  test('should handle wrap-around correctly in enumFrameSegments', () => {
    const frameIndex = frameBuffer.frameCount - 5
    const availableFrames = 10

    const processFrameSegment
     = vi.fn((segment: AudioFrameSegment, _offset: number) => Math.min(segment.frameCount, availableFrames))

    const result = frameBuffer.enumFrameSegments(frameIndex, availableFrames, processFrameSegment)

    expect(result.totalProcessedFrames).toBe(availableFrames)
    expect(result.nextFrameIndex).toBe((frameIndex + availableFrames) % frameBuffer.frameCount)
  })
})
