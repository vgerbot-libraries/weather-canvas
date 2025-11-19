import { BaseElement } from './base';
import { RenderingContext2D, Cloud, TimeMode, CloudConfig } from '../types';
import { randomBetween } from '../utils/math';

export class CloudElement extends BaseElement {
    private clouds: Cloud[] = [];
    private cloudsInitialized = false;
    private config: CloudConfig;
    private currentWind: number = 0;
    private mode: TimeMode = 'day'; // Default mode

    constructor(ctx: RenderingContext2D, width: number, height: number, config: CloudConfig) {
        super(ctx, width, height);
        this.config = config;
    }

    setMode(mode: TimeMode): void {
        this.mode = mode;
    }

    private initializeClouds(): void {
        if (this.cloudsInitialized) {
            return;
        }

        this.clouds = [];
        for (let i = 0; i < this.config.count; i++) {
            const yMin = this.height * this.config.yRange[0];
            const yMax = this.height * this.config.yRange[1];
            this.clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * (yMax - yMin) + yMin,
                width: randomBetween(this.config.widthRange[0], this.config.widthRange[1]),
                height: randomBetween(this.config.heightRange[0], this.config.heightRange[1]),
                speed: randomBetween(this.config.speedRange[0], this.config.speedRange[1]),
                opacity: randomBetween(this.config.opacityRange[0], this.config.opacityRange[1]),
            });
        }

        this.cloudsInitialized = true;
    }

    update(): void {
        if (!this.cloudsInitialized) {
            this.initializeClouds();
        }

        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed + this.currentWind;
            if (cloud.x > this.width + cloud.width) {
                cloud.x = -cloud.width;
            } else if (cloud.x < -cloud.width) {
                cloud.x = this.width + cloud.width;
            }
        });
    }

    render(): void {
        if (!this.cloudsInitialized) {
            this.initializeClouds();
        }

        this.clouds.forEach(cloud => {
            const cloudColor =
                this.mode === 'night' ? `rgba(70, 80, 90, ${cloud.opacity})` : `rgba(255, 255, 255, ${cloud.opacity})`;

            this.ctx.fillStyle = cloudColor;
            if (this.config.style === 'elliptical') {
                this.drawEllipticalCloud(cloud.x, cloud.y, cloud.width, cloud.height);
            } else {
                this.drawRoundedCloud(cloud.x, cloud.y, cloud.width, cloud.height);
            }
        });
    }

    setWind(wind: number): void {
        this.currentWind = wind;
    }

    resize(width: number, height: number): void {
        super.resize(width, height);
        this.cloudsInitialized = false;
        this.clouds = [];
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
}
