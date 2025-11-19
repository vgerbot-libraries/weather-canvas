import { BaseElement } from './base';
import { RenderingContext2D } from '../types';

export class SunElement extends BaseElement {
    constructor(ctx: RenderingContext2D, width: number, height: number) {
        super(ctx, width, height);
    }

    update(): void {
        // Static element (for now)
    }

    render(): void {
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
