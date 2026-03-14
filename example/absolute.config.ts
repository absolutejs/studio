import { defineConfig } from '@absolutejs/absolute';

export default defineConfig({
	assetsDirectory: 'src/backend/assets',
	buildDirectory: 'build',
	reactDirectory: 'src/frontend/react',
	vueDirectory: 'src/frontend/vue',
	htmlDirectory: 'src/frontend/html',
	svelteDirectory: 'src/frontend/svelte',
	stylesConfig: 'src/frontend/styles'
});
