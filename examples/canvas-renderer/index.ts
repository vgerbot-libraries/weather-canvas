import { TimeMode, WeatherCanvasRenderer, WeatherIntensity, WeatherType } from '~/index';

const renderer = new WeatherCanvasRenderer(document.getElementById('canvas') as HTMLCanvasElement);

renderer.render('sunny', 'day', 'light');

renderer.start();

document.getElementById('start')?.addEventListener('click', () => {
    renderer.start();
});

document.getElementById('stop')?.addEventListener('click', () => {
    renderer.stop();
});

document.getElementById('weather')?.addEventListener('change', event => {
    renderer.setWeatherType((event.target as HTMLSelectElement).value as unknown as WeatherType);
});

document.getElementById('mode')?.addEventListener('change', event => {
    renderer.setMode((event.target as HTMLSelectElement).value as unknown as TimeMode);
});

document.getElementById('intensity')?.addEventListener('change', event => {
    renderer.setIntensity((event.target as HTMLSelectElement).value as unknown as WeatherIntensity);
});

document.getElementById('wind')?.addEventListener('input', event => {
    const value = parseFloat((event.target as HTMLInputElement).value);
    renderer.setWind(value);
    const windValue = document.getElementById('wind-value');
    if (windValue) {
        windValue.textContent = value.toString();
    }
});
