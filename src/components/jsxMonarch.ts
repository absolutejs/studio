export const jsxMonarchLanguage = {
  defaultToken: "",
  tokenPostfix: ".tsx",

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
    "as",
    "implements",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "type",
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
    "is",
    "asserts",
    "satisfies",
    "interface",
    "constructor",
    "override",
    "out",
    "global",
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
    "Exclude",
    "Extract",
    "NonNullable",
    "ReturnType",
    "Parameters",
    "InstanceType",
    "ConstructorParameters",
    "JSX",
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
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc:
    /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

  tokenizer: {
    root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],

    common: [
      // Decorators
      [/@@[a-zA-Z_$][\w$]*/, "annotation"],

      // Function declaration: function name → name is yellow (annotation)
      [/(function)(\s+)([a-zA-Z_$][\w$]*)/, ["keyword", "", "annotation"]],

      // Import/export statements — enter importStatement so all identifiers are light blue
      [
        /(import|export)(\s+)/,
        ["keyword.import", { token: "", next: "@importStatement" }],
      ],

      // Function calls: identifier followed by ( or < → yellow
      [
        /#?[a-zA-Z_$][\w$]*(?=\s*\()/,
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

      // Identifiers and keywords
      [
        /#?[a-z_$][\w$]*/,
        {
          cases: {
            "@typeKeywords": "type",
            "@importKeywords": "keyword.import",
            "@controlKeywords": "keyword.control",
            "@keywords": "keyword",
            "@default": "identifier",
          },
        },
      ],
      // PascalCase in code context → type.identifier (green for types/components)
      [
        /[A-Z][\w$]*/,
        {
          cases: {
            "@typeKeywords": "type",
            "@default": "type.identifier",
          },
        },
      ],

      { include: "@whitespace" },

      // Regular expression
      [
        /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: "regexp", bracket: "@open", next: "@regexp" },
      ],

      // Delimiters and operators
      [/[()]/, "delimiter.parenthesis"],
      [/[\[\]]/, "delimiter.square"],

      // JSX tags — MUST come before generic <> handling
      // Closing tags: </Component> or </div>
      [
        /(<\/)([A-Z][\w$]*)(>)/,
        ["delimiter.html", "tag.component", "delimiter.html"],
      ],
      [/(<\/)([\w-]+)(>)/, ["delimiter.html", "tag", "delimiter.html"]],
      // Fragment </>
      [/<\/>/, "delimiter.html"],
      // Opening tags: <Component or <div (enter attributes state)
      [
        /(<)([A-Z][\w$]*)/,
        ["delimiter.html", { token: "tag.component", next: "@jsxAttributes" }],
      ],
      [
        /(<)([\w-]+)/,
        ["delimiter.html", { token: "tag", next: "@jsxAttributes" }],
      ],

      // Generic < > for comparison/generics (not JSX)
      [/[<>](?!@symbols)/, "delimiter.angle"],
      [/!(?=([^=]|$))/, "delimiter"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": "",
          },
        },
      ],

      // Numbers
      [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
      [/0[xX](@hexdigits)n?/, "number.hex"],
      [/0[oO]?(@octaldigits)n?/, "number.octal"],
      [/0[bB](@binarydigits)n?/, "number.binary"],
      [/(@digits)n?/, "number"],

      // Delimiter
      [/[;,.]/, "delimiter"],

      // Strings
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"],
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

    jsxAttributes: [
      [/\s+/, ""],
      // Self-closing /> — pop back to code context
      [/\/>/, { token: "delimiter.html", next: "@pop" }],
      // Closing > — enter JSX content
      [/>/, { token: "delimiter.html", switchTo: "@jsxContent" }],
      // Attribute with expression value: key={expr}
      [
        /([\w$-]+)(\s*)(=)(\s*)(\{)/,
        [
          "attribute.name",
          "",
          "delimiter",
          "",
          { token: "delimiter.bracket", next: "@jsxExpression" },
        ],
      ],
      // Attribute with double-quoted string
      [
        /([\w$-]+)(\s*)(=)(\s*)(")/,
        [
          "attribute.name",
          "",
          "delimiter",
          "",
          { token: "string", next: "@jsxAttrStringDouble" },
        ],
      ],
      // Attribute with single-quoted string
      [
        /([\w$-]+)(\s*)(=)(\s*)(')/,
        [
          "attribute.name",
          "",
          "delimiter",
          "",
          { token: "string", next: "@jsxAttrStringSingle" },
        ],
      ],
      // Boolean attribute
      [/[\w$-]+/, "attribute.name"],
    ],

    // JSX content between tags — text is white (empty token)
    jsxContent: [
      // Closing tag — pop back
      [
        /(<\/)([A-Z][\w$]*)(>)/,
        [
          "delimiter.html",
          "tag.component",
          { token: "delimiter.html", next: "@pop" },
        ],
      ],
      [
        /(<\/)([\w-]+)(>)/,
        ["delimiter.html", "tag", { token: "delimiter.html", next: "@pop" }],
      ],
      // Nested opening tag — component
      [
        /(<)([A-Z][\w$]*)/,
        ["delimiter.html", { token: "tag.component", next: "@jsxAttributes" }],
      ],
      // Nested opening tag — html element
      [
        /(<)([\w-]+)/,
        ["delimiter.html", { token: "tag", next: "@jsxAttributes" }],
      ],
      // Fragment </>
      [/<\/>/, { token: "delimiter.html", next: "@pop" }],
      // Expression in JSX content
      [/\{/, { token: "delimiter.bracket", next: "@jsxExpression" }],
      // Text content — white (empty token = editor.foreground)
      [/[^<{]+/, ""],
    ],

    jsxAttrStringDouble: [
      [/[^"]+/, "string"],
      [/"/, { token: "string", next: "@pop" }],
    ],

    jsxAttrStringSingle: [
      [/[^']+/, "string"],
      [/'/, { token: "string", next: "@pop" }],
    ],

    jsxExpression: [
      [/\{/, "delimiter.bracket", "@jsxExpression"],
      [/\}/, { token: "delimiter.bracket", next: "@pop" }],
      { include: "common" },
    ],

    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
      [/\/\*/, "comment", "@commentBlock"],
      [/\/\/.*$/, "comment"],
    ],

    jsdoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"],
    ],

    commentBlock: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"],
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
      { include: "common" },
    ],

    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        [
          "regexp.escape.control",
          "regexp.escape.control",
          "regexp.escape.control",
        ],
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        ["regexp.escape.control", { token: "regexp.escape.control" }],
      ],
      [
        /(\])([dgimsuy]*)/,
        [{ token: "regexp.escape.control" }, { token: "regexp", next: "@pop" }],
      ],
      [/@regexpesc/, "regexp.escape"],
      [/[^\\\/]/, "regexp"],
      [
        /(\/)([dgimsuy]*)/,
        [{ token: "regexp" }, { token: "keyword.other", next: "@pop" }],
      ],
    ],
  },
} as const;
