import type { GetterTree } from 'vuex';
import type { HorsesState, RootState } from '@/modules/game/store/types';
import type { Horse, HorseId } from '@/domain/models';

export const getters: GetterTree<HorsesState, RootState> = {
	allHorses(state: HorsesState): Horse[] {
		return state.pool;
	},

	horseCount(state: HorsesState): number {
		return state.pool.length;
	},

	getHorseById:
		(state: HorsesState) =>
		(id: HorseId): Horse | undefined => {
			return state.pool.find((h: Horse) => h.id === id);
		},

	horseMap(state: HorsesState): Map<HorseId, Horse> {
		return new Map(state.pool.map((h: Horse) => [h.id, h]));
	}
};
