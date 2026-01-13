import type { Module } from 'vuex';
import type { HorsesState, RootState } from '@/store/types';
import { createState } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export const horsesModule: Module<HorsesState, RootState> = {
	namespaced: true,
	state: createState,
	mutations,
	actions,
	getters
};

export { ACTIONS as HORSE_ACTIONS } from './types';
