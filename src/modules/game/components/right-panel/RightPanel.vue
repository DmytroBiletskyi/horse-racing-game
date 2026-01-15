<script setup lang="ts">
	import ProgramPanel from './ProgramPanel.vue';
	import ResultsPanel from './ResultsPanel.vue';
</script>

<template>
	<section class="right-panel">
		<ProgramPanel />
		<ResultsPanel />
	</section>
</template>

<style scoped>
	.right-panel {
		display: flex;
		gap: var(--space-md);
		overflow: hidden;
	}
</style>
