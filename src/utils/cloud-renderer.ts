// src/utils/cloud-renderer.ts

import { RenderingContext2D, Cloud, TimeMode } from '../types';
import { randomBetween } from './math';

export type CloudStyle = 'rounded' | 'elliptical';

export interface CloudConfig {
    count: number;
    widthRange: [number, number];
    heightRange: [number, number];
    speedRange: [number, number];
    opacityRange: [number, number];
    yRange: [number, number]; // [min, max] as percentage of height
    style?: CloudStyle;
}

export class CloudRenderer {
    private clouds: Cloud[] = [];
    private cloudsInitialized = false;

    constructor(
        private ctx: RenderingContext2D,
        private width: number,
        private height: number
    ) {}

    initializeClouds(config: CloudConfig, speedMultiplier: number = 1): void {
        if (this.cloudsInitialized) {
            return;
        }

        this.clouds = [];
        for (let i = 0; i < config.count; i++) {
            const yMin = this.height * config.yRange[0];
            const yMax = this.height * config.yRange[1];
            this.clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * (yMax - yMin) + yMin,
                width: randomBetween(config.widthRange[0], config.widthRange[1]),
                height: randomBetween(config.heightRange[0], config.heightRange[1]),
                speed: randomBetween(config.speedRange[0], config.speedRange[1]) * speedMultiplier,
                opacity: randomBetween(config.opacityRange[0], config.opacityRange[1]),
            });
        }

        this.cloudsInitialized = true;
    }

    drawClouds(mode: TimeMode, wind: number = 0, style: CloudStyle = 'rounded'): void {
        if (!this.cloudsInitialized) {
            return;
        }

        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed + wind;
            if (cloud.x > this.width + cloud.width) {
                cloud.x = -cloud.width;
            } else if (cloud.x < -cloud.width) {
                cloud.x = this.width + cloud.width;
            }

            const cloudColor =
                mode === 'night' ? `rgba(70, 80, 90, ${cloud.opacity})` : `rgba(255, 255, 255, ${cloud.opacity})`;

            this.ctx.fillStyle = cloudColor;
            if (style === 'elliptical') {
                this.drawEllipticalCloud(cloud.x, cloud.y, cloud.width, cloud.height);
            } else {
                this.drawRoundedCloud(cloud.x, cloud.y, cloud.width, cloud.height);
            }
        });
    }

    private drawRoundedCloud(x: number, y: number, w: number, h: number): void {
        this.ctx.beginPath();
        this.ctx.arc(x, y, h * 0.6, 0, Math.PI * 2);
        this.ctx.arc(x + w * 0.3, y - h * 0.2, h * 0.7, 0, Math.PI * 2);
        this.ctx.arc(x + w * 0.7, y, h * 0.6, 0, Math.PI * 2);
        this.ctx.arc(x + w * 0.5, y + h * 0.2, h * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private drawEllipticalCloud(x: number, y: number, w: number, h: number): void {
        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.15, y + h * 0.5, w * 0.25, h * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.4, y, w * 0.3, h * 0.6, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.65, y + h * 0.3, w * 0.28, h * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.85, y + h * 0.5, w * 0.25, h * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.cloudsInitialized = false;
        this.clouds = [];
    }
}
