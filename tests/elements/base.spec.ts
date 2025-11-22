import { BaseElement } from '../../src/elements/base';
import { RenderingContext2D } from '../../src/types';

class TestElement extends BaseElement {
    update(): void {}
    render(): void {}
}

describe('BaseElement', () => {
    let ctx: RenderingContext2D;
    let testElement: TestElement;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') as RenderingContext2D;
        testElement = new TestElement(ctx, 800, 600);
    });

    it('should initialize with dimensions', () => {
        const elementAny = testElement as any;
        expect(elementAny.width).toBe(800);
        expect(elementAny.height).toBe(600);
    });

    it('should update dimensions on resize', () => {
        testElement.resize(400, 300);

        const elementAny = testElement as any;
        expect(elementAny.width).toBe(400);
        expect(elementAny.height).toBe(300);
    });
});
