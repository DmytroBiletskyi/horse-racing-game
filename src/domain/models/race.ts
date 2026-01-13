import type { HorseId } from './horse';

export type RaceStatus = 'idle' | 'ready' | 'running' | 'paused' | 'finished';

export interface RoundSpec {
	index: number;
	distance: number;
}

export interface RoundProgram {
	round: RoundSpec;
	participantIds: HorseId[];
}

export interface RoundResultRow {
	position: number;
	horseId: HorseId;
	timeMs: number;
}

export interface RoundResult {
	roundIndex: number;
	distance: number;
	rows: RoundResultRow[];
}
