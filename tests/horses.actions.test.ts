import { describe, it, jest, expect } from '@jest/globals';
import type { ActionContext } from 'vuex';

import { MUTATIONS } from '../src/modules/game/store/horses/types';
import { TOTAL_HORSES, HORSE_NAMES, HORSE_COLORS } from '../src/domain/constants';
import type { HorsesState, RootState } from '../src/modules/game/store/types';
import type { SetPoolPayload } from '../src/modules/game/store/horses/types';

await jest.unstable_mockModule('@/domain/utils', () => ({
	shuffle: (arr: readonly unknown[]) => arr,
	randomInt: () => 42
}));

const { generatePool } = await import('../src/modules/game/store/horses/actions');

describe('horses store actions', () => {
	it('generatePool commits TOTAL_HORSES horses with deterministic values', () => {
		const commit = jest.fn();

		generatePool({ commit } as ActionContext<HorsesState, RootState>);

		const setPoolCall = commit.mock.calls.find((c) => c[0] === MUTATIONS.SET_POOL);
		expect(setPoolCall).toBeTruthy();

		const payload = setPoolCall![1] as SetPoolPayload;
		expect(payload.horses).toHaveLength(TOTAL_HORSES);

		expect(payload.horses[0]).toEqual({
			id: 'horse-1',
			name: HORSE_NAMES[0],
			color: HORSE_COLORS[0],
			condition: 42
		});
	});
});
