import type { StudioBlockDefinition } from '../../types/studio'

export const builtinBlocks: StudioBlockDefinition[] = [
	{
		name: 'TextBlock',
		category: 'Text',
		description: 'A paragraph with configurable alignment',
		props: {
			text: {
				type: 'string',
				label: 'Text',
				defaultValue: 'Enter text...',
			},
			align: {
				type: 'select',
				label: 'Alignment',
				defaultValue: 'left',
				options: ['left', 'center', 'right', 'justify'],
			},
		},
		component: './TextBlock',
	},
	{
		name: 'HeadingBlock',
		category: 'Text',
		description: 'A heading element (h1-h6) with configurable level and alignment',
		props: {
			text: {
				type: 'string',
				label: 'Text',
				defaultValue: 'Heading',
			},
			level: {
				type: 'number',
				label: 'Level (1-6)',
				defaultValue: 2,
			},
			align: {
				type: 'select',
				label: 'Alignment',
				defaultValue: 'left',
				options: ['left', 'center', 'right'],
			},
		},
		component: './HeadingBlock',
	},
	{
		name: 'ImageBlock',
		category: 'Media',
		description: 'An image with alt text and width control',
		props: {
			src: {
				type: 'image',
				label: 'Image Source',
				defaultValue: '',
			},
			alt: {
				type: 'string',
				label: 'Alt Text',
				defaultValue: '',
			},
			width: {
				type: 'string',
				label: 'Width',
				defaultValue: '100%',
			},
		},
		component: './ImageBlock',
	},
	{
		name: 'HeroBlock',
		category: 'Media',
		description: 'A hero section with background image, overlay, title, subtitle, and CTA',
		props: {
			backgroundImage: {
				type: 'image',
				label: 'Background Image',
				defaultValue: '',
			},
			title: {
				type: 'string',
				label: 'Title',
				defaultValue: 'Hero Title',
			},
			subtitle: {
				type: 'string',
				label: 'Subtitle',
				defaultValue: '',
			},
			ctaText: {
				type: 'string',
				label: 'Button Text',
				defaultValue: 'Learn More',
			},
			ctaLink: {
				type: 'string',
				label: 'Button Link',
				defaultValue: '#',
			},
			overlayOpacity: {
				type: 'number',
				label: 'Overlay Opacity',
				defaultValue: 0.5,
			},
		},
		component: './HeroBlock',
	},
	{
		name: 'ButtonBlock',
		category: 'Interactive',
		description: 'A styled link button with variant options',
		props: {
			text: {
				type: 'string',
				label: 'Text',
				defaultValue: 'Click me',
			},
			href: {
				type: 'string',
				label: 'Link URL',
				defaultValue: '#',
			},
			variant: {
				type: 'select',
				label: 'Variant',
				defaultValue: 'primary',
				options: ['primary', 'secondary', 'outline'],
			},
		},
		component: './ButtonBlock',
	},
	{
		name: 'SpacerBlock',
		category: 'Layout',
		description: 'A vertical spacer with configurable height',
		props: {
			height: {
				type: 'string',
				label: 'Height',
				defaultValue: '48px',
			},
		},
		component: './SpacerBlock',
	},
	{
		name: 'CodeBlock',
		category: 'Code',
		description: 'A code block with syntax highlighting support',
		props: {
			code: {
				type: 'string',
				label: 'Code',
				defaultValue: '',
			},
			language: {
				type: 'select',
				label: 'Language',
				defaultValue: '',
				options: ['', 'javascript', 'typescript', 'html', 'css', 'json', 'bash', 'python'],
			},
		},
		component: './CodeBlock',
	},
	{
		name: 'ColumnsBlock',
		category: 'Layout',
		description: 'A grid layout with 2-4 columns',
		props: {
			columns: {
				type: 'number',
				label: 'Columns (2-4)',
				defaultValue: 2,
			},
			gap: {
				type: 'string',
				label: 'Gap',
				defaultValue: '24px',
			},
		},
		component: './ColumnsBlock',
	},
	{
		name: 'HTMLBlock',
		category: 'Code',
		description: 'Raw HTML content renderer',
		props: {
			html: {
				type: 'string',
				label: 'HTML',
				defaultValue: '',
			},
		},
		component: './HTMLBlock',
	},
]
