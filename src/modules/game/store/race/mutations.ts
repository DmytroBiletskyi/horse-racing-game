import type { MutationTree } from 'vuex';
import type { RaceState } from '@/modules/game/store/types';
import {
	MUTATIONS,
	type SetStatusPayload,
	type SetProgramPayload,
	type SetCurrentRoundPayload,
	type AddResultPayload,
	type SetHorseProgressPayload,
	type UpdateHorsePositionPayload,
	type SetTrackWidthPayload,
	type SetRoundStartTimePayload
} from './types';
import { RACE_STATUS } from '@/domain/models/race';

export const mutations: MutationTree<RaceState> = {
	[MUTATIONS.SET_STATUS](state: RaceState, payload: SetStatusPayload) {
		state.status = payload.status;
	},

	[MUTATIONS.SET_PROGRAM](state: RaceState, payload: SetProgramPayload) {
		state.program = payload.program;
	},

	[MUTATIONS.SET_CURRENT_ROUND](state: RaceState, payload: SetCurrentRoundPayload) {
		state.currentRoundIndex = payload.roundIndex;
	},

	[MUTATIONS.ADD_RESULT](state: RaceState, payload: AddResultPayload) {
		state.results.push(payload.result);
	},

	[MUTATIONS.RESET_RESULTS](state: RaceState) {
		state.results = [];
	},

	[MUTATIONS.SET_HORSE_PROGRESS](state: RaceState, payload: SetHorseProgressPayload) {
		state.horseProgress = payload.progress;
	},

	[MUTATIONS.UPDATE_HORSE_POSITION](state: RaceState, payload: UpdateHorsePositionPayload) {
		const progress = state.horseProgress.get(payload.horseId);
		if (progress) {
			progress.xPx = payload.xPx;
			if (payload.finishedAtMs !== undefined) {
				progress.finishedAtMs = payload.finishedAtMs;
			}
		}
	},

	[MUTATIONS.SET_TRACK_WIDTH](state: RaceState, payload: SetTrackWidthPayload) {
		state.trackWidthPx = payload.width;
	},

	[MUTATIONS.SET_ROUND_START_TIME](state: RaceState, payload: SetRoundStartTimePayload) {
		state.roundStartTime = payload.time;
	},

	[MUTATIONS.RESET_RACE](state: RaceState) {
		state.status = RACE_STATUS.IDLE;
		state.program = [];
		state.currentRoundIndex = 0;
		state.results = [];
		state.horseProgress = new Map();
		state.roundStartTime = null;
	}
};
