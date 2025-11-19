import { BaseElement } from './base';
import { RenderingContext2D } from '../types';

export class LightningElement extends BaseElement {
    private lightningFlash = 0;
    private config: { color: string } = { color: '255, 255, 200' };

    constructor(ctx: RenderingContext2D, width: number, height: number, config: { color?: string } = {}) {
        super(ctx, width, height);
        if (config.color) {
            this.config.color = config.color;
        }
    }

    update(): void {
        // Random lightning flash
        if (Math.random() < 0.01) {
            this.lightningFlash = 1;
        }

        if (this.lightningFlash > 0) {
            this.lightningFlash -= 0.05;
        }
    }

    render(): void {
        if (this.lightningFlash > 0) {
            // Draw flash overlay
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningFlash * 0.3})`;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Draw lightning bolt
            if (this.lightningFlash > 0.7) {
                this.ctx.strokeStyle = `rgba(${this.config.color}, ${this.lightningFlash})`;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();

                let x = this.width * 0.3 + Math.random() * this.width * 0.4;
                let y = 0;
                this.ctx.moveTo(x, y);

                for (let i = 0; i < 5; i++) {
                    x += (Math.random() - 0.5) * 40;
                    y += this.height / 5;
                    this.ctx.lineTo(x, y);
                }

                this.ctx.stroke();
            }
        }
    }

    resize(width: number, height: number): void {
        super.resize(width, height);
        this.lightningFlash = 0;
    }
}
