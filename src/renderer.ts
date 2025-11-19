import {
    WeatherType,
    TimeMode,
    RenderOptions,
    WeatherIntensity,
    RenderingContext2D,
    CustomWeatherConfig,
} from './types';
import {
    SunnyEffect,
    CloudyEffect,
    OvercastEffect,
    RainyEffect,
    SnowyEffect,
    HazeEffect,
    FoggyEffect,
    ThunderstormEffect,
    WeatherEffect,
    CustomEffect,
} from './effects';

/**
 * Main weather Canvas renderer class
 */
export class WeatherCanvasRenderer {
    private canvas: HTMLCanvasElement | OffscreenCanvas;
    private ctx: RenderingContext2D;
    private width: number;
    private height: number;
    private fps: number;
    private frameInterval: number;
    private animationId: number | null = null;
    private lastFrameTime = 0;

    private currentWeather: WeatherType = 'sunny';
    private currentMode: TimeMode = 'day';
    private currentIntensity: WeatherIntensity = WeatherIntensity.moderate;
    private currentEffect: WeatherEffect | null = null;
    private currentWind: number = 0;

    private effectMap: Map<string, WeatherEffect> = new Map();
    private customWeatherMap: Map<string, CustomWeatherConfig> = new Map();

    /**
     * Constructor
     * @param canvas Canvas DOM element
     * @param options Configuration options
     */
    constructor(canvas: HTMLCanvasElement | OffscreenCanvas, options?: RenderOptions) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }
        this.ctx = ctx;

        this.width = options?.width || canvas.width || 700;
        this.height = options?.height || canvas.height || 400;
        this.fps = options?.fps || 60;
        this.currentWind = options?.wind || 0;
        this.frameInterval = 1000 / this.fps;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.initializeEffects();
    }

    /**
     * Initialize all weather effects
     */
    private initializeEffects(): void {
        const weatherTypes: WeatherType[] = [
            'sunny',
            'cloudy',
            'overcast',
            'rainy',
            'snowy',
            'haze',
            'foggy',
            'thunderstorm',
        ];

        weatherTypes.forEach(type => {
            ['day', 'night'].forEach(mode => {
                ['light', 'moderate', 'heavy'].forEach(intensity => {
                    const effect = this.createEffect(type, mode as TimeMode, intensity as WeatherIntensity);
                    if (effect) {
                        const key = `${type}_${mode}_${intensity}`;
                        this.effectMap.set(key, effect);
                    }
                });
            });
        });

        // Re-initialize custom effects if any exist (useful when resizing)
        this.customWeatherMap.forEach((config, name) => {
            ['day', 'night'].forEach(mode => {
                ['light', 'moderate', 'heavy'].forEach(intensity => {
                    const effect = new CustomEffect(
                        this.ctx,
                        this.width,
                        this.height,
                        config,
                        mode as TimeMode,
                        intensity as WeatherIntensity,
                        this.currentWind
                    );
                    const key = `${name}_${mode}_${intensity}`;
                    this.effectMap.set(key, effect);
                });
            });
        });
    }

    /**
     * Create effect instance for specified weather, time mode and intensity
     */
    private createEffect(weatherType: WeatherType, mode: TimeMode, intensity: WeatherIntensity): WeatherEffect | null {
        // Check custom weather first
        if (this.customWeatherMap.has(weatherType as string)) {
            const config = this.customWeatherMap.get(weatherType as string)!;
            return new CustomEffect(this.ctx, this.width, this.height, config, mode, intensity, this.currentWind);
        }

        switch (weatherType) {
            case 'sunny':
                return new SunnyEffect(this.ctx, this.width, this.height, mode, intensity, this.currentWind);
            case 'cloudy':
                return new CloudyEffect(this.ctx, this.width, this.height, mode, intensity, this.currentWind);
            case 'overcast':
                return new OvercastEffect(this.ctx, this.width, this.height, mode, intensity, this.currentWind);
            case 'rainy':
                return new RainyEffect(this.ctx, this.width, this.height, mode, intensity, this.currentWind);
            case 'snowy':
                return new SnowyEffect(this.ctx, this.width, this.height, mode, intensity, this.currentWind);
            case 'haze':
                return new HazeEffect(this.ctx, this.width, this.height, mode, intensity, this.currentWind);
            case 'foggy':
                return new FoggyEffect(this.ctx, this.width, this.height, mode, intensity, this.currentWind);
            case 'thunderstorm':
                return new ThunderstormEffect(this.ctx, this.width, this.height, mode, intensity, this.currentWind);
            default:
                return null;
        }
    }

    /**
     * Register a custom weather effect configuration
     * @param name Unique name for the weather effect
     * @param config Configuration object defining the elements and background
     */
    registerWeather(name: string, config: CustomWeatherConfig): void {
        this.customWeatherMap.set(name, config);
        // Pre-generate effects for this new type
        ['day', 'night'].forEach(mode => {
            ['light', 'moderate', 'heavy'].forEach(intensity => {
                const effect = new CustomEffect(
                    this.ctx,
                    this.width,
                    this.height,
                    config,
                    mode as TimeMode,
                    intensity as WeatherIntensity,
                    this.currentWind
                );
                const key = `${name}_${mode}_${intensity}`;
                this.effectMap.set(key, effect);
            });
        });
    }

    /**
     * Render specified weather, time mode and intensity
     */
    render(weatherType: WeatherType, mode: TimeMode, intensity: WeatherIntensity = WeatherIntensity.moderate): void {
        this.currentWeather = weatherType;
        this.currentMode = mode;
        this.currentIntensity = intensity;

        const key = `${weatherType}_${mode}_${intensity}`;
        let effect = this.effectMap.get(key);

        if (!effect) {
            const newEffect = this.createEffect(weatherType, mode, intensity);
            if (newEffect) {
                this.effectMap.set(key, newEffect);
                effect = newEffect;
            } else {
                // Fallback to sunny if type not found
                console.warn(`Weather type '${weatherType}' not found, falling back to sunny.`);
                const fallbackKey = `sunny_${mode}_${intensity}`;
                effect = this.effectMap.get(fallbackKey);
                if (!effect) {
                    effect = new SunnyEffect(this.ctx, this.width, this.height, mode, intensity, this.currentWind);
                    this.effectMap.set(fallbackKey, effect);
                }
            }
        }

        this.currentEffect = effect!;
        this.currentEffect.setWind(this.currentWind);
    }

    /**
     * Start animation loop
     */
    start(): void {
        if (this.animationId === null) {
            this.animate();
        }
    }

    /**
     * Stop animation loop
     */
    stop(): void {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Main animation loop
     */
    private animate = (timestamp = 0): void => {
        if (timestamp - this.lastFrameTime >= this.frameInterval) {
            this.update();
            this.draw();
            this.lastFrameTime = timestamp;
        }
        this.animationId = requestAnimationFrame(this.animate);
    };

    /**
     * Update animation state
     */
    private update(): void {
        if (this.currentEffect) {
            this.currentEffect.update();
        }
    }

    /**
     * Draw frame
     */
    private draw(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.currentEffect) {
            this.currentEffect.render(this.lastFrameTime);
        }
    }

    /**
     * Set Canvas size
     */
    setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;

        this.effectMap.clear();
        this.initializeEffects();

        // Re-apply current weather to generate currentEffect
        this.render(this.currentWeather, this.currentMode, this.currentIntensity);
    }

    /**
     * Change weather type
     */
    setWeatherType(weatherType: WeatherType): void {
        this.render(weatherType, this.currentMode, this.currentIntensity);
    }

    /**
     * Change time mode
     */
    setMode(mode: TimeMode): void {
        this.render(this.currentWeather, mode, this.currentIntensity);
    }

    /**
     * Change weather intensity
     */
    setIntensity(intensity: WeatherIntensity): void {
        this.render(this.currentWeather, this.currentMode, intensity);
    }

    /**
     * Change wind speed
     */
    setWind(wind: number): void {
        this.currentWind = wind;
        if (this.currentEffect) {
            this.currentEffect.setWind(wind);
        }
    }

    /**
     * Clear Canvas
     */
    clear(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Destroy instance
     */
    destroy(): void {
        this.stop();
        this.clear();
        this.effectMap.clear();
        this.currentEffect = null;
    }

    getWeatherType(): WeatherType {
        return this.currentWeather;
    }

    getMode(): TimeMode {
        return this.currentMode;
    }

    getIntensity(): WeatherIntensity {
        return this.currentIntensity;
    }

    getWind(): number {
        return this.currentWind;
    }

    getCanvas(): HTMLCanvasElement | OffscreenCanvas {
        return this.canvas;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }
}

export default WeatherCanvasRenderer;
