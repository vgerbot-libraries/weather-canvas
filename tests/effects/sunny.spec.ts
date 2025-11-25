import { SunnyEffect } from '~/effects/sunny';
import { RenderingContext2D, WeatherIntensity } from '~/types';

describe('SunnyEffect', () => {
    let ctx: RenderingContext2D;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;
        ctx.createRadialGradient = jest.fn().mockReturnValue({
            addColorStop: jest.fn(),
        });
        ctx.fillRect = jest.fn();
    });

    it('should render sun and sky', () => {
        const effect = new SunnyEffect(ctx, 800, 600, 'day', 'moderate');
        effect.render(0);

        expect(ctx.createRadialGradient).toHaveBeenCalled();
        expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
});
