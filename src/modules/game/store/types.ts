import type { Horse, HorseId, HorseProgress } from '@/domain/models/horse';
import type { RaceStatus, RoundProgram, RoundResult } from '@/domain/models/race';

export interface HorsesState {
	pool: Horse[];
}

export interface RaceState {
	status: RaceStatus;
	program: RoundProgram[];
	currentRoundIndex: number;
	results: RoundResult[];
	horseProgress: Map<HorseId, HorseProgress>;
	trackWidthPx: number;
	roundStartTime: number | null;
}

export interface RootState {
	horses: HorsesState;
	race: RaceState;
}
