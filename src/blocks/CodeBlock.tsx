import React from 'react'

type CodeBlockProps = {
	code?: string
	language?: string
}

export const CodeBlock = ({ code = '', language = '' }: CodeBlockProps) => (
	<pre
		style={{
			backgroundColor: '#1e1e2e',
			color: '#cdd6f4',
			padding: '16px',
			borderRadius: '6px',
			overflow: 'auto',
			fontSize: '14px',
			lineHeight: 1.5,
		}}
	>
		<code data-language={language}>{code}</code>
	</pre>
)
