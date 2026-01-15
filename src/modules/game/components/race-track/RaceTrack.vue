<script setup lang="ts">
	import { computed, onMounted, onUnmounted, ref } from 'vue';
	import { useStore } from '@/store';
	import type { Horse, HorseId, HorseProgress } from '@/domain/models';
	import { HORSES_PER_ROUND } from '@/domain/constants';
	import TrackLane from './TrackLane.vue';

	const emit = defineEmits<{
		(e: 'track-resize', width: number): void;
	}>();

	const store = useStore();
	const trackRef = ref<HTMLElement | null>(null);

	const currentRound = computed(() => store.state.race.program[store.state.race.currentRoundIndex]);
	const horseProgress = computed(() => store.state.race.horseProgress);

	const horseMap = computed<Map<HorseId, Horse>>(() => {
		return new Map(store.state.horses.pool.map((h: Horse) => [h.id, h]));
	});

	const roundLabel = computed(() => {
		if (!currentRound.value) {
			return 'No Race';
		}
		const ordinal = getOrdinal(currentRound.value.round.index + 1);
		return `${ordinal} Lap - ${currentRound.value.round.distance}m`;
	});

	interface LaneData {
		id: string;
		horse: Horse | undefined;
		progress: HorseProgress | undefined;
		laneNumber: number;
	}

	const participants = computed<LaneData[]>(() => {
		if (!currentRound.value) {
			return [];
		}
		return currentRound.value.participantIds
			.map((id: HorseId, index: number): LaneData => {
				const horse = horseMap.value.get(id);
				const progress = horseProgress.value.get(id);
				return {
					id,
					horse,
					progress,
					laneNumber: index + 1
				};
			})
			.filter((p: LaneData) => p.horse);
	});

	const lanes = computed<LaneData[]>(() => {
		const result: LaneData[] = [...participants.value];
		while (result.length < HORSES_PER_ROUND) {
			result.push({
				id: `empty-${result.length}`,
				horse: undefined,
				progress: undefined,
				laneNumber: result.length + 1
			});
		}
		return result;
	});

	function getOrdinal(n: number): string {
		const suffixes = ['th', 'st', 'nd', 'rd'];
		const v = n % 100;
		return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
	}

	let resizeObserver: ResizeObserver | null = null;

	onMounted(() => {
		if (trackRef.value) {
			resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					emit('track-resize', entry.contentRect.width);
				}
			});
			resizeObserver.observe(trackRef.value);
			emit('track-resize', trackRef.value.offsetWidth);
		}
	});

	onUnmounted(() => {
		resizeObserver?.disconnect();
	});
</script>

<template>
	<section class="race-track-panel">
		<div ref="trackRef" class="track-container">
			<div class="track">
				<div v-for="lane in lanes" :key="lane.id" class="lane-wrapper">
					<div class="lane-number">{{ lane.laneNumber }}</div>
					<TrackLane
						:horse="lane.horse"
						:progress="lane.progress"
						:lane-number="lane.laneNumber"
						:is-active="!!lane.horse"
					/>
				</div>
			</div>
			<div class="finish-line-wrapper">
				<div class="finish-line" />
				<div class="finish-label">FINISH</div>
			</div>
			<div class="round-label">
				{{ roundLabel }}
			</div>
		</div>
	</section>
</template>

<style scoped>
	.race-track-panel {
		background: var(--bg-track);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.track-container {
		flex: 1;
		position: relative;
		padding: var(--space-md);
		padding-right: calc(var(--space-md) + 60px);
	}

	.track {
		display: flex;
		flex-direction: column;
		gap: 2px;
		height: 100%;
	}

	.lane-wrapper {
		flex: 1;
		display: flex;
		align-items: stretch;
		min-height: 40px;
	}

	.lane-number {
		width: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--accent-yellow);
		color: var(--text-primary);
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: bold;
		border-radius: var(--radius-sm) 0 0 var(--radius-sm);
	}

	.finish-line-wrapper {
		position: absolute;
		right: 60px;
		top: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: var(--space-md);
		width: 6px;
	}

	.finish-line {
		position: absolute;
		top: 0;
		bottom: 54px;
		width: 6px;
		background: repeating-linear-gradient(
			to bottom,
			var(--accent-red) 0px,
			var(--accent-red) 10px,
			white 10px,
			white 20px
		);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.finish-label {
		position: relative;
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: bold;
		color: var(--accent-red);
		letter-spacing: 0.1em;
		white-space: nowrap;
		background: rgba(0, 0, 0, 0.7);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		display: flex;
		margin-top: var(--space-sm);
		z-index: 1;
	}

	.round-label {
		position: absolute;
		bottom: var(--space-md);
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.7);
		color: var(--accent-yellow);
		font-family: var(--font-display);
		font-size: 1.25rem;
		letter-spacing: 0.1em;
		padding: var(--space-xs) var(--space-lg);
		border-radius: var(--radius-sm);
		display: flex;
		gap: var(--space-lg);
		align-items: center;
	}

	.finish-text {
		color: var(--accent-red);
		font-weight: bold;
	}
</style>
