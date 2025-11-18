// src/effects/haze.ts

import { WeatherEffect } from './base';
import { randomBetween } from '../utils/math';
import { RenderingContext2D, TimeMode, WeatherIntensity } from '../types';
import { SkyRenderer, BackgroundColors } from '../utils/sky-renderer';

const BACKGROUND_COLORS: BackgroundColors = {
    day: ['#b8a58e', '#d4c5b0'],
    night: ['#2d2416', '#3d3020'],
};

interface HazeParticle {
    x: number;
    y: number;
    radius: number;
    speed: number;
    opacity: number;
    color: string; // Pre-computed color string
}

export class HazeEffect extends WeatherEffect {
    private particles: HazeParticle[] = [];
    private skyRenderer: SkyRenderer;
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
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time: number): void {
        this.skyRenderer.drawBackground(BACKGROUND_COLORS, this.mode);
        this.skyRenderer.drawStars(this.mode);
        this.skyRenderer.drawMoon(this.mode);
        this.drawHaze();
    }

    private initParticles(): void {
        if (this.particlesInitialized) {
            return;
        }

        const baseCount = 50;
        const particleCount = this.getParticleCount(baseCount);

        this.particles = [];
        const color = '150, 130, 100';
        for (let i = 0; i < particleCount; i++) {
            const opacity = this.getOpacity(randomBetween(0.05, 0.2));
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: randomBetween(30, 70),
                speed: this.getSpeed(randomBetween(0.2, 0.7)),
                opacity: opacity,
                color: `rgba(${color}, ${opacity})`, // Pre-compute color string
            });
        }

        this.particlesInitialized = true;
    }

    private drawHaze(): void {
        if (!this.particlesInitialized) {
            this.initParticles();
        }

        // Use shadowBlur for softer edges instead of expensive gradients
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = 'rgba(150, 130, 100, 0.5)';

        this.particles.forEach(particle => {
            particle.x += particle.speed;

            if (particle.x > this.width + particle.radius) {
                particle.x = -particle.radius;
            }

            // Use simple fill with shadow for better performance
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Reset shadow
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
    }

    /**
     * Reset particles when canvas size changes
     */
    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.particlesInitialized = false;
        this.particles = [];
        this.skyRenderer.resize(width, height);
    }
}
