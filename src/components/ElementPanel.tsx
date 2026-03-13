import { useState, useEffect } from 'react'

type SelectedElement = {
	tagName: string
	id: string
	className: string
	textContent: string
	attributes: Record<string, string>
}

type ElementPanelProps = {
	selectedElement: SelectedElement | null
	onTextChange: (value: string) => void
	onAttributeChange: (name: string, value: string) => void
}

export const ElementPanel = ({
	selectedElement,
	onTextChange,
	onAttributeChange,
}: ElementPanelProps) => {
	const [editText, setEditText] = useState('')
	const [editAttrs, setEditAttrs] = useState<Record<string, string>>({})

	useEffect(() => {
		if (selectedElement) {
			setEditText(selectedElement.textContent.slice(0, 100))
			setEditAttrs({ ...selectedElement.attributes })
		}
	}, [selectedElement])

	if (!selectedElement) {
		return (
			<div className="studio-inspector">
				<p className="studio-inspector-empty">Select an element in the preview</p>
			</div>
		)
	}

	const handleTextChange = (value: string) => {
		setEditText(value)
		onTextChange(value)
	}

	const handleAttrChange = (name: string, value: string) => {
		setEditAttrs((prev) => ({ ...prev, [name]: value }))
		onAttributeChange(name, value)
	}

	return (
		<div>
			<div className="studio-inspector-title">Inspector</div>

			<div className="studio-inspector-section">
				<div className="studio-inspector-tag">
					&lt;{selectedElement.tagName}&gt;
				</div>

				{selectedElement.id && (
					<div className="studio-inspector-field">
						<label className="studio-inspector-label">ID</label>
						<span className="studio-inspector-value">#{selectedElement.id}</span>
					</div>
				)}

				{selectedElement.className && (
					<div className="studio-inspector-field">
						<label className="studio-inspector-label">Classes</label>
						<span className="studio-inspector-value">
							{typeof selectedElement.className === 'string'
								? selectedElement.className
										.trim()
										.split(/\s+/)
										.map((cls) => `.${cls}`)
										.join(' ')
								: ''}
						</span>
					</div>
				)}
			</div>

			<div className="studio-inspector-section">
				<div className="studio-inspector-field">
					<label className="studio-inspector-label">Text</label>
					<input
						className="studio-inspector-value"
						value={editText}
						onChange={(e) => handleTextChange(e.target.value)}
					/>
				</div>
			</div>

			{Object.keys(editAttrs).length > 0 && (
				<div className="studio-inspector-section">
					<div className="studio-inspector-title">Attributes</div>
					{Object.entries(editAttrs).map(([name, value]) => (
						<div className="studio-inspector-field" key={name}>
							<label className="studio-inspector-label">{name}</label>
							<input
								className="studio-inspector-value"
								value={value}
								onChange={(e) => handleAttrChange(name, e.target.value)}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
