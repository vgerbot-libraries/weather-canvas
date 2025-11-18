// src/effects/overcast.ts

import { WeatherEffect } from './base';
import { randomBetween } from '../utils/math';
import { Cloud, RenderingContext2D, TimeMode, WeatherIntensity } from '../types';

export class OvercastEffect extends WeatherEffect {
    private clouds: Cloud[] = [];
    private mode: TimeMode;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate
    ) {
        super(ctx, width, height, intensity);
        this.mode = mode;
        this.initializeClouds();
    }

    private initializeClouds(): void {
        this.clouds = [];
        for (let i = 0; i < 7; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.5),
                width: randomBetween(100, 200),
                height: randomBetween(60, 100),
                speed: randomBetween(0.05, 0.15),
                opacity: randomBetween(0.6, 1),
            });
        }
    }

    render(): void {
        if (this.mode === 'day') {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#808080');
            gradient.addColorStop(1, '#A9A9A9');
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#1a1a1a');
            gradient.addColorStop(1, '#2d2d2d');
            this.ctx.fillStyle = gradient;
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.drawClouds();
    }

    private drawClouds(): void {
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.width + cloud.width) {
                cloud.x = -cloud.width;
            }

            this.ctx.fillStyle = `rgba(100, 100, 100, ${cloud.opacity})`;
            this.drawCloud(cloud.x, cloud.y, cloud.width, cloud.height);
        });
    }

    private drawCloud(x: number, y: number, w: number, h: number): void {
        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.15, y + h * 0.5, w * 0.25, h * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.4, y, w * 0.3, h * 0.6, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.65, y + h * 0.3, w * 0.28, h * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.85, y + h * 0.5, w * 0.25, h * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
