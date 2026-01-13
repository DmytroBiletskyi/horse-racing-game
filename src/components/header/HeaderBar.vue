<script setup lang="ts">
	import { computed } from 'vue';
	import { useStore } from '@/store';

	const emit = defineEmits<{
		(e: 'generate-program'): void;
		(e: 'start-pause'): void;
	}>();

	const store = useStore();

	const raceStatus = computed(() => store.state.race.status);

	const canStartPause = computed(() => {
		return ['ready', 'running', 'paused'].includes(raceStatus.value);
	});

	const startPauseLabel = computed(() => {
		switch (raceStatus.value) {
			case 'running':
				return 'Pause';
			case 'paused':
				return 'Resume';
			default:
				return 'Start';
		}
	});

	const statusText = computed(() => {
		switch (raceStatus.value) {
			case 'idle':
				return 'Waiting for program';
			case 'ready':
				return 'Ready to race!';
			case 'running':
				return 'Race in progress...';
			case 'paused':
				return 'Paused';
			case 'finished':
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
				<span class="title-icon">🏇</span>
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
		font-size: 1.75rem;
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
