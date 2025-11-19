import { IntensityConfig, RenderingContext2D, WeatherIntensity, getIntensityConfig } from '../types';
import { WeatherElement } from '../elements';

export abstract class WeatherEffect {
    protected ctx: RenderingContext2D;
    protected width: number;
    protected height: number;
    protected time = 0;
    protected intensity: WeatherIntensity;
    protected intensityConfig: IntensityConfig;
    protected wind: number;
    protected elements: WeatherElement[] = [];

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        intensity: WeatherIntensity = WeatherIntensity.moderate,
        wind: number = 0
    ) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.intensity = intensity;
        this.wind = wind;
        this.intensityConfig = getIntensityConfig(intensity);
    }

    abstract render(time: number): void;

    protected renderElements(time: number): void {
        this.elements.forEach(element => element.render(time));
    }

    update(): void {
        this.time += 1;
        this.elements.forEach(element => element.update(this.time));
    }

    setWind(wind: number): void {
        this.wind = wind;
        this.elements.forEach(element => {
            if (element.setWind) {
                element.setWind(wind);
            }
        });
    }

    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.elements.forEach(element => element.resize(width, height));
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

    // Deprecated helper methods (kept just in case subclasses still use them directly for some reason,
    // but they should move to elements)
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
