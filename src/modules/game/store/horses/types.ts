import type { Horse } from '@/domain/models';

export const MUTATIONS = {
	SET_POOL: 'SET_POOL'
} as const;

export const ACTIONS = {
	GENERATE_POOL: 'generatePool'
} as const;

export interface SetPoolPayload {
	horses: Horse[];
}
