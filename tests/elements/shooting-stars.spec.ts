import { ShootingStarsElement } from '../../src/elements/shooting-stars';
import { RenderingContext2D, ShootingStarsConfig } from '../../src/types';

describe('ShootingStarsElement', () => {
    let ctx: RenderingContext2D;
    let width: number;
    let height: number;
    let config: ShootingStarsConfig;
    let starsElement: ShootingStarsElement;
    let nowSpy: jest.SpyInstance;
    let randomSpy: jest.SpyInstance;

    beforeEach(() => {
        width = 800;
        height = 600;
        config = {
            spawnInterval: { min: 100, max: 200 },
            life: { min: 50, max: 60 },
        };

        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;

        ctx.save = jest.fn();
        ctx.restore = jest.fn();
        ctx.createLinearGradient = jest.fn().mockReturnValue({
            addColorStop: jest.fn(),
        });
        ctx.beginPath = jest.fn();
        ctx.moveTo = jest.fn();
        ctx.lineTo = jest.fn();
        ctx.stroke = jest.fn();

        nowSpy = jest.spyOn(Date, 'now');
        randomSpy = jest.spyOn(Math, 'random');

        // Initialize with time T
        nowSpy.mockReturnValue(1000);
        // Mock random to return 0.5 -> mid range
        randomSpy.mockReturnValue(0.5);

        starsElement = new ShootingStarsElement(ctx, width, height, config);
    });

    afterEach(() => {
        nowSpy.mockRestore();
        randomSpy.mockRestore();
    });

    it('should spawn stars after interval', () => {
        // Initial update at T=1000. Last spawn is 0. Diff = 1000. Interval is 150 (mid of 100-200).
        // Should spawn one immediately.

        starsElement.update(0);

        const elementAny = starsElement as any;
        expect(elementAny.stars.length).toBe(1);

        // Advance time but less than interval
        // lastSpawnTime is now 1000. Next interval is 150 (random 0.5).
        // Time 1050. Diff 50 < 150.
        nowSpy.mockReturnValue(1050);
        starsElement.update(0);
        expect(elementAny.stars.length).toBe(1); // No new star

        // Advance time past interval
        // Time 1300. Diff 300 > 150.
        nowSpy.mockReturnValue(1300);
        starsElement.update(0);
        expect(elementAny.stars.length).toBe(2); // New star spawned
    });

    it('should update star positions and trails', () => {
        starsElement.update(0); // Spawn one
        const elementAny = starsElement as any;
        const star = elementAny.stars[0];
        const initialX = star.x;
        const initialY = star.y;

        starsElement.update(0); // Update position

        // With mocked random=0.5, it might move vertically only (angle PI/2)
        const moved = star.x !== initialX || star.y !== initialY;
        expect(moved).toBe(true);
        expect(star.trail.length).toBeGreaterThan(0);
    });

    it('should render trails', () => {
        starsElement.update(0); // Spawn
        starsElement.update(0); // Move and create trail

        starsElement.render();

        expect(ctx.createLinearGradient).toHaveBeenCalled();
        expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should remove dead stars', () => {
        starsElement.update(0); // Spawn
        const elementAny = starsElement as any;
        const star = elementAny.stars[0];

        // Force life to 0
        star.life = 0;

        starsElement.update(0);
        expect(elementAny.stars.length).toBe(0);
    });
});
