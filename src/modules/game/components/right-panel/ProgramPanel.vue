<script setup lang="ts">
	import { computed } from 'vue';
	import { useStore } from '@/store';
	import type { Horse, HorseId } from '@/domain/models';

	const store = useStore();

	const program = computed(() => store.state.race.program);
	const currentRoundIndex = computed(() => store.state.race.currentRoundIndex);
	const raceStatus = computed(() => store.state.race.status);

	const horseMap = computed<Map<HorseId, Horse>>(() => {
		return new Map(store.state.horses.pool.map((h: Horse) => [h.id, h]));
	});

	function getOrdinal(n: number): string {
		const suffixes = ['th', 'st', 'nd', 'rd'];
		const v = n % 100;
		return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
	}

	function getHorseName(id: HorseId): string {
		return horseMap.value.get(id)?.name ?? 'Unknown';
	}

	function isCurrentRound(index: number): boolean {
		return index === currentRoundIndex.value && ['running', 'paused'].includes(raceStatus.value);
	}

	function isCompletedRound(index: number): boolean {
		return index < currentRoundIndex.value || raceStatus.value === 'finished';
	}
</script>

<template>
	<section class="program-panel panel">
		<header class="panel-header program-header">
			<span>Program</span>
		</header>
		<div class="program-content">
			<div v-if="program.length === 0" class="empty-state">
				<p>No program generated</p>
				<p class="text-muted">Click "Generate Program" to start</p>
			</div>
			<div
				v-for="roundProgram in program"
				:key="roundProgram.round.index"
				class="round-block"
				:class="{
					current: isCurrentRound(roundProgram.round.index),
					completed: isCompletedRound(roundProgram.round.index)
				}"
			>
				<div class="round-header">
					<span class="round-title">
						{{ getOrdinal(roundProgram.round.index + 1) }} Lap - {{ roundProgram.round.distance }}m
					</span>
					<span v-if="isCurrentRound(roundProgram.round.index)" class="current-badge"> LIVE </span>
				</div>
				<table class="data-table round-table">
					<thead>
						<tr>
							<th>#</th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(horseId, idx) in roundProgram.participantIds" :key="horseId">
							<td>{{ idx + 1 }}</td>
							<td class="truncate">{{ getHorseName(horseId) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>
</template>

<style scoped>
	.program-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 200px;
	}

	.program-header {
		background: var(--accent-blue);
		color: var(--text-light);
	}

	.program-content {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-sm);
	}

	.empty-state {
		text-align: center;
		padding: var(--space-xl);
		color: var(--text-muted);
	}

	.round-block {
		margin-bottom: var(--space-sm);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.round-block.current {
		border-color: var(--accent-blue);
		box-shadow: 0 0 8px rgba(74, 111, 165, 0.4);
	}

	.round-block.completed {
		opacity: 0.6;
	}

	.round-header {
		background: var(--bg-secondary);
		padding: var(--space-xs) var(--space-sm);
		font-family: var(--font-display);
		font-size: 0.875rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--border-color);
	}

	.round-title {
		color: var(--accent-red);
	}

	.current-badge {
		background: var(--accent-red);
		color: white;
		padding: 2px 6px;
		border-radius: 2px;
		font-size: 0.625rem;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.round-table {
		font-size: 0.75rem;
	}

	.round-table th,
	.round-table td {
		padding: 2px var(--space-xs);
		height: 24px;
		line-height: 20px;
		vertical-align: middle;
	}

	.round-table td.truncate {
		max-width: 160px;
	}
</style>
