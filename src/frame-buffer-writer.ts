import { FrameBuffer } from './frame-buffer'
import type { FrameBufferContext } from './frame-buffer-context'
import type { FrameBufferSegment } from './frame-buffer-segment'

/**
 * FrameBufferWriter class
 * This class writes audio frame data to a shared Float32Array buffer.
 * The buffer usage is tracked using a Uint32Array.
 */
export class FrameBufferWriter {
  private readonly _frameBuffer: FrameBuffer
  private readonly _usedFramesInBuffer: Uint32Array
  private readonly _totalFrames: BigUint64Array
  private _frameIndex: number = 0

  /**
   * Creates an instance of FrameBufferWriter.
   * @param context - The context object containing:
   *   - `sampleBuffer`: The shared buffer to write audio data frames.
   *   - `samplesPerFrame`: The number of samples per frame.
   *   - `usedFramesInBuffer`: A Uint32Array tracking the usage of frames in the buffer.
   *   - `totalWriteFrames`: A BigUint64Array tracking the total frames written to the buffer.
   */
  constructor(context: FrameBufferContext) {
    this._frameBuffer = new FrameBuffer(context)
    this._usedFramesInBuffer = context.usedFramesInBuffer
    this._totalFrames = context.totalWriteFrames
  }

  /**
   * Get the number of available frames in the buffer.
   * This represents the number of frames that can be written before the buffer is full.
   * @returns The number of available frames in the buffer.
   */
  public get availableFrames(): number {
    return this._frameBuffer.frameCount - Atomics.load(this._usedFramesInBuffer, 0)
  }

  /**
   * Get the total number of frames written to the buffer.
   *
   * @returns The total number of frames written.
   */
  public get totalFrames(): bigint {
    // This class is not used concurrently by multiple threads,
    // so `Atomics` is not necessary when reading `totalFrames`.
    return this._totalFrames[0]
  }

  /**
   * Writes audio frame data into the buffer using the provided callback.
   * This method handles one or more writable segments within the ring buffer
   * and invokes the callback for each segment.
   *
   * @param processFrameSegment - The callback function invoked for each writable segment
   *   of the ring buffer. It receives:
   *   1. `segment`: An FrameBufferSegment instance representing the writable segment of the buffer.
   *   2. `offset`: The cumulative number of frames processed so far, used as the starting index
   *      for the current segment relative to the entire data.
   *
   *   The callback must return the number of frames it successfully wrote.
   *   If the callback returns a smaller number of frames than are available in the current segment,
   *   only the returned number of frames will be considered written, and enumeration will stop.
   *
   * @returns The total number of frames written across all segments.
   *   Note: The return value is in frames, not in samples.
   *
   * @throws RangeError - If the processFrameSegment callback returns a written length greater than the available space
   * in the current segment.
   *
   * @remarks The buffer is an array of samples, but it is always provided in frame-sized segments.
   * Each frame consists of multiple samples (e.g., for stereo, a frame contains a sample for the left channel
   * and one for the right channel). You must access and process the buffer in frame-sized chunks,
   * based on the structure of the frames.
   */
  public write(processFrameSegment: (segment: FrameBufferSegment, offset: number) => number): number {
    const result = this._frameBuffer.enumFrameSegments(this._frameIndex, this.availableFrames, processFrameSegment)
    this._frameIndex = result.nextFrameIndex
    Atomics.add(this._usedFramesInBuffer, 0, result.totalProcessedFrames)
    Atomics.add(this._totalFrames, 0, BigInt(result.totalProcessedFrames))
    return result.totalProcessedFrames
  }
}
