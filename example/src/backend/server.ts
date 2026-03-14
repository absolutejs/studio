import { ReactExample } from '../frontend/react/pages/ReactExample';
import {
	asset,
	handleReactPageRequest,
	networking,
	prepare
} from '@absolutejs/absolute';
import { Elysia } from 'elysia';
import { handleVuePageRequest } from '@absolutejs/absolute/vue';
import { generateHeadElement } from '@absolutejs/absolute';
import VueExample from '../frontend/vue/pages/VueExample.vue';
import { handleHTMLPageRequest } from '@absolutejs/absolute';
import { handleSveltePageRequest } from '@absolutejs/absolute/svelte';
import SvelteExample from '../frontend/svelte/pages/SvelteExample.svelte';

const { absolutejs, manifest } = await prepare();

const server = new Elysia()
	.use(absolutejs)
	.get('/', () =>
		handleReactPageRequest(
			ReactExample,
			asset(manifest, 'ReactExampleIndex'),
			{ initialCount: 0, cssPath: asset(manifest, 'ReactExampleCSS') }
		)
	)
	.on('error', (err) => {
		const { request } = err;
		console.error(
			`Server error on ${request.method} ${request.url}: ${err.message}`
		);
	})
	.get('/vue', () =>
		handleVuePageRequest(
			VueExample,
			asset(manifest, 'VueExample'),
			asset(manifest, 'VueExampleIndex'),
			generateHeadElement({
				cssPath: asset(manifest, 'VueExampleCompiledCSS'),
				title: 'VueExample'
			}),
			{ initialCount: 0 }
		)
	)
	.get('/html', () => handleHTMLPageRequest(asset(manifest, 'HTMLExample')))
	.get('/svelte', () =>
		handleSveltePageRequest(
			SvelteExample,
			asset(manifest, 'SvelteExample'),
			asset(manifest, 'SvelteExampleIndex'),
			{ initialCount: 0, cssPath: asset(manifest, 'SvelteExampleCSS') }
		)
	)
	.use(networking);

export type Server = typeof server;
