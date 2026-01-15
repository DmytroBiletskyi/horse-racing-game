import type { Module } from 'vuex';
import type { HorsesState, RootState } from '@/modules/game/store/types';
import { createState } from './state';
import { mutations } from './mutations';
import * as actionFns from './actions';
import { getters } from './getters';
import { ACTIONS } from './types';
import type { ActionTree } from 'vuex';

const actions: ActionTree<HorsesState, RootState> = {
	[ACTIONS.GENERATE_POOL]: actionFns.generatePool
};

export const horsesModule: Module<HorsesState, RootState> = {
	namespaced: true,
	state: createState,
	mutations,
	actions,
	getters
};

export { ACTIONS as HORSE_ACTIONS } from './types';
