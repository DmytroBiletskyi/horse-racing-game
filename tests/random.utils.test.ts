import { describe, it, afterEach, jest, expect } from '@jest/globals';
import { clamp, pickUnique, randomInt, randomRange, shuffle, generateId } from '../src/domain/utils/random';

describe('domain/utils/random', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('randomInt returns integer in inclusive range', () => {
		jest.spyOn(Math, 'random').mockReturnValue(0);
		expect(randomInt(5, 10)).toBe(5);

		jest.spyOn(Math, 'random').mockReturnValue(0.999999);
		expect(randomInt(5, 10)).toBe(10);
	});

	it('randomRange returns number in [min, max)', () => {
		jest.spyOn(Math, 'random').mockReturnValue(0);
		expect(randomRange(2, 4)).toBe(2);

		jest.spyOn(Math, 'random').mockReturnValue(0.5);
		expect(randomRange(2, 4)).toBe(3);
	});

	it('clamp limits a value to bounds', () => {
		expect(clamp(10, 0, 5)).toBe(5);
		expect(clamp(-1, 0, 5)).toBe(0);
		expect(clamp(3, 0, 5)).toBe(3);
	});

	it('shuffle returns a new array with same elements', () => {
		const rnd = jest.spyOn(Math, 'random');
		rnd.mockReturnValueOnce(0.0);
		rnd.mockReturnValueOnce(0.0);

		const input = [1, 2, 3, 4] as const;
		const out = shuffle(input);
		expect(out).not.toBe(input);
		expect(out.sort()).toEqual([1, 2, 3, 4]);
	});

	it('pickUnique returns requested count and throws when impossible', () => {
		jest.spyOn(Math, 'random').mockReturnValue(0.1);
		const input = ['a', 'b', 'c', 'd'] as const;
		const out = pickUnique(input, 2);
		expect(out).toHaveLength(2);
		expect(new Set(out).size).toBe(2);

		expect(() => pickUnique(input, 99)).toThrow(/Cannot pick 99 unique elements/);
	});

	it('generateId uses Date.now and Math.random', () => {
		jest.spyOn(Date, 'now').mockReturnValue(1234567890);
		jest.spyOn(Math, 'random').mockReturnValue(0.123456);

		const id = generateId();
		expect(id.startsWith('1234567890-')).toBe(true);
	});
});
