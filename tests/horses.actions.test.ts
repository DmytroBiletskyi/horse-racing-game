import { describe, it, jest, expect } from '@jest/globals';
import { actions } from '../src/modules/game/store/horses/actions';
import { MUTATIONS, ACTIONS } from '../src/modules/game/store/horses/types';
import { TOTAL_HORSES, HORSE_NAMES, HORSE_COLORS } from '../src/domain/constants';
import type { ActionContext } from 'vuex';
import type { HorsesState, RootState } from '../src/modules/game/store/types';
import type { Horse } from '../src/domain/models';
import type { SetPoolPayload } from '../src/modules/game/store/horses/types';

jest.mock('@/domain/utils', () => ({
	shuffle: (arr: readonly unknown[]) => [...arr],
	randomInt: () => 42
}));

describe('horses store actions', () => {
	it('generatePool commits TOTAL_HORSES horses with deterministic values', () => {
		const commit = jest.fn();

		actions[ACTIONS.GENERATE_POOL]({ commit } as ActionContext<HorsesState, RootState>);

		expect(commit).toHaveBeenCalledTimes(1);
		const [mutation, payload] = commit.mock.calls[0];
		expect(mutation).toBe(MUTATIONS.SET_POOL);

		expect((payload as SetPoolPayload).horses).toHaveLength(TOTAL_HORSES);
		expect((payload as SetPoolPayload).horses[0]).toEqual({
			id: 'horse-1',
			name: HORSE_NAMES[0],
			color: HORSE_COLORS[0],
			condition: 42
		});
		const ids = (payload as SetPoolPayload).horses.map((h: Horse) => h.id);
		expect(new Set(ids).size).toBe(TOTAL_HORSES);
	});
});
