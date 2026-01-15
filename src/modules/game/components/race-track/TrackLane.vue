<script setup lang="ts">
	import { computed } from 'vue';
	import type { Horse, HorseProgress } from '@/domain/models';

	const props = defineProps<{
		horse?: Horse;
		progress?: HorseProgress;
		laneNumber: number;
		isActive: boolean;
	}>();

	const horseStyle = computed(() => {
		if (!props.progress) {
			return { transform: 'translateX(0)' };
		}
		return {
			transform: `translateX(${props.progress.xPx}px)`
		};
	});

	const hasFinished = computed(() => {
		return props.progress?.finishedAtMs !== null && props.progress?.finishedAtMs !== undefined;
	});
</script>

<template>
	<div class="track-lane" :class="{ inactive: !isActive }">
		<div class="lane-track">
			<div v-if="horse" class="horse-sprite" :style="horseStyle">
				<div class="horse-body" :style="{ backgroundColor: horse.color }" :class="{ finished: hasFinished }">
					<img src="@/assets/images/horse-image.svg" alt="Horse" class="horse-icon" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.track-lane {
		flex: 1;
		background: var(--bg-track-lane);
		border-top: 1px dashed rgba(255, 255, 255, 0.3);
		border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
		position: relative;
		overflow: hidden;
	}

	.track-lane.inactive {
		opacity: 0.5;
	}

	.lane-track {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
	}

	.horse-sprite {
		position: absolute;
		left: 0;
		display: flex;
		align-items: center;
		transition: transform 0.016s linear;
	}

	.horse-body {
		width: 36px;
		height: 28px;
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
		position: relative;
	}

	.horse-body.finished {
		animation: celebrate 0.3s ease-in-out;
	}

	@keyframes celebrate {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
	}

	.horse-icon {
		width: 22px;
		height: 22px;
		object-fit: contain;
		filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3));
	}
</style>
