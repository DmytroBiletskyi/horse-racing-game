import { createStore, Store, useStore as baseUseStore } from 'vuex';
import type { InjectionKey } from 'vue';
import type { RootState } from './types';
import { horsesModule } from './modules/horses';
import { raceModule } from './modules/race';

export const key: InjectionKey<Store<RootState>> = Symbol('vuex-store');

export const store = createStore<RootState>({
	modules: {
		horses: horsesModule,
		race: raceModule
	},
	strict: import.meta.env.DEV
});

export function useStore(): Store<RootState> {
	return baseUseStore(key);
}

export * from './types';
export { HORSE_ACTIONS } from './modules/horses';
export { RACE_ACTIONS, RACE_MUTATIONS } from './modules/race';
