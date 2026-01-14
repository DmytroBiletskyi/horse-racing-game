<script setup lang="ts">
	import { computed } from 'vue';
	import { useStore } from '@/store';
	import type { Horse } from '@/domain/models';

	const store = useStore();

	const horses = computed<Horse[]>(() => store.state.horses.pool);
	const horseCount = computed(() => horses.value.length);
</script>

<template>
	<section class="horse-list-panel panel">
		<header class="panel-header">
			<span class="header-title">Horse List ({{ horseCount }}/20)</span>
		</header>
		<div class="table-container">
			<table class="data-table">
				<thead>
					<tr>
						<th>Name</th>
						<th class="text-center">Cond.</th>
						<th class="text-center">Color</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="horse in horses" :key="horse.id">
						<td class="truncate horse-name">{{ horse.name }}</td>
						<td class="text-center">{{ horse.condition }}</td>
						<td class="text-center">
							<span class="color-swatch" :style="{ backgroundColor: horse.color }" :title="horse.color" />
						</td>
					</tr>
					<tr v-if="horses.length === 0">
						<td colspan="3" class="text-center text-muted">No horses generated</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>

<style scoped>
	.horse-list-panel {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.table-container {
		flex: 1;
		overflow-y: auto;
	}

	.horse-name {
		max-width: 150px;
	}

	.data-table tbody tr {
		transition: background-color 0.15s ease;
	}
</style>
