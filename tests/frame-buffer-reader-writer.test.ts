import { describe, beforeEach, test, expect, vi } from 'vitest'
import { type FrameBufferContext, createFrameBufferContext } from '../src/frame-buffer-context'
import type { FrameBufferSegment } from '../src/frame-buffer-segment'
import { FrameBufferReader } from '../src/frame-buffer-reader'
import { FrameBufferWriter } from '../src/frame-buffer-writer'

describe.each([1, 2, 3, 4])('FrameBufferReader and FrameBufferWriter with channelCount = %i', (channelCount) => {
  let context: FrameBufferContext
  let reader: FrameBufferReader
  let writer: FrameBufferWriter

  beforeEach(() => {
    context = createFrameBufferContext({
      frameCount: 1024,
      channelCount,
    })
    reader = new FrameBufferReader(context)
    writer = new FrameBufferWriter(context)
  })

  test('should correctly write and read frames', () => {
    const framesToWrite = 10

    const processWriteSegment = vi.fn((segment: FrameBufferSegment, offset: number) => {
      for (let frame = 0; frame < segment.frameCount; frame++) {
        for (let channel = 0; channel < channelCount; channel++) {
          segment.set(frame, channel, offset + frame * channelCount + channel)
        }
      }
      return framesToWrite
    })

    const writtenFrames = writer.write(processWriteSegment)
    expect(processWriteSegment).toHaveBeenCalled()
    expect(writtenFrames).toBe(framesToWrite)

    const processReadSegment = vi.fn((segment: FrameBufferSegment, offset: number) => {
      for (let frame = 0; frame < segment.frameCount; frame++) {
        for (let channel = 0; channel < channelCount; channel++) {
          expect(segment.get(frame, channel)).toBe(offset + frame * channelCount + channel)
        }
      }
      return framesToWrite
    })

    const readFrames = reader.read(processReadSegment)
    expect(processReadSegment).toHaveBeenCalled()
    expect(readFrames).toBe(framesToWrite)
  })

  test('should correctly write and read frames with direct samples access', () => {
    const framesToWrite = 10
    const processWriteSegment = vi.fn((segment: FrameBufferSegment, offset: number) => {
      for (let i = 0; i < framesToWrite * segment.channels; i++) {
        segment.samples[i] = offset + i // Direct access to samples
      }
      return framesToWrite
    })

    const writtenFrames = writer.write(processWriteSegment)
    expect(processWriteSegment).toHaveBeenCalled()
    expect(writtenFrames).toBe(framesToWrite)

    const processReadSegment = vi.fn((segment: FrameBufferSegment, offset: number) => {
      for (let i = 0; i < framesToWrite * segment.channels; i++) {
        expect(segment.samples[i]).toBe(offset + i) // Direct access to samples
      }
      return framesToWrite
    })

    const readFrames = reader.read(processReadSegment)
    expect(processReadSegment).toHaveBeenCalled()
    expect(readFrames).toBe(framesToWrite)
  })

  test('should handle wrap-around correctly', () => {
    const framesToWrite = (context.sampleBuffer.length / channelCount) - 5

    const processWriteSegment = vi.fn((segment: FrameBufferSegment, offset: number) => {
      const framesToProcess = Math.min(segment.frameCount, framesToWrite)
      for (let frame = 0; frame < segment.frameCount; frame++) {
        for (let channel = 0; channel < channelCount; channel++) {
          segment.set(frame, channel, offset + frame * channelCount + channel)
        }
      }
      return framesToProcess
    })
    const writtenFrames = writer.write(processWriteSegment)
    expect(writtenFrames).toBe(framesToWrite)

    const processReadSegment = vi.fn((segment: FrameBufferSegment, offset: number) => {
      for (let frame = 0; frame < segment.frameCount; frame++) {
        for (let channel = 0; channel < channelCount; channel++) {
          expect(segment.get(frame, channel)).toBe(offset + frame * channelCount + channel)
        }
      }
      return segment.frameCount
    })
    const readFrames = reader.read(processReadSegment)
    expect(readFrames).toBe(framesToWrite)

    const additionalFrames = 10
    let remainingFrames = additionalFrames
    const processWriteSegmentWrap = vi.fn((segment: FrameBufferSegment, offset: number) => {
      const framesToWrite = Math.min(segment.frameCount, remainingFrames)
      for (let frame = 0; frame < framesToWrite; frame++) {
        for (let channel = 0; channel < channelCount; channel++) {
          segment.set(frame, channel, offset + frame * channelCount + channel)
        }
      }
      remainingFrames -= framesToWrite
      return framesToWrite
    })

    const wrapFramesWritten = writer.write(processWriteSegmentWrap)
    expect(wrapFramesWritten).toBe(additionalFrames)

    remainingFrames = additionalFrames
    const processReadSegmentWrap = vi.fn((segment: FrameBufferSegment, offset: number) => {
      const framesToRead = Math.min(segment.frameCount, remainingFrames)
      for (let frame = 0; frame < framesToRead; frame++) {
        for (let channel = 0; channel < channelCount; channel++) {
          expect(segment.get(frame, channel)).toBe(offset + frame * channelCount + channel)
        }
      }
      remainingFrames -= framesToRead
      return framesToRead
    })

    const wrapFramesRead = reader.read(processReadSegmentWrap)
    expect(wrapFramesRead).toBe(additionalFrames)
  })
})
