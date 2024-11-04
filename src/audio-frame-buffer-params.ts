/**
 * Parameters for creating an AudioFrameBuffer.
 * Note: The total sample count in the buffer will be `frameBufferSize * channelCount`.
 */
export type AudioFrameBufferParams = {
  /** The count of the frame buffer in frames. */
  readonly frameCount: number

  /** The number of audio channels. */
  readonly channelCount: number
}
