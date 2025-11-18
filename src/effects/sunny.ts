// src/effects/sunny.ts

import { WeatherEffect } from './base';
import { randomBetween } from '../utils/math';
import { Cloud, RenderingContext2D, TimeMode, WeatherIntensity } from '../types';

export class SunnyEffect extends WeatherEffect {
    private clouds: Cloud[] = [];
    private sunGlowPhase = 0;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        private mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate
    ) {
        super(ctx, width, height, intensity);
        this.initializeClouds();
    }

    private initializeClouds(): void {
        this.clouds = [];
        for (let i = 0; i < 3; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.3) + this.height * 0.1,
                width: randomBetween(60, 120),
                height: randomBetween(30, 50),
                speed: randomBetween(0.2, 0.5),
                opacity: randomBetween(0.4, 0.7),
            });
        }
    }

    render(): void {
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.drawSun();
        this.drawClouds();
    }

    private drawSun(): void {
        const sunX = this.width * 0.8;
        const sunY = this.height * 0.2;
        const sunRadius = 40;

        this.sunGlowPhase = Math.sin(this.time * 0.02) * 10 + 20;
        const glowGradient = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius + this.sunGlowPhase);
        glowGradient.addColorStop(0, 'rgba(255, 220, 0, 0.3)');
        glowGradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.1)');
        glowGradient.addColorStop(1, 'rgba(255, 180, 0, 0)');

        this.ctx.fillStyle = glowGradient;
        this.ctx.fillRect(
            sunX - sunRadius - this.sunGlowPhase,
            sunY - sunRadius - this.sunGlowPhase,
            (sunRadius + this.sunGlowPhase) * 2,
            (sunRadius + this.sunGlowPhase) * 2
        );

        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        this.ctx.fill();

        this.drawSunRays(sunX, sunY, sunRadius);
    }

    private drawSunRays(x: number, y: number, radius: number): void {
        this.ctx.strokeStyle = 'rgba(255, 220, 0, 0.6)';
        this.ctx.lineWidth = 2;

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = x + Math.cos(angle) * (radius + 20);
            const y1 = y + Math.sin(angle) * (radius + 20);
            const x2 = x + Math.cos(angle) * (radius + 40);
            const y2 = y + Math.sin(angle) * (radius + 40);

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    private drawClouds(): void {
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.width + cloud.width) {
                cloud.x = -cloud.width;
            }

            this.ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
            this.drawCloud(cloud.x, cloud.y, cloud.width, cloud.height);
        });
    }

    private drawCloud(x: number, y: number, w: number, h: number): void {
        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.25, y + h * 0.5, w * 0.2, h * 0.4, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.5, y, w * 0.25, h * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.75, y + h * 0.5, w * 0.2, h * 0.4, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
