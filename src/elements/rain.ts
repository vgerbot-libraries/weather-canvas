import { BaseElement } from './base';
import { RenderingContext2D, RainConfig } from '../types';
import { ParticlePool } from '../utils/particles';
import { randomBetween } from '../utils/math';

interface RainDrop {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
}

export class RainElement extends BaseElement {
    private rainDrops: RainDrop[] = [];
    private particlesInitialized = false;
    private splashPool: ParticlePool;
    private config: RainConfig;
    private currentWind: number = 0;

    constructor(ctx: RenderingContext2D, width: number, height: number, config: RainConfig) {
        super(ctx, width, height);
        this.config = config;
        this.splashPool = new ParticlePool(100);
    }

    private initRainDrops(): void {
        if (this.particlesInitialized) {
            return;
        }

        this.rainDrops = [];
        for (let i = 0; i < this.config.count; i++) {
            this.rainDrops.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                length: randomBetween(10, 30),
                speed: this.config.speed * randomBetween(1, 2), // vary speed slightly
                opacity: randomBetween(0.5, 1) * this.config.opacity,
            });
        }

        this.particlesInitialized = true;
    }

    update(): void {
        if (!this.particlesInitialized) {
            this.initRainDrops();
        }

        this.rainDrops.forEach(drop => {
            drop.y += drop.speed;
            drop.x += this.currentWind;

            if (this.currentWind > 0 && drop.x > this.width) {
                drop.x = -20;
            } else if (this.currentWind < 0 && drop.x < -20) {
                drop.x = this.width;
            }

            if (drop.y > this.height) {
                this.createSplash(drop.x, this.height);
                drop.y = -drop.length;
                drop.x = Math.random() * this.width;
            }
        });

        this.splashPool.update();
    }

    render(): void {
        if (!this.particlesInitialized) {
            this.initRainDrops();
        }

        // Draw Rain
        this.rainDrops.forEach(drop => {
            this.ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x + this.currentWind * 2, drop.y + drop.length);
            this.ctx.stroke();
        });

        // Draw Splashes
        const particles = this.splashPool.getActive();
        this.ctx.fillStyle = 'rgba(174, 194, 224, 0.6)';

        particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            this.ctx.fill();
        });
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

    setWind(wind: number): void {
        this.currentWind = wind;
    }

    resize(width: number, height: number): void {
        super.resize(width, height);
        this.particlesInitialized = false;
        this.rainDrops = [];
        // clear splashes?
        // this.splashPool.clear(); // Maybe not needed, they will just die out or be off screen
    }
}
