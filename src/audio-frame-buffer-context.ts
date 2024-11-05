import { createArrayBufferViews } from '@ain1084/array-buffer-partitioner'
import type { AudioFrameBufferParams } from './audio-frame-buffer-params'

/**
 * Context for an AudioFrameBuffer.
 * This context is returned by the `createAudioFrameBufferContext` function and is designed
 * to be shared between threads, allowing safe and efficient audio data processing in
 * multithreaded environments. It leverages a `SharedArrayBuffer` to enable
 * thread-safe data access.
 *
 * @property sampleBuffer - The shared buffer (based on `SharedArrayBuffer`) for audio data frames,
 *                          enabling thread-safe data sharing across different threads.
 * @property samplesPerFrame - The number of samples per frame, representing the channel count.
 * @property usedFramesInBuffer - A counter that tracks the usage count of the frames in the buffer.
 * @property totalReadFrames - A counter for the total number of frames read from the buffer.
 * @property totalWriteFrames - A counter for the total number of frames written to the buffer.
 */
export type AudioFrameBufferContext = {
  readonly sampleBuffer: Float32Array
  readonly samplesPerFrame: number
  readonly usedFramesInBuffer: Uint32Array
  readonly totalReadFrames: BigUint64Array
  readonly totalWriteFrames: BigUint64Array
}

/**
 * Creates a AudioFrameBufferContext instance.
 * @param params - The parameters for the AudioFrameBuffer.
 * @returns A new instance of AudioFrameBufferContext.
 */
export const createAudioFrameBufferContext = (params: AudioFrameBufferParams): AudioFrameBufferContext => {
  return {
    ...createArrayBufferViews(SharedArrayBuffer, {
      sampleBuffer: [Float32Array, params.frameCount * params.channelCount],
      usedFramesInBuffer: [Uint32Array, 1],
      totalReadFrames: [BigUint64Array, 1],
      totalWriteFrames: [BigUint64Array, 1],
    }),
    samplesPerFrame: params.channelCount,
  }
}
