export const svelteMonarchLanguage = {
  defaultToken: "",
  tokenPostfix: ".svelte",

  importKeywords: ["import", "export", "from", "as", "default"],

  controlKeywords: [
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "return",
    "throw",
    "try",
    "catch",
    "finally",
    "yield",
    "await",
    "of",
    "in",
  ],

  keywords: [
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "in",
    "instanceof",
    "let",
    "new",
    "null",
    "of",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "undefined",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "async",
    "await",
    "implements",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "namespace",
    "abstract",
    "declare",
    "enum",
    "module",
    "require",
    "get",
    "set",
    "readonly",
    "keyof",
    "infer",
    "unique",
    "satisfies",
    "interface",
    "type",
  ],

  typeKeywords: [
    "string",
    "number",
    "boolean",
    "symbol",
    "bigint",
    "object",
    "void",
    "never",
    "unknown",
    "any",
    "undefined",
    "null",
    "Array",
    "Map",
    "Set",
    "Promise",
    "Record",
    "Partial",
    "Required",
    "Readonly",
    "Pick",
    "Omit",
  ],

  operators: [
    "<=",
    ">=",
    "==",
    "!=",
    "===",
    "!==",
    "=>",
    "+",
    "-",
    "**",
    "*",
    "/",
    "%",
    "++",
    "--",
    "<<",
    ">>",
    ">>>",
    "&",
    "|",
    "^",
    "!",
    "~",
    "&&",
    "||",
    "??",
    "?",
    ":",
    "=",
    "+=",
    "-=",
    "*=",
    "**=",
    "/=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "...",
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,

  tokenizer: {
    root: [
      // Svelte logic blocks: {#if}, {/if}, {:else}, {#each}, {#await}, {#snippet}, {#key}
      [
        /(\{)([#/:@])(\w+)/,
        ["delimiter.bracket", "keyword.control", "keyword.control"],
      ],

      // Script tag — dark blue like VSCode
      [/(<)(script)/, ["delimiter.html", { token: "tag", next: "@scriptTag" }]],
      // Style tag — dark blue like VSCode
      [/(<)(style)/, ["delimiter.html", { token: "tag", next: "@styleTag" }]],

      // Svelte special elements: svelte:head, svelte:body, etc
      // < → gray, svelte: → magenta, then enter state for element name → dark blue
      [
        /(<)(svelte:)/,
        [
          "delimiter.html",
          { token: "meta.directive", next: "@svelteElemName" },
        ],
      ],

      // HTML closing tags — split angle brackets (gray) from tag name (dark blue)
      [
        /(<\/)(svelte:)/,
        [
          "delimiter.html",
          { token: "meta.directive", next: "@svelteElemCloseName" },
        ],
      ],
      [/(<\/)(script)(>)/, ["delimiter.html", "tag", "delimiter.html"]],
      [/(<\/)(style)(>)/, ["delimiter.html", "tag", "delimiter.html"]],
      [
        /(<\/)([A-Z][\w$]*)(>)/,
        ["delimiter.html", "tag.component", "delimiter.html"],
      ],
      [/(<\/)([\w-]+)(>)/, ["delimiter.html", "tag", "delimiter.html"]],
      // HTML opening tags — distinguish components (PascalCase) from elements
      [
        /(<)([A-Z][\w$]*)/,
        ["delimiter.html", { token: "tag.component", next: "@htmlTag" }],
      ],
      [/(<)([\w-]+)/, ["delimiter.html", { token: "tag", next: "@htmlTag" }]],

      // Svelte expressions in template
      [/\{/, { token: "delimiter.bracket", next: "@svelteExpression" }],

      // HTML entities
      [/&\w+;/, "string.html"],

      // HTML comment
      [/<!--/, "comment.html", "@htmlComment"],

      // HTML text content — no token so it uses editor.foreground (white)
      [/[^<{&]+/, ""],
    ],

    // svelte: element name (opening tag) — tag then enter htmlTag for attributes
    svelteElemName: [[/[\w-]+/, { token: "tag", switchTo: "@htmlTag" }]],

    // svelte: element name (closing tag) — tag then expect >
    svelteElemCloseName: [
      [/([\w-]+)(>)/, ["tag", { token: "delimiter.html", next: "@pop" }]],
    ],

    htmlComment: [
      [/-->/, "comment.html", "@pop"],
      [/[^-]+/, "comment.html"],
      [/./, "comment.html"],
    ],

    htmlTag: [
      [/\s+/, ""],
      // Svelte directives: on:click, bind:value, class:active, use:action, transition:fade
      [
        /(on|bind|class|style|use|transition|in|out|animate|let)(:)([\w|.]+)/,
        ["meta.directive", "delimiter", "meta.directive"],
      ],
      // Svelte event modifiers |preventDefault etc
      [/(\|)(\w+)/, ["delimiter", "meta.directive"]],
      // Svelte shorthand {variable}
      [/\{/, { token: "delimiter.bracket", next: "@svelteExpression" }],
      // Standard attributes with expression values
      [
        /([\w-]+)(=)(\{)/,
        [
          "attribute.name",
          "delimiter",
          { token: "delimiter.bracket", next: "@svelteExpression" },
        ],
      ],
      // Standard attributes with string values
      [
        /([\w-]+)(=)(")/,
        [
          "attribute.name",
          "delimiter",
          { token: "string", next: "@attrStringDouble" },
        ],
      ],
      [
        /([\w-]+)(=)(')/,
        [
          "attribute.name",
          "delimiter",
          { token: "string", next: "@attrStringSingle" },
        ],
      ],
      // Boolean attributes
      [/[\w-]+/, "attribute.name"],
      [/\/?>/, { token: "delimiter.html", next: "@pop" }],
    ],

    attrStringDouble: [
      [/\{/, { token: "delimiter.bracket", next: "@svelteExpression" }],
      [/[^"{]+/, "string"],
      [/"/, { token: "string", next: "@pop" }],
    ],

    attrStringSingle: [
      [/\{/, { token: "delimiter.bracket", next: "@svelteExpression" }],
      [/[^'{]+/, "string"],
      [/'/, { token: "string", next: "@pop" }],
    ],

    svelteExpression: [
      [/\{/, "delimiter.bracket", "@svelteExpression"],
      [/\}/, { token: "delimiter.bracket", next: "@pop" }],
      // Svelte runes — yellow (annotation)
      [
        /\$(?:state|derived|effect|props|bindable|inspect|host)\b/,
        "annotation",
      ],
      // Function calls: identifier followed by ( → yellow
      [
        /[a-zA-Z_$][\w$]*(?=\s*\()/,
        {
          cases: {
            "@typeKeywords": "type",
            "@keywords": "keyword",
            "@default": "annotation",
          },
        },
      ],
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            "@typeKeywords": "type",
            "@keywords": "keyword",
            "@default": "variable",
          },
        },
      ],
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"],
      [/@digits/, "number"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": "delimiter",
          },
        },
      ],
      [/[,;.]/, "delimiter"],
      [/[()]/, "delimiter.parenthesis"],
      [/[\[\]]/, "delimiter.bracket"],
    ],

    scriptTag: [
      [/\s+/, ""],
      [
        /(lang)(=)(")([^"]*)(")/,
        ["attribute.name", "delimiter", "string", "string", "string"],
      ],
      [
        /([\w-]+)(=)(")([^"]*)(")/,
        ["attribute.name", "delimiter", "string", "string", "string"],
      ],
      [/>/, { token: "delimiter.html", switchTo: "@scriptContent" }],
    ],

    scriptContent: [
      [
        /(<\/)(script)(>)/,
        ["delimiter.html", "tag", { token: "delimiter.html", next: "@pop" }],
      ],
      // Svelte runes — yellow (annotation)
      [
        /\$(?:state|derived|effect|props|bindable|inspect|host)\b/,
        "annotation",
      ],
      // Import/export statements — enter importStatement so all identifiers are light blue
      [
        /(import|export)(\s+)/,
        ["keyword.import", { token: "", next: "@importStatement" }],
      ],
      // Function declaration: function name → yellow
      [/(function)(\s+)([a-zA-Z_$][\w$]*)/, ["keyword", "", "annotation"]],
      // Function calls: identifier followed by ( or <T>( → yellow
      [
        /[a-zA-Z_$][\w$]*(?=\s*[<(])/,
        {
          cases: {
            "@typeKeywords": "type",
            "@importKeywords": "keyword.import",
            "@controlKeywords": "keyword.control",
            "@keywords": "keyword",
            "@default": "annotation",
          },
        },
      ],
      // PascalCase → type.identifier (green for types/components)
      [
        /[A-Z][\w$]*/,
        {
          cases: {
            "@typeKeywords": "type",
            "@default": "type.identifier",
          },
        },
      ],
      // Identifiers/keywords — check typeKeywords FIRST so string/number/boolean → green
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@typeKeywords": "type",
            "@importKeywords": "keyword.import",
            "@controlKeywords": "keyword.control",
            "@keywords": "keyword",
            "@default": "variable",
          },
        },
      ],
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"],
      [/\/\/.*$/, "comment"],
      [/\/\*/, "comment", "@commentBlock"],
      [/@digits/, "number"],
      [/</, "delimiter.angle"],
      [/>/, "delimiter.angle"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": "delimiter",
          },
        },
      ],
      [/[{}]/, "delimiter.bracket"],
      [/[()]/, "delimiter.parenthesis"],
      [/[\[\]]/, "delimiter.square"],
      [/[;,.]/, "delimiter"],
    ],

    // Import/export statement — all identifiers are light blue (identifier)
    importStatement: [
      [/\s+/, ""],
      // End of import statement on semicolon or newline
      [/;/, { token: "delimiter", next: "@pop" }],
      [/\n/, { token: "", next: "@pop" }],
      // from keyword
      [/\bfrom\b/, "keyword.import"],
      // as keyword
      [/\bas\b/, "keyword.import"],
      // default keyword
      [/\bdefault\b/, "keyword.import"],
      // type keyword in import type {}
      [/\btype\b/, "keyword"],
      // function declaration after export
      [
        /(function)(\s+)([a-zA-Z_$][\w$]*)/,
        ["keyword", "", { token: "annotation", next: "@pop" }],
      ],
      // const/let/var after export — go to declarationName to make name yellow
      [
        /\b(const|let|var)\b/,
        { token: "keyword", switchTo: "@declarationName" },
      ],
      // Braces for destructured imports
      [/[{}]/, "delimiter.bracket"],
      // Commas
      [/,/, "delimiter"],
      // All identifiers in import context are light blue
      [/[a-zA-Z_$][\w$]*/, "identifier"],
      // String (module path)
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      // Star for wildcard imports
      [/\*/, "operator"],
    ],

    // After export const/let/var — next identifier is yellow (declaration name)
    declarationName: [
      [/\s+/, ""],
      [/[a-zA-Z_$][\w$]*/, { token: "annotation", next: "@pop" }],
      // Destructuring — pop back to normal
      [/[{[]/, { token: "delimiter.bracket", next: "@pop" }],
      // Fallback
      [/./, { token: "", next: "@pop" }],
    ],

    styleTag: [
      [/\s+/, ""],
      [
        /([\w-]+)(=)(")([^"]*)(")/,
        ["attribute.name", "delimiter", "string", "string", "string"],
      ],
      [/>/, { token: "delimiter.html", switchTo: "@styleContent" }],
    ],

    styleContent: [
      [
        /(<\/)(style)(>)/,
        ["delimiter.html", "tag", { token: "delimiter.html", next: "@pop" }],
      ],
      { include: "@cssSelectorRules" },
    ],

    // Shared selector-context rules
    cssSelectorRules: [
      // At-rules that contain selectors (not declarations)
      [
        /@@(?:media|supports|container|layer|scope)\b/,
        { token: "keyword.css", next: "@cssAtRuleCondition" },
      ],
      [/@@keyframes\b/, { token: "keyword.css", next: "@cssAtRuleCondition" }],
      [/@@font-face\b/, "keyword.css"],
      [/@@import\b/, "keyword.css"],
      [/:root\b/, "keyword.css"],
      [/:global\b/, "keyword.css"],
      [/:local\b/, "keyword.css"],
      [/::?[\w-]+/, "tag.css"],
      [/\.[\w-]+/, "tag.css"],
      [/#[\w-]+(?![0-9a-fA-F]{2,})/, "tag.css"],
      [/\[/, "delimiter.bracket", "@cssAttrSelector"],
      [/\{/, { token: "delimiter.bracket", next: "@cssDeclarationBlock" }],
      [/\/\*/, "comment", "@commentBlock"],
      [/,/, "delimiter"],
      [/[()]/, "delimiter.parenthesis"],
      [/[\w-]+/, "tag.css"],
      [/\s+/, ""],
    ],

    cssDeclarationBlock: [
      [/\}/, { token: "delimiter.bracket", next: "@pop" }],
      // Nested at-rules open a selector block
      [/@@[\w-]+\b/, { token: "keyword.css", next: "@cssAtRuleCondition" }],
      [/[\w-]+(?=\s*:)/, "attribute.name"],
      [/:/, "delimiter"],
      [/;/, "delimiter"],
      [/#[0-9a-fA-F]{3,8}\b/, "number.hex"],
      [
        /\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|s|ms|deg|rad|turn|fr)?/,
        "number",
      ],
      [/"[^"]*"/, "string"],
      [/'[^']*'/, "string"],
      [/\/\*/, "comment", "@commentBlock"],
      [/!important\b/, "keyword.css"],
      [/[\w-]+\(/, "function.css"],
      [/\)/, "delimiter.parenthesis"],
      [/,/, "delimiter"],
      [/[\w-]+/, "string"],
    ],

    // At-rule condition: consumes (...) then { opens cssAtRuleBlock
    cssAtRuleCondition: [
      [/\{/, { token: "delimiter.bracket", switchTo: "@cssAtRuleBlock" }],
      [/[()]/, "delimiter.parenthesis"],
      [/[\w-]+/, "tag.css"],
      [/:/, "delimiter"],
      [/,/, "delimiter"],
      [/"[^"]*"/, "string"],
      [/'[^']*'/, "string"],
      [
        /\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|s|ms|deg|rad|turn|fr)?/,
        "number",
      ],
      [/\s+/, ""],
    ],

    // At-rule block (e.g. @media { ... }): contains selectors, } pops
    cssAtRuleBlock: [
      [/\}/, { token: "delimiter.bracket", next: "@pop" }],
      { include: "@cssSelectorRules" },
    ],

    cssAttrSelector: [
      [/\]/, "delimiter.bracket", "@pop"],
      [/[\w-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/"[^"]*"/, "string"],
      [/'[^']*'/, "string"],
    ],

    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"],
    ],

    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"],
    ],

    string_backtick: [
      [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
      [/[^\\`$]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, "string", "@pop"],
    ],

    bracketCounting: [
      [/\{/, "delimiter.bracket", "@bracketCounting"],
      [/\}/, "delimiter.bracket", "@pop"],
      [
        /\$(?:state|derived|effect|props|bindable|inspect|host)\b/,
        "annotation",
      ],
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            "@typeKeywords": "type",
            "@keywords": "keyword",
            "@default": "variable",
          },
        },
      ],
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/@digits/, "number"],
    ],

    commentBlock: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"],
    ],
  },
} as const;
