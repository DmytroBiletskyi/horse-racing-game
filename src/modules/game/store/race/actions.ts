import type { ActionContext } from 'vuex';
import type { RaceState, RootState } from '@/modules/game/store/types';
import type { Horse, HorseId, HorseProgress, RoundProgram, RoundResult, RoundResultRow } from '@/domain/models';
import {
	ROUND_DISTANCES,
	TOTAL_ROUNDS,
	HORSES_PER_ROUND,
	SPEED_FACTOR_MIN,
	SPEED_FACTOR_MAX
} from '@/domain/constants';
import { pickUnique, randomRange } from '@/domain/utils';
import { MUTATIONS } from './types';
import { RACE_STATUS } from '@/domain/models/race';

export type RaceActionContext = ActionContext<RaceState, RootState>;

const generateProgram = ({ commit, rootState }: RaceActionContext) => {
	commit(MUTATIONS.RESET_RACE);

	const pool = rootState.horses.pool;
	if (pool.length < HORSES_PER_ROUND) {
		console.warn(`Not enough horses in pool (${pool.length}). Need at least ${HORSES_PER_ROUND}.`);
		return;
	}

	const program: RoundProgram[] = [];
	const allIds: HorseId[] = pool.map((h: Horse) => h.id);

	for (let i = 0; i < TOTAL_ROUNDS; i++) {
		const participantIds = pickUnique(allIds, Math.min(HORSES_PER_ROUND, allIds.length));

		program.push({
			round: {
				index: i,
				distance: ROUND_DISTANCES[i]
			},
			participantIds
		});
	}

	commit(MUTATIONS.SET_PROGRAM, { program });
	commit(MUTATIONS.SET_STATUS, { status: RACE_STATUS.READY });
};

const startRace = ({ commit, state }: RaceActionContext) => {
	if (state.program.length === 0) {
		return;
	}

	const currentRound = state.program[state.currentRoundIndex];
	if (!currentRound) {
		return;
	}

	const progress = new Map<HorseId, HorseProgress>();
	currentRound.participantIds.forEach((id: HorseId) => {
		progress.set(id, {
			horseId: id,
			xPx: 0,
			finishedAtMs: null,
			speedFactor: randomRange(SPEED_FACTOR_MIN, SPEED_FACTOR_MAX)
		});
	});

	commit(MUTATIONS.SET_HORSE_PROGRESS, { progress });
	commit(MUTATIONS.SET_ROUND_START_TIME, { time: performance.now() });
	commit(MUTATIONS.SET_STATUS, { status: RACE_STATUS.RUNNING });
};

const pauseRace = ({ commit }: RaceActionContext) => {
	commit(MUTATIONS.SET_STATUS, { status: RACE_STATUS.PAUSED });
};

const resumeRace = ({ commit }: RaceActionContext) => {
	commit(MUTATIONS.SET_STATUS, { status: RACE_STATUS.RUNNING });
};

const finishRound = ({ commit, state }: RaceActionContext) => {
	const currentRound = state.program[state.currentRoundIndex];
	if (!currentRound) {
		return;
	}

	const finishers: { horseId: HorseId; timeMs: number; xPx: number }[] = [];
	state.horseProgress.forEach((progress: HorseProgress, horseId: HorseId) => {
		finishers.push({
			horseId,
			timeMs: progress.finishedAtMs ?? Infinity,
			xPx: progress.xPx
		});
	});

	finishers.sort((a, b) => {
		if (a.timeMs !== b.timeMs) {
			return a.timeMs - b.timeMs;
		}
		return b.xPx - a.xPx;
	});

	const rows: RoundResultRow[] = finishers.map((f, idx) => ({
		position: idx + 1,
		horseId: f.horseId,
		timeMs: f.timeMs === Infinity ? 0 : f.timeMs
	}));

	const result: RoundResult = {
		roundIndex: state.currentRoundIndex,
		distance: currentRound.round.distance,
		rows
	};

	commit(MUTATIONS.ADD_RESULT, { result });
};

const nextRound = ({ commit, state }: RaceActionContext) => {
	const nextIndex = state.currentRoundIndex + 1;

	if (nextIndex >= state.program.length) {
		commit(MUTATIONS.SET_STATUS, { status: RACE_STATUS.FINISHED });
		return;
	}

	commit(MUTATIONS.SET_CURRENT_ROUND, { roundIndex: nextIndex });

	const nextRound = state.program[nextIndex];
	const progress = new Map<HorseId, HorseProgress>();
	nextRound.participantIds.forEach((id: HorseId) => {
		progress.set(id, {
			horseId: id,
			xPx: 0,
			finishedAtMs: null,
			speedFactor: randomRange(SPEED_FACTOR_MIN, SPEED_FACTOR_MAX)
		});
	});

	commit(MUTATIONS.SET_HORSE_PROGRESS, { progress });
	commit(MUTATIONS.SET_ROUND_START_TIME, { time: performance.now() });
	commit(MUTATIONS.SET_STATUS, { status: RACE_STATUS.RUNNING });
};

export { generateProgram, startRace, pauseRace, resumeRace, finishRound, nextRound };
