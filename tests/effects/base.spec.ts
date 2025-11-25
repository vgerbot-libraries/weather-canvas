import { WeatherEffect } from '~/effects/base';
import { RenderingContext2D, WeatherIntensity } from '~/types';

class MockWeatherEffect extends WeatherEffect {
    render(): void {
        // no-op
    }

    public testGetParticleCount(baseCount: number): number {
        return this.getParticleCount(baseCount);
    }

    public testGetSpeed(baseSpeed: number): number {
        return this.getSpeed(baseSpeed);
    }

    public testGetOpacity(baseOpacity: number): number {
        return this.getOpacity(baseOpacity);
    }
}

describe('WeatherEffect', () => {
    let ctx: RenderingContext2D;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;
    });

    it('should initialize properties in constructor', () => {
        const effect = new MockWeatherEffect(ctx, 100, 200, 'light');
        // @ts-expect-error protected property
        expect(effect.ctx).toBe(ctx);
        // @ts-expect-error protected property
        expect(effect.width).toBe(100);
        // @ts-expect-error protected property
        expect(effect.height).toBe(200);
        // @ts-expect-error protected property
        expect(effect.intensity).toBe('light');
    });

    it('should update time', () => {
        const effect = new MockWeatherEffect(ctx, 100, 200);
        // @ts-expect-error protected property
        expect(effect.time).toBe(0);
        effect.update();
        // @ts-expect-error protected property
        expect(effect.time).toBe(1);
    });

    it('should get particle count based on intensity', () => {
        const lightEffect = new MockWeatherEffect(ctx, 100, 200, 'light');
        expect(lightEffect.testGetParticleCount(100)).toBe(50);

        const moderateEffect = new MockWeatherEffect(ctx, 100, 200, 'moderate');
        expect(moderateEffect.testGetParticleCount(100)).toBe(100);

        const heavyEffect = new MockWeatherEffect(ctx, 100, 200, 'heavy');
        expect(heavyEffect.testGetParticleCount(100)).toBe(180);
    });

    it('should get speed based on intensity', () => {
        const lightEffect = new MockWeatherEffect(ctx, 100, 200, 'light');
        expect(lightEffect.testGetSpeed(10)).toBe(6);

        const moderateEffect = new MockWeatherEffect(ctx, 100, 200, 'moderate');
        expect(moderateEffect.testGetSpeed(10)).toBe(10);

        const heavyEffect = new MockWeatherEffect(ctx, 100, 200, 'heavy');
        expect(heavyEffect.testGetSpeed(10)).toBe(14);
    });

    it('should get opacity based on intensity', () => {
        const lightEffect = new MockWeatherEffect(ctx, 100, 200, 'light');
        expect(lightEffect.testGetOpacity(1)).toBe(0.6);

        const moderateEffect = new MockWeatherEffect(ctx, 100, 200, 'moderate');
        expect(moderateEffect.testGetOpacity(1)).toBe(0.8);

        const heavyEffect = new MockWeatherEffect(ctx, 100, 200, 'heavy');
        expect(heavyEffect.testGetOpacity(1)).toBe(1);
    });
});
