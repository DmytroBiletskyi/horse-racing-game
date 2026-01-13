import type { HorsesState } from '@/store/types';

export function createState(): HorsesState {
	return {
		pool: []
	};
}
