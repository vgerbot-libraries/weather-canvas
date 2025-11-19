import { RenderingContext2D } from '../types';

export interface WeatherElement {
    update(time?: number): void;
    render(time?: number): void;
    resize(width: number, height: number): void;
    setWind?(wind: number): void;
    destroy?(): void;
}

export abstract class BaseElement implements WeatherElement {
    protected ctx: RenderingContext2D;
    protected width: number;
    protected height: number;

    constructor(ctx: RenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    abstract update(time?: number): void;
    abstract render(time?: number): void;

    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setWind(_wind: number): void {
        // Optional override
    }

    destroy(): void {
        // Optional override
    }
}
