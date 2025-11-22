import { SunElement } from '../../src/elements/sun';
import { RenderingContext2D } from '../../src/types';

describe('SunElement', () => {
    let ctx: RenderingContext2D;
    let width: number;
    let height: number;
    let sunElement: SunElement;

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
        ctx.fill = jest.fn();

        sunElement = new SunElement(ctx, width, height);
    });

    it('should render sun', () => {
        sunElement.update(); // No-op
        sunElement.render();

        expect(ctx.createRadialGradient).toHaveBeenCalled();
        expect(ctx.fillRect).toHaveBeenCalled();
        expect(ctx.arc).toHaveBeenCalled();
        expect(ctx.fill).toHaveBeenCalled();
    });
});
