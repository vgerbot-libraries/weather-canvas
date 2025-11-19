import { BaseElement } from './base';
import { RenderingContext2D, Star } from '../types';
import { randomBetween } from '../utils/math';

export class StarsElement extends BaseElement {
    private stars: Star[] = [];
    private starsInitialized = false;
    private count: number;

    constructor(ctx: RenderingContext2D, width: number, height: number, config: { count?: number } = {}) {
        super(ctx, width, height);
        this.count = config.count || 100;
    }

    private initializeStars(): void {
        if (this.starsInitialized) {
            return;
        }

        this.stars = [];
        for (let i = 0; i < this.count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.6),
                radius: randomBetween(0.5, 1.5),
                opacity: 0.5,
                twinkleSpeed: randomBetween(0.02, 0.05),
                phase: Math.random() * Math.PI * 2,
            });
        }

        this.starsInitialized = true;
    }

    update(): void {
        // Initialize if needed (lazy init)
        if (!this.starsInitialized) {
            this.initializeStars();
        }
    }

    render(): void {
        if (!this.starsInitialized) {
            this.initializeStars();
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
        super.resize(width, height);
        this.starsInitialized = false;
        this.stars = [];
    }
}
