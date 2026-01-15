import type { Module } from 'vuex';
import type { RaceState, RootState } from '@/modules/game/store/types';
import { createState } from './state';
import { mutations } from './mutations';
import type { ActionTree } from 'vuex';
import * as actionFns from './actions';
import { getters } from './getters';
import { ACTIONS } from './types';

const actions: ActionTree<RaceState, RootState> = {
	[ACTIONS.GENERATE_PROGRAM]: actionFns.generateProgram,
	[ACTIONS.START_RACE]: actionFns.startRace,
	[ACTIONS.PAUSE_RACE]: actionFns.pauseRace,
	[ACTIONS.RESUME_RACE]: actionFns.resumeRace,
	[ACTIONS.FINISH_ROUND]: actionFns.finishRound,
	[ACTIONS.NEXT_ROUND]: actionFns.nextRound
};

export const raceModule: Module<RaceState, RootState> = {
	namespaced: true,
	state: createState,
	mutations,
	actions,
	getters
};

export { ACTIONS as RACE_ACTIONS, MUTATIONS as RACE_MUTATIONS } from './types';
