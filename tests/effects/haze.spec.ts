import { HazeEffect } from '~/effects/haze';
import { RenderingContext2D, WeatherIntensity } from '~/types';

describe('HazeEffect', () => {
    let ctx: RenderingContext2D;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;
        ctx.createLinearGradient = jest.fn().mockReturnValue({
            addColorStop: jest.fn(),
        });
        ctx.fillRect = jest.fn();
    });

    it('should render haze', () => {
        const effect = new HazeEffect(ctx, 800, 600, 'day', 'moderate');
        effect.render(0);

        expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
});
