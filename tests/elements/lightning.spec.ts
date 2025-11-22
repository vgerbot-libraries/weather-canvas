import { LightningElement } from '../../src/elements/lightning';
import { RenderingContext2D } from '../../src/types';

describe('LightningElement', () => {
    let ctx: RenderingContext2D;
    let width: number;
    let height: number;
    let lightningElement: LightningElement;
    let randomSpy: jest.SpyInstance;

    beforeEach(() => {
        width = 800;
        height = 600;

        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;

        ctx.fillRect = jest.fn();
        ctx.beginPath = jest.fn();
        ctx.moveTo = jest.fn();
        ctx.lineTo = jest.fn();
        ctx.stroke = jest.fn();

        // Spy on Math.random
        randomSpy = jest.spyOn(Math, 'random');

        lightningElement = new LightningElement(ctx, width, height);
    });

    afterEach(() => {
        randomSpy.mockRestore();
    });

    it('should trigger flash on low random value', () => {
        // Force random to return < 0.01
        randomSpy.mockReturnValue(0.005);

        lightningElement.update();

        const elementAny = lightningElement as any;
        // set to 1, then immediately decayed by 0.05 -> 0.95
        expect(elementAny.lightningFlash).toBeCloseTo(0.95);
    });

    it('should decay flash over time', () => {
        randomSpy.mockReturnValue(0.005);
        lightningElement.update(); // flash -> 0.95

        // Next update, random > 0.01
        randomSpy.mockReturnValue(0.5);

        lightningElement.update();
        const elementAny = lightningElement as any;
        // 0.95 - 0.05 = 0.90
        expect(elementAny.lightningFlash).toBeCloseTo(0.9);
    });

    it('should render flash overlay and bolt when active', () => {
        randomSpy.mockReturnValue(0.005);
        lightningElement.update(); // flash = 1

        lightningElement.render();

        expect(ctx.fillRect).toHaveBeenCalled(); // Overlay
        expect(ctx.stroke).toHaveBeenCalled(); // Bolt
    });

    it('should not render when inactive', () => {
        randomSpy.mockReturnValue(0.5); // No flash
        lightningElement.update();

        lightningElement.render();

        expect(ctx.fillRect).not.toHaveBeenCalled();
        expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should reset on resize', () => {
        randomSpy.mockReturnValue(0.005);
        lightningElement.update(); // flash = 1 -> 0.95
        const elementAny = lightningElement as any;
        expect(elementAny.lightningFlash).toBeCloseTo(0.95);

        lightningElement.resize(400, 300);
        expect(elementAny.lightningFlash).toBe(0);
    });
});
