// src/effects/overcast.ts

import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity } from '../types';
import { SkyRenderer, BackgroundColors } from '../utils/sky-renderer';
import { CloudRenderer } from '../utils/cloud-renderer';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#778899', '#a0aec0'],
    night: ['#0f1624', '#1f2937'],
};

export class OvercastEffect extends WeatherEffect {
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

        // Initialize clouds
        this.cloudRenderer.initializeClouds({
            count: 7,
            widthRange: [100, 200],
            heightRange: [60, 100],
            speedRange: [0.05, 0.15],
            opacityRange: [0.6, 1],
            yRange: [0, 0.5],
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time: number): void {
        this.skyRenderer.drawBackground(BACKGROUND_COLORS, this.mode);
        this.cloudRenderer.drawClouds(this.mode);
    }
}
