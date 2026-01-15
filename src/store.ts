import { createStore, Store, useStore as baseUseStore } from 'vuex';
import type { InjectionKey } from 'vue';
import type { RootState } from '@/modules/game/store/types';
import { horsesModule } from '@/modules/game/store/horses';
import { raceModule } from '@/modules/game/store/race';
import { isDev } from '@/env';

export const key: InjectionKey<Store<RootState>> = Symbol('vuex-store');

export const store = createStore<RootState>({
	modules: {
		horses: horsesModule,
		race: raceModule
	},
	strict: isDev()
});

export function useStore(): Store<RootState> {
	return baseUseStore(key);
}

export * from '@/modules/game/store/types';
export { HORSE_ACTIONS } from '@/modules/game/store/horses';
export { RACE_ACTIONS, RACE_MUTATIONS } from '@/modules/game/store/race';
