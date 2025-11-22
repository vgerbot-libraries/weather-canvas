import { SnowElement } from '../../src/elements/snow';
import { RenderingContext2D, SnowConfig } from '../../src/types';

describe('SnowElement', () => {
    let ctx: RenderingContext2D;
    let width: number;
    let height: number;
    let config: SnowConfig;
    let snowElement: SnowElement;

    beforeEach(() => {
        width = 800;
        height = 600;
        config = {
            count: 2,
            speed: 1,
            opacity: 0.8,
        };

        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;

        ctx.save = jest.fn();
        ctx.restore = jest.fn();
        ctx.translate = jest.fn();
        ctx.rotate = jest.fn();
        ctx.beginPath = jest.fn();
        ctx.moveTo = jest.fn();
        ctx.lineTo = jest.fn();
        ctx.stroke = jest.fn();
        ctx.fill = jest.fn(); // Not used in SnowElement based on code, but good to have

        snowElement = new SnowElement(ctx, width, height, config);
    });

    it('should initialize particle pool', () => {
        const elementAny = snowElement as any;
        expect(elementAny.particlePool).toBeDefined();
        // Check internal pool size via any cast
        expect(elementAny.particlePool.pool.length).toBe(2);
    });

    it('should emit particles on update', () => {
        snowElement.update();

        const elementAny = snowElement as any;
        const activeParticles = elementAny.particlePool.getActive();

        // It attempts to emit 'count' particles per frame.
        // Pool size is 'count' (2).
        expect(activeParticles.length).toBeGreaterThan(0);
    });

    it('should render snowflakes', () => {
        snowElement.update(); // create some particles
        snowElement.render();

        expect(ctx.save).toHaveBeenCalled();
        expect(ctx.translate).toHaveBeenCalled();
        expect(ctx.rotate).toHaveBeenCalled();
        expect(ctx.stroke).toHaveBeenCalled();
        expect(ctx.restore).toHaveBeenCalled();
    });

    it('should handle wind', () => {
        snowElement.update(); // create particles
        snowElement.setWind(3);

        const elementAny = snowElement as any;
        expect(elementAny.currentWind).toBe(3);

        // Verify particles vx matches wind roughly
        const activeParticles = elementAny.particlePool.getActive();
        activeParticles.forEach((p: any) => {
            // vx = wind + randomBetween(-1, 1)
            expect(p.vx).toBeGreaterThanOrEqual(2);
            expect(p.vx).toBeLessThanOrEqual(4);
        });
    });

    it('should reset on resize', () => {
        snowElement.update();
        const elementAny = snowElement as any;
        expect(elementAny.particlePool.getActive().length).toBeGreaterThan(0);

        snowElement.resize(400, 300);
        expect(elementAny.particlePool.getActive().length).toBe(0);
    });
});
