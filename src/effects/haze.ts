import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity, BackgroundColors } from '../types';
import { BackgroundElement, StarsElement, MoonElement, FogElement } from '../elements';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#b8a58e', '#d4c5b0'],
    night: ['#2d2416', '#3d3020'],
};

export class HazeEffect extends WeatherEffect {
    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        private mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate,
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

        this.elements.push(new StarsElement(ctx, width, height));
        this.elements.push(new MoonElement(ctx, width, height));

        const baseCount = 50;
        const particleCount = this.getParticleCount(baseCount);
        const fogElement = new FogElement(ctx, width, height, {
            count: particleCount,
            color: '150, 130, 100',
        });
        fogElement.setWind(this.wind);
        this.elements.push(fogElement);
    }

    render(time: number): void {
        this.renderElements(time);
    }
}
