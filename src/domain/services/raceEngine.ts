import type { Ref } from 'vue';
import type { Store } from 'vuex';
import type { RootState } from '@/store/types';
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

export class RaceEngine {
	private store: Store<RootState>;
	private trackWidthRef: Ref<number>;
	private rafId: number | null = null;
	private isAnimating = false;

	constructor(options: RaceEngineOptions) {
		this.store = options.store;
		this.trackWidthRef = options.trackWidthRef;
	}

	private get finishLineX(): number {
		return this.trackWidthRef.value - TRACK_PADDING_PX;
	}

	private getConditionMultiplier(condition: number): number {
		const normalized = (condition - 1) / 99;
		return CONDITION_SPEED_MIN + normalized * (CONDITION_SPEED_MAX - CONDITION_SPEED_MIN);
	}

	private calculateSpeed(progress: HorseProgress, horse: { condition: number }): number {
		const conditionMultiplier = this.getConditionMultiplier(horse.condition);
		const jitter = randomRange(-JITTER_RANGE, JITTER_RANGE);
		return BASE_SPEED_PX_PER_FRAME * conditionMultiplier * progress.speedFactor + jitter;
	}

	start(): void {
		if (this.isAnimating) {
			return;
		}
		this.isAnimating = true;
		this.animate();
	}

	pause(): void {
		this.isAnimating = false;
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
	}

	resume(): void {
		if (this.isAnimating) {
			return;
		}
		this.isAnimating = true;
		this.animate();
	}

	stop(): void {
		this.pause();
	}

	private animate = (): void => {
		if (!this.isAnimating) {
			return;
		}

		const raceState = this.store.state.race;
		if (raceState.status !== 'running') {
			this.rafId = requestAnimationFrame(this.animate);
			return;
		}

		const horseMap: Record<HorseId, Horse> = {};
		this.store.state.horses.pool.forEach((h: Horse) => {
			horseMap[h.id] = h;
		});

		let allFinished = true;
		const finishX = this.finishLineX;
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

			const speed = this.calculateSpeed(progress, horse);
			const newX = clamp(progress.xPx + speed, 0, finishX);

			if (newX >= finishX && progress.finishedAtMs === null) {
				this.store.commit(`race/${RACE_MUTATIONS.UPDATE_HORSE_POSITION}`, {
					horseId,
					xPx: finishX,
					finishedAtMs: currentTime - roundStartTime
				});
			} else {
				this.store.commit(`race/${RACE_MUTATIONS.UPDATE_HORSE_POSITION}`, {
					horseId,
					xPx: newX
				});
				allFinished = false;
			}
		});

		if (allFinished) {
			this.handleRoundEnd();
			return;
		}

		this.rafId = requestAnimationFrame(this.animate);
	};

	private handleRoundEnd(): void {
		this.isAnimating = false;

		this.store.dispatch(`race/${RACE_ACTIONS.FINISH_ROUND}`);

		setTimeout(() => {
			const raceState = this.store.state.race;
			if (raceState.currentRoundIndex < raceState.program.length - 1) {
				this.store.dispatch(`race/${RACE_ACTIONS.NEXT_ROUND}`);
				this.start();
			} else {
				this.store.commit(`race/${RACE_MUTATIONS.SET_STATUS}`, { status: 'finished' });
			}
		}, ROUND_END_DELAY_MS);
	}
}

export function useRaceEngine(store: Store<RootState>, trackWidthRef: Ref<number>): RaceEngine {
	const engine = new RaceEngine({ store, trackWidthRef });
	return engine;
}
