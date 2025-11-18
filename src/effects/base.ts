// src/effects/base.ts

import { IntensityConfig, RenderingContext2D, WeatherIntensity, getIntensityConfig } from '../types';

export abstract class WeatherEffect {
    protected ctx: RenderingContext2D;
    protected width: number;
    protected height: number;
    protected time = 0;
    protected intensity: WeatherIntensity;
    protected intensityConfig: IntensityConfig;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        intensity: WeatherIntensity = WeatherIntensity.moderate
    ) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.intensity = intensity;
        this.intensityConfig = getIntensityConfig(intensity);
    }

    abstract render(time: number): void;

    update(): void {
        this.time += 1;
    }

    protected getParticleCount(baseCount: number): number {
        return Math.ceil(baseCount * this.intensityConfig.particleCount);
    }

    protected getSpeed(baseSpeed: number): number {
        return baseSpeed * this.intensityConfig.speed;
    }

    protected getOpacity(baseOpacity: number): number {
        return baseOpacity * this.intensityConfig.opacity;
    }

    protected drawGradient(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        stops: Array<[number, string]>
    ): CanvasGradient {
        const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
        stops.forEach(([offset, color]) => {
            gradient.addColorStop(offset, color);
        });
        return gradient;
    }

    protected drawRadialGradient(
        x: number,
        y: number,
        r1: number,
        r2: number,
        stops: Array<[number, string]>
    ): CanvasGradient {
        const gradient = this.ctx.createRadialGradient(x, y, r1, x, y, r2);
        stops.forEach(([offset, color]) => {
            gradient.addColorStop(offset, color);
        });
        return gradient;
    }
}
