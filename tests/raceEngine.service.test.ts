import { describe, it, afterEach, jest, expect } from '@jest/globals';

import type { Ref } from 'vue';
import type { RootState } from '../src/modules/game/store/types';
import { createRaceEngineService } from '../src/domain/services/raceEngine';
import { RACE_MUTATIONS, RACE_ACTIONS } from '../src/store';
import { ROUND_END_DELAY_MS, TRACK_PADDING_PX } from '../src/domain/constants';
import type { SetStatusPayload, UpdateHorsePositionPayload } from '../src/modules/game/store/race/types';
import type { RaceState } from '../src/modules/game/store/types';
import type { Store } from 'vuex';

Object.defineProperty(globalThis, 'import', {
	value: {
		meta: {
			env: {
				DEV: false
			}
		}
	}
});

jest.mock('@/domain/utils', () => ({
	randomRange: () => 0,
	clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
}));

describe('raceEngine service', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.spyOn(globalThis.performance, 'now').mockReturnValue(2000);
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it('finishes the last round and sets status to finished', () => {
		(globalThis as unknown as Window).requestAnimationFrame = (cb: FrameRequestCallback) => {
			cb(0);
			return 1;
		};
		(globalThis as unknown as Window).cancelAnimationFrame = () => {};

		const commit = jest.fn();
		const dispatch = jest.fn();

		const trackWidthRef: Ref<number> = { value: 100 } as Ref<number>;
		const finishX = trackWidthRef.value - TRACK_PADDING_PX;

		const state: RootState = {
			horses: {
				pool: [{ id: 'horse-1', name: 'H1', color: '#000', condition: 100 }]
			},
			race: {
				status: 'running',
				program: [{ round: { index: 0, distance: 1200 }, participantIds: ['horse-1'] }],
				currentRoundIndex: 0,
				results: [],
				horseProgress: new Map([
					['horse-1', { horseId: 'horse-1', xPx: finishX - 1, finishedAtMs: null, speedFactor: 1 }]
				]),
				trackWidthPx: trackWidthRef.value,
				roundStartTime: 1000
			}
		};

		const store = {
			state,
			commit: (type: string, payload: SetStatusPayload | UpdateHorsePositionPayload) => {
				commit(type, payload);
				if (type === `race/${RACE_MUTATIONS.SET_STATUS}`) {
					(state.race as RaceState).status = (payload as SetStatusPayload).status;
				}
				if (type === `race/${RACE_MUTATIONS.UPDATE_HORSE_POSITION}`) {
					const p = state.race.horseProgress.get((payload as UpdateHorsePositionPayload).horseId);
					if (p) {
						p.xPx = (payload as UpdateHorsePositionPayload).xPx;
						if ((payload as UpdateHorsePositionPayload).finishedAtMs !== undefined) {
							p.finishedAtMs = (payload as UpdateHorsePositionPayload).finishedAtMs;
						}
					}
				}
			},
			dispatch
		} as Store<RootState>;

		const engine = createRaceEngineService({ store, trackWidthRef });
		engine.start();

		expect(commit).toHaveBeenCalledWith(`race/${RACE_MUTATIONS.UPDATE_HORSE_POSITION}`, {
			horseId: 'horse-1',
			xPx: finishX,
			finishedAtMs: 1000
		});

		expect(dispatch).toHaveBeenCalledWith(`race/${RACE_ACTIONS.FINISH_ROUND}`);

		jest.advanceTimersByTime(ROUND_END_DELAY_MS);
		expect(commit).toHaveBeenCalledWith(`race/${RACE_MUTATIONS.SET_STATUS}`, { status: 'finished' });
	});
});
