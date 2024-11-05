import type { AudioFrameBufferContext } from './audio-frame-buffer-context'
import { AudioFrameSegment } from './audio-frame-segment'

/**
 * AudioFrameBuffer class
 * This class manages a buffer of audio frames.
 */
export class AudioFrameBuffer {
  private readonly _buffer: Float32Array
  private readonly _samplesPerFrame: number

  /** The count of the frame buffer in frames. */
  public readonly frameCount: number

  /**
   * Creates an instance of AudioFrameBuffer.
   * @param context - The context object containing:
   *   - `sampleBuffer`: The shared buffer to read audio data frames from.
   *   - `samplesPerFrame`: The number of samples per frame.
   */
  public constructor(context: AudioFrameBufferContext) {
    this._buffer = context.sampleBuffer
    this._samplesPerFrame = context.samplesPerFrame
    this.frameCount = Math.floor(this._buffer.length / this._samplesPerFrame)
  }

  /**
   * @internal
   * Processes segments of a Float32Array buffer using a callback function.
   * This function handles one or more frame segments within the ring buffer and invokes
   * the provided callback for each segment. It is intended for internal use only.
   *
   * @param frameIndex - The starting frame index in the buffer from where processing should begin.
   * @param availableFrames - The total number of frames available to process in the buffer.
   * @param processFrameSegment - The callback function invoked for each segment
   *   of the ring buffer during enumeration. It receives:
   *   1. `segment`: An `AudioFrameSegment` instance representing the current segment to process.
   *   2. `offset`: The cumulative number of frames processed so far, used as the starting index
   *      for the current segment relative to the entire data.
   *
   *   The callback must return the number of frames it successfully processed.
   *   When the callback returns a value smaller than the available frames in the current segment,
   *   it indicates that the callback has processed up to that frame count, and enumeration will stop early.
   *
   * @returns An object containing:
   *          - `totalProcessedFrames`: The number of frames successfully processed.
   *          - `nextIndex`: The frame index in the buffer for the next processing cycle.
   *
   * @throws RangeError - If the processFrameSegment callback returns a processed length greater than the available
   * frames in the current segment.
   *
   * @remarks The buffer is always provided in frame-sized segments, meaning that the buffer contains complete frames.
   * You must process the buffer in frame-sized chunks based on the structure of the frames.
   */
  public enumFrameSegments(
    frameIndex: number,
    availableFrames: number,
    processFrameSegment: (segment: AudioFrameSegment, offset: number) => number):
    { totalProcessedFrames: number, nextFrameIndex: number } {
    let totalProcessedFrames = 0
    while (totalProcessedFrames < availableFrames) {
      // Determine the length of the current frame segment to process
      const currentFrames = Math.min(this.frameCount - frameIndex, availableFrames - totalProcessedFrames)
      // Process the current frame segment using the processFrameSegment function
      const processedFrames = processFrameSegment(
        new AudioFrameSegment(this._buffer, this._samplesPerFrame, frameIndex, currentFrames), totalProcessedFrames)
      // Ensure the processed length does not exceed the segment length
      if (processedFrames > currentFrames) {
        throw new RangeError(`Processed frames (${processedFrames}) exceeds segment frames (${currentFrames})`)
      }
      totalProcessedFrames += processedFrames
      frameIndex = (frameIndex + processedFrames) % this.frameCount
      if (processedFrames < currentFrames) {
        break
      }
    }
    return { totalProcessedFrames, nextFrameIndex: frameIndex }
  }
}
