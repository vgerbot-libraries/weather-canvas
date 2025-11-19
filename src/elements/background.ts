import { BaseElement } from './base';
import { RenderingContext2D } from '../types';

export interface BackgroundConfig {
    topColor: string;
    bottomColor: string;
}

export class BackgroundElement extends BaseElement {
    private config: BackgroundConfig;

    constructor(ctx: RenderingContext2D, width: number, height: number, config: BackgroundConfig) {
        super(ctx, width, height);
        this.config = config;
    }

    update(): void {
        // Static element
    }

    render(): void {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, this.config.topColor);
        gradient.addColorStop(1, this.config.bottomColor);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    setConfig(config: BackgroundConfig): void {
        this.config = config;
    }
}
