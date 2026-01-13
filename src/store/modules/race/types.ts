import type { HorseId, HorseProgress } from '@/domain/models/horse';
import type { RaceStatus, RoundProgram, RoundResult } from '@/domain/models/race';

export const MUTATIONS = {
	SET_STATUS: 'SET_STATUS',
	SET_PROGRAM: 'SET_PROGRAM',
	SET_CURRENT_ROUND: 'SET_CURRENT_ROUND',
	ADD_RESULT: 'ADD_RESULT',
	RESET_RESULTS: 'RESET_RESULTS',
	SET_HORSE_PROGRESS: 'SET_HORSE_PROGRESS',
	UPDATE_HORSE_POSITION: 'UPDATE_HORSE_POSITION',
	SET_TRACK_WIDTH: 'SET_TRACK_WIDTH',
	SET_ROUND_START_TIME: 'SET_ROUND_START_TIME',
	RESET_RACE: 'RESET_RACE'
} as const;

export const ACTIONS = {
	GENERATE_PROGRAM: 'generateProgram',
	START_RACE: 'startRace',
	PAUSE_RACE: 'pauseRace',
	RESUME_RACE: 'resumeRace',
	FINISH_ROUND: 'finishRound',
	NEXT_ROUND: 'nextRound'
} as const;

export interface SetStatusPayload {
	status: RaceStatus;
}

export interface SetProgramPayload {
	program: RoundProgram[];
}

export interface SetCurrentRoundPayload {
	roundIndex: number;
}

export interface AddResultPayload {
	result: RoundResult;
}

export interface SetHorseProgressPayload {
	progress: Map<HorseId, HorseProgress>;
}

export interface UpdateHorsePositionPayload {
	horseId: HorseId;
	xPx: number;
	finishedAtMs?: number;
}

export interface SetTrackWidthPayload {
	width: number;
}

export interface SetRoundStartTimePayload {
	time: number | null;
}
