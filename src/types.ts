export type WeatherType =
    | 'sunny'
    | 'cloudy'
    | 'overcast'
    | 'rainy'
    | 'snowy'
    | 'haze'
    | 'foggy'
    | 'thunderstorm'
    | string;

export type TimeMode = 'day' | 'night';
export type RenderingContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export type BackgroundColors = {
    day: [string, string];
    night: [string, string];
};

/**
 * Weather intensity levels
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
    wind?: number;
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
    gravity?: number;
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

// --- Element Configs ---

export type CloudStyle = 'rounded' | 'elliptical';

export interface CloudConfig {
    count: number;
    widthRange: [number, number];
    heightRange: [number, number];
    speedRange: [number, number];
    opacityRange: [number, number];
    yRange: [number, number]; // [min, max] as percentage of height
    style?: CloudStyle;
}

export interface RainConfig {
    count: number;
    speed: number;
    opacity: number;
}

export interface SnowConfig {
    count: number;
    speed: number;
    opacity: number;
}

export interface FogConfig {
    count: number;
    color: string; // 'R, G, B'
}

export interface LightningConfig {
    color?: string;
}

export interface MoonConfig {
    date?: Date;
}

export interface StarsConfig {
    count?: number;
}

export interface BackgroundConfig {
    topColor: string;
    bottomColor: string;
}

// --- Custom Weather Config ---

export type WeatherElementType =
    | 'sun'
    | 'moon'
    | 'stars'
    | 'cloud'
    | 'rain'
    | 'snow'
    | 'fog'
    | 'lightning'
    | 'background';

export interface ElementConfig {
    type: WeatherElementType;
    options?:
        | CloudConfig
        | RainConfig
        | SnowConfig
        | FogConfig
        | LightningConfig
        | StarsConfig
        | BackgroundConfig
        | MoonConfig;
}

export interface CustomWeatherConfig {
    background: {
        day: [string, string]; // top, bottom
        night: [string, string];
    };
    elements: Array<{
        type: WeatherElementType;
        options?:
            | CloudConfig
            | RainConfig
            | SnowConfig
            | FogConfig
            | LightningConfig
            | StarsConfig
            | BackgroundConfig
            | MoonConfig;
        modes?: TimeMode[]; // If undefined, applies to both
    }>;
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
