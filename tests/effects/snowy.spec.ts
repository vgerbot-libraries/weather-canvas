import { SnowyEffect } from '~/effects/snowy';
import { RenderingContext2D, WeatherIntensity } from '~/types';

describe('SnowyEffect', () => {
    let ctx: RenderingContext2D;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;
        ctx.createLinearGradient = jest.fn().mockReturnValue({
            addColorStop: jest.fn(),
        });
        ctx.fillRect = jest.fn();
        ctx.beginPath = jest.fn();
        ctx.arc = jest.fn();
        ctx.fill = jest.fn();
    });

    it('should render snow particles', () => {
        const effect = new SnowyEffect(ctx, 800, 600, 'day', WeatherIntensity.moderate);
        effect.render(0);

        expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
});
