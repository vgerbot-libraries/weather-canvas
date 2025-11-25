import { OvercastEffect } from '~/effects/overcast';
import { RenderingContext2D, WeatherIntensity } from '~/types';

describe('OvercastEffect', () => {
    let ctx: RenderingContext2D;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;
        ctx.createLinearGradient = jest.fn().mockReturnValue({
            addColorStop: jest.fn(),
        });
        ctx.fillRect = jest.fn();
        ctx.beginPath = jest.fn();
        ctx.moveTo = jest.fn();
        ctx.lineTo = jest.fn();
        ctx.closePath = jest.fn();
        ctx.fill = jest.fn();
    });

    it('should render overcast sky', () => {
        const effect = new OvercastEffect(ctx, 800, 600, 'day', 'moderate');
        effect.render(0);

        expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
        expect(ctx.fill).toHaveBeenCalled();
    });
});
