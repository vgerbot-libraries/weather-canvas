import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity, BackgroundColors } from '../types';
import { BackgroundElement, MoonElement, SnowElement } from '../elements';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#e0e7ef', '#f0f4f8'],
    night: ['#1a2b4a', '#2d4563'],
};

export class SnowyEffect extends WeatherEffect {
    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        private mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate,
        wind: number = 0
    ) {
        super(ctx, width, height, intensity, wind);

        // Background
        const bgColors = this.mode === 'night' ? BACKGROUND_COLORS.night : BACKGROUND_COLORS.day;
        this.elements.push(
            new BackgroundElement(ctx, width, height, {
                topColor: bgColors[0],
                bottomColor: bgColors[1],
            })
        );

        // Snow
        const baseCount = 4; // per frame emission
        const snowflakeCount = this.getParticleCount(baseCount);

        const snowElement = new SnowElement(ctx, width, height, {
            count: snowflakeCount,
            speed: this.getSpeed(2),
            opacity: this.intensityConfig.opacity,
        });
        snowElement.setWind(this.wind);
        this.elements.push(snowElement);

        // Moon
        this.elements.push(new MoonElement(ctx, width, height));
    }

    render(time: number): void {
        this.renderElements(time);
    }
}
