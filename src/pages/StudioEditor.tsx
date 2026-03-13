import { useState, useEffect, useRef, useCallback } from 'react'
import { MonacoEditor } from '../components/MonacoEditor'
import { ElementPanel } from '../components/ElementPanel'
import { iframeOverlayScript } from '../components/iframeOverlay'
import { StudioHead } from '../components/StudioHead'

type StudioEditorProps = {
	devServerUrl?: string
	cssPath?: string
}

type PageInfo = {
	name: string
	path: string
	framework: string
}

type SelectedElement = {
	tagName: string
	id: string
	className: string
	textContent: string
	attributes: Record<string, string>
}

type ScriptInfo = {
	name: string
	command: string
	category: string
}

const ELEMENT_CATEGORIES: Record<string, string[]> = {
	Layout: [
		'div',
		'section',
		'article',
		'aside',
		'header',
		'footer',
		'main',
		'nav',
		'figure',
		'figcaption',
		'details',
		'summary',
		'dialog',
	],
	Text: [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'p',
		'span',
		'a',
		'strong',
		'em',
		'b',
		'i',
		'u',
		's',
		'small',
		'mark',
		'sub',
		'sup',
		'abbr',
		'cite',
		'code',
		'pre',
		'blockquote',
		'q',
		'kbd',
		'samp',
		'var',
		'time',
		'data',
		'ruby',
		'rt',
		'rp',
		'bdi',
		'bdo',
		'wbr',
		'br',
		'hr',
	],
	Lists: ['ul', 'ol', 'li', 'dl', 'dt', 'dd', 'menu'],
	Table: [
		'table',
		'thead',
		'tbody',
		'tfoot',
		'tr',
		'th',
		'td',
		'caption',
		'colgroup',
		'col',
	],
	Form: [
		'form',
		'input',
		'textarea',
		'select',
		'option',
		'optgroup',
		'button',
		'label',
		'fieldset',
		'legend',
		'datalist',
		'output',
		'progress',
		'meter',
	],
	Media: [
		'img',
		'video',
		'audio',
		'source',
		'track',
		'picture',
		'canvas',
		'svg',
		'iframe',
		'embed',
		'object',
		'map',
		'area',
	],
	Semantic: ['address', 'hgroup', 'search'],
}

export const StudioEditor = ({ devServerUrl = 'http://localhost:3000', cssPath }: StudioEditorProps) => {
	const [pages, setPages] = useState<PageInfo[]>([])
	const [currentPage, setCurrentPage] = useState<PageInfo | null>(null)
	const [view, setView] = useState<'preview' | 'source'>('preview')
	const [sourceContent, setSourceContent] = useState('')
	const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
	const [showScripts, setShowScripts] = useState(false)
	const [scripts, setScripts] = useState<ScriptInfo[]>([])
	const [scriptOutput, setScriptOutput] = useState('')
	const [runningScript, setRunningScript] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [showPages, setShowPages] = useState(false)
	const [newPageName, setNewPageName] = useState('')
	const [types, setTypes] = useState<Record<string, string>>({})
	const [deps, setDeps] = useState<Record<string, string>>({})

	const iframeRef = useRef<HTMLIFrameElement>(null)

	// Fetch pages on mount
	useEffect(() => {
		const fetchPages = async () => {
			try {
				const res = await fetch('/api/pages')
				const data = await res.json()
				setPages(data)
				if (data.length > 0 && !currentPage) {
					setCurrentPage(data[0])
				}
			} catch (err) {
				console.error('[studio] Failed to fetch pages:', err)
			}
		}
		fetchPages()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	// Fetch scripts on mount
	useEffect(() => {
		const fetchScripts = async () => {
			try {
				const res = await fetch('/api/scripts')
				const data = await res.json()
				setScripts(data)
			} catch (err) {
				console.error('[studio] Failed to fetch scripts:', err)
			}
		}
		fetchScripts()
	}, [])

	// Fetch source when currentPage changes
	useEffect(() => {
		if (!currentPage) return

		const fetchSource = async () => {
			try {
				const res = await fetch(
					`/api/source?file=${encodeURIComponent(currentPage.path)}`,
				)
				const data = await res.json()
				setSourceContent(data.content)
			} catch (err) {
				console.error('[studio] Failed to fetch source:', err)
			}
		}
		fetchSource()
	}, [currentPage])

	// Fetch types and deps when entering source view
	useEffect(() => {
		if (view !== 'source' || !currentPage) return

		const fetchTypesAndDeps = async () => {
			try {
				const [typesRes, depsRes] = await Promise.all([
					fetch('/api/types'),
					fetch(
						`/api/deps?file=${encodeURIComponent(currentPage.path)}`,
					),
				])
				const typesData = await typesRes.json()
				const depsData = await depsRes.json()
				setTypes(typesData)
				setDeps(depsData)
			} catch (err) {
				console.error('[studio] Failed to fetch types/deps:', err)
			}
		}
		fetchTypesAndDeps()
	}, [view, currentPage])

	// Listen for element selection from iframe
	useEffect(() => {
		const handleMessage = (e: MessageEvent) => {
			if (e.data?.type === '__studio_select') {
				setSelectedElement(e.data.element)
			}
		}
		window.addEventListener('message', handleMessage)
		return () => window.removeEventListener('message', handleMessage)
	}, [])

	const handlePageSelect = useCallback((page: PageInfo) => {
		setCurrentPage(page)
		setShowPages(false)
		setSelectedElement(null)
	}, [])

	const handleCreatePage = useCallback(async () => {
		if (!newPageName.trim()) return

		try {
			await fetch('/api/pages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newPageName.trim() }),
			})

			const res = await fetch('/api/pages')
			const data = await res.json()
			setPages(data)
			setNewPageName('')
		} catch (err) {
			console.error('[studio] Failed to create page:', err)
		}
	}, [newPageName])

	const handleSaveSource = useCallback(
		async (content: string) => {
			if (!currentPage) return

			try {
				await fetch('/api/source', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						file: currentPage.path,
						content,
					}),
				})
				setSourceContent(content)
			} catch (err) {
				console.error('[studio] Failed to save source:', err)
			}
		},
		[currentPage],
	)

	const handleRunScript = useCallback(async (name: string) => {
		setRunningScript(name)
		setScriptOutput('')
		setShowScripts(false)

		try {
			const res = await fetch('/api/scripts/run', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name }),
			})
			const data = await res.json()
			const output = [
				`$ bun run ${name}`,
				'',
				data.stdout,
				data.stderr ? `\nSTDERR:\n${data.stderr}` : '',
				'',
				`Exit code: ${data.exitCode}`,
			]
				.filter(Boolean)
				.join('\n')
			setScriptOutput(output)
		} catch (err) {
			setScriptOutput(`Failed to run script: ${err}`)
		} finally {
			setRunningScript(null)
		}
	}, [])

	const handleTextChange = useCallback((value: string) => {
		if (iframeRef.current?.contentWindow) {
			iframeRef.current.contentWindow.postMessage(
				{ type: '__studio_update_text', value },
				'*',
			)
		}
	}, [])

	const handleAttributeChange = useCallback((name: string, value: string) => {
		if (iframeRef.current?.contentWindow) {
			iframeRef.current.contentWindow.postMessage(
				{ type: '__studio_update_attr', name, value },
				'*',
			)
		}
	}, [])

	const handleOpenEditor = useCallback(async () => {
		if (!currentPage) return

		try {
			await fetch(
				`/api/open-editor?file=${encodeURIComponent(currentPage.path)}`,
			)
		} catch (err) {
			console.error('[studio] Failed to open editor:', err)
		}
	}, [currentPage])

	const handleNavigate = useCallback(
		async (path: string) => {
			if (!currentPage) return

			try {
				// Resolve relative to current file's directory
				const currentDir = currentPage.path.replace(/\/[^/]+$/, '')
				const fullPath = `${currentDir}/${path}`

				const res = await fetch(
					`/api/source?file=${encodeURIComponent(fullPath)}`,
				)
				const data = await res.json()
				setSourceContent(data.content)
			} catch (err) {
				console.error('[studio] Failed to navigate:', err)
			}
		},
		[currentPage],
	)

	const handleIframeLoad = useCallback(() => {
		if (!iframeRef.current?.contentWindow) return

		try {
			const doc = iframeRef.current.contentDocument
			if (doc) {
				const script = doc.createElement('script')
				script.textContent = iframeOverlayScript
				doc.body.appendChild(script)
			}
		} catch {
			// Cross-origin — can't inject
		}
	}, [])

	const getPreviewUrl = () => {
		return devServerUrl + '/'
	}

	const filteredCategories = Object.entries(ELEMENT_CATEGORIES)
		.map(([category, elements]) => {
			const filtered = searchQuery
				? elements.filter((el) =>
						el.toLowerCase().includes(searchQuery.toLowerCase()),
					)
				: elements
			return [category, filtered] as [string, string[]]
		})
		.filter(([, elements]) => elements.length > 0)

	const groupedScripts = scripts.reduce<Record<string, ScriptInfo[]>>(
		(acc, script) => {
			if (!acc[script.category]) {
				acc[script.category] = []
			}
			acc[script.category]!.push(script)
			return acc
		},
		{},
	)

	return (
		<html lang="en">
			<StudioHead cssPath={cssPath} />
			<body className="studio-body">
				<div className="studio-layout">
					{/* Toolbar */}
					<div className="studio-toolbar">
						<div className="studio-logo">ABSOLUTE STUDIO</div>

						<div className="studio-toolbar-center">
							{/* Pages dropdown */}
							<div className="studio-pages-dropdown">
								<button
									className="studio-btn"
									onClick={() => setShowPages(!showPages)}
								>
									{currentPage?.name || 'Select page'}
									<span className="studio-caret">
										{showPages ? '\u25B2' : '\u25BC'}
									</span>
								</button>

								{showPages && (
									<div className="studio-dropdown-menu">
										{pages.map((page) => (
											<button
												className={`studio-page-item ${
													currentPage?.path === page.path
														? 'studio-page-item-active'
														: ''
												}`}
												key={page.path}
												onClick={() => handlePageSelect(page)}
											>
												<span className="studio-page-name">
													{page.name}
												</span>
												<span className="studio-page-framework">
													{page.framework}
												</span>
											</button>
										))}

										<div className="studio-create-page">
											<input
												className="studio-search-input"
												placeholder="New page name..."
												value={newPageName}
												onChange={(e) =>
													setNewPageName(e.target.value)
												}
												onKeyDown={(e) => {
													if (e.key === 'Enter')
														handleCreatePage()
												}}
											/>
											<button
												className="studio-btn"
												onClick={handleCreatePage}
											>
												+
											</button>
										</div>
									</div>
								)}
							</div>

							{/* View toggle */}
							<div className="studio-view-toggle">
								<button
									className={`studio-btn ${view === 'preview' ? 'studio-btn-active' : ''}`}
									onClick={() => setView('preview')}
								>
									Preview
								</button>
								<button
									className={`studio-btn ${view === 'source' ? 'studio-btn-active' : ''}`}
									onClick={() => setView('source')}
								>
									Source
								</button>
							</div>
						</div>

						<div className="studio-toolbar-right">
							{/* Scripts dropdown */}
							<div className="studio-dropdown">
								<button
									className="studio-scripts-btn"
									onClick={() => setShowScripts(!showScripts)}
								>
									Scripts
									{runningScript && (
										<span className="studio-spinner" />
									)}
								</button>

								{showScripts && (
									<div className="studio-dropdown-menu studio-scripts-menu">
										{Object.entries(groupedScripts).map(
											([category, categoryScripts]) => (
												<div key={category}>
													<div className="studio-script-category">
														{category}
													</div>
													{categoryScripts.map((script) => (
														<button
															className="studio-page-item"
															key={script.name}
															onClick={() =>
																handleRunScript(
																	script.name,
																)
															}
														>
															<span className="studio-page-name">
																{script.name}
															</span>
															<span className="studio-page-framework">
																{script.command}
															</span>
														</button>
													))}
												</div>
											),
										)}
									</div>
								)}
							</div>

							{/* Open in editor */}
							<button
								className="studio-btn"
								disabled={!currentPage}
								onClick={handleOpenEditor}
								title="Open in editor"
							>
								Open in Editor
							</button>
						</div>
					</div>

					<div className="studio-content">
						{/* Left sidebar - Elements */}
						<div className="studio-sidebar">
							<input
								className="studio-search-input"
								placeholder="Search elements..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<div className="studio-elements-list">
								{filteredCategories.map(
									([category, elements]) => (
										<div key={category}>
											<div className="studio-element-category">
												{category}
											</div>
											{elements.map((el) => (
												<div
													className="studio-element-item"
													draggable
													key={el}
													onDragStart={(e) => {
														e.dataTransfer.setData(
															'text/plain',
															`<${el}></${el}>`,
														)
													}}
												>
													&lt;{el}&gt;
												</div>
											))}
										</div>
									),
								)}
							</div>
						</div>

						{/* Main area */}
						<div className="studio-main">
							{view === 'preview' ? (
								<iframe
									ref={iframeRef}
									className="studio-preview-frame"
									src={getPreviewUrl()}
									title="Preview"
									onLoad={handleIframeLoad}
								/>
							) : (
								<div className="studio-source-editor">
									<MonacoEditor
										deps={deps}
										types={types}
										value={sourceContent}
										onChange={setSourceContent}
										onNavigate={handleNavigate}
										onSave={handleSaveSource}
									/>
								</div>
							)}
						</div>

						{/* Right sidebar - Inspector */}
						<div className="studio-inspector">
							<ElementPanel
								selectedElement={selectedElement}
								onAttributeChange={handleAttributeChange}
								onTextChange={handleTextChange}
							/>
						</div>
					</div>

					{/* Bottom panel - Script output */}
					{scriptOutput && (
						<div className="studio-scripts-output">
							<div className="studio-scripts-output-header">
								<span>Script Output</span>
								<button
									className="studio-btn"
									onClick={() => setScriptOutput('')}
								>
									Close
								</button>
							</div>
							<pre>{scriptOutput}</pre>
						</div>
					)}
				</div>
			</body>
		</html>
	)
}
