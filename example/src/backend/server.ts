import { ReactExample } from '../frontend/react/pages/ReactExample';
import {
	asset,
	handleReactPageRequest,
	handleHTMLPageRequest,
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
	.on('error', (err) => {
		const { request } = err;
		console.error(
			`Server error on ${request.method} ${request.url}: ${err.message}`
		);
	})
	.get('/html', () => handleHTMLPageRequest(asset(manifest, 'HTMLExample')))
	.use(networking);

export type Server = typeof server;
