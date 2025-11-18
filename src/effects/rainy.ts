// src/effects/rainy.ts

import { WeatherEffect } from './base';
import { ParticlePool } from '../utils/particles';
import { randomBetween } from '../utils/math';
import { RenderingContext2D, TimeMode, WeatherIntensity } from '../types';

export class RainyEffect extends WeatherEffect {
    private particlePool: ParticlePool;
    private mode: TimeMode;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate
    ) {
        super(ctx, width, height, intensity);
        this.particlePool = new ParticlePool(500);
        this.mode = mode;
    }

    render(): void {
        // Background
        if (this.mode === 'day') {
            const baseOpacity = 0.3 + this.intensityConfig.opacity * 0.4;
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, `rgba(96, 96, 96, ${baseOpacity + 0.2})`);
            gradient.addColorStop(1, `rgba(160, 160, 160, ${baseOpacity})`);
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#1a1a2e');
            gradient.addColorStop(1, '#16213e');
            this.ctx.fillStyle = gradient;
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        const baseParticleCount = this.mode === 'night' ? 10 : 8;
        const particleCount = this.getParticleCount(baseParticleCount);

        for (let i = 0; i < particleCount; i++) {
            const speed = this.getSpeed(randomBetween(4, 8));
            this.particlePool.get(
                Math.random() * this.width,
                Math.random() * this.height - this.height,
                0,
                speed,
                this.height / 5
            );
        }

        this.particlePool.update();

        const lineWidth = this.intensity === 'light' ? 0.5 : this.intensity === 'heavy' ? 2 : 1;
        const baseOpacity = this.intensity === 'light' ? 0.5 : this.intensity === 'heavy' ? 1 : 0.8;

        this.ctx.strokeStyle = `rgba(200, 220, 255, ${baseOpacity})`;
        this.ctx.lineWidth = lineWidth;

        this.particlePool.getActive().forEach(particle => {
            this.ctx.globalAlpha = particle.opacity! * baseOpacity;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(particle.x, particle.y + 10);
            this.ctx.stroke();
        });
        this.ctx.globalAlpha = 1;

        if (this.mode === 'night') {
            const lightningChance = this.intensity === 'light' ? 0.005 : this.intensity === 'heavy' ? 0.04 : 0.02;
            if (Math.random() < lightningChance) {
                this.drawLightning();
            }
        }
    }

    private drawLightning(): void {
        const x = Math.random() * this.width;
        const y = Math.random() * (this.height * 0.5);

        this.ctx.strokeStyle = 'rgba(255, 255, 200, 0.8)';
        this.ctx.lineWidth = 3;

        let currentX = x;
        let currentY = y;

        for (let i = 0; i < 5; i++) {
            const nextX = currentX + randomBetween(-30, 30);
            const nextY = currentY + randomBetween(20, 50);

            this.ctx.beginPath();
            this.ctx.moveTo(currentX, currentY);
            this.ctx.lineTo(nextX, nextY);
            this.ctx.stroke();

            currentX = nextX;
            currentY = nextY;
        }
    }
}
