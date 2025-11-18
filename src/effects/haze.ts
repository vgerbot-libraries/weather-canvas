// src/effects/haze.ts

import { WeatherEffect } from './base';
import { ParticlePool } from '../utils/particles';
import { randomBetween } from '../utils/math';
import { RenderingContext2D, TimeMode, WeatherIntensity } from '../types';

export class HazeEffect extends WeatherEffect {
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
        this.particlePool = new ParticlePool(300);
        this.mode = mode;
    }

    render(): void {
        if (this.mode === 'day') {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);

            if (this.intensity === 'light') {
                gradient.addColorStop(0, '#D4AF37');
                gradient.addColorStop(0.5, '#E5C158');
                gradient.addColorStop(1, '#E8CC7C');
            } else if (this.intensity === 'heavy') {
                gradient.addColorStop(0, '#8B6914');
                gradient.addColorStop(0.5, '#A0860D');
                gradient.addColorStop(1, '#B8860B');
            } else {
                gradient.addColorStop(0, '#B8860B');
                gradient.addColorStop(0.5, '#CD9B1D');
                gradient.addColorStop(1, '#DAA520');
            }
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#3d3020');
            gradient.addColorStop(1, '#5a4a35');
            this.ctx.fillStyle = gradient;
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        const baseCount = 3;
        const particleCount = this.getParticleCount(baseCount);

        for (let i = 0; i < particleCount; i++) {
            this.particlePool.get(
                Math.random() * this.width,
                Math.random() * this.height,
                randomBetween(-0.5, 0.5),
                randomBetween(-0.5, 0.5),
                300
            );
        }

        this.particlePool.update();
        const particleOpacity = this.intensity === 'light' ? 0.15 : this.intensity === 'heavy' ? 0.5 : 0.3;
        const particleSize = this.intensity === 'light' ? 3 : this.intensity === 'heavy' ? 10 : 6;

        this.ctx.fillStyle = `rgba(180, 140, 80, ${particleOpacity})`;
        this.particlePool.getActive().forEach(particle => {
            this.ctx.globalAlpha = particle.opacity! * (particleOpacity / 0.3);
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, randomBetween(particleSize * 0.5, particleSize), 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
}
