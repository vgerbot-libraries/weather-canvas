import { WeatherCanvasRenderer } from '~/renderer';
import { WeatherIntensity } from '~/types';

jest.mock('~/effects/sunny', () => ({
    SunnyEffect: jest.fn().mockImplementation(() => ({
        setWind: jest.fn(),
        render: jest.fn(),
        update: jest.fn(),
    })),
}));

describe('WeatherCanvasRenderer', () => {
    let canvas: HTMLCanvasElement;
    let renderer: WeatherCanvasRenderer;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        renderer = new WeatherCanvasRenderer(canvas);
    });

    it('should initialize with default values', () => {
        expect(renderer['width']).toBe(canvas.width);
        expect(renderer['height']).toBe(canvas.height);
    });

    it('should start and stop animation frame', () => {
        const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(0);
        const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame');

        renderer.start();
        expect(requestAnimationFrameSpy).toHaveBeenCalled();

        renderer.stop();
        expect(cancelAnimationFrameSpy).toHaveBeenCalled();

        requestAnimationFrameSpy.mockRestore();
        cancelAnimationFrameSpy.mockRestore();
    });

    it('should set weather type, mode, and intensity', () => {
        renderer.render('sunny', 'day', WeatherIntensity.moderate);
        expect(renderer['currentWeather']).toBe('sunny');
        expect(renderer['currentMode']).toBe('day');
        expect(renderer['currentIntensity']).toBe(WeatherIntensity.moderate);
    });

    it('should set size', () => {
        renderer.setSize(1000, 800);
        expect(renderer['width']).toBe(1000);
        expect(renderer['height']).toBe(800);
    });

    it('should destroy the renderer', () => {
        const stopSpy = jest.spyOn(renderer, 'stop');
        renderer.destroy();
        expect(stopSpy).toHaveBeenCalled();
    });

    it('should get correct values', () => {
        renderer.render('cloudy', 'night', WeatherIntensity.heavy);
        expect(renderer.getWeatherType()).toBe('cloudy');
        expect(renderer.getMode()).toBe('night');
        expect(renderer.getIntensity()).toBe(WeatherIntensity.heavy);
        expect(renderer.getCanvas()).toBe(canvas);
        expect(renderer.getWidth()).toBe(canvas.width);
        expect(renderer.getHeight()).toBe(canvas.height);
    });

    it('should clear canvas', () => {
        const clearRectSpy = jest.spyOn(renderer['ctx'], 'clearRect');
        renderer.clear();
        expect(clearRectSpy).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });
});
