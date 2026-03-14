export const vueMonarchLanguage = {
  defaultToken: "",
  tokenPostfix: ".vue",

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
      // Script tag — dark blue like VSCode
      [/(<)(script)/, ["delimiter.html", { token: "tag", next: "@scriptTag" }]],
      // Style tag — dark blue like VSCode
      [/(<)(style)/, ["delimiter.html", { token: "tag", next: "@styleTag" }]],
      // Template tag
      [
        /(<)(template)/,
        ["delimiter.html", { token: "tag", next: "@templateTag" }],
      ],

      // Other top-level HTML — split closing tags
      [/(<\/)(script)(>)/, ["delimiter.html", "tag", "delimiter.html"]],
      [/(<\/)(style)(>)/, ["delimiter.html", "tag", "delimiter.html"]],
      [/(<\/)([\w-]+)(>)/, ["delimiter.html", "tag", "delimiter.html"]],
      [/(<)([\w-]+)/, ["delimiter.html", { token: "tag", next: "@htmlTag" }]],
      [/[^<]+/, ""],
    ],

    templateTag: [
      [/\s+/, ""],
      [
        /([\w-]+)(=)(")([^"]*)(")/,
        ["attribute.name", "delimiter", "string", "string", "string"],
      ],
      [/>/, { token: "delimiter.html", switchTo: "@templateContent" }],
    ],

    templateContent: [
      [
        /(<\/)(template)(>)/,
        ["delimiter.html", "tag", { token: "delimiter.html", next: "@pop" }],
      ],

      // Vue interpolation {{ }}
      [/\{\{/, { token: "delimiter.bracket", next: "@vueExpression" }],

      // HTML comment
      [/<!--/, "comment.html", "@htmlComment"],

      // HTML closing tags — split angle brackets (gray) from tag name
      [
        /(<\/)([A-Z][\w$]*)(>)/,
        ["delimiter.html", "tag.component", "delimiter.html"],
      ],
      [/(<\/)([\w-]+)(>)/, ["delimiter.html", "tag", "delimiter.html"]],
      // HTML opening tags — components (PascalCase) vs elements
      [
        /(<)([A-Z][\w$]*)/,
        [
          "delimiter.html",
          { token: "tag.component", next: "@htmlTagInTemplate" },
        ],
      ],
      [
        /(<)([\w-]+)/,
        ["delimiter.html", { token: "tag", next: "@htmlTagInTemplate" }],
      ],

      // HTML entities
      [/&\w+;/, "string.html"],
      // Text content — no token → uses editor.foreground (white)
      [/[^<{&]+/, ""],
    ],

    htmlTagInTemplate: [
      [/\s+/, ""],
      // Vue directives — match name, transition to directiveAttr for = and value
      [/v-[\w-]+/, { token: "meta.directive", next: "@directiveAttr" }],
      // @event shorthand
      [
        /(@@)([\w.-]+)/,
        ["attribute.name", { token: "attribute.name", next: "@directiveAttr" }],
      ],
      // :prop shorthand
      [
        /(:)([\w.-]+)/,
        ["attribute.name", { token: "attribute.name", next: "@directiveAttr" }],
      ],
      // #slot shorthand
      [
        /(#)([\w.-]+)/,
        ["attribute.name", { token: "attribute.name", next: "@directiveAttr" }],
      ],
      // Standard attributes
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
      [/[\w-]+/, "attribute.name"],
      [/\/?>/, { token: "delimiter.html", next: "@pop" }],
    ],

    // After a directive name — handle optional ="value"
    // Uses switchTo so directiveValue pops straight back to htmlTagInTemplate
    directiveAttr: [
      [/\s+/, ""],
      [/=/, "delimiter"],
      [/"/, { token: "delimiter", switchTo: "@directiveValue" }],
      [/'/, { token: "delimiter", switchTo: "@directiveValueSingle" }],
      // No value follows (e.g. bare v-show) — pop without consuming
      [/(?=\S)/, "", "@pop"],
    ],

    directiveValue: [
      // Closing quote
      [/"/, { token: "delimiter", next: "@pop" }],
      // Identifiers — check keywords/types
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
      [/@digits/, "number"],
      [/@symbols/, "operator"],
      [/[^"a-zA-Z_$0-9=><!~?:&|+\-*\/\^%]+/, "variable"],
    ],

    directiveValueSingle: [
      // Closing quote
      [/'/, { token: "delimiter", next: "@pop" }],
      // Identifiers — check keywords/types
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
      [/@digits/, "number"],
      [/@symbols/, "operator"],
      [/[^'a-zA-Z_$0-9=><!~?:&|+\-*\/\^%]+/, "variable"],
    ],

    vueExpression: [
      [/\}\}/, { token: "delimiter.bracket", next: "@pop" }],
      // Function calls → yellow
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

    htmlTag: [
      [/\s+/, ""],
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
      [/[\w-]+/, "attribute.name"],
      [/\/?>/, { token: "delimiter.html", next: "@pop" }],
    ],

    htmlComment: [
      [/-->/, "comment.html", "@pop"],
      [/[^-]+/, "comment.html"],
      [/./, "comment.html"],
    ],

    attrStringDouble: [
      [/[^"]+/, "string"],
      [/"/, { token: "string", next: "@pop" }],
    ],

    attrStringSingle: [
      [/[^']+/, "string"],
      [/'/, { token: "string", next: "@pop" }],
    ],

    scriptTag: [
      [/\s+/, ""],
      [/setup/, "attribute.name"],
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
      // Check typeKeywords FIRST so string/number/boolean → green
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
      [/scoped/, "attribute.name"],
      [
        /(lang)(=)(")([^"]*)(")/,
        ["attribute.name", "delimiter", "string", "string", "string"],
      ],
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

    cssSelectorRules: [
      [
        /@@(?:media|supports|container|layer|scope)\b/,
        { token: "keyword.css", next: "@cssAtRuleCondition" },
      ],
      [/@@keyframes\b/, { token: "keyword.css", next: "@cssAtRuleCondition" }],
      [/@@font-face\b/, "keyword.css"],
      [/@@import\b/, "keyword.css"],
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
};
