import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{
		ignores: ['example/build/**', '.absolutejs/**', 'node_modules/**']
	},

	pluginJs.configs.recommended,

	...tseslint.configs.recommended,

	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json'
			}
		}
	},

	{
		files: ['**/*.{ts,tsx}'],
		plugins: { '@stylistic': stylistic },
		rules: {
			'@stylistic/padding-line-between-statements': [
				'error',
				{ blankLine: 'always', next: 'return', prev: '*' }
			]
		}
	},

	{
		files: ['example/server.ts'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off'
		}
	},

	{
		files: ['eslint.config.mjs'],
		rules: {
			'@typescript-eslint/no-unused-expressions': 'off'
		}
	}
]);
