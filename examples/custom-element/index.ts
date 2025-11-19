import '~/index';
import { TimeMode, WeatherCanvas, WeatherIntensity, WeatherType } from '~/index';

const canvas = document.getElementById('canvas') as WeatherCanvas;

document.getElementById('stop')?.addEventListener('click', () => {
    canvas.stop();
});

document.getElementById('start')?.addEventListener('click', () => {
    canvas.start();
});

document.getElementById('weather')?.addEventListener('change', event => {
    canvas.setAttribute('weather-type', (event.target as HTMLSelectElement).value as WeatherType);
});

document.getElementById('mode')?.addEventListener('change', event => {
    canvas.setAttribute('time-mode', (event.target as HTMLSelectElement).value as TimeMode);
});

document.getElementById('intensity')?.addEventListener('change', event => {
    canvas.setAttribute('intensity', (event.target as HTMLSelectElement).value as WeatherIntensity);
});

document.getElementById('wind')?.addEventListener('input', event => {
    const value = (event.target as HTMLInputElement).value;
    canvas.setAttribute('wind', value);
    const windValue = document.getElementById('wind-value');
    if (windValue) {
        windValue.textContent = value;
    }
});
