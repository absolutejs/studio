type StudioHeadProps = {
	title?: string
	cssPath?: string
}

export const StudioHead = ({
	title = 'Absolute Studio',
	cssPath,
}: StudioHeadProps) => (
	<head>
		<meta charSet="utf-8" />
		<title>{title}</title>
		<meta content="width=device-width, initial-scale=1" name="viewport" />
		{cssPath && <link href={cssPath} rel="stylesheet" type="text/css" />}
	</head>
)
