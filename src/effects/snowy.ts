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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time: number): void {
        this.drawBackground();
        this.drawSnow();
        this.drawMoon();
    }

    private drawBackground(): void {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);

        if (this.mode === 'night') {
            gradient.addColorStop(0, '#1a2b4a');
            gradient.addColorStop(1, '#2d4563');
        } else {
            gradient.addColorStop(0, '#e0e7ef');
            gradient.addColorStop(1, '#f0f4f8');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    private drawSnow(): void {
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
        if (this.mode === 'night') {
            const moonX = this.width * 0.75;
            const moonY = this.height * 0.25;
            const moonRadius = 35;

            // Moon glow
            const glowGradient = this.ctx.createRadialGradient(
                moonX,
                moonY,
                moonRadius * 0.5,
                moonX,
                moonY,
                moonRadius * 2
            );
            glowGradient.addColorStop(0, 'rgba(240, 248, 255, 0.2)');
            glowGradient.addColorStop(1, 'rgba(240, 248, 255, 0)');
            this.ctx.fillStyle = glowGradient;
            this.ctx.fillRect(moonX - moonRadius * 2, moonY - moonRadius * 2, moonRadius * 4, moonRadius * 4);

            // Moon
            this.ctx.fillStyle = '#f0f8ff';
            this.ctx.beginPath();
            this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // Moon craters
            this.ctx.fillStyle = 'rgba(200, 210, 220, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(moonX - 10, moonY - 8, 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(moonX + 8, moonY + 5, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}
