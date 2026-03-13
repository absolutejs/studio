import { Elysia } from 'elysia'
import { join } from 'path'
import {
	asset,
	handleReactPageRequest,
	prepare,
} from '@absolutejs/absolute'
import { StudioEditor } from './pages/StudioEditor'
import {
	scanProjectPages,
	createPageFile,
	readPageSource,
	writePageSource,
	getTypeDefinitions,
	resolveLocalImports,
} from './project'
import { openInEditor } from './openEditor'
import type { StudioScriptInfo, StudioScriptRunResult } from '../types/studio'

type StudioConfig = {
	port?: number
	projectDir?: string
	devServerUrl?: string
	reactDirectory?: string
	svelteDirectory?: string
	vueDirectory?: string
	htmlDirectory?: string
	htmxDirectory?: string
	angularDirectory?: string
}

const categorizeScript = (
	name: string,
): StudioScriptInfo['category'] => {
	if (name.includes('dev') || name.includes('watch') || name.includes('start'))
		return 'dev'
	if (name.includes('build') || name.includes('compile')) return 'build'
	if (name.includes('test') || name.includes('spec')) return 'test'
	if (
		name.includes('lint') ||
		name.includes('format') ||
		name.includes('prettier') ||
		name.includes('eslint') ||
		name.includes('typecheck')
	)
		return 'lint'
	return 'other'
}

export const startStudio = async (config: StudioConfig = {}) => {
	const port = config.port ?? 3625
	const projectDir = config.projectDir ?? process.cwd()
	const devServerUrl = config.devServerUrl ?? 'http://localhost:3000'

	const scanConfig = {
		reactDirectory: config.reactDirectory,
		svelteDirectory: config.svelteDirectory,
		vueDirectory: config.vueDirectory,
		htmlDirectory: config.htmlDirectory,
		htmxDirectory: config.htmxDirectory,
		angularDirectory: config.angularDirectory,
	}

	const { absolutejs, manifest } = await prepare()

	const app = new Elysia()
		.use(absolutejs)

		// Studio UI — served as an absolutejs React page
		.get('/', () =>
			handleReactPageRequest(
				StudioEditor,
				asset(manifest, 'StudioEditorIndex'),
				{
					devServerUrl,
					cssPath: asset(manifest, 'StudioCSS'),
				},
			),
		)

		// Page API
		.get('/api/pages', async () => {
			return await scanProjectPages(scanConfig)
		})

		.post('/api/pages', async ({ body }) => {
			const { name, directory } = body as {
				name: string
				directory?: string
			}
			const dir = directory ?? config.reactDirectory ?? projectDir
			const filePath = await createPageFile(name, dir)
			return { file: filePath }
		})

		// Source editing
		.get('/api/source', async ({ query }) => {
			const file = query.file as string
			const content = await readPageSource(file)
			return { content }
		})

		.put('/api/source', async ({ body }) => {
			const { file, content } = body as {
				file: string
				content: string
			}
			await writePageSource(file, content)
			return { ok: true }
		})

		// Monaco editor support
		.get('/api/types', async () => {
			return await getTypeDefinitions()
		})

		.get('/api/deps', async ({ query }) => {
			const file = query.file as string
			return await resolveLocalImports(file)
		})

		// Editor integration
		.get('/api/open-editor', async ({ query }) => {
			const file = query.file as string
			const line = query.line ? Number(query.line) : undefined
			await openInEditor(file, line)
			return { ok: true }
		})

		// Project info
		.get('/api/project', () => {
			return { devServerUrl, projectDir }
		})

		// Scripts
		.get('/api/scripts', async () => {
			try {
				const pkgPath = join(projectDir, 'package.json')
				const pkgContent = await Bun.file(pkgPath).text()
				const pkg = JSON.parse(pkgContent) as {
					scripts?: Record<string, string>
				}
				const scripts = pkg.scripts ?? {}

				const result: StudioScriptInfo[] = Object.entries(scripts)
					.filter(
						([name]) => !name.startsWith('pre') && !name.startsWith('post'),
					)
					.map(([name, command]) => ({
						name,
						command,
						category: categorizeScript(name),
					}))
					.sort((a, b) => {
						const categoryCompare = a.category.localeCompare(b.category)
						if (categoryCompare !== 0) return categoryCompare
						return a.name.localeCompare(b.name)
					})

				return result
			} catch {
				return []
			}
		})

		.post('/api/scripts/run', async ({ body }) => {
			const { name } = body as { name: string }
			const proc = Bun.spawn(['bun', 'run', name], {
				cwd: projectDir,
				stdout: 'pipe',
				stderr: 'pipe',
			})

			const [stdout, stderr, exitCode] = await Promise.all([
				new Response(proc.stdout).text(),
				new Response(proc.stderr).text(),
				proc.exited,
			])

			const result: StudioScriptRunResult = { exitCode, stdout, stderr }
			return result
		})


	app.listen(port)

	return app
}

export type StudioApp = Awaited<ReturnType<typeof startStudio>>
