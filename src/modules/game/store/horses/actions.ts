import type { ActionContext } from 'vuex';
import type { HorsesState, RootState } from '@/modules/game/store/types';
import type { Horse } from '@/domain/models';
import { HORSE_COLORS, HORSE_NAMES, TOTAL_HORSES } from '@/domain/constants';
import { randomInt, shuffle } from '@/domain/utils';
import { MUTATIONS } from './types';

export type HorsesActionContext = ActionContext<HorsesState, RootState>;

const generatePool = ({ commit }: HorsesActionContext) => {
	const horseCount = TOTAL_HORSES;

	const shuffledNames = shuffle(HORSE_NAMES);
	const shuffledColors = shuffle(HORSE_COLORS);

	const horses: Horse[] = [];

	for (let i = 0; i < horseCount; i++) {
		horses.push({
			id: `horse-${i + 1}`,
			name: shuffledNames[i],
			color: shuffledColors[i],
			condition: randomInt(1, 100)
		});
	}

	commit(MUTATIONS.SET_POOL, { horses });
};

export { generatePool };
