import { ThunderstormEffect } from '~/effects/thunderstorm';
import { RenderingContext2D, WeatherIntensity } from '~/types';

describe('ThunderstormEffect', () => {
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
        ctx.stroke = jest.fn();
    });

    it('should render thunderstorm', () => {
        const effect = new ThunderstormEffect(ctx, 800, 600, 'day', WeatherIntensity.moderate);
        effect.render(0);

        expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
        expect(ctx.stroke).toHaveBeenCalled();
    });
});
