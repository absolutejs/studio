export const jsxMonarchLanguage = {
	defaultToken: 'invalid',
	tokenPostfix: '.tsx',

	keywords: [
		'break',
		'case',
		'catch',
		'class',
		'const',
		'continue',
		'debugger',
		'default',
		'delete',
		'do',
		'else',
		'export',
		'extends',
		'false',
		'finally',
		'for',
		'from',
		'function',
		'if',
		'import',
		'in',
		'instanceof',
		'let',
		'new',
		'null',
		'of',
		'return',
		'super',
		'switch',
		'this',
		'throw',
		'true',
		'try',
		'typeof',
		'undefined',
		'var',
		'void',
		'while',
		'with',
		'yield',
		'async',
		'await',
		'as',
		'implements',
		'package',
		'private',
		'protected',
		'public',
		'static',
		'type',
		'namespace',
		'abstract',
		'declare',
		'enum',
		'module',
		'require',
		'get',
		'set',
		'readonly',
		'keyof',
		'infer',
		'unique',
		'is',
		'never',
		'unknown',
		'any',
		'asserts',
		'satisfies',
	],

	typeKeywords: [
		'string',
		'number',
		'boolean',
		'symbol',
		'bigint',
		'object',
		'void',
		'never',
		'unknown',
		'any',
		'undefined',
		'null',
		'Array',
		'Map',
		'Set',
		'Promise',
		'Record',
		'Partial',
		'Required',
		'Readonly',
		'Pick',
		'Omit',
		'Exclude',
		'Extract',
		'NonNullable',
		'ReturnType',
		'Parameters',
		'InstanceType',
		'ConstructorParameters',
		'JSX',
	],

	operators: [
		'<=',
		'>=',
		'==',
		'!=',
		'===',
		'!==',
		'=>',
		'+',
		'-',
		'**',
		'*',
		'/',
		'%',
		'++',
		'--',
		'<<',
		'</',
		'>>',
		'>>>',
		'&',
		'|',
		'^',
		'!',
		'~',
		'&&',
		'||',
		'??',
		'?',
		':',
		'=',
		'+=',
		'-=',
		'*=',
		'**=',
		'/=',
		'%=',
		'<<=',
		'>>=',
		'>>>=',
		'&=',
		'|=',
		'^=',
		'@',
		'...',
	],

	symbols: /[=><!~?:&|+\-*\/\^%]+/,
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
	digits: /\d+(_+\d+)*/,
	octaldigits: /[0-7]+(_+[0-7]+)*/,
	binarydigits: /[0-1]+(_+[0-1]+)*/,
	hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
	regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
	regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

	tokenizer: {
		root: [
			// JSX self-closing tag: <Component />
			[/(<)([\w$]+)(\s*)(\/)(>)/, ['delimiter', 'tag', '', 'delimiter', 'delimiter']],

			// JSX closing tag: </Component>
			[/(<\/)([\w$]+)(>)/, ['delimiter', 'tag', 'delimiter']],

			// JSX opening tag start: <Component or <div
			[/(<)([\w$]+)/, ['delimiter', { token: 'tag', next: '@jsxAttributes' }]],

			// Decorators
			[/@[a-zA-Z_$][\w$]*/, 'annotation'],

			// Identifiers and keywords
			[
				/[a-zA-Z_$][\w$]*/,
				{
					cases: {
						'@typeKeywords': 'type.identifier',
						'@keywords': 'keyword',
						'@default': 'identifier',
					},
				},
			],

			// Whitespace
			{ include: '@whitespace' },

			// Regular expression
			[
				/\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
				{ token: 'regexp', bracket: '@open', next: '@regexp' },
			],

			// Delimiters and operators
			[/[{}()\[\]]/, '@brackets'],
			[/[<>](?!@symbols)/, '@brackets'],
			[
				/@symbols/,
				{
					cases: {
						'@operators': 'operator',
						'@default': '',
					},
				},
			],

			// Numbers
			[/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
			[/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
			[/0[xX](@hexdigits)n?/, 'number.hex'],
			[/0[oO]?(@octaldigits)n?/, 'number.octal'],
			[/0[bB](@binarydigits)n?/, 'number.binary'],
			[/(@digits)n?/, 'number'],

			// Delimiter
			[/[;,.]/, 'delimiter'],

			// Strings
			[/"/, 'string', '@string_double'],
			[/'/, 'string', '@string_single'],
			[/`/, 'string', '@string_backtick'],
		],

		jsxAttributes: [
			[/\s+/, ''],
			[/([\w$\-]+)(\s*)(=)(\s*)(")/, ['attribute.name', '', 'delimiter', '', { token: 'attribute.value', next: '@jsxAttrStringDouble' }]],
			[/([\w$\-]+)(\s*)(=)(\s*)(')/, ['attribute.name', '', 'delimiter', '', { token: 'attribute.value', next: '@jsxAttrStringSingle' }]],
			[/([\w$\-]+)(\s*)(=)(\s*)(\{)/, ['attribute.name', '', 'delimiter', '', { token: 'delimiter', next: '@jsxExpression' }]],
			[/[\w$\-]+/, 'attribute.name'],
			[/\/?>/, { token: 'delimiter', next: '@pop' }],
		],

		jsxAttrStringDouble: [
			[/[^"]+/, 'attribute.value'],
			[/"/, { token: 'attribute.value', next: '@pop' }],
		],

		jsxAttrStringSingle: [
			[/[^']+/, 'attribute.value'],
			[/'/, { token: 'attribute.value', next: '@pop' }],
		],

		jsxExpression: [
			[/\{/, 'delimiter', '@jsxExpression'],
			[/\}/, { token: 'delimiter', next: '@pop' }],
			{ include: 'root' },
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/\/\*/, 'comment', '@commentBlock'],
			[/\/\/.*$/, 'comment'],
		],

		comment: [
			[/\/\/.*$/, 'comment'],
		],

		commentBlock: [
			[/[^\/*]+/, 'comment'],
			[/\*\//, 'comment', '@pop'],
			[/[\/*]/, 'comment'],
		],

		string_double: [
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string', '@pop'],
		],

		string_single: [
			[/[^\\']+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/'/, 'string', '@pop'],
		],

		string_backtick: [
			[/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
			[/[^\\`$]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/`/, 'string', '@pop'],
		],

		bracketCounting: [
			[/\{/, 'delimiter.bracket', '@bracketCounting'],
			[/\}/, 'delimiter.bracket', '@pop'],
			{ include: 'root' },
		],

		regexp: [
			[
				/(\{)(\d+(?:,\d*)?)(\})/,
				['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control'],
			],
			[
				/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
				['regexp.escape.control', { token: 'regexp.escape.control' }],
			],
			[/(\])([dgimsuy]*)/, [{ token: 'regexp.escape.control' }, { token: 'regexp', next: '@pop' }]],
			[/@regexpesc/, 'regexp.escape'],
			[/[^\\\/]/, 'regexp'],
			[/(\/)([dgimsuy]*)/, [{ token: 'regexp' }, { token: 'keyword.other', next: '@pop' }]],
		],
	},
} as const
