declare module '*.vue' {
	import type { Component } from 'vue';

	const component: Component<Record<never, never>>;
	export default component;
}
