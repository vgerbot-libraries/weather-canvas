import { WeatherCanvasRenderer } from './renderer';
import { WeatherType, TimeMode, WeatherIntensity } from './types';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 400;

export class WeatherCanvas extends HTMLElement {
    private renderer: WeatherCanvasRenderer | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    width: fit-content;
                    height: fit-content;
                }
                canvas {
                    width: 100%;
                    height: 100%;
                }
            </style>
        `;
    }

    connectedCallback() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.shadow.appendChild(this.canvas);
        }

        const width = this.getAttribute('width');
        const height = this.getAttribute('height');

        const canvasWidth = parseInt(width ?? '' + DEFAULT_WIDTH, 10);
        const canvasHeight = parseInt(height ?? '' + DEFAULT_HEIGHT, 10);

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        this.renderer = new WeatherCanvasRenderer(this.canvas);

        const weatherType = (this.getAttribute('weather-type') || 'sunny') as WeatherType;
        const timeMode = (this.getAttribute('time-mode') || 'day') as TimeMode;
        const intensity = (this.getAttribute('intensity') || WeatherIntensity.moderate) as WeatherIntensity;

        this.renderer.render(weatherType, timeMode, intensity);
        this.renderer.start();
    }

    disconnectedCallback() {
        if (this.renderer) {
            this.renderer.destroy();
            this.renderer = null;
        }
    }

    static get observedAttributes() {
        return ['weather-type', 'time-mode', 'intensity', 'width', 'height'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (!this.renderer) {
            return;
        }

        switch (name) {
            case 'weather-type':
                this.renderer.setWeatherType(newValue as WeatherType);
                break;
            case 'time-mode':
                this.renderer.setMode(newValue as TimeMode);
                break;
            case 'intensity':
                this.renderer.setIntensity(newValue as WeatherIntensity);
                break;
            case 'width':
                if (this.canvas) {
                    this.canvas.width = parseInt(newValue, 10);
                    this.renderer?.setSize(this.canvas.width, this.canvas.height);
                }
                break;
            case 'height':
                if (this.canvas) {
                    this.canvas.height = parseInt(newValue, 10);
                    this.renderer?.setSize(this.canvas.width, this.canvas.height);
                }
                break;
        }
    }
    start() {
        this.renderer?.start();
    }
    stop() {
        this.renderer?.stop();
    }
}

customElements.define('weather-canvas', WeatherCanvas);
