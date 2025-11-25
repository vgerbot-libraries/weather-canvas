import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity, BackgroundColors } from '../types';
import { BackgroundElement, MoonElement, FogElement } from '../elements';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#c0c5ce', '#dfe3e8'],
    night: ['#1c2128', '#2d3748'],
};

export class FoggyEffect extends WeatherEffect {
    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        private mode: TimeMode = 'day',
        intensity: WeatherIntensity = 'moderate',
        wind: number = 0
    ) {
        super(ctx, width, height, intensity, wind);

        const bgColors = this.mode === 'night' ? BACKGROUND_COLORS.night : BACKGROUND_COLORS.day;
        this.elements.push(
            new BackgroundElement(ctx, width, height, {
                topColor: bgColors[0],
                bottomColor: bgColors[1],
            })
        );

        this.elements.push(new MoonElement(ctx, width, height));

        const baseCount = 50;
        const particleCount = this.getParticleCount(baseCount);
        const fogElement = new FogElement(ctx, width, height, {
            count: particleCount,
            color: '180, 190, 200',
        });
        fogElement.setWind(this.wind);
        this.elements.push(fogElement);
    }

    render(time: number): void {
        this.renderElements(time);
    }
}
