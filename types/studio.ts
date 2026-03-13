export type StudioPropField = {
	type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'image'
	label: string
	defaultValue?: unknown
	options?: string[]
}

export type StudioBlockDefinition = {
	name: string
	category: string
	description?: string
	icon?: string
	props: Record<string, StudioPropField>
	component: string
}

export type StudioBlockInstance = {
	id: string
	blockName: string
	props: Record<string, unknown>
	children?: StudioBlockInstance[]
}

export type StudioFramework =
	| 'react'
	| 'svelte'
	| 'vue'
	| 'html'
	| 'htmx'
	| 'angular'

export type StudioPage = {
	slug: string
	title: string
	framework: StudioFramework
	blocks: StudioBlockInstance[]
	meta?: Record<string, string>
}

export type StudioConfig = {
	blocks?: StudioBlockDefinition[]
	mediaDirectory?: string
}

export type StudioScriptInfo = {
	name: string
	command: string
	category: 'dev' | 'build' | 'test' | 'lint' | 'other'
}

export type StudioScriptRunResult = {
	exitCode: number
	stdout: string
	stderr: string
}
