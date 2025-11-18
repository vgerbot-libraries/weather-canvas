// src/effects/cloudy.ts

import { WeatherEffect } from './base';
import { randomBetween } from '../utils/math';
import { Cloud, RenderingContext2D, TimeMode, WeatherIntensity, Star } from '../types';

export class CloudyEffect extends WeatherEffect {
    private clouds: Cloud[] = [];
    private stars: Star[] = [];
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
        this.initializeStars();
    }

    private initializeClouds(): void {
        this.clouds = [];
        const cloudCount = this.intensity === 'light' ? 3 : this.intensity === 'heavy' ? 7 : 5;

        for (let i = 0; i < cloudCount; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.4) + this.height * 0.1,
                width: randomBetween(80, 120),
                height: randomBetween(30, 40),
                speed: this.getSpeed(randomBetween(0.1, 0.3)),
                opacity: randomBetween(this.intensity === 'light' ? 0.4 : 0.5, this.intensity === 'heavy' ? 0.9 : 0.8),
            });
        }
    }

    private initializeStars(): void {
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
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time: number): void {
        this.drawBackground();
        this.drawStars();
        this.drawSun();
        this.drawMoon();
        this.drawClouds();
    }

    private drawBackground(): void {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);

        if (this.mode === 'night') {
            gradient.addColorStop(0, '#0f1624');
            gradient.addColorStop(1, '#1f2937');
        } else {
            gradient.addColorStop(0, '#87ceeb');
            gradient.addColorStop(1, '#b0d4f1');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    private drawSun(): void {
        if (this.mode === 'day') {
            const sunX = this.width * 0.75;
            const sunY = this.height * 0.25;
            const sunRadius = 40;

            // Sun glow
            const glowGradient = this.ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 2);
            glowGradient.addColorStop(0, 'rgba(255, 223, 0, 0.3)');
            glowGradient.addColorStop(1, 'rgba(255, 223, 0, 0)');
            this.ctx.fillStyle = glowGradient;
            this.ctx.fillRect(sunX - sunRadius * 2, sunY - sunRadius * 2, sunRadius * 4, sunRadius * 4);

            // Sun
            this.ctx.fillStyle = '#ffd700';
            this.ctx.beginPath();
            this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
            this.ctx.fill();
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

    private drawStars(): void {
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

    private drawClouds(): void {
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
}
