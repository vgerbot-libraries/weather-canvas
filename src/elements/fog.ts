import { BaseElement } from './base';
import { RenderingContext2D, FogConfig } from '../types';
import { randomBetween } from '../utils/math';

interface FogParticle {
    x: number;
    y: number;
    radius: number;
    speed: number;
    opacity: number;
}

export class FogElement extends BaseElement {
    private particles: FogParticle[] = [];
    private particlesInitialized = false;
    private config: FogConfig;
    private currentWind: number = 0;

    constructor(ctx: RenderingContext2D, width: number, height: number, config: FogConfig) {
        super(ctx, width, height);
        this.config = config;
    }

    private initParticles(): void {
        if (this.particlesInitialized) {
            return;
        }

        this.particles = [];
        for (let i = 0; i < this.config.count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: randomBetween(30, 70),
                speed: randomBetween(0.2, 0.7),
                opacity: randomBetween(0.05, 0.2),
            });
        }

        this.particlesInitialized = true;
    }

    update(): void {
        if (!this.particlesInitialized) {
            this.initParticles();
        }

        this.particles.forEach(particle => {
            particle.x += particle.speed + this.currentWind;

            if (particle.x > this.width + particle.radius) {
                particle.x = -particle.radius;
            } else if (particle.x < -particle.radius) {
                particle.x = this.width + particle.radius;
            }
        });
    }

    render(): void {
        if (!this.particlesInitialized) {
            this.initParticles();
        }

        this.particles.forEach(particle => {
            const gradient = this.ctx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                particle.radius
            );
            gradient.addColorStop(0, `rgba(${this.config.color}, ${particle.opacity})`);
            gradient.addColorStop(1, `rgba(${this.config.color}, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    setWind(wind: number): void {
        this.currentWind = wind;
    }

    resize(width: number, height: number): void {
        super.resize(width, height);
        this.particlesInitialized = false;
        this.particles = [];
    }
}
