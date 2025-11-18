// src/effects/rainy.ts

import { WeatherEffect } from './base';
import { randomBetween } from '../utils/math';
import { RenderingContext2D, TimeMode, WeatherIntensity } from '../types';
import { SkyRenderer, BackgroundColors } from '../utils/sky-renderer';
import { CloudRenderer } from '../utils/cloud-renderer';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#4a5568', '#718096'],
    night: ['#1a1a2e', '#16213e'],
};

interface RainDrop {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
}

export class RainyEffect extends WeatherEffect {
    private rainDrops: RainDrop[] = [];
    private skyRenderer: SkyRenderer;
    private cloudRenderer: CloudRenderer;
    private particlesInitialized = false;

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
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time: number): void {
        this.skyRenderer.drawBackground(BACKGROUND_COLORS, this.mode);
        this.skyRenderer.drawStars(this.mode);
        this.skyRenderer.drawMoon(this.mode);
        this.drawClouds();
        this.drawRain();
    }

    private initRainDrops(): void {
        if (this.particlesInitialized) {
            return;
        }

        const baseCount = 150;
        const particleCount = this.getParticleCount(baseCount);

        this.rainDrops = [];
        for (let i = 0; i < particleCount; i++) {
            this.rainDrops.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                length: randomBetween(10, 30),
                speed: this.getSpeed(randomBetween(5, 10)),
                opacity: randomBetween(0.5, 1),
            });
        }

        this.particlesInitialized = true;
    }

    private drawClouds(): void {
        // Lazy initialize clouds
        this.cloudRenderer.initializeClouds(
            {
                count: 3,
                widthRange: [80, 200],
                heightRange: [30, 70],
                speedRange: [0.1, 0.4],
                opacityRange: [0.5, 0.5],
                yRange: [0, 0.4],
            },
            this.intensityConfig.speed
        );

        this.cloudRenderer.drawClouds(this.mode);
    }

    private drawRain(): void {
        if (!this.particlesInitialized) {
            this.initRainDrops();
        }

        this.rainDrops.forEach(drop => {
            drop.y += drop.speed;
            if (drop.y > this.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.width;
            }

            this.ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
            this.ctx.stroke();
        });
    }

    /**
     * Reset particles when canvas size changes
     */
    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.particlesInitialized = false;
        this.rainDrops = [];
        this.skyRenderer.resize(width, height);
        this.cloudRenderer.resize(width, height);
    }
}
