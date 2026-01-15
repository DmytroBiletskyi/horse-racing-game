import type { GetterTree } from 'vuex';
import type { RaceState, RootState } from '@/modules/game/store/types';
import type { RoundProgram, RoundResult, HorseProgress, RaceStatus, HorseId } from '@/domain/models';
import { RACE_STATUS } from '@/domain/models/race';

export const getters: GetterTree<RaceState, RootState> = {
	raceStatus(state: RaceState): RaceStatus {
		return state.status;
	},

	program(state: RaceState): RoundProgram[] {
		return state.program;
	},

	currentRoundIndex(state: RaceState): number {
		return state.currentRoundIndex;
	},

	currentRound(state: RaceState): RoundProgram | null {
		return state.program[state.currentRoundIndex] ?? null;
	},

	results(state: RaceState): RoundResult[] {
		return state.results;
	},

	horseProgress(state: RaceState): Map<HorseId, HorseProgress> {
		return state.horseProgress;
	},

	trackWidth(state: RaceState): number {
		return state.trackWidthPx;
	},

	isRunning(state: RaceState): boolean {
		return state.status === RACE_STATUS.RUNNING;
	},

	isPaused(state: RaceState): boolean {
		return state.status === RACE_STATUS.PAUSED;
	},

	isReady(state: RaceState): boolean {
		return state.status === RACE_STATUS.READY;
	},

	isFinished(state: RaceState): boolean {
		return state.status === RACE_STATUS.FINISHED;
	},

	canStart(state: RaceState): boolean {
		return state.status === RACE_STATUS.READY || state.status === RACE_STATUS.PAUSED;
	},

	roundStartTime(state: RaceState): number | null {
		return state.roundStartTime;
	}
};
