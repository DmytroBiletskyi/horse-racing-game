import type { Module } from 'vuex';
import type { RaceState, RootState } from '@/modules/game/store/types';
import { createState } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export const raceModule: Module<RaceState, RootState> = {
	namespaced: true,
	state: createState,
	mutations,
	actions,
	getters
};

export { ACTIONS as RACE_ACTIONS, MUTATIONS as RACE_MUTATIONS } from './types';
