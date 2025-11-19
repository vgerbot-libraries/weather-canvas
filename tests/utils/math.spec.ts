import { randomBetween, clamp, easeInOutQuad, easeInOutCubic } from '~/utils/math';

describe('math', () => {
    it('should get random value between min and max', () => {
        const random = randomBetween(1, 10);
        expect(random > 1).toBeTruthy();
        expect(random < 10).toBeTruthy();
    });

    it('should clamp value', () => {
        expect(clamp(1, 2, 3)).toBe(2);
        expect(clamp(4, 2, 3)).toBe(3);
        expect(clamp(2.5, 2, 3)).toBe(2.5);
    });

    it('should get correct ease in out quad value', () => {
        expect(easeInOutQuad(0)).toBe(0);
        expect(easeInOutQuad(0.3)).toBe(0.18);
        expect(easeInOutQuad(0.6)).toBeCloseTo(0.68);
        expect(easeInOutQuad(1)).toBe(1);
    });

    it('should get correct ease in out cubic value', () => {
        expect(easeInOutCubic(0)).toBe(0);
        expect(easeInOutCubic(0.3)).toBe(0.108);
        expect(easeInOutCubic(0.6)).toBeCloseTo(0.744);
        expect(easeInOutCubic(1)).toBe(1);
    });
});
