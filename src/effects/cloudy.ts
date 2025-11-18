// src/effects/cloudy.ts

import { WeatherEffect } from './base';
import { randomBetween } from '../utils/math';
import { Cloud, RenderingContext2D, TimeMode, WeatherIntensity } from '../types';

export class CloudyEffect extends WeatherEffect {
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
        const cloudCount = this.intensity === 'light' ? 3 : this.intensity === 'heavy' ? 7 : 5;

        for (let i = 0; i < cloudCount; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.4) + this.height * 0.1,
                width: randomBetween(80, 150),
                height: randomBetween(40, 70),
                speed: this.getSpeed(randomBetween(0.1, 0.3)),
                opacity: randomBetween(this.intensity === 'light' ? 0.4 : 0.5, this.intensity === 'heavy' ? 0.9 : 0.8),
            });
        }
    }

    render(): void {
        if (this.mode === 'day') {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#C0E0FF');
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#2d4a6f');
            gradient.addColorStop(1, '#3d5a7f');
            this.ctx.fillStyle = gradient;
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.drawClouds();

        if (this.mode === 'night') {
            this.drawMoon();
        }
    }

    private drawClouds(): void {
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.width + cloud.width) {
                cloud.x = -cloud.width;
            }

            const cloudColor =
                this.mode === 'day' ? `rgba(200, 220, 255, ${cloud.opacity})` : `rgba(80, 100, 120, ${cloud.opacity})`;

            this.ctx.fillStyle = cloudColor;
            this.drawCloud(cloud.x, cloud.y, cloud.width, cloud.height);
        });
    }

    private drawCloud(x: number, y: number, w: number, h: number): void {
        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.2, y + h * 0.5, w * 0.25, h * 0.45, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.5, y, w * 0.3, h * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.8, y + h * 0.5, w * 0.25, h * 0.45, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private drawMoon(): void {
        const moonX = this.width * 0.15;
        const moonY = this.height * 0.15;
        const moonRadius = 25;

        this.ctx.fillStyle = 'rgba(200, 200, 180, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
