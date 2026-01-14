import type { HorsesState } from '@/modules/game/store/types';

export function createState(): HorsesState {
	return {
		pool: []
	};
}
