import React from 'react'

type HeroBlockProps = {
	backgroundImage?: string
	title?: string
	subtitle?: string
	ctaText?: string
	ctaLink?: string
	overlayOpacity?: number
}

export const HeroBlock = ({
	backgroundImage = '',
	title = 'Hero Title',
	subtitle = '',
	ctaText = 'Learn More',
	ctaLink = '#',
	overlayOpacity = 0.5,
}: HeroBlockProps) => (
	<div
		style={{
			position: 'relative',
			backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			minHeight: '400px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
			}}
		/>
		<div style={{ position: 'relative', textAlign: 'center', color: '#fff', padding: '48px' }}>
			<h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{title}</h1>
			{subtitle && <p style={{ fontSize: '1.25rem', marginBottom: '24px' }}>{subtitle}</p>}
			<a
				href={ctaLink}
				style={{
					display: 'inline-block',
					padding: '12px 32px',
					backgroundColor: '#89b4fa',
					color: '#1e1e2e',
					borderRadius: '6px',
					textDecoration: 'none',
					fontWeight: 600,
				}}
			>
				{ctaText}
			</a>
		</div>
	</div>
)
