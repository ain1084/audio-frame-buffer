import { createArrayBufferViews } from '@ain1084/array-buffer-partitioner'
import type { AudioFrameBufferContext } from './audio-frame-buffer-context'
import type { AudioFrameBufferParams } from './audio-frame-buffer-params'

/**
 * Creates a AudioFrameBufferContext instance.
 * @param params - The parameters for the AudioFrameBuffer.
 * @returns A new instance of AudioFrameBufferContext.
 */
export const createAudioFrameBufferContext = (params: AudioFrameBufferParams): AudioFrameBufferContext => {
  return {
    ...createArrayBufferViews(SharedArrayBuffer, {
      sampleBuffer: [Float32Array, params.frameBufferSize * params.channelCount],
      usedFramesInBuffer: [Uint32Array, 1],
      totalReadFrames: [BigUint64Array, 1],
      totalWriteFrames: [BigUint64Array, 1],
    }),
    samplesPerFrame: params.channelCount,
  }
}
