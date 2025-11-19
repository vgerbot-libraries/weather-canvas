import { WeatherCanvas } from '~/custom-element';
import { WeatherCanvasRenderer } from '~/renderer';

jest.mock('~/renderer', () => ({
    WeatherCanvasRenderer: jest.fn().mockImplementation(() => ({
        render: jest.fn(),
        start: jest.fn(),
        destroy: jest.fn(),
        setWeatherType: jest.fn(),
        setMode: jest.fn(),
        setIntensity: jest.fn(),
        setSize: jest.fn(),
        stop: jest.fn(),
        setWind: jest.fn(),
    })),
}));

describe('WeatherCanvas', () => {
    let element: WeatherCanvas;

    beforeEach(() => {
        element = new WeatherCanvas();
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('should create a canvas and renderer on connectedCallback', () => {
        expect(element.shadowRoot?.querySelector('canvas')).not.toBeNull();
        expect(WeatherCanvasRenderer).toHaveBeenCalled();
    });

    it('should destroy renderer on disconnectedCallback', () => {
        const renderer = element['renderer']!;
        element.disconnectedCallback();
        expect(renderer.destroy).toHaveBeenCalled();
    });

    it('should handle attribute changes', () => {
        const renderer = element['renderer']!;

        element.attributeChangedCallback('weather-type', '', 'cloudy');
        expect(renderer.setWeatherType).toHaveBeenCalledWith('cloudy');

        element.attributeChangedCallback('time-mode', '', 'night');
        expect(renderer.setMode).toHaveBeenCalledWith('night');

        element.attributeChangedCallback('intensity', '', 'heavy');
        expect(renderer.setIntensity).toHaveBeenCalledWith('heavy');

        element.attributeChangedCallback('width', '', '1000');
        expect(renderer.setSize).toHaveBeenCalledWith(1000, 400);

        element.attributeChangedCallback('height', '', '800');
        expect(renderer.setSize).toHaveBeenCalledWith(1000, 800);
    });

    it('should call renderer start and stop', () => {
        const renderer = element['renderer']!;
        element.start();
        expect(renderer.start).toHaveBeenCalled();
        element.stop();
        expect(renderer.stop).toHaveBeenCalled();
    });
});
