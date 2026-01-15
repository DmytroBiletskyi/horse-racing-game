import type { Ref } from 'vue';
import type { Store } from 'vuex';
import type { RootState } from '@/modules/game/store/types';
import type { Horse, HorseId, HorseProgress } from '@/domain/models';
import {
	BASE_SPEED_PX_PER_FRAME,
	JITTER_RANGE,
	CONDITION_SPEED_MIN,
	CONDITION_SPEED_MAX,
	ROUND_END_DELAY_MS,
	TRACK_PADDING_PX
} from '@/domain/constants';
import { randomRange, clamp } from '@/domain/utils';
import { RACE_MUTATIONS, RACE_ACTIONS } from '@/store';

export interface RaceEngineOptions {
	store: Store<RootState>;
	trackWidthRef: Ref<number>;
}

export type RaceEngineService = {
	start(): void;
	pause(): void;
	resume(): void;
	stop(): void;
};

export const createRaceEngineService = (options: RaceEngineOptions): RaceEngineService => {
	const store = options.store;
	const trackWidthRef = options.trackWidthRef;

	let rafId: number | null = null;
	let isAnimating = false;

	let isPaused = false;

	let nextRoundTimeoutId: number | null = null;
	let isRoundEnding = false;

	const getFinishLineX = (): number => trackWidthRef.value - TRACK_PADDING_PX;

	const getConditionMultiplier = (condition: number): number => {
		const normalized = (condition - 1) / 99;
		return CONDITION_SPEED_MIN + normalized * (CONDITION_SPEED_MAX - CONDITION_SPEED_MIN);
	};

	const calculateSpeed = (progress: HorseProgress, horse: { condition: number }): number => {
		const conditionMultiplier = getConditionMultiplier(horse.condition);
		const jitter = randomRange(-JITTER_RANGE, JITTER_RANGE);
		return BASE_SPEED_PX_PER_FRAME * conditionMultiplier * progress.speedFactor + jitter;
	};

	const advanceAfterRoundEnd = (): void => {
		nextRoundTimeoutId = null;

		const raceState = store.state.race;

		if (raceState.status === 'paused') {
			return;
		}

		isRoundEnding = false;

		if (raceState.currentRoundIndex < raceState.program.length - 1) {
			store.dispatch(`race/${RACE_ACTIONS.NEXT_ROUND}`);

			const currentState = store.state.race;
			if (currentState.status === 'running' && !isPaused) {
				start();
			}
		} else {
			store.commit(`race/${RACE_MUTATIONS.SET_STATUS}`, { status: 'finished' });
		}
	};

	const scheduleAdvanceAfterRoundEnd = (delayMs: number): void => {
		if (nextRoundTimeoutId !== null) {
			return;
		}

		nextRoundTimeoutId = window.setTimeout(() => {
			advanceAfterRoundEnd();
		}, delayMs);
	};

	const pause = (): void => {
		isPaused = true;
		isAnimating = false;

		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};

	const handleRoundEnd = (): void => {
		if (isRoundEnding) {
			return;
		}

		isRoundEnding = true;
		isAnimating = false;

		store.dispatch(`race/${RACE_ACTIONS.FINISH_ROUND}`);

		scheduleAdvanceAfterRoundEnd(ROUND_END_DELAY_MS);
	};

	const animate = (): void => {
		if (!isAnimating) {
			return;
		}

		if (isPaused) {
			return;
		}

		const raceState = store.state.race;

		if (raceState.status !== 'running') {
			rafId = requestAnimationFrame(animate);
			return;
		}

		if (isRoundEnding) {
			rafId = requestAnimationFrame(animate);
			return;
		}

		const horseMap: Record<HorseId, Horse> = {};
		store.state.horses.pool.forEach((h: Horse) => {
			horseMap[h.id] = h;
		});

		let allFinished = true;
		const finishX = getFinishLineX();
		const currentTime = performance.now();
		const roundStartTime = raceState.roundStartTime ?? currentTime;

		raceState.horseProgress.forEach((progress: HorseProgress, horseId: HorseId) => {
			if (progress.finishedAtMs !== null) {
				return;
			}

			const horse = horseMap[horseId];
			if (!horse) {
				return;
			}

			const speed = calculateSpeed(progress, horse);
			const newX = clamp(progress.xPx + speed, 0, finishX);

			if (newX >= finishX) {
				store.commit(`race/${RACE_MUTATIONS.UPDATE_HORSE_POSITION}`, {
					horseId,
					xPx: finishX,
					finishedAtMs: currentTime - roundStartTime
				});
			} else {
				store.commit(`race/${RACE_MUTATIONS.UPDATE_HORSE_POSITION}`, {
					horseId,
					xPx: newX
				});
				allFinished = false;
			}
		});

		if (allFinished) {
			handleRoundEnd();
			return;
		}

		rafId = requestAnimationFrame(animate);
	};

	const start = (): void => {
		isPaused = false;

		if (isAnimating) {
			return;
		}

		isAnimating = true;
		isRoundEnding = false;
		animate();
	};

	const resume = (): void => {
		isPaused = false;

		if (isAnimating) {
			return;
		}

		isAnimating = true;

		if (isRoundEnding && nextRoundTimeoutId === null) {
			scheduleAdvanceAfterRoundEnd(0);
		}

		animate();
	};

	const stop = (): void => {
		isPaused = false;
		isRoundEnding = false;

		if (nextRoundTimeoutId !== null) {
			clearTimeout(nextRoundTimeoutId);
			nextRoundTimeoutId = null;
		}

		isAnimating = false;

		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};

	return {
		start,
		pause,
		resume,
		stop
	};
};

export function useRaceEngine(store: Store<RootState>, trackWidthRef: Ref<number>): RaceEngineService {
	return createRaceEngineService({ store, trackWidthRef });
}
