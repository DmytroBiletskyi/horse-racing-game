<script setup lang="ts">
	import { computed } from 'vue';
	import { useStore } from '@/store';
	import type { Horse, HorseId, RoundResult } from '@/domain/models';

	const store = useStore();

	const results = computed<RoundResult[]>(() => store.state.race.results);

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
</script>

<template>
	<section class="results-panel panel">
		<header class="panel-header results-header">
			<span>Results</span>
		</header>
		<div class="results-content">
			<div v-if="results.length === 0" class="empty-state">
				<p>No results yet</p>
				<p class="text-muted">Race results will appear here</p>
			</div>
			<div v-for="result in results" :key="result.roundIndex" class="result-block">
				<div class="result-header">
					<span class="result-title">
						{{ getOrdinal(result.roundIndex + 1) }} Lap - {{ result.distance }}m
					</span>
				</div>
				<table class="data-table result-table">
					<thead>
						<tr>
							<th>Pos</th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.rows" :key="row.horseId" :class="{ winner: row.position === 1 }">
							<td class="position">
								<span v-if="row.position <= 3" class="medal">
									{{ row.position === 1 ? '🥇' : row.position === 2 ? '🥈' : '🥉' }}
								</span>
								<span v-else>{{ row.position }}</span>
							</td>
							<td class="truncate">{{ getHorseName(row.horseId) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>
</template>

<style scoped>
	.results-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 200px;
	}

	.results-header {
		background: var(--accent-green);
		color: var(--text-light);
	}

	.results-content {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-sm);
	}

	.empty-state {
		text-align: center;
		padding: var(--space-xl);
		color: var(--text-muted);
	}

	.result-block {
		margin-bottom: var(--space-sm);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		overflow: hidden;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.result-header {
		background: var(--bg-secondary);
		padding: var(--space-xs) var(--space-sm);
		font-family: var(--font-display);
		font-size: 0.875rem;
		border-bottom: 1px solid var(--border-color);
	}

	.result-title {
		color: var(--accent-red);
	}

	.result-table {
		font-size: 0.75rem;
	}

	.result-table th,
	.result-table td {
		padding: 2px var(--space-xs);
	}

	.result-table td.truncate {
		max-width: 120px;
	}

	.result-table tr.winner {
		background: rgba(212, 168, 67, 0.2);
	}

	.position {
		width: 30px;
		text-align: center;
	}

	.medal {
		font-size: 0.875rem;
	}
</style>
