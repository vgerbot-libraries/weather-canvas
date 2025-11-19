import { ParticlePool } from '~/utils/particles';

describe('ParticlePool', () => {
    it('should create a pool with an initial size', () => {
        const pool = new ParticlePool(50);
        expect(pool.getActive().length).toBe(0);
    });

    it('should get a particle from the pool', () => {
        const pool = new ParticlePool(1);
        const particle = pool.get(10, 20, 1, 2, 100);

        expect(particle.x).toBe(10);
        expect(particle.y).toBe(20);
        expect(particle.vx).toBe(1);
        expect(particle.vy).toBe(2);
        expect(particle.life).toBe(1);
        expect(particle.maxLife).toBe(100);
        expect(particle.opacity).toBe(1);
        expect(pool.getActive().length).toBe(1);
    });

    it('should create a new particle if the pool is empty', () => {
        const pool = new ParticlePool(0);
        const particle = pool.get(10, 20, 1, 2, 100);
        expect(particle).toBeDefined();
        expect(pool.getActive().length).toBe(1);
    });

    it('should update particles and remove dead ones', () => {
        const pool = new ParticlePool(1);
        const particle = pool.get(10, 20, 1, 2, 2); // life of 2 updates

        pool.update();
        expect(particle.life).toBe(0.5);
        expect(particle.x).toBe(11);
        expect(particle.y).toBe(22);
        expect(pool.getActive().length).toBe(1);

        pool.update();
        expect(pool.getActive().length).toBe(0);
    });

    it('should clear all active particles', () => {
        const pool = new ParticlePool(1);
        pool.get(10, 20, 1, 2, 100);
        pool.get(10, 20, 1, 2, 100);

        expect(pool.getActive().length).toBe(2);
        pool.clear();
        expect(pool.getActive().length).toBe(0);
    });

    it('should apply gravity to particles', () => {
        const pool = new ParticlePool(1);
        const particle = pool.get(10, 20, 1, 2, 100, 0.5); // gravity 0.5

        pool.update();
        expect(particle.vy).toBe(2.5); // 2 + 0.5
        expect(particle.y).toBe(22.5); // 20 + 2.5

        pool.update();
        expect(particle.vy).toBe(3.0); // 2.5 + 0.5
        expect(particle.y).toBe(25.5); // 22.5 + 3.0
    });
});
