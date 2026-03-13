import React from 'react'

type HeadingBlockProps = {
	text?: string
	level?: number
	align?: string
}

export const HeadingBlock = ({
	text = 'Heading',
	level = 2,
	align = 'left',
}: HeadingBlockProps) => {
	const Tag = `h${Math.min(Math.max(level, 1), 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	return <Tag style={{ textAlign: align as React.CSSProperties['textAlign'] }}>{text}</Tag>
}
