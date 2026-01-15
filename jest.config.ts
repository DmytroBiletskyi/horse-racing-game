import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'jsdom',
	extensionsToTreatAsEsm: ['.ts'],
	rootDir: '.',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: '<rootDir>/tsconfig.json'
			}
		]
	},
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	clearMocks: true
};

export default config;
