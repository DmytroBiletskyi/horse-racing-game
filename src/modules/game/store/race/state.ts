import type { RaceState } from '@/modules/game/store/types';
import { RACE_STATUS } from '@/domain/models/race';

export function createState(): RaceState {
	return {
		status: RACE_STATUS.IDLE,
		program: [],
		currentRoundIndex: 0,
		results: [],
		horseProgress: new Map(),
		trackWidthPx: 0,
		roundStartTime: null
	};
}
