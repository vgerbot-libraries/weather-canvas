import { RainElement } from '../../src/elements/rain';
import { RenderingContext2D, RainConfig } from '../../src/types';

describe('RainElement', () => {
    let ctx: RenderingContext2D;
    let width: number;
    let height: number;
    let config: RainConfig;
    let rainElement: RainElement;

    beforeEach(() => {
        width = 800;
        height = 600;
        config = {
            count: 100,
            speed: 5,
            opacity: 0.5,
        };

        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;

        // Mock canvas methods
        ctx.createLinearGradient = jest.fn().mockReturnValue({
            addColorStop: jest.fn(),
        });
        ctx.fillRect = jest.fn();
        ctx.beginPath = jest.fn();
        ctx.moveTo = jest.fn();
        ctx.lineTo = jest.fn();
        ctx.stroke = jest.fn();
        ctx.fill = jest.fn();
        ctx.arc = jest.fn();

        rainElement = new RainElement(ctx, width, height, config);
    });

    it('should initialize rain drops', () => {
        // Force initialization by calling update or render
        rainElement.update();

        // We can't access private properties directly in TS easily without ignoring TS,
        // but we can verify behavior.
        // Or we can cast to any to inspect private state for unit testing purposes.
        const elementAny = rainElement as any;
        expect(elementAny.rainDrops.length).toBe(config.count);
        expect(elementAny.particlesInitialized).toBe(true);
    });

    it('should update rain drop positions', () => {
        rainElement.update();
        const elementAny = rainElement as any;
        const initialY = elementAny.rainDrops[0].y;

        rainElement.update();
        const newY = elementAny.rainDrops[0].y;

        // In the update loop: drop.y += drop.speed;
        // And speed is positive.
        // Note: if it reset (went off screen), this might fail, but with 100 drops and large screen,
        // checking one that is within bounds is safer.
        // However, we can't easily pick one guaranteed not to reset.
        // But speed is ~5-10, height is 600. One frame won't reset unless it started at the very bottom.

        // Let's just check that update runs without error and presumably changes state.
        expect(newY).not.toBe(initialY);
    });

    it('should render rain drops', () => {
        rainElement.render();
        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.moveTo).toHaveBeenCalled();
        expect(ctx.lineTo).toHaveBeenCalled();
        expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should handle wind', () => {
        rainElement.setWind(2);
        const elementAny = rainElement as any;
        expect(elementAny.currentWind).toBe(2);

        rainElement.update();
        // With wind, x should change.
        // drop.x += this.currentWind;
    });

    it('should reset on resize', () => {
        rainElement.update();
        const elementAny = rainElement as any;
        expect(elementAny.particlesInitialized).toBe(true);

        rainElement.resize(400, 300);
        expect(elementAny.particlesInitialized).toBe(false);
        expect(elementAny.rainDrops.length).toBe(0);

        rainElement.update();
        expect(elementAny.particlesInitialized).toBe(true);
        expect(elementAny.rainDrops.length).toBe(config.count);
    });
});
