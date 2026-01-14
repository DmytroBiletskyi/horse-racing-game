<script setup lang="ts">
	import { onMounted, ref, provide } from 'vue';
	import { useStore, HORSE_ACTIONS, RACE_ACTIONS, RACE_MUTATIONS } from '@/store';
	import { useRaceEngine } from '@/domain/services/raceEngine';
	import HeaderBar from './components/header/HeaderBar.vue';
	import HorseListPanel from './components/horse-list/HorseListPanel.vue';
	import RaceTrack from './components/race-track/RaceTrack.vue';
	import RightPanel from './components/right-panel/RightPanel.vue';

	const store = useStore();
	const trackWidth = ref(800);

	const raceEngine = useRaceEngine(store, trackWidth);

	provide('trackWidth', trackWidth);
	provide('raceEngine', raceEngine);

	onMounted(() => {
		store.dispatch(`horses/${HORSE_ACTIONS.GENERATE_POOL}`);
	});

	function handleGenerateProgram() {
		raceEngine.stop();
		store.dispatch(`race/${RACE_ACTIONS.GENERATE_PROGRAM}`);
	}

	function handleStartPause() {
		const status = store.state.race.status;

		if (status === 'ready') {
			store.dispatch(`race/${RACE_ACTIONS.START_RACE}`);
			raceEngine.start();
		} else if (status === 'running') {
			store.dispatch(`race/${RACE_ACTIONS.PAUSE_RACE}`);
			raceEngine.pause();
		} else if (status === 'paused') {
			store.dispatch(`race/${RACE_ACTIONS.RESUME_RACE}`);
			raceEngine.resume();
		}
	}

	function updateTrackWidth(width: number) {
		trackWidth.value = width;
		store.commit(`race/${RACE_MUTATIONS.SET_TRACK_WIDTH}`, { width });
	}
</script>

<template>
	<div class="app-layout">
		<HeaderBar @generate-program="handleGenerateProgram" @start-pause="handleStartPause" />
		<main class="main-grid">
			<HorseListPanel />
			<RaceTrack @track-resize="updateTrackWidth" />
			<RightPanel />
		</main>
	</div>
</template>

<style scoped>
	.app-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main-grid {
		flex: 1;
		display: grid;
		grid-template-columns: 280px 1fr 360px;
		gap: var(--space-md);
		padding: var(--space-md);
		min-height: 0;
	}

	@media (max-width: 1200px) {
		.main-grid {
			grid-template-columns: 220px 1fr 300px;
		}
	}

	@media (max-width: 900px) {
		.main-grid {
			grid-template-columns: 1fr;
			grid-template-rows: auto 400px auto;
		}
	}
</style>
