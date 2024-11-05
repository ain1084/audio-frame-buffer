/**
 * Parameters for creating an FrameBuffer.
 * Note: The total sample count in the buffer will be `frameBufferSize * channelCount`.
 */
export type FrameBufferParams = {
  /** The count of the frame buffer in frames. */
  readonly frameCount: number

  /** The number of audio channels. */
  readonly channelCount: number
}
