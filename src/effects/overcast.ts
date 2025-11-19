import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity, BackgroundColors } from '../types';
import { BackgroundElement, CloudElement } from '../elements';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#778899', '#a0aec0'],
    night: ['#0f1624', '#1f2937'],
};

export class OvercastEffect extends WeatherEffect {
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

        const cloudElement = new CloudElement(ctx, width, height, {
            count: 7,
            widthRange: [100, 200],
            heightRange: [60, 100],
            speedRange: [0.05, 0.15],
            opacityRange: [0.6, 1],
            yRange: [0, 0.5],
        });
        cloudElement.setMode(this.mode);
        cloudElement.setWind(this.wind);
        this.elements.push(cloudElement);
    }

    render(time: number): void {
        this.renderElements(time);
    }
}
