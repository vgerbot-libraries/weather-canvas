// src/types.ts

export type WeatherType = 'sunny' | 'cloudy' | 'overcast' | 'rainy' | 'snowy' | 'haze' | 'foggy' | 'thunderstorm';

export type TimeMode = 'day' | 'night';
export type RenderingContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/**
 * Weather intensity levels
 * light: Light (e.g., light rain, light fog)
 * moderate: Moderate (e.g., moderate rain, moderate fog)
 * heavy: Heavy (e.g., heavy rain, dense fog)
 */
export const enum WeatherIntensity {
    light = 'light',
    moderate = 'moderate',
    heavy = 'heavy',
}

export interface RenderOptions {
    width?: number;
    height?: number;
    fps?: number;
}

export interface WeatherConfig {
    type: WeatherType;
    mode: TimeMode;
    intensity?: WeatherIntensity;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size?: number;
    opacity?: number;
}

export interface Cloud {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    opacity: number;
}

export interface Star {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    twinkleSpeed: number;
    phase: number;
}

export interface IntensityConfig {
    opacity: number;
    speed: number;
    particleCount: number;
    description: string;
}

// Weather intensity configuration
export const INTENSITY_CONFIG = {
    light: {
        opacity: 0.6,
        speed: 0.6,
        particleCount: 0.5,
        description: 'Light',
    },
    moderate: {
        opacity: 0.8,
        speed: 1.0,
        particleCount: 1.0,
        description: 'Moderate',
    },
    heavy: {
        opacity: 1.0,
        speed: 1.4,
        particleCount: 1.8,
        description: 'Heavy',
    },
};

/**
 * Get intensity configuration
 */
export function getIntensityConfig(intensity: WeatherIntensity) {
    return INTENSITY_CONFIG[intensity];
}
