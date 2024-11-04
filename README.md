# Audio Frame Buffer

[![npm version](https://badge.fury.io/js/@ain1084%2Faudio-frame-buffer.svg)](https://badge.fury.io/js/@ain1084%2Faudio-frame-buffer)
[![CI](https://github.com/ain1084/audio-frame-buffer/actions/workflows/ci.yml/badge.svg)](https://github.com/ain1084/audio-frame-buffer/actions?query=workflow%3Aci)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

`Audio Frame Buffer` is a multi-channel ring buffer library designed to handle audio frame data. This library is optimized for audio data buffering and is specifically designed for Single Producer, Single Consumer (SPSC) scenarios.

## Features

- **Multi-Channel Support**: Handles multi-channel audio data and allows buffer operations on a frame-by-frame basis.
- **Thread-Safe Sharing**: Enables efficient audio processing in multithreaded environments by safely sharing data across threads through the `AudioFrameBufferContext`.

## Installation

```bash
npm install @ain1084/audio-frame-buffer
```

## Basic Usage

In this example, we demonstrate how to:

1. Create an `AudioFrameBufferContext`, which contains the shared configuration and buffer used for audio processing.
2. Initialize `AudioFrameBufferReader` and `AudioFrameBufferWriter` instances for reading and writing frame data.
3. Use `read` and `write` methods with callbacks to process and store audio frames in blocks.

### Creating an AudioFrameBufferContext

```typescript
import { createAudioFrameBufferContext, AudioFrameBufferParams } from '@ain1084/audio-frame-buffer'

const params: AudioFrameBufferParams = {
  frameCount: 1024,
  channelCount: 2
}

const context = createAudioFrameBufferContext(params)
```

### Using AudioFrameBufferReader / AudioFrameBufferWriter

```typescript
import { AudioFrameBufferReader, AudioFrameBufferWriter } from '@ain1084/audio-frame-buffer'

const reader = new AudioFrameBufferReader(context)
const writer = new AudioFrameBufferWriter(context)

// Reading data
const framesRead = reader.read((segment, offset) => {
  // `segment` provides methods to access frame data in a structured way.
  for (let frame = 0; frame < segment.frameCount; frame++) {
    for (let channel = 0; channel < segment.channels; channel++) {
      const sample = segment.get(frame, channel)
      // Process the sample as needed
    }
  }
  return segment.frameCount // Return the number of frames processed
})

// Writing data
const framesWritten = writer.write((segment, offset) => {
  // Write data to each frame and channel
  for (let frame = 0; frame < segment.frameCount; frame++) {
    for (let channel = 0; channel < segment.channels; channel++) {
      segment.set(frame, channel, offset + frame * segment.channels + channel)
    }
  }
  return segment.frameCount // Return the number of frames written
})
```

### Differences from a Standard Ring Buffer

Unlike standard ring buffers, which typically use `push/pop` operations for single-element access, `Audio Frame Buffer` is designed to read and write data **in blocks (multiple frames) using a callback function**. This design choice offers specific benefits for handling continuous data streams, like audio data:

- **Efficiency**: Block-based processing reduces the overhead associated with single-frame operations.
- **Real-Time Processing**: In audio processing, handling data in larger segments improves real-time performance.
- **Seamless Wrapping**: When the ring buffer wraps around, readable/writable segments may be split into two parts within the buffer. The `read` and `write` operations handle this division automatically and return contiguous subarrays, so the user can access the segments without additional complexity.

## API Documentation

For more detailed documentation on the API, including parameter descriptions and usage details, please refer to the [API Documentation](https://ain1084.github.io/audio-frame-buffer).

## Important Notes

- **SPSC**: This package is designed for Single Producer, Single Consumer (SPSC) use. Only one instance of each `Reader` and `Writer` should be created; multiple instances may result in unexpected behavior.
- **Thread Safety**: `AudioFrameBufferContext` uses `SharedArrayBuffer` to safely share data across multiple threads.
- **Browser Requirements (COOP/COEP)**: To use `SharedArrayBuffer`, the following HTTP headers must be set:

  - **COOP (Cross-Origin-Opener-Policy)**:

    ```text
    Cross-Origin-Opener-Policy: same-origin
    ```

  - **COEP (Cross-Origin-Embedder-Policy)**:

    ```text
    Cross-Origin-Embedder-Policy: require-corp
    ```

  These settings enable `SharedArrayBuffer` and allow for safe multi-threaded data sharing. For details, refer to the [MDN Web Docs - SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).

## Detailed API Reference

For a full API reference, please see the [documentation here](https://ain1084.github.io/audio-frame-buffer).

## Contribution

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under multiple licenses:

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

You can choose either license depending on your project needs.

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.