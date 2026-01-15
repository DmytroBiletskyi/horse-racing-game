import type { HorseId } from './horse';

export const RACE_STATUS = {
	IDLE: 'idle',
	READY: 'ready',
	RUNNING: 'running',
	PAUSED: 'paused',
	FINISHED: 'finished'
} as const;

export type RaceStatus = (typeof RACE_STATUS)[keyof typeof RACE_STATUS];

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
