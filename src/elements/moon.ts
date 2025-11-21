import { BaseElement } from './base';
import { RenderingContext2D, MoonConfig } from '../types';

export class MoonElement extends BaseElement {
    private phase: number = 0.5; // Default to Full Moon (0.5)

    constructor(ctx: RenderingContext2D, width: number, height: number, config?: MoonConfig) {
        super(ctx, width, height);
        this.phase = this.getMoonPhase(config?.date ?? new Date());
    }

    /**
     * Calculate moon phase (0 to 1)
     * 0: New Moon
     * 0.25: First Quarter
     * 0.5: Full Moon
     * 0.75: Last Quarter
     */
    private getMoonPhase(date: Date): number {
        // Known new moon: 2000-01-06 18:14 UTC
        const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
        const cycle = 29.530588853;
        const diffTime = date.getTime() - knownNewMoon;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        let phase = (diffDays % cycle) / cycle;
        if (phase < 0) phase += 1;
        return phase;
    }

    update(): void {
        // Static element
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_time?: number): void {
        const moonX = this.width * 0.75;
        const moonY = this.height * 0.25;
        const moonRadius = 35;

        // Moon glow
        // Adjust glow brightness based on phase (full moon = brightest)
        // Phase 0.5 is max brightness, 0/1 is min
        const brightness = Math.sin(this.phase * Math.PI); // 0 to 1
        const glowOpacity = 0.2 * (0.2 + 0.8 * brightness);

        const glowGradient = this.ctx.createRadialGradient(
            moonX,
            moonY,
            moonRadius * 0.5,
            moonX,
            moonY,
            moonRadius * 2
        );
        glowGradient.addColorStop(0, `rgba(240, 248, 255, ${glowOpacity})`);
        glowGradient.addColorStop(1, 'rgba(240, 248, 255, 0)');
        this.ctx.fillStyle = glowGradient;
        this.ctx.fillRect(moonX - moonRadius * 2, moonY - moonRadius * 2, moonRadius * 4, moonRadius * 4);

        // Moon Phase Clipping
        this.ctx.save();
        this.ctx.beginPath();

        // If effectively New Moon, draw nothing for the disc
        if (this.phase < 0.02 || this.phase > 0.98) {
            this.ctx.restore();
            return;
        }

        // If effectively Full Moon, draw circle
        if (Math.abs(this.phase - 0.5) < 0.02) {
            this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        } else {
            const isWaxing = this.phase < 0.5;
            // w is the width of the terminator ellipse from center
            // +w means bulging right, -w means bulging left relative to vertical axis
            // However, we need to be careful with orientation
            const w = moonRadius * Math.cos(this.phase * 2 * Math.PI);

            if (isWaxing) {
                // Waxing: Light on Right.
                // 1. Outer Arc: Top to Bottom (Clockwise)
                this.ctx.arc(moonX, moonY, moonRadius, -Math.PI / 2, Math.PI / 2, false);

                // 2. Terminator: Bottom to Top
                // w > 0 (Crescent): Curve to Right (CounterClockwise)
                // w < 0 (Gibbous): Curve to Left (Clockwise)
                // We use ellipse to connect PI/2 back to -Math.PI/2 (same as 3PI/2)
                this.ctx.ellipse(moonX, moonY, Math.abs(w), moonRadius, 0, Math.PI / 2, (3 * Math.PI) / 2, w > 0);
            } else {
                // Waning: Light on Left.
                // 1. Outer Arc: Bottom to Top (Clockwise)
                this.ctx.arc(moonX, moonY, moonRadius, Math.PI / 2, (3 * Math.PI) / 2, false);

                // 2. Terminator: Top to Bottom
                // w < 0 (Gibbous): Curve to Left (CounterClockwise)
                // w > 0 (Crescent): Curve to Right (Clockwise)
                this.ctx.ellipse(moonX, moonY, Math.abs(w), moonRadius, 0, (3 * Math.PI) / 2, (5 * Math.PI) / 2, w < 0);
            }
        }

        this.ctx.closePath();
        this.ctx.clip();

        // Moon Body
        this.ctx.fillStyle = '#f0f8ff';
        this.ctx.fillRect(moonX - moonRadius, moonY - moonRadius, moonRadius * 2, moonRadius * 2);

        // Moon craters (will be clipped)
        this.ctx.fillStyle = 'rgba(200, 210, 220, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(moonX - 10, moonY - 8, 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(moonX + 8, moonY + 5, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }
}
