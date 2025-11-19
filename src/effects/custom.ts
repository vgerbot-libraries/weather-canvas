import { WeatherEffect } from './base';
import { RenderingContext2D, TimeMode, WeatherIntensity, CustomWeatherConfig, WeatherElementType } from '../types';
import {
    BackgroundElement,
    SunElement,
    MoonElement,
    StarsElement,
    CloudElement,
    RainElement,
    SnowElement,
    FogElement,
    LightningElement,
} from '../elements';

export class CustomEffect extends WeatherEffect {
    private config: CustomWeatherConfig;
    private mode: TimeMode;

    constructor(
        ctx: RenderingContext2D,
        width: number,
        height: number,
        config: CustomWeatherConfig,
        mode: TimeMode = 'day',
        intensity: WeatherIntensity = WeatherIntensity.moderate,
        wind: number = 0
    ) {
        super(ctx, width, height, intensity, wind);
        this.config = config;
        this.mode = mode;

        this.initializeElements();
    }

    private initializeElements(): void {
        // 1. Background
        const bgColors = this.mode === 'night' ? this.config.background.night : this.config.background.day;

        // Always add background first if configured (it's usually implicit in the config structure)
        this.elements.push(
            new BackgroundElement(this.ctx, this.width, this.height, {
                topColor: bgColors[0],
                bottomColor: bgColors[1],
            })
        );

        // 2. Other Elements
        this.config.elements.forEach(elConfig => {
            // Check mode restriction
            if (elConfig.modes && !elConfig.modes.includes(this.mode)) {
                return;
            }

            this.addElement(elConfig.type, elConfig.options);
        });
    }

    private addElement(type: WeatherElementType, options: any): void {
        switch (type) {
            case 'sun':
                this.elements.push(new SunElement(this.ctx, this.width, this.height));
                break;
            case 'moon':
                this.elements.push(new MoonElement(this.ctx, this.width, this.height));
                break;
            case 'stars':
                this.elements.push(new StarsElement(this.ctx, this.width, this.height, options || {}));
                break;
            case 'cloud':
                {
                    const cloudEl = new CloudElement(this.ctx, this.width, this.height, options);
                    cloudEl.setMode(this.mode);
                    cloudEl.setWind(this.wind);
                    this.elements.push(cloudEl);
                }
                break;
            case 'rain':
                {
                    const rainEl = new RainElement(this.ctx, this.width, this.height, options);
                    rainEl.setWind(this.wind);
                    this.elements.push(rainEl);
                }
                break;
            case 'snow':
                {
                    const snowEl = new SnowElement(this.ctx, this.width, this.height, options);
                    snowEl.setWind(this.wind);
                    this.elements.push(snowEl);
                }
                break;
            case 'fog':
                {
                    const fogEl = new FogElement(this.ctx, this.width, this.height, options);
                    fogEl.setWind(this.wind);
                    this.elements.push(fogEl);
                }
                break;
            case 'lightning':
                this.elements.push(new LightningElement(this.ctx, this.width, this.height, options || {}));
                break;
            case 'background':
                // Background is handled separately at start of init
                break;
        }
    }

    render(time: number): void {
        this.renderElements(time);
    }
}
