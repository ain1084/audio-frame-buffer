# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-11-07

### Changed

- Simplified and unified class and function names for consistency:
  - `AudioFrameBufferContext` → `FrameBufferContext`
  - `AudioFrameBufferParams` → `FrameBufferParams`
  - `AudioFrameBufferReader` → `FrameBufferReader`
  - `AudioFrameBufferWriter` → `FrameBufferWriter`
  - `AudioFrameBuffer` → `FrameBuffer`
  - `createAudioFrameBufferContext` → `createFrameBufferContext`

## [0.2.0] - 2024-11-06

### Added

- Added `tsconfig.tests.json` specifically for test configurations.

### Changed

- Consolidated `create-audio-frame-buffer-context.ts` into `audio-frame-buffer-context.ts` and removed `create-audio-frame-buffer-context.ts`.

## [0.1.0] - 2024-11-05

### Changed

- Renamed `frameBufferCount` to `frameCount` in `FrameBufferParams` for consistency with other naming conventions.

## [0.0.2] - 2024-11-05

### Changed

- docs: update README.md with badge

## [0.0.1] - 2024-11-05

### Added

- Initial release of the project.
