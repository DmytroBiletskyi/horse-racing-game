// eslint.config.mjs
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import prettierConfig from '@vue/eslint-config-prettier';

export default defineConfigWithVueTs(
	pluginVue.configs['flat/recommended'],

	vueTsConfigs.recommended,

	prettierConfig,

	{
		ignores: ['dist/**', 'node_modules/**'],
		rules: {
			'no-console': 'off',
			'no-debugger': 'warn',

			'vue/multi-word-component-names': 'off',

			curly: ['error', 'all']
		}
	}
);
