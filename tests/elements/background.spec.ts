import { BackgroundElement, BackgroundConfig } from '../../src/elements/background';
import { RenderingContext2D } from '../../src/types';

describe('BackgroundElement', () => {
    let ctx: RenderingContext2D;
    let width: number;
    let height: number;
    let config: BackgroundConfig;
    let backgroundElement: BackgroundElement;

    beforeEach(() => {
        width = 800;
        height = 600;
        config = {
            topColor: '#000000',
            bottomColor: '#ffffff',
        };

        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;

        ctx.createLinearGradient = jest.fn().mockReturnValue({
            addColorStop: jest.fn(),
        });
        ctx.fillRect = jest.fn();

        backgroundElement = new BackgroundElement(ctx, width, height, config);
    });

    it('should render background gradient', () => {
        backgroundElement.render();

        expect(ctx.createLinearGradient).toHaveBeenCalledWith(0, 0, 0, height);
        expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, width, height);
    });

    it('should update config', () => {
        const newConfig = { topColor: '#111', bottomColor: '#222' };
        backgroundElement.setConfig(newConfig);

        const elementAny = backgroundElement as any;
        expect(elementAny.config).toEqual(newConfig);

        backgroundElement.render();
        // We can check addColorStop calls if we want, but checking state update is enough for setConfig
    });
});
