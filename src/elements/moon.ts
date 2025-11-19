import { BaseElement } from './base';
import { RenderingContext2D } from '../types';

export class MoonElement extends BaseElement {
    constructor(ctx: RenderingContext2D, width: number, height: number) {
        super(ctx, width, height);
    }

    update(): void {
        // Static element
    }

    render(): void {
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
