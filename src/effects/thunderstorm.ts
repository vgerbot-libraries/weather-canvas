// src/effects/thunderstorm.ts

import { WeatherEffect } from './base';
import { ParticlePool } from '../utils/particles';
import { randomBetween } from '../utils/math';
import { RenderingContext2D, WeatherIntensity } from '../types';

export class ThunderstormEffect extends WeatherEffect {
    private particlePool: ParticlePool;
    private lightningIntensity = 0;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        intensity: WeatherIntensity = WeatherIntensity.moderate
    ) {
        super(ctx, width, height, intensity);
        this.particlePool = new ParticlePool(600);
    }

    render(): void {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#1a0f2e');
        gradient.addColorStop(0.5, '#2d1b4e');
        gradient.addColorStop(1, '#1a0f2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < 15; i++) {
            this.particlePool.get(
                Math.random() * this.width,
                Math.random() * this.height - this.height * 0.5,
                0,
                randomBetween(6, 10),
                this.height / 3
            );
        }

        this.particlePool.update();
        this.ctx.strokeStyle = 'rgba(150, 180, 255, 0.9)';
        this.ctx.lineWidth = 2;
        this.particlePool.getActive().forEach(particle => {
            this.ctx.globalAlpha = (particle.opacity ?? 1) * 0.9;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(particle.x, particle.y + 15);
            this.ctx.stroke();
        });
        this.ctx.globalAlpha = 1;

        this.lightningIntensity = Math.max(0, this.lightningIntensity - 0.05);

        if (Math.random() < 0.02) {
            this.lightningIntensity = 1;
            this.drawLightning();
        } else if (this.lightningIntensity > 0) {
            this.drawLightningFlash();
        }
    }

    private drawLightning(): void {
        const x = Math.random() * this.width;
        const y = Math.random() * (this.height * 0.4);

        this.ctx.strokeStyle = 'rgba(255, 255, 150, 0.9)';
        this.ctx.lineWidth = 4;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = 'rgba(255, 200, 0, 0.8)';

        let currentX = x;
        let currentY = y;

        for (let i = 0; i < 8; i++) {
            const nextX = currentX + randomBetween(-40, 40);
            const nextY = currentY + randomBetween(20, 60);

            this.ctx.beginPath();
            this.ctx.moveTo(currentX, currentY);
            this.ctx.lineTo(nextX, nextY);
            this.ctx.stroke();

            currentX = nextX;
            currentY = nextY;
        }

        this.ctx.shadowBlur = 0;
    }

    private drawLightningFlash(): void {
        const opacity = this.lightningIntensity * 0.3;
        this.ctx.fillStyle = `rgba(255, 255, 200, ${opacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}
