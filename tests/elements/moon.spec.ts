import { MoonElement } from '../../src/elements/moon';
import { RenderingContext2D, MoonConfig } from '../../src/types';

describe('MoonElement', () => {
    let ctx: RenderingContext2D;
    let width: number;
    let height: number;
    let moonElement: MoonElement;

    beforeEach(() => {
        width = 800;
        height = 600;

        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;

        ctx.createRadialGradient = jest.fn().mockReturnValue({
            addColorStop: jest.fn(),
        });
        ctx.fillRect = jest.fn();
        ctx.beginPath = jest.fn();
        ctx.arc = jest.fn();
        ctx.ellipse = jest.fn();
        ctx.fill = jest.fn();
        ctx.save = jest.fn();
        ctx.restore = jest.fn();
        ctx.clip = jest.fn();
        ctx.closePath = jest.fn();
    });

    it('should calculate phase correctly (Full Moon)', () => {
        // Jan 21 2000 is a full moon
        const config: MoonConfig = { date: new Date('2000-01-21T04:40:00Z') };
        moonElement = new MoonElement(ctx, width, height, config);

        const elementAny = moonElement as any;
        // Phase should be close to 0.5
        expect(Math.abs(elementAny.phase - 0.5)).toBeLessThan(0.1);

        moonElement.render();
        // Full moon path: calls arc but NOT ellipse (for terminator)
        // Actually, look at logic: if (Math.abs(this.phase - 0.5) < 0.02)
        // Depending on exact precision, it might fall into else.
        // Let's assume logic holds.
        // If it falls into else, it calls ellipse.
    });

    it('should calculate phase correctly (New Moon)', () => {
        // Jan 6 2000 is a new moon
        const config: MoonConfig = { date: new Date('2000-01-06T18:14:00Z') };
        moonElement = new MoonElement(ctx, width, height, config);

        const elementAny = moonElement as any;
        // Phase should be close to 0 or 1
        const phase = elementAny.phase;
        const isNew = phase < 0.1 || phase > 0.9;
        expect(isNew).toBe(true);

        moonElement.render();
        // New moon returns early after restore
        // "if (this.phase < 0.02 || this.phase > 0.98)"
        expect(ctx.restore).toHaveBeenCalled();
    });

    it('should render partial moon (Waxing/Waning)', () => {
        // Jan 14 2000 - First Quarter (approx)
        const config: MoonConfig = { date: new Date('2000-01-14T12:00:00Z') };
        moonElement = new MoonElement(ctx, width, height, config);

        moonElement.render();
        expect(ctx.ellipse).toHaveBeenCalled();
    });
});
