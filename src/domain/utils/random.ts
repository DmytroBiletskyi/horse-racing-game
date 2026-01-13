export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomRange(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export function shuffle<T>(array: readonly T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export function pickUnique<T>(array: readonly T[], count: number): T[] {
	if (count > array.length) {
		throw new Error(`Cannot pick ${count} unique elements from array of length ${array.length}`);
	}
	const shuffled = shuffle(array);
	return shuffled.slice(0, count);
}

export function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
