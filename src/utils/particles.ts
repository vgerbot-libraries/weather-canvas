// src/utils/particles.ts

import { Particle } from '../types';
import { clamp } from './math';

export class ParticlePool {
    private pool: Particle[] = [];
    private active: Particle[] = [];

    constructor(initialSize: number = 100) {
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createParticle());
        }
    }

    private createParticle(): Particle {
        return {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            life: 1,
            maxLife: 1,
            size: 2,
            opacity: 1,
        };
    }

    get(x: number, y: number, vx: number, vy: number, life: number): Particle {
        let particle: Particle;
        if (this.pool.length > 0) {
            particle = this.pool.pop()!;
        } else {
            particle = this.createParticle();
        }
        particle.x = x;
        particle.y = y;
        particle.vx = vx;
        particle.vy = vy;
        particle.life = 1;
        particle.maxLife = life;
        particle.opacity = 1;
        this.active.push(particle);
        return particle;
    }

    update(): void {
        for (let i = this.active.length - 1; i >= 0; i--) {
            const p = this.active[i] as Particle;
            p.life -= 1 / p.maxLife;
            p.opacity = clamp(p.life, 0, 1);

            if (p.life <= 0) {
                this.pool.push(this.active.splice(i, 1)[0] as Particle);
            } else {
                p.x += p.vx;
                p.y += p.vy;
            }
        }
    }

    getActive(): Particle[] {
        return this.active;
    }

    clear(): void {
        this.pool.push(...this.active);
        this.active = [];
    }
}
