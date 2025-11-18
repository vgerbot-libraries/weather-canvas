// src/utils/sky-renderer.ts

import { RenderingContext2D, TimeMode, Star } from '../types';
import { randomBetween } from './math';

export interface BackgroundColors {
    day: [string, string]; // [top, bottom]
    night: [string, string];
}

export class SkyRenderer {
    private stars: Star[] = [];
    private starsInitialized = false;

    constructor(
        private ctx: RenderingContext2D,
        private width: number,
        private height: number
    ) {}

    drawBackground(colors: BackgroundColors, mode: TimeMode): void {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        const [top, bottom] = mode === 'night' ? colors.night : colors.day;
        gradient.addColorStop(0, top);
        gradient.addColorStop(1, bottom);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawSun(mode: TimeMode): void {
        if (mode !== 'day') {
            return;
        }

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

    drawMoon(mode: TimeMode): void {
        if (mode !== 'night') {
            return;
        }

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

    initializeStars(mode: TimeMode, count: number = 100): void {
        if (this.starsInitialized) {
            return;
        }

        this.stars = [];
        if (mode === 'night') {
            for (let i = 0; i < count; i++) {
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

    drawStars(mode: TimeMode): void {
        if (mode !== 'night' || this.stars.length === 0) {
            return;
        }

        this.stars.forEach(star => {
            star.phase += star.twinkleSpeed;
            const opacity = 0.5 + Math.sin(star.phase) * 0.5;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.starsInitialized = false;
        this.stars = [];
    }
}
