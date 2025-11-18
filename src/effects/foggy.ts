// src/effects/foggy.ts

import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity } from '../types';

export class FoggyEffect extends WeatherEffect {
    private mode: TimeMode;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate
    ) {
        super(ctx, width, height, intensity);
        this.mode = mode;
    }

    render(): void {
        if (this.mode === 'day') {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#E8E8E8');
            gradient.addColorStop(1, '#D3D3D3');
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#3a3a4a');
            gradient.addColorStop(1, '#2a2a3a');
            this.ctx.fillStyle = gradient;
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        const layerCount = this.intensity === 'light' ? 3 : this.intensity === 'heavy' ? 7 : 5;
        const baseOpacity = this.intensity === 'light' ? 0.08 : this.intensity === 'heavy' ? 0.25 : 0.15;

        for (let layer = 0; layer < layerCount; layer++) {
            const opacity = baseOpacity - layer * (baseOpacity / layerCount);
            const speed = this.getSpeed(0.5 + layer * 0.2);
            const yOffset = (this.time * speed) % this.height;

            this.ctx.fillStyle = `rgba(200, 200, 200, ${opacity})`;
            this.ctx.fillRect(0, yOffset, this.width, 40);
            this.ctx.fillRect(0, yOffset - this.height, this.width, 40);
        }

        if (this.mode === 'night') {
            this.drawMoon();
        }
    }

    private drawMoon(): void {
        const moonX = this.width * 0.85;
        const moonY = this.height * 0.15;
        const moonRadius = 20;

        const moonOpacity = this.intensity === 'light' ? 0.6 : this.intensity === 'heavy' ? 0.1 : 0.3;

        this.ctx.fillStyle = `rgba(150, 150, 130, ${moonOpacity})`;
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
