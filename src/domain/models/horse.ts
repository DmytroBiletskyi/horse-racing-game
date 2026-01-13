export type HorseId = string;

export interface Horse {
	id: HorseId;
	name: string;
	color: string;
	condition: number;
}

export interface HorseProgress {
	horseId: HorseId;
	xPx: number;
	finishedAtMs: number | null;
	speedFactor: number;
}
