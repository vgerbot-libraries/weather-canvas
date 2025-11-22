import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity, BackgroundColors } from '../types';
import { BackgroundElement, MoonElement, CloudElement, RainElement } from '../elements';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#4a5568', '#718096'],
    night: ['#1a1a2e', '#16213e'],
};

export class RainyEffect extends WeatherEffect {
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

        // Moon
        this.elements.push(new MoonElement(ctx, width, height));

        // Clouds
        const cloudElement = new CloudElement(ctx, width, height, {
            count: 3,
            widthRange: [80, 200],
            heightRange: [30, 70],
            speedRange: [0.1, 0.4],
            opacityRange: [0.5, 0.5],
            yRange: [0, 0.4],
        });
        cloudElement.setMode(this.mode);
        cloudElement.setWind(this.wind);
        this.elements.push(cloudElement);

        // Rain
        const baseCount = 150;
        const particleCount = this.getParticleCount(baseCount);
        const rainElement = new RainElement(ctx, width, height, {
            count: particleCount,
            speed: this.getSpeed(8), // approximate average speed
            opacity: 1,
        });
        rainElement.setWind(this.wind);
        this.elements.push(rainElement);
    }

    render(time: number): void {
        this.renderElements(time);
    }
}
