import React from 'react'

type ColumnsBlockProps = {
	columns?: number
	gap?: string
	children?: React.ReactNode
}

export const ColumnsBlock = ({
	columns = 2,
	gap = '24px',
	children,
}: ColumnsBlockProps) => (
	<div
		style={{
			display: 'grid',
			gridTemplateColumns: `repeat(${Math.min(Math.max(columns, 2), 4)}, 1fr)`,
			gap,
		}}
	>
		{children}
	</div>
)
