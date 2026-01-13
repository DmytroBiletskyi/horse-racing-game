import type { MutationTree } from 'vuex';
import type { HorsesState } from '@/store/types';
import { MUTATIONS, type SetPoolPayload } from './types';

export const mutations: MutationTree<HorsesState> = {
	[MUTATIONS.SET_POOL](state: HorsesState, payload: SetPoolPayload) {
		state.pool = payload.horses;
	}
};
