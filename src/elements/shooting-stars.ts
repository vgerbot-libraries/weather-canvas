import { BaseElement } from './base';
import { RenderingContext2D, ShootingStarsConfig } from '../types';
import { randomBetween } from '../utils/math';

interface ShootingStarParticle {
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    opacity: number;
    life: number;
    maxLife: number;
    trail: { x: number; y: number; opacity: number }[];
}

export class ShootingStarsElement extends BaseElement {
    private stars: ShootingStarParticle[] = [];
    private lastSpawnTime = 0;
    private spawnInterval: number;
    private options: ShootingStarsConfig;

    constructor(ctx: RenderingContext2D, width: number, height: number, options: ShootingStarsConfig = {}) {
        super(ctx, width, height);
        this.options = options;
        // Randomize spawn interval between 2 and 5 seconds initially
        if (this.options.spawnInterval) {
            this.spawnInterval = randomBetween(this.options.spawnInterval.min, this.options.spawnInterval.max);
        } else {
            this.spawnInterval = randomBetween(2000, 5000);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_time: number): void {
        const now = Date.now();

        // Spawn new shooting star
        if (now - this.lastSpawnTime > this.spawnInterval) {
            this.spawnStar();
            this.lastSpawnTime = now;
            // Reset interval for next star
            if (this.options.spawnInterval) {
                this.spawnInterval = randomBetween(this.options.spawnInterval.min, this.options.spawnInterval.max);
            } else {
                this.spawnInterval = randomBetween(1000, 4000);
            }
        }

        // Update existing stars
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const star = this.stars[i] as ShootingStarParticle;

            // Save current position for trail
            star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity });
            if (star.trail.length > 10) {
                star.trail.pop();
            }

            // Move star
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;

            // Fade in/out logic
            star.life--;
            if (star.life < 20) {
                star.opacity = star.life / 20;
            } else if (star.opacity < 1 && star.maxLife - star.life < 20) {
                star.opacity = (star.maxLife - star.life) / 20;
            }

            // Remove if dead or out of bounds (with some margin)
            if (
                star.life <= 0 ||
                star.x < -100 ||
                star.x > this.width + 100 ||
                star.y < -100 ||
                star.y > this.height + 100
            ) {
                this.stars.splice(i, 1);
            }
        }
    }

    private spawnStar(): void {
        // Start from a random position, often outside the screen or near edges
        // Strategy: Pick a random side to start from (top, left, right)

        const side = Math.floor(Math.random() * 3); // 0: top, 1: left, 2: right
        let startX, startY, angle;

        if (side === 0) {
            // Top
            startX = randomBetween(0, this.width);
            startY = -50;
            // Angle pointing down-ish
            angle = randomBetween(Math.PI / 4, (3 * Math.PI) / 4);
        } else if (side === 1) {
            // Left
            startX = -50;
            startY = randomBetween(0, this.height * 0.5); // Top half
            // Angle pointing right-ish
            angle = randomBetween(-Math.PI / 4, Math.PI / 4);
        } else {
            // Right
            startX = this.width + 50;
            startY = randomBetween(0, this.height * 0.5); // Top half
            // Angle pointing left-ish
            angle = randomBetween((3 * Math.PI) / 4, (5 * Math.PI) / 4);
        }

        // Override with totally random direction as requested "from different directions"
        // But let's make it look good - usually across the sky.
        // Let's try totally random start point in the top half extended area

        startX = randomBetween(-this.width * 0.2, this.width * 1.2);
        startY = randomBetween(-this.height * 0.2, this.height * 0.5);

        // Target a point in the central/lower area to ensure it crosses the screen
        const targetX = randomBetween(this.width * 0.2, this.width * 0.8);
        const targetY = randomBetween(this.height * 0.3, this.height * 0.8);

        angle = Math.atan2(targetY - startY, targetX - startX);

        const life = this.options.life
            ? randomBetween(this.options.life.min, this.options.life.max)
            : randomBetween(60, 100);

        this.stars.push({
            x: startX,
            y: startY,
            length: randomBetween(50, 150),
            speed: randomBetween(15, 25),
            angle: angle,
            opacity: 0,
            life: life, // Frames roughly
            maxLife: 100, // placeholder, will set in logic
            trail: [],
        });

        // Update maxLife for correct fade in
        this.stars[this.stars.length - 1]!.maxLife = this.stars[this.stars.length - 1]!.life;
    }

    render(): void {
        this.ctx.save();
        this.ctx.lineCap = 'round';

        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i] as ShootingStarParticle;

            // Draw head
            // this.ctx.beginPath();
            // this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            // this.ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
            // this.ctx.fill();

            // Draw trail
            if (star.trail.length > 0) {
                const gradient = this.ctx.createLinearGradient(
                    star.trail[star.trail.length - 1]!.x,
                    star.trail[star.trail.length - 1]!.y,
                    star.x,
                    star.y
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
                gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 2;

                this.ctx.beginPath();
                // Draw line from end of trail to current pos
                const tailEnd = star.trail[star.trail.length - 1]!;
                this.ctx.moveTo(tailEnd.x, tailEnd.y);
                this.ctx.lineTo(star.x, star.y);
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }
}
