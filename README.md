# @vgerbot/weather-canvas

A lightweight, high-performance HTML5 Canvas library for rendering dynamic weather effects. Supports various weather conditions, day/night cycles, and adjustable intensities.

## Previews

![sunny day mode](https://raw.githubusercontent.com/vgerbot-libraries/weather-canvas/refs/heads/master/readme-assets/sunny.png)

![sunny night mode](https://raw.githubusercontent.com/vgerbot-libraries/weather-canvas/refs/heads/master/readme-assets/sunny-night.png)

![haze day mode](https://raw.githubusercontent.com/vgerbot-libraries/weather-canvas/refs/heads/master/readme-assets/haze.png)

## Features

- **Multiple Weather Types**: Sunny, Cloudy, Overcast, Rainy, Snowy, Haze, Foggy, Thunderstorm.
- **Day & Night Modes**: Automatic lighting adjustments for different times of day.
- **Adjustable Intensity**: Control the severity of weather (Light, Moderate, Heavy).
- **Dynamic Wind**: Adjustable wind speed affecting rain and snow direction.
- **Web Component Support**: Drop-in `<weather-canvas>` element for easy integration.
- **High Performance**: Optimized HTML5 Canvas rendering with requestAnimationFrame.
- **TypeScript Support**: Fully typed for better development experience.
- **Zero Dependencies**: (Runtime) Lightweight and standalone.

## Installation

Install via npm:

```bash
npm install @vgerbot/weather-canvas
```

or yarn:

```bash
yarn add @vgerbot/weather-canvas
```

or pnpm:

```bash
pnpm add @vgerbot/weather-canvas
```

### CDN

You can also use the library directly via CDN:

```html
<script src="https://unpkg.com/@vgerbot/weather-canvas"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/@vgerbot/weather-canvas"></script>
```

## Usage

### 1. As a Web Component (Recommended)

The easiest way to use Weather Canvas is as a custom element.

First, import the library to register the custom element:

```typescript
import '@vgerbot/weather-canvas';
```

Then use it in your HTML:

```html
<weather-canvas
    width="800"
    height="400"
    weather-type="rainy"
    time-mode="night"
    intensity="moderate"
    wind="2"
></weather-canvas>
```

#### Attributes

| Attribute      | Type     | Default    | Description                                                                 |
| :------------- | :------- | :--------- | :-------------------------------------------------------------------------- |
| `weather-type` | String   | `sunny`    | `sunny`, `cloudy`, `overcast`, `rainy`, `snowy`, `haze`, `foggy`, `thunderstorm` |
| `time-mode`    | String   | `day`      | `day`, `night`                                                              |
| `intensity`    | String   | `moderate` | `light`, `moderate`, `heavy`                                                |
| `width`        | Number   | `700`      | Canvas width in pixels                                                      |
| `height`       | Number   | `400`      | Canvas height in pixels                                                     |
| `wind`         | Number   | `0`        | Wind speed (negative for left, positive for right)                          |

#### Methods

- `start()`: Start the animation.
- `stop()`: Stop the animation.
- `registerCustomWeather(name: string, config: CustomWeatherConfig)`: Register a new custom weather type.

### 2. Programmatic Usage (Vanilla JS / TypeScript)

For more control, you can use the `WeatherCanvasRenderer` directly.

```typescript
import { WeatherCanvasRenderer, WeatherIntensity } from '@vgerbot/weather-canvas';

// 1. Get your canvas element
const canvas = document.getElementById('my-canvas');

// 2. Initialize the renderer
const renderer = new WeatherCanvasRenderer(canvas);

// 3. Configure and Start
// render(weatherType, timeMode, intensity)
renderer.render('rainy', 'night', 'heavy');
renderer.start();

// ... later ...

// Update settings dynamically
renderer.setWeatherType('sunny');
renderer.setMode('day');
renderer.setWind(5.0); // Strong wind to the right

// Stop animation
// renderer.stop();
```

## Custom Weather Types

You can register your own custom weather types with specific configurations for background colors and weather elements.

### 1. Using Web Component

```javascript
const weatherCanvas = document.querySelector('weather-canvas');

weatherCanvas.registerCustomWeather('mars-storm', {
    background: {
        day: ['#ff4d4d', '#b30000'],   // Reddish sky
        night: ['#4d0000', '#1a0000']
    },
    elements: [
        {
            type: 'fog',
            options: {
                count: 20,
                color: '255, 100, 100' // Reddish fog
            }
        },
        {
            type: 'snow', // Using snow particles to simulate dust
            options: {
                count: 200,
                speed: 1.5,
                opacity: 0.8
            }
        }
    ]
});

// Use the new weather type
weatherCanvas.setAttribute('weather-type', 'mars-storm');
```

### 2. Using Renderer

```typescript
renderer.registerWeather('mars-storm', {
    background: {
        day: ['#ff4d4d', '#b30000'],
        night: ['#4d0000', '#1a0000']
    },
    elements: [
        {
            type: 'stars',
            options: { count: 100 },
            modes: ['night'] // Only show stars at night
        },
        {
            type: 'cloud',
            options: {
                count: 5,
                widthRange: [100, 200],
                heightRange: [60, 100],
                speedRange: [0.5, 1],
                opacityRange: [0.4, 0.8],
                yRange: [0, 0.5]
            }
        }
    ]
});

renderer.setWeatherType('mars-storm');
```

### Configuration Object (`CustomWeatherConfig`)

```typescript
interface CustomWeatherConfig {
    background: {
        day: [string, string];   // Gradient colors [top, bottom]
        night: [string, string];
    };
    elements: Array<{
        type: 'sun' | 'moon' | 'stars' | 'shooting-stars' | 'cloud' | 'rain' | 'snow' | 'fog' | 'lightning' | 'background';
        options?: MoonConfig | StarsConfig | ShootingStarsConfig | CloudConfig | RainConfig | SnowConfig | FogConfig | lightningConfig | BackgroundConfig; // Specific options for each element
        modes?: ('day' | 'night')[]; // Optional: restrict to specific time modes
    }>;
}
```

## API Reference

### `WeatherCanvasRenderer`

#### Methods

- `constructor(canvas: HTMLCanvasElement)`: Creates a new renderer instance.
- `render(weather: WeatherType, mode: TimeMode, intensity: WeatherIntensity)`: Sets up the initial weather state.
- `start()`: Starts the animation loop.
- `stop()`: Stops the animation loop.
- `resize(width: number, height: number)`: Resizes the internal canvas dimensions.
- `setWeatherType(type: WeatherType)`: Changes the weather type dynamically.
- `setMode(mode: TimeMode)`: Changes between 'day' and 'night'.
- `setIntensity(intensity: WeatherIntensity)`: Changes weather intensity.
- `setWind(speed: number)`: Sets wind speed and direction.
- `registerWeather(name: string, config: CustomWeatherConfig)`: Registers a custom weather configuration.

### Types

#### `WeatherType`

`'sunny' | 'cloudy' | 'overcast' | 'rainy' | 'snowy' | 'haze' | 'foggy' | 'thunderstorm'`

#### `TimeMode`

`'day' | 'night'`

#### `WeatherIntensity`

`'light' | 'moderate' | 'heavy'`

## Development

1. Clone the repository:

    ```bash
    git clone https://github.com/vgerbot-libraries/weather-canvas.git
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Run the development server (with examples):

    ```bash
    pnpm dev
    ```

## License

MIT © [ChienHsinYang](https://github.com/y1j2x34)
