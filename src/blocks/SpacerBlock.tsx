import React from 'react'

type SpacerBlockProps = {
	height?: string
}

export const SpacerBlock = ({ height = '48px' }: SpacerBlockProps) => (
	<div style={{ height }} />
)
