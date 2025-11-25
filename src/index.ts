// src/index.ts

export { WeatherCanvasRenderer } from './renderer';
export type { WeatherType, TimeMode, RenderOptions, WeatherConfig, WeatherIntensity } from './types';
export { INTENSITY_CONFIG, getIntensityConfig } from './types';
export * from './effects';
export { ParticlePool } from './utils/particles';
export { randomBetween, clamp, easeInOutQuad, easeInOutCubic } from './utils/math';

export * from './custom-element';
