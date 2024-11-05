/**
 * FrameBufferSegment class
 * Represents a segment of audio frames within a shared Float32Array buffer, providing
 * methods to access and modify individual samples in a frame-based structure across
 * multiple channels.
 *
 * This class is used internally by the library to represent a specific range of frames
 * within the shared buffer, allowing controlled access for reading or writing operations.
 * Users do not create instances of this class directly; instead, instances are provided
 * by the library when using the {@link FrameBufferReader.read} and
 * {@link FrameBufferWriter.write} methods.
 */
export class FrameBufferSegment {
  /**
   * The Float32Array representing the sample data in the segment.
   * Each frame consists of multiple samples (one for each channel).
   *
   * If the arrangement of samples within a frame is understood, direct access to `samples`
   * is possible without using the `get` and `set` methods, by indexing based on
   * `frame * channels + channel`.
   */
  public readonly samples: Float32Array

  /**
   * The number of channels in each frame.
   * This value defines how many samples make up a single frame.
   */
  public readonly channels: number

  /**
   * The number of frames in this segment.
   * This determines the length of this segment in terms of frames, rather than samples.
   */
  public readonly frameCount: number

  /**
   * @internal
   * Creates an instance of FrameBufferSegment.
   * This constructor is intended for internal use only, and instances are generated by the library.
   * @param buffer - The shared Float32Array buffer containing audio samples.
   * @param channelCount - The number of channels per frame.
   * @param frameNumber - The starting frame index within the buffer.
   * @param frameCount - The number of frames included in this segment.
   */
  constructor(buffer: Float32Array, channelCount: number, frameNumber: number, frameCount: number) {
    // Slice the buffer to represent only the frames within this segment
    this.samples = buffer.subarray(frameNumber * channelCount, (frameNumber + frameCount) * channelCount)
    this.channels = channelCount
    this.frameCount = frameCount
  }

  /**
   * Gets the sample value for a specific frame and channel.
   * @param frame - The frame index within the segment (0 to frameCount - 1).
   * @param channel - The channel index within the frame (0 to channels - 1).
   * @returns The sample value for the specified frame and channel.
   * @throws RangeError if the frame or channel index is out of bounds.
   */
  public get(frame: number, channel: number): number {
    if (frame < 0 || frame >= this.frameCount || channel < 0 || channel >= this.channels) {
      throw new RangeError(`Frame or channel index is out of bounds: frame ${frame}, channel ${channel}`)
    }
    return this.samples[frame * this.channels + channel]
  }

  /**
   * Sets the sample value for a specific frame and channel.
   * @param frame - The frame index within the segment (0 to frameCount - 1).
   * @param channel - The channel index within the frame (0 to channels - 1).
   * @param value - The value to set for the specified frame and channel.
   * @throws RangeError if the frame or channel index is out of bounds.
   */
  public set(frame: number, channel: number, value: number): void {
    if (frame < 0 || frame >= this.frameCount || channel < 0 || channel >= this.channels) {
      throw new RangeError(`Frame or channel index is out of bounds: frame ${frame}, channel ${channel}`)
    }
    this.samples[frame * this.channels + channel] = value
  }
}