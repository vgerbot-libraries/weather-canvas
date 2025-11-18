// src/effects/haze.ts

import { WeatherEffect } from './base';
import { randomBetween } from '../utils/math';
import { RenderingContext2D, TimeMode, WeatherIntensity, Star } from '../types';

interface HazeParticle {
    x: number;
    y: number;
    radius: number;
    speed: number;
    opacity: number;
}

export class HazeEffect extends WeatherEffect {
    private particles: HazeParticle[] = [];
    private stars: Star[] = [];
    private mode: TimeMode;
    private particlesInitialized = false;
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
        this.drawHaze();
    }

    private drawBackground(): void {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);

        if (this.mode === 'night') {
            gradient.addColorStop(0, '#2d2416');
            gradient.addColorStop(1, '#3d3020');
        } else {
            gradient.addColorStop(0, '#b8a58e');
            gradient.addColorStop(1, '#d4c5b0');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    private initParticles(): void {
        if (this.particlesInitialized) {
            return;
        }

        const baseCount = 50;
        const particleCount = this.getParticleCount(baseCount);

        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: randomBetween(30, 70), // Math.random() * 40 + 30
                speed: this.getSpeed(randomBetween(0.2, 0.7)), // Math.random() * 0.5 + 0.2, adjusted by intensity
                opacity: this.getOpacity(randomBetween(0.05, 0.2)), // Math.random() * 0.15 + 0.05, adjusted by intensity
            });
        }

        this.particlesInitialized = true;
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
        // Initialize stars on first render
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

    private drawHaze(): void {
        // Initialize particles on first render
        if (!this.particlesInitialized) {
            this.initParticles();
        }

        // Update and draw particles
        this.particles.forEach(particle => {
            // Move particle horizontally
            particle.x += particle.speed;

            // Wrap around when particle goes off screen
            if (particle.x > this.width + particle.radius) {
                particle.x = -particle.radius;
            }

            // Draw particle with radial gradient
            const gradient = this.ctx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                particle.radius
            );
            const color = '150, 130, 100';
            gradient.addColorStop(0, `rgba(${color}, ${particle.opacity})`);
            gradient.addColorStop(1, `rgba(${color}, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    /**
     * Reset particles when canvas size changes
     */
    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.particlesInitialized = false;
        this.particles = [];
        this.starsInitialized = false;
        this.stars = [];
    }
}
