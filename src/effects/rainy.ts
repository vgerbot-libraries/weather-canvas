// src/effects/rainy.ts

import { WeatherEffect } from './base';
import { randomBetween } from '../utils/math';
import { RenderingContext2D, TimeMode, WeatherIntensity, Cloud, Star } from '../types';

interface RainDrop {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
}

export class RainyEffect extends WeatherEffect {
    private rainDrops: RainDrop[] = [];
    private clouds: Cloud[] = [];
    private stars: Star[] = [];
    private mode: TimeMode;
    private particlesInitialized = false;
    private cloudsInitialized = false;
    private starsInitialized = false;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate
    ) {
        super(ctx, width, height, intensity);
        this.mode = mode;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time: number): void {
        this.drawBackground();
        this.drawStars();
        this.drawMoon();
        this.drawClouds();
        this.drawRain();
    }

    private drawBackground(): void {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);

        if (this.mode === 'night') {
            gradient.addColorStop(0, '#1a1a2e');
            gradient.addColorStop(1, '#16213e');
        } else {
            gradient.addColorStop(0, '#4a5568');
            gradient.addColorStop(1, '#718096');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
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
                length: randomBetween(10, 30), // Math.random() * 20 + 10
                speed: this.getSpeed(randomBetween(5, 10)), // Math.random() * 5 + 5, adjusted by intensity
                opacity: randomBetween(0.5, 1), // Math.random() * 0.5 + 0.5
            });
        }

        this.particlesInitialized = true;
    }

    private initializeClouds(): void {
        if (this.cloudsInitialized) {
            return;
        }

        this.clouds = [];
        const cloudCount = 3; // rainy has 3 clouds

        for (let i = 0; i < cloudCount; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.4),
                width: randomBetween(80, 200), // Math.random() * 120 + 80
                height: randomBetween(30, 70), // Math.random() * 40 + 30
                speed: randomBetween(0.1, 0.4), // Math.random() * 0.3 + 0.1
                opacity: 0.5,
            });
        }

        this.cloudsInitialized = true;
    }

    private initializeStars(): void {
        if (this.starsInitialized) {
            return;
        }

        this.stars = [];
        if (this.mode === 'night') {
            for (let i = 0; i < 100; i++) {
                this.stars.push({
                    x: Math.random() * this.width,
                    y: Math.random() * (this.height * 0.6),
                    radius: randomBetween(0.5, 1.5),
                    opacity: 0.5,
                    twinkleSpeed: randomBetween(0.02, 0.05),
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }

        this.starsInitialized = true;
    }

    private drawStars(): void {
        if (!this.starsInitialized) {
            this.initializeStars();
        }

        if (this.mode === 'night' && this.stars.length > 0) {
            this.stars.forEach(star => {
                star.phase += star.twinkleSpeed;
                const opacity = 0.5 + Math.sin(star.phase) * 0.5;

                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }
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

    private drawClouds(): void {
        if (!this.cloudsInitialized) {
            this.initializeClouds();
        }

        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.width + cloud.width) {
                cloud.x = -cloud.width;
            }

            const cloudColor =
                this.mode === 'night' ? `rgba(70, 80, 90, ${cloud.opacity})` : `rgba(255, 255, 255, ${cloud.opacity})`;

            this.ctx.fillStyle = cloudColor;
            this.drawCloud(cloud.x, cloud.y, cloud.width, cloud.height);
        });
    }

    private drawCloud(x: number, y: number, w: number, h: number): void {
        this.ctx.beginPath();
        this.ctx.arc(x, y, h * 0.6, 0, Math.PI * 2);
        this.ctx.arc(x + w * 0.3, y - h * 0.2, h * 0.7, 0, Math.PI * 2);
        this.ctx.arc(x + w * 0.7, y, h * 0.6, 0, Math.PI * 2);
        this.ctx.arc(x + w * 0.5, y + h * 0.2, h * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private drawRain(): void {
        if (!this.particlesInitialized) {
            this.initRainDrops();
        }

        this.rainDrops.forEach(drop => {
            drop.y += drop.speed;
            if (drop.y > this.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.width;
            }

            this.ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
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
        this.cloudsInitialized = false;
        this.clouds = [];
        this.starsInitialized = false;
        this.stars = [];
    }
}
