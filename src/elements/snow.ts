import { BaseElement } from './base';
import { RenderingContext2D, SnowConfig } from '../types';
import { ParticlePool } from '../utils/particles';
import { randomBetween } from '../utils/math';

export class SnowElement extends BaseElement {
    private particlePool: ParticlePool;
    private config: SnowConfig;
    private currentWind: number = 0;

    constructor(ctx: RenderingContext2D, width: number, height: number, config: SnowConfig) {
        super(ctx, width, height);
        this.config = config;
        this.particlePool = new ParticlePool(config.count);
        this.initSnow();
    }

    private initSnow(): void {
        // Pre-fill managed by pool on demand
    }

    update(): void {
        // Emit new snowflakes
        // Logic: config.count is emission density.
        // In SnowyEffect logic, we want to maintain N snowflakes.
        // ParticlePool doesn't automatically maintain count.
        // So we emit up to config.count per frame? No that's too many.
        // SnowyEffect was: for (let i = 0; i < snowflakeCount; i++) { ... } where snowflakeCount ~ 4
        // So config.count should be small (emission rate).

        for (let i = 0; i < this.config.count; i++) {
            const speed = this.config.speed * randomBetween(1, 3);
            const snowflake = this.particlePool.get(
                Math.random() * this.width,
                Math.random() * this.height - this.height, // start above
                this.currentWind + randomBetween(-1, 1),
                speed,
                this.height / 2 // life
            );
            snowflake.size = randomBetween(2, 6) * (this.config.opacity / 0.8);
        }

        this.particlePool.update();

        // Update wind for active particles is handled by emission direction + gravity/update logic
        // We could modify active particles here if we wanted wind changes to affect falling snow.
    }

    render(): void {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.particlePool.getActive().forEach(particle => {
            this.ctx.globalAlpha = particle.opacity!;
            this.drawSnowflake(particle.x, particle.y, particle.size!);
        });
        this.ctx.globalAlpha = 1;
    }

    private drawSnowflake(x: number, y: number, size: number): void {
        this.ctx.save();
        this.ctx.translate(x, y);

        for (let i = 0; i < 6; i++) {
            this.ctx.rotate((Math.PI * 2) / 6);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -size);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(-size * 0.3, -size * 0.7);
            this.ctx.lineTo(size * 0.3, -size * 0.7);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    setWind(wind: number): void {
        this.currentWind = wind;
        this.particlePool.getActive().forEach(p => {
            p.vx = wind + randomBetween(-1, 1);
        });
    }

    resize(width: number, height: number): void {
        super.resize(width, height);
        this.particlePool.clear(); // Clear active particles
    }
}
