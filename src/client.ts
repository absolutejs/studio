import { treaty } from '@elysiajs/eden'
import type { StudioApp } from './server'

const getBaseUrl = () => {
	if (typeof window !== 'undefined') {
		return window.location.origin
	}
	return 'http://localhost:3625'
}

export const client = treaty<StudioApp>(getBaseUrl())
