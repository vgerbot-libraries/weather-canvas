// src/effects/rainy.ts

import { WeatherEffect } from './base';
import { randomBetween } from '../utils/math';
import { ParticlePool } from '../utils/particles';
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
    private splashPool: ParticlePool;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        private mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate,
        wind: number = 0
    ) {
        super(ctx, width, height, intensity, wind);
        this.skyRenderer = new SkyRenderer(ctx, width, height);
        this.cloudRenderer = new CloudRenderer(ctx, width, height);
        this.splashPool = new ParticlePool(100);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time: number): void {
        this.skyRenderer.drawBackground(BACKGROUND_COLORS, this.mode);
        this.skyRenderer.drawStars(this.mode);
        this.skyRenderer.drawMoon(this.mode);
        this.drawClouds();
        this.drawRain();
        this.drawSplashes();
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

    private createSplash(x: number, y: number): void {
        const count = Math.floor(randomBetween(2, 4));
        for (let i = 0; i < count; i++) {
            const vx = randomBetween(-1, 1);
            const vy = randomBetween(-2, -4.5);
            const life = randomBetween(10, 20);
            this.splashPool.get(x, y, vx, vy, life, 0.2);
        }
    }

    private drawSplashes(): void {
        this.splashPool.update();
        const particles = this.splashPool.getActive();

        this.ctx.fillStyle = 'rgba(174, 194, 224, 0.6)';

        particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    private drawRain(): void {
        if (!this.particlesInitialized) {
            this.initRainDrops();
        }

        this.rainDrops.forEach(drop => {
            drop.y += drop.speed;
            drop.x += this.wind;

            if (this.wind > 0 && drop.x > this.width) {
                drop.x = -20;
            } else if (this.wind < 0 && drop.x < -20) {
                drop.x = this.width;
            }

            if (drop.y > this.height) {
                this.createSplash(drop.x, this.height);
                drop.y = -drop.length;
                drop.x = Math.random() * this.width;
            }

            this.ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x + this.wind * 2, drop.y + drop.length);
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
