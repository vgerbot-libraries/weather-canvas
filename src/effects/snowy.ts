// src/effects/snowy.ts

import { WeatherEffect } from './base';
import { ParticlePool } from '../utils/particles';
import { randomBetween } from '../utils/math';
import { RenderingContext2D, TimeMode, WeatherIntensity } from '../types';
import { SkyRenderer, BackgroundColors } from '../utils/sky-renderer';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#e0e7ef', '#f0f4f8'],
    night: ['#1a2b4a', '#2d4563'],
};

export class SnowyEffect extends WeatherEffect {
    private particlePool: ParticlePool;
    private skyRenderer: SkyRenderer;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        private mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate,
        wind: number = 0
    ) {
        super(ctx, width, height, intensity, wind);
        this.particlePool = new ParticlePool(200);
        this.skyRenderer = new SkyRenderer(ctx, width, height);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time: number): void {
        this.skyRenderer.drawBackground(BACKGROUND_COLORS, this.mode);
        this.drawSnow();
        this.skyRenderer.drawMoon(this.mode);
    }

    setWind(wind: number): void {
        super.setWind(wind);
        this.particlePool.getActive().forEach(p => {
            p.vx = wind + randomBetween(-1, 1);
        });
    }

    private drawSnow(): void {
        const baseCount = 4;
        const snowflakeCount = this.getParticleCount(baseCount);

        for (let i = 0; i < snowflakeCount; i++) {
            const speed = this.getSpeed(randomBetween(1, 3));
            const snowflake = this.particlePool.get(
                Math.random() * this.width,
                Math.random() * this.height - this.height,
                this.wind + randomBetween(-1, 1),
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
}
