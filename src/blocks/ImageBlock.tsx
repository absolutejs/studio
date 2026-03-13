import React from 'react'

type ImageBlockProps = {
	src?: string
	alt?: string
	width?: string
}

export const ImageBlock = ({ src = '', alt = '', width = '100%' }: ImageBlockProps) => (
	<img src={src} alt={alt} style={{ width, maxWidth: '100%', display: 'block' }} />
)
