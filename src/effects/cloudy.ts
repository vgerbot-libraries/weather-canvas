import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity, BackgroundColors } from '../types';
import { BackgroundElement, SunElement, MoonElement, StarsElement, CloudElement, CloudConfig } from '../elements';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#87ceeb', '#b0d4f1'],
    night: ['#0f1624', '#1f2937'],
};

export class CloudyEffect extends WeatherEffect {
    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        private mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate,
        wind: number = 0
    ) {
        super(ctx, width, height, intensity, wind);

        // 1. Background
        const bgColors = this.mode === 'night' ? BACKGROUND_COLORS.night : BACKGROUND_COLORS.day;
        this.elements.push(
            new BackgroundElement(ctx, width, height, {
                topColor: bgColors[0],
                bottomColor: bgColors[1],
            })
        );

        // 2. Stars (Night only)
        if (this.mode === 'night') {
            this.elements.push(new StarsElement(ctx, width, height));
        }

        // 3. Sun/Moon
        if (this.mode === 'day') {
            this.elements.push(new SunElement(ctx, width, height));
        } else {
            this.elements.push(new MoonElement(ctx, width, height));
        }

        // 4. Clouds
        const cloudCount = intensity === WeatherIntensity.light ? 3 : intensity === WeatherIntensity.heavy ? 7 : 5;
        const opacityMin = intensity === WeatherIntensity.light ? 0.4 : 0.5;
        const opacityMax = intensity === WeatherIntensity.heavy ? 0.9 : 0.8;

        const cloudConfig: CloudConfig = {
            count: cloudCount,
            widthRange: [80, 120],
            heightRange: [30, 40],
            speedRange: [0.1, 0.3],
            opacityRange: [opacityMin, opacityMax],
            yRange: [0.1, 0.5],
        };

        const speedMult = this.intensityConfig.speed;
        cloudConfig.speedRange = [cloudConfig.speedRange[0] * speedMult, cloudConfig.speedRange[1] * speedMult];

        const cloudElement = new CloudElement(ctx, width, height, cloudConfig);
        cloudElement.setMode(this.mode);
        cloudElement.setWind(this.wind);
        this.elements.push(cloudElement);
    }

    render(time: number): void {
        this.renderElements(time);
    }
}
