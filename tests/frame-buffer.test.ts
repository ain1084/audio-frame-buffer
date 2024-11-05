import { describe, beforeEach, test, expect, vi } from 'vitest'
import { FrameBuffer } from '../src/frame-buffer'
import { type FrameBufferContext, createFrameBufferContext } from '../src/frame-buffer-context'
import type { FrameBufferSegment } from '../src/frame-buffer-segment'

describe.each([1, 2, 4])('FrameBuffer with channelCount = %i', (channelCount) => {
  let context: FrameBufferContext
  let frameBuffer: FrameBuffer

  beforeEach(() => {
    context = createFrameBufferContext({
      frameCount: 1024,
      channelCount,
    })
    frameBuffer = new FrameBuffer(context)
  })

  test('should correctly process segments in enumFrameSegments', () => {
    const frameIndex = 0
    const availableFrames = 10

    // Mock callback function
    const processFrameSegment = vi.fn((segment: FrameBufferSegment, _offset: number) => segment.frameCount)

    const result = frameBuffer.enumFrameSegments(frameIndex, availableFrames, processFrameSegment)

    expect(processFrameSegment).toHaveBeenCalled()
    expect(result.totalProcessedFrames).toBe(availableFrames)
    expect(result.nextFrameIndex).toBe((frameIndex + availableFrames) % frameBuffer.frameCount)
  })

  test('should throw RangeError if processed frames exceed segment length', () => {
    const frameIndex = 0
    const availableFrames = 10

    // Callback that returns more frames than available in segment
    const processFrameSegment = vi.fn((segment: FrameBufferSegment) => segment.frameCount + 1)

    expect(() => {
      frameBuffer.enumFrameSegments(frameIndex, availableFrames, processFrameSegment)
    }).toThrow(RangeError)
  })

  test('should handle wrap-around correctly in enumFrameSegments', () => {
    const frameIndex = frameBuffer.frameCount - 5
    const availableFrames = 10

    const processFrameSegment
     = vi.fn((segment: FrameBufferSegment, _offset: number) => Math.min(segment.frameCount, availableFrames))

    const result = frameBuffer.enumFrameSegments(frameIndex, availableFrames, processFrameSegment)

    expect(result.totalProcessedFrames).toBe(availableFrames)
    expect(result.nextFrameIndex).toBe((frameIndex + availableFrames) % frameBuffer.frameCount)
  })
})
