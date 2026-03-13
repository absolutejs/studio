import { ReactExample } from '../frontend/pages/ReactExample';
import {
	asset,
	handleReactPageRequest,
	networking,
	prepare
} from '@absolutejs/absolute';
import { Elysia } from 'elysia';

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
	.get('/react', () =>
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
	.use(networking);

export type Server = typeof server;
