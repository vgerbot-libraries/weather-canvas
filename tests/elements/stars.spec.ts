import { StarsElement } from '../../src/elements/stars';
import { RenderingContext2D } from '../../src/types';

describe('StarsElement', () => {
    let ctx: RenderingContext2D;
    let width: number;
    let height: number;
    let starsElement: StarsElement;

    beforeEach(() => {
        width = 800;
        height = 600;

        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;

        ctx.beginPath = jest.fn();
        ctx.arc = jest.fn();
        ctx.fill = jest.fn();

        starsElement = new StarsElement(ctx, width, height, { count: 10 });
    });

    it('should initialize stars', () => {
        starsElement.update();
        const elementAny = starsElement as any;
        expect(elementAny.stars.length).toBe(10);
        expect(elementAny.starsInitialized).toBe(true);
    });

    it('should render stars with twinkling', () => {
        starsElement.render();
        expect(ctx.arc).toHaveBeenCalledTimes(10);
        expect(ctx.fill).toHaveBeenCalledTimes(10);

        const elementAny = starsElement as any;
        const initialPhase = elementAny.stars[0].phase;

        starsElement.render(); // Render also updates phase
        const newPhase = elementAny.stars[0].phase;

        expect(newPhase).not.toBe(initialPhase);
    });

    it('should reset on resize', () => {
        starsElement.update();
        const elementAny = starsElement as any;
        expect(elementAny.starsInitialized).toBe(true);

        starsElement.resize(400, 300);
        expect(elementAny.starsInitialized).toBe(false);
        expect(elementAny.stars.length).toBe(0);
    });
});
