<script setup lang="ts">
	import { computed } from 'vue';
	import { useStore } from '@/store';
	import { RACE_STATUS, type RaceStatus } from '@/domain/models/race';

	const emit = defineEmits<{
		(e: 'generate-program'): void;
		(e: 'start-pause'): void;
	}>();

	const store = useStore();

	const raceStatus = computed(() => store.state.race.status);

	const canStartPause = computed(() => {
		const validStatuses: readonly RaceStatus[] = [RACE_STATUS.READY, RACE_STATUS.RUNNING, RACE_STATUS.PAUSED];
		return validStatuses.includes(raceStatus.value);
	});

	const startPauseLabel = computed(() => {
		switch (raceStatus.value) {
			case RACE_STATUS.RUNNING:
				return 'Pause';
			case RACE_STATUS.PAUSED:
				return 'Resume';
			default:
				return 'Start';
		}
	});

	const statusText = computed(() => {
		switch (raceStatus.value) {
			case RACE_STATUS.IDLE:
				return 'Waiting for program';
			case RACE_STATUS.READY:
				return 'Ready to race!';
			case RACE_STATUS.RUNNING:
				return 'Race in progress...';
			case RACE_STATUS.PAUSED:
				return 'Paused';
			case RACE_STATUS.FINISHED:
				return 'Race finished!';
			default:
				return '';
		}
	});
</script>

<template>
	<header class="header-bar">
		<div class="header-left">
			<h1 class="title">
				<img src="@/assets/images/horse-image.svg" alt="Horse" class="title-icon" />
				Horse Racing
			</h1>
			<span class="status-badge" :class="raceStatus">
				{{ statusText }}
			</span>
		</div>
		<div class="header-right">
			<button class="btn btn-primary" @click="emit('generate-program')">Generate Program</button>
			<button class="btn btn-secondary" :disabled="!canStartPause" @click="emit('start-pause')">
				{{ startPauseLabel }}
			</button>
		</div>
	</header>
</template>

<style scoped>
	.header-bar {
		background: var(--bg-header);
		color: var(--text-light);
		padding: var(--space-md) var(--space-lg);
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: var(--shadow-md);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}

	.title {
		font-family: var(--font-display);
		font-size: 2rem;
		letter-spacing: 0.1em;
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.title-icon {
		width: 28px;
		height: 28px;
		object-fit: contain;
	}

	.status-badge {
		padding: var(--space-xs) var(--space-md);
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.status-badge.idle {
		background: var(--text-muted);
	}

	.status-badge.ready {
		background: var(--accent-green);
	}

	.status-badge.running {
		background: var(--accent-blue);
		animation: pulse 1.5s ease-in-out infinite;
	}

	.status-badge.paused {
		background: var(--accent-yellow);
		color: var(--text-primary);
	}

	.status-badge.finished {
		background: var(--accent-red);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.header-right {
		display: flex;
		gap: var(--space-md);
	}

	@media (max-width: 768px) {
		.header-bar {
			flex-direction: column;
			gap: var(--space-md);
		}

		.title {
			font-size: 1.5rem;
		}
	}
</style>
