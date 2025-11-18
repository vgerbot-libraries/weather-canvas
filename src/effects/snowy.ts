// src/effects/snowy.ts

import { WeatherEffect } from './base';
import { ParticlePool } from '../utils/particles';
import { randomBetween } from '../utils/math';
import { RenderingContext2D, TimeMode, WeatherIntensity } from '../types';

export class SnowyEffect extends WeatherEffect {
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
        this.particlePool = new ParticlePool(200);
        this.mode = mode;
    }

    render(): void {
        if (this.mode === 'day') {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#D3D3D3');
            gradient.addColorStop(1, '#F0F0F0');
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#1a2b4a');
            gradient.addColorStop(1, '#2d4563');
            this.ctx.fillStyle = gradient;
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        const baseCount = 4;
        const snowflakeCount = this.getParticleCount(baseCount);

        for (let i = 0; i < snowflakeCount; i++) {
            const speed = this.getSpeed(randomBetween(1, 3));
            const snowflake = this.particlePool.get(
                Math.random() * this.width,
                Math.random() * this.height - this.height,
                randomBetween(-1, 1),
                speed,
                this.height / 2
            );
            snowflake.size = randomBetween(2, 6) * (this.intensityConfig.opacity / 0.8);
        }

        this.particlePool.update();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.particlePool.getActive().forEach(particle => {
            this.ctx.globalAlpha = particle.opacity!;
            this.drawSnowflake(particle.x, particle.y, particle.size!);
        });
        this.ctx.globalAlpha = 1;

        if (this.mode === 'night') {
            this.drawMoon();
        }
    }

    private drawSnowflake(x: number, y: number, size: number): void {
        this.ctx.save();
        this.ctx.translate(x, y);

        for (let i = 0; i < 6; i++) {
            this.ctx.rotate((Math.PI * 2) / 6);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -size);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(-size * 0.3, -size * 0.7);
            this.ctx.lineTo(size * 0.3, -size * 0.7);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    private drawMoon(): void {
        const moonX = this.width * 0.15;
        const moonY = this.height * 0.15;
        const moonRadius = 30;

        this.ctx.fillStyle = 'rgba(220, 220, 200, 0.9)';
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        this.ctx.fill();

        const shadowGradient = this.ctx.createRadialGradient(moonX + 10, moonY - 10, 0, moonX, moonY, moonRadius);
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        this.ctx.fillStyle = shadowGradient;
        this.ctx.fill();
    }
}
