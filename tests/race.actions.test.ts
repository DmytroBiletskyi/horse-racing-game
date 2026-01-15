import { describe, it, beforeEach, jest, expect } from '@jest/globals';
import type { ActionContext } from 'vuex';

import { MUTATIONS } from '../src/modules/game/store/race/types';
import {
	ROUND_DISTANCES,
	TOTAL_ROUNDS,
	HORSES_PER_ROUND,
	SPEED_FACTOR_MIN,
	SPEED_FACTOR_MAX
} from '../src/domain/constants';

import type { RaceState, RootState } from '../src/modules/game/store/types';
import type { HorseId, HorseProgress } from '../src/domain/models';
import type { RoundResultRow } from '../src/domain/models';
import type {
	SetProgramPayload,
	SetHorseProgressPayload,
	AddResultPayload
} from '../src/modules/game/store/race/types';

await jest.unstable_mockModule('@/domain/utils', () => ({
	pickUnique: (arr: readonly unknown[], count: number) => (arr as unknown[]).slice(0, count),
	randomRange: () => 1.0
}));

const { generateProgram, startRace, finishRound, nextRound } = await import('../src/modules/game/store/race/actions');

function makeHorsePool(total: number) {
	return Array.from({ length: total }, (_, i) => ({
		id: `horse-${i + 1}`,
		name: `Horse ${i + 1}`,
		color: '#000',
		condition: 50
	}));
}

describe('race store actions', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.spyOn(globalThis.performance, 'now').mockReturnValue(1000);
	});

	it('generateProgram creates TOTAL_ROUNDS rounds and sets status ready', () => {
		const commit = jest.fn();
		const rootState = { horses: { pool: makeHorsePool(20) } };

		generateProgram({ commit, rootState } as ActionContext<RaceState, RootState>);

		expect(commit.mock.calls[0][0]).toBe(MUTATIONS.RESET_RACE);

		const setProgramCall = commit.mock.calls.find((c) => c[0] === MUTATIONS.SET_PROGRAM);
		expect(setProgramCall).toBeTruthy();

		const program = (setProgramCall![1] as SetProgramPayload).program;
		expect(program).toHaveLength(TOTAL_ROUNDS);

		for (let i = 0; i < TOTAL_ROUNDS; i++) {
			expect(program[i].round.index).toBe(i);
			expect(program[i].round.distance).toBe(ROUND_DISTANCES[i]);
			expect(program[i].participantIds).toHaveLength(HORSES_PER_ROUND);

			expect(program[i].participantIds[0]).toBe('horse-1');
		}

		expect(commit).toHaveBeenCalledWith(MUTATIONS.SET_STATUS, { status: 'ready' });
	});

	it('startRace initializes horseProgress, sets roundStartTime and status running', () => {
		const commit = jest.fn();
		const state = {
			program: [
				{
					round: { index: 0, distance: 1200 },
					participantIds: ['horse-1', 'horse-2', 'horse-3']
				}
			],
			currentRoundIndex: 0
		} as unknown as RaceState;

		startRace({ commit, state } as ActionContext<RaceState, RootState>);

		const setProgressCall = commit.mock.calls.find((c) => c[0] === MUTATIONS.SET_HORSE_PROGRESS);
		expect(setProgressCall).toBeTruthy();

		const progressMap: Map<HorseId, HorseProgress> = (setProgressCall![1] as SetHorseProgressPayload).progress;

		expect(progressMap.size).toBe(3);
		expect(progressMap.get('horse-1')).toMatchObject({ xPx: 0, finishedAtMs: null });

		expect(progressMap.get('horse-1')?.speedFactor).toBe(1.0);
		expect(1.0).toBeGreaterThanOrEqual(SPEED_FACTOR_MIN);
		expect(1.0).toBeLessThanOrEqual(SPEED_FACTOR_MAX);

		expect(commit).toHaveBeenCalledWith(MUTATIONS.SET_ROUND_START_TIME, { time: 1000 });
		expect(commit).toHaveBeenCalledWith(MUTATIONS.SET_STATUS, { status: 'running' });
	});

	it('finishRound produces sorted result rows by time', () => {
		const commit = jest.fn();
		const state = {
			currentRoundIndex: 0,
			program: [{ round: { index: 0, distance: 1200 }, participantIds: ['horse-1', 'horse-2', 'horse-3'] }],
			horseProgress: new Map([
				['horse-1', { horseId: 'horse-1', xPx: 40, finishedAtMs: 900, speedFactor: 1 }],
				['horse-2', { horseId: 'horse-2', xPx: 40, finishedAtMs: 850, speedFactor: 1 }],
				['horse-3', { horseId: 'horse-3', xPx: 10, finishedAtMs: null, speedFactor: 1 }]
			])
		} as unknown as RaceState;

		finishRound({ commit, state } as ActionContext<RaceState, RootState>);

		const addResultCall = commit.mock.calls.find((c) => c[0] === MUTATIONS.ADD_RESULT);
		expect(addResultCall).toBeTruthy();

		const result = (addResultCall![1] as AddResultPayload).result;
		expect(result.distance).toBe(1200);

		expect(result.rows.map((r: RoundResultRow) => r.horseId)).toEqual(['horse-2', 'horse-1', 'horse-3']);
		expect(result.rows[0].position).toBe(1);
	});

	it('nextRound increments round and re-initializes progress (or finishes)', () => {
		const commit = jest.fn();
		const state = {
			currentRoundIndex: 0,
			program: [
				{ round: { index: 0, distance: 1200 }, participantIds: ['horse-1'] },
				{ round: { index: 1, distance: 1400 }, participantIds: ['horse-2'] }
			]
		} as unknown as RaceState;

		nextRound({ commit, state } as ActionContext<RaceState, RootState>);

		expect(commit).toHaveBeenCalledWith(MUTATIONS.SET_CURRENT_ROUND, { roundIndex: 1 });
		expect(commit).toHaveBeenCalledWith(MUTATIONS.SET_STATUS, { status: 'running' });
	});
});
