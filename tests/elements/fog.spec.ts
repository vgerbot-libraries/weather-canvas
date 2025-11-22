import { FogElement } from '../../src/elements/fog';
import { RenderingContext2D, FogConfig } from '../../src/types';

describe('FogElement', () => {
    let ctx: RenderingContext2D;
    let width: number;
    let height: number;
    let config: FogConfig;
    let fogElement: FogElement;

    beforeEach(() => {
        width = 800;
        height = 600;
        config = {
            count: 5,
            color: '200, 200, 200',
        };

        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;

        ctx.createRadialGradient = jest.fn().mockReturnValue({
            addColorStop: jest.fn(),
        });
        ctx.beginPath = jest.fn();
        ctx.arc = jest.fn();
        ctx.fill = jest.fn();

        fogElement = new FogElement(ctx, width, height, config);
    });

    it('should initialize fog particles', () => {
        fogElement.update();
        const elementAny = fogElement as any;
        expect(elementAny.particles.length).toBe(5);
        expect(elementAny.particlesInitialized).toBe(true);
    });

    it('should update particle positions', () => {
        fogElement.update();
        const elementAny = fogElement as any;
        const initialX = elementAny.particles[0].x;

        fogElement.update();
        const newX = elementAny.particles[0].x;

        expect(newX).not.toBe(initialX);
    });

    it('should render fog particles', () => {
        fogElement.render();
        expect(ctx.createRadialGradient).toHaveBeenCalledTimes(5);
        expect(ctx.arc).toHaveBeenCalledTimes(5);
        expect(ctx.fill).toHaveBeenCalledTimes(5);
    });

    it('should handle wind', () => {
        fogElement.setWind(2);
        const elementAny = fogElement as any;
        expect(elementAny.currentWind).toBe(2);

        fogElement.update();
        // x += speed + wind. Speed is 0.2-0.7. Wind is 2.
        // Should move significantly.
    });

    it('should reset on resize', () => {
        fogElement.update();
        const elementAny = fogElement as any;
        expect(elementAny.particlesInitialized).toBe(true);

        fogElement.resize(400, 300);
        expect(elementAny.particlesInitialized).toBe(false);
        expect(elementAny.particles.length).toBe(0);
    });
});
