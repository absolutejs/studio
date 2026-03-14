import { defineConfig } from '@absolutejs/absolute';

export default defineConfig({
	assetsDirectory: 'src/backend/assets',
	buildDirectory: 'build',
	reactDirectory: 'src/frontend/react',
	htmlDirectory: 'src/frontend/html',
	svelteDirectory: 'src/frontend/svelte',
	vueDirectory: 'src/frontend/vue',
	stylesConfig: 'src/frontend/styles'
});
