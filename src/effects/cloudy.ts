// src/effects/cloudy.ts

import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity } from '../types';
import { SkyRenderer, BackgroundColors } from '../utils/sky-renderer';
import { CloudRenderer } from '../utils/cloud-renderer';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#87ceeb', '#b0d4f1'],
    night: ['#0f1624', '#1f2937'],
};

export class CloudyEffect extends WeatherEffect {
    private skyRenderer: SkyRenderer;
    private cloudRenderer: CloudRenderer;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        private mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate
    ) {
        super(ctx, width, height, intensity);
        this.skyRenderer = new SkyRenderer(ctx, width, height);
        this.cloudRenderer = new CloudRenderer(ctx, width, height);

        // Initialize clouds based on intensity
        const cloudCount = intensity === WeatherIntensity.light ? 3 : intensity === WeatherIntensity.heavy ? 7 : 5;
        const opacityMin = intensity === WeatherIntensity.light ? 0.4 : 0.5;
        const opacityMax = intensity === WeatherIntensity.heavy ? 0.9 : 0.8;

        this.cloudRenderer.initializeClouds(
            {
                count: cloudCount,
                widthRange: [80, 120],
                heightRange: [30, 40],
                speedRange: [0.1, 0.3],
                opacityRange: [opacityMin, opacityMax],
                yRange: [0.1, 0.5],
            },
            this.intensityConfig.speed
        );

        // Initialize stars
        this.skyRenderer.initializeStars(this.mode);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time: number): void {
        this.skyRenderer.drawBackground(BACKGROUND_COLORS, this.mode);
        this.skyRenderer.drawStars(this.mode);
        this.skyRenderer.drawSun(this.mode);
        this.skyRenderer.drawMoon(this.mode);
        this.cloudRenderer.drawClouds(this.mode);
    }
}
