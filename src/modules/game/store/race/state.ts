import type { RaceState } from '@/modules/game/store/types';

export function createState(): RaceState {
	return {
		status: 'idle',
		program: [],
		currentRoundIndex: 0,
		results: [],
		horseProgress: new Map(),
		trackWidthPx: 0,
		roundStartTime: null
	};
}
