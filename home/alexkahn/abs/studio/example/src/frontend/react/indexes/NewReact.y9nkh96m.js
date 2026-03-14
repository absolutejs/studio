import {
  hideErrorOverlay,
  showErrorOverlay,
} from "../../../../../../../../../studio/example/chunk-by5rgrj5.js";
import "../../../../../../../../../studio/example/chunk-nbv5v51q.js";

// src/frontend/react/indexes/NewReact.tsx
import { hydrateRoot, createRoot } from "/react/vendor/react-dom_client.js";
import { createElement, Component } from "/react/vendor/react.js";

// src/frontend/react/pages/NewReact.tsx
import { useState } from "/react/vendor/react.js";
import { jsxDEV } from "/react/vendor/react_jsx-dev-runtime.js";
function NewReact({ cssPath }) {
  _s();
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ jsxDEV(
    "html",
    {
      children: [
        /* @__PURE__ */ jsxDEV(
          "head",
          {
            children: [
              /* @__PURE__ */ jsxDEV(
                "meta",
                {
                  charSet: "utf-8",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              /* @__PURE__ */ jsxDEV(
                "title",
                {
                  children: "AbsoluteJS + React",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              /* @__PURE__ */ jsxDEV(
                "meta",
                {
                  content: "AbsoluteJS React Page",
                  name: "description",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              /* @__PURE__ */ jsxDEV(
                "meta",
                {
                  content: "width=device-width, initial-scale=1",
                  name: "viewport",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              /* @__PURE__ */ jsxDEV(
                "link",
                {
                  href: "/assets/ico/favicon.ico",
                  rel: "icon",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              /* @__PURE__ */ jsxDEV(
                "link",
                {
                  href: "https://fonts.googleapis.com",
                  rel: "preconnect",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              /* @__PURE__ */ jsxDEV(
                "link",
                {
                  crossOrigin: "anonymous",
                  href: "https://fonts.gstatic.com",
                  rel: "preconnect",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              /* @__PURE__ */ jsxDEV(
                "link",
                {
                  href: "https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap",
                  rel: "stylesheet",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              cssPath &&
                /* @__PURE__ */ jsxDEV(
                  "link",
                  {
                    href: cssPath,
                    rel: "stylesheet",
                    type: "text/css",
                  },
                  undefined,
                  false,
                  undefined,
                  this,
                ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
        /* @__PURE__ */ jsxDEV(
          "body",
          {
            children: [
              /* @__PURE__ */ jsxDEV(
                "header",
                {
                  children: [
                    /* @__PURE__ */ jsxDEV(
                      "a",
                      {
                        href: "/",
                        children: "AbsoluteJS",
                      },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "details",
                      {
                        onPointerEnter: (e) => {
                          if (e.pointerType === "mouse")
                            e.currentTarget.open = true;
                        },
                        onPointerLeave: (e) => {
                          if (e.pointerType === "mouse")
                            e.currentTarget.open = false;
                        },
                        children: [
                          /* @__PURE__ */ jsxDEV(
                            "summary",
                            {
                              children: "Pages",
                            },
                            undefined,
                            false,
                            undefined,
                            this,
                          ),
                          /* @__PURE__ */ jsxDEV(
                            "nav",
                            {
                              children: [
                                /* @__PURE__ */ jsxDEV(
                                  "a",
                                  {
                                    href: "/react",
                                    children: "React",
                                  },
                                  undefined,
                                  false,
                                  undefined,
                                  this,
                                ),
                                /* @__PURE__ */ jsxDEV(
                                  "a",
                                  {
                                    href: "/html",
                                    children: "HTML",
                                  },
                                  undefined,
                                  false,
                                  undefined,
                                  this,
                                ),
                                /* @__PURE__ */ jsxDEV(
                                  "a",
                                  {
                                    href: "/svelte",
                                    children: "Svelte",
                                  },
                                  undefined,
                                  false,
                                  undefined,
                                  this,
                                ),
                                /* @__PURE__ */ jsxDEV(
                                  "a",
                                  {
                                    href: "/vue",
                                    children: "Vue",
                                  },
                                  undefined,
                                  false,
                                  undefined,
                                  this,
                                ),
                                /* @__PURE__ */ jsxDEV(
                                  "a",
                                  {
                                    href: "/htmx",
                                    children: "HTMX",
                                  },
                                  undefined,
                                  false,
                                  undefined,
                                  this,
                                ),
                                /* @__PURE__ */ jsxDEV(
                                  "a",
                                  {
                                    href: "/angular",
                                    children: "Angular",
                                  },
                                  undefined,
                                  false,
                                  undefined,
                                  this,
                                ),
                              ],
                            },
                            undefined,
                            true,
                            undefined,
                            this,
                          ),
                        ],
                      },
                      undefined,
                      true,
                      undefined,
                      this,
                    ),
                  ],
                },
                undefined,
                true,
                undefined,
                this,
              ),
              /* @__PURE__ */ jsxDEV(
                "main",
                {
                  children: [
                    /* @__PURE__ */ jsxDEV(
                      "nav",
                      {
                        children: [
                          /* @__PURE__ */ jsxDEV(
                            "a",
                            {
                              href: "https://absolutejs.com",
                              target: "_blank",
                              children: /* @__PURE__ */ jsxDEV(
                                "img",
                                {
                                  className: "logo",
                                  src: "/assets/png/absolutejs-temp.png",
                                  alt: "AbsoluteJS Logo",
                                },
                                undefined,
                                false,
                                undefined,
                                this,
                              ),
                            },
                            undefined,
                            false,
                            undefined,
                            this,
                          ),
                          /* @__PURE__ */ jsxDEV(
                            "a",
                            {
                              href: "https://react.dev/",
                              children: /* @__PURE__ */ jsxDEV(
                                "img",
                                {
                                  className: "logo react",
                                  src: "/assets/svg/react.svg",
                                  alt: "React Logo",
                                },
                                undefined,
                                false,
                                undefined,
                                this,
                              ),
                            },
                            undefined,
                            false,
                            undefined,
                            this,
                          ),
                        ],
                      },
                      undefined,
                      true,
                      undefined,
                      this,
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "h1",
                      {
                        children: "AbsoluteJS + React",
                      },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => setCount(count + 1),
                        children: ["count is ", count],
                      },
                      undefined,
                      true,
                      undefined,
                      this,
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "p",
                      {
                        children: [
                          "Edit ",
                          /* @__PURE__ */ jsxDEV(
                            "code",
                            {
                              children: "src/frontend/react/pages/NewReact.tsx",
                            },
                            undefined,
                            false,
                            undefined,
                            this,
                          ),
                          " and save to test HMR.",
                        ],
                      },
                      undefined,
                      true,
                      undefined,
                      this,
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "p",
                      {
                        style: { marginTop: "2rem" },
                        children:
                          "Explore the other pages to see multiple frameworks running together.",
                      },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "p",
                      {
                        style: {
                          color: "#777",
                          fontSize: "1rem",
                          marginTop: "2rem",
                        },
                        children:
                          "Click on the AbsoluteJS and React logos to learn more.",
                      },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                  ],
                },
                undefined,
                true,
                undefined,
                this,
              ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
      ],
    },
    undefined,
    true,
    undefined,
    this,
  );
}
var _s = $RefreshSig$();
_s(NewReact, "MY+OAOgvYPI=");
$RefreshReg$(NewReact, "src/frontend/react/pages/NewReact.tsx:NewReact");

// src/frontend/react/indexes/NewReact.tsx
window.__HMR_FRAMEWORK__ = "react";
window.__REACT_COMPONENT_KEY__ = "NewReactIndex";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    window.__ERROR_BOUNDARY__ = this;
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    showErrorOverlay({
      framework: "react",
      kind: "runtime",
      message: error && error.stack ? error.stack : String(error),
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.hasError && !this.state.hasError) {
      hideErrorOverlay();
    }
  }
  reset() {
    this.setState({ hasError: false });
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
var isDev = true;
var componentPath = "../pages/NewReact";
function isHydrationError(error) {
  if (!error) return false;
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = String(error);
  const fullMessage = errorMessage + " " + errorString;
  const hydrationKeywords = [
    "hydration",
    "Hydration",
    "mismatch",
    "Mismatch",
    "did not match",
    "server rendered HTML",
    "server HTML",
    "client HTML",
    "Hydration failed",
  ];
  const isHydration = hydrationKeywords.some((keyword) =>
    fullMessage.includes(keyword),
  );
  if (isHydration) {
    const isHeadRelated =
      fullMessage.includes("<head") ||
      fullMessage.includes("</head>") ||
      fullMessage.includes("head>") ||
      fullMessage.includes("<link") ||
      fullMessage.includes("link>") ||
      fullMessage.includes("stylesheet") ||
      fullMessage.includes("fonts.googleapis") ||
      fullMessage.includes('rel="stylesheet"');
    const hasWhitespacePattern =
      /\{\s*["']\\n[^"']*["']\s*\}/.test(fullMessage) ||
      /\{\s*["'][\\n\\r\\s]+["']\s*\}/.test(fullMessage) ||
      /-\s*\{\s*["'][\\n\\r\\s]+["']\s*\}/.test(fullMessage);
    const isWhitespaceOnly =
      /^[\s\n\r]*$/.test(errorString) || /^[\s\n\r]*$/.test(errorMessage);
    const hasNewlinePattern =
      fullMessage.includes("\\n") ||
      fullMessage.includes("\\r") ||
      fullMessage.includes(`
`) ||
      fullMessage.includes("\r");
    if (
      isHeadRelated &&
      (hasWhitespacePattern || isWhitespaceOnly || hasNewlinePattern)
    ) {
      return false;
    }
  }
  return isHydration;
}
function logHydrationError(error, componentName) {
  if (!isDev) return;
  if (window.__HMR_WS__ && window.__HMR_WS__.readyState === WebSocket.OPEN) {
    try {
      window.__HMR_WS__.send(
        JSON.stringify({
          type: "hydration-error",
          data: {
            componentName: "NewReact",
            componentPath,
            error: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
          },
        }),
      );
    } catch (err) {}
  }
}
var hasSwitchedToClientOnly = false;
var hydrationErrorDetected = false;
function handleHydrationFallback(error) {
  if (hasSwitchedToClientOnly) return;
  hasSwitchedToClientOnly = true;
  hydrationErrorDetected = true;
  logHydrationError(error, "NewReact");
  try {
    if (
      window.__REACT_ROOT__ &&
      typeof window.__REACT_ROOT__.unmount === "function"
    ) {
      try {
        window.__REACT_ROOT__.unmount();
      } catch (e) {}
    }
    const root = createRoot(container);
    root.render(
      createElement(ErrorBoundary, null, createElement(NewReact, mergedProps)),
    );
    window.__REACT_ROOT__ = root;
    window.__HMR_CLIENT_ONLY_MODE__ = true;
  } catch (fallbackError) {
    window.location.reload();
  }
}
var preservedState =
  typeof window !== "undefined" && window.__HMR_PRESERVED_STATE__
    ? window.__HMR_PRESERVED_STATE__
    : {};
if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
  const hmrStateJson = sessionStorage.getItem("__REACT_HMR_STATE__");
  if (hmrStateJson) {
    try {
      const hmrState = JSON.parse(hmrStateJson);
      preservedState = { ...preservedState, ...hmrState };
      sessionStorage.removeItem("__REACT_HMR_STATE__");
    } catch (e) {}
  }
}
var mergedProps = { ...(window.__INITIAL_PROPS__ || {}), ...preservedState };
if (typeof window !== "undefined") {
  window.__HMR_PRESERVED_STATE__ = undefined;
}
var container = typeof document !== "undefined" ? document : null;
if (!container) {
  throw new Error("React root container not found: document is null");
}
if (!window.__REACT_ROOT__) {
  let root;
  try {
    root = hydrateRoot(
      container,
      createElement(ErrorBoundary, null, createElement(NewReact, mergedProps)),
      {
        onRecoverableError: (error) => {
          if (isDev && isHydrationError(error)) {
            handleHydrationFallback(error);
          } else {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            const errorString = String(error);
            const fullMessage = errorMessage + " " + errorString;
            const hydrationKeywords = [
              "hydration",
              "Hydration",
              "mismatch",
              "Mismatch",
              "did not match",
              "server rendered HTML",
              "server HTML",
              "client HTML",
              "Hydration failed",
            ];
            const isHydration = hydrationKeywords.some((keyword) =>
              fullMessage.includes(keyword),
            );
            if (isHydration) {
              const isHeadRelated =
                fullMessage.includes("<head") ||
                fullMessage.includes("</head>") ||
                fullMessage.includes("head>") ||
                fullMessage.includes("<link") ||
                fullMessage.includes("link>") ||
                fullMessage.includes("stylesheet") ||
                fullMessage.includes("fonts.googleapis") ||
                fullMessage.includes('rel="stylesheet"');
              const hasWhitespacePattern =
                /\{\s*["']\\n[^"']*["']\s*\}/.test(fullMessage) ||
                /\{\s*["'][\\n\\r\\s]+["']\s*\}/.test(fullMessage) ||
                /-\s*\{\s*["'][\\n\\r\\s]+["']\s*\}/.test(fullMessage);
              const isWhitespaceOnly =
                /^[\s\n\r]*$/.test(errorString) ||
                /^[\s\n\r]*$/.test(errorMessage);
              const hasNewlinePattern =
                fullMessage.includes("\\n") ||
                fullMessage.includes("\\r") ||
                fullMessage.includes(`
`) ||
                fullMessage.includes("\r");
              if (
                isHeadRelated &&
                (hasWhitespacePattern || isWhitespaceOnly || hasNewlinePattern)
              ) {
                return;
              }
            }
            console.error("React recoverable error:", error);
          }
        },
      },
    );
    window.__REACT_ROOT__ = root;
  } catch (error) {
    if (isDev && isHydrationError(error)) {
      handleHydrationFallback(error);
    } else {
      throw error;
    }
  }
  if (isDev) {
    const originalError = console.error;
    console.error = function (...args) {
      const errorMessage = args
        .map((arg) => {
          if (arg instanceof Error) return arg.message;
          return String(arg);
        })
        .join(" ");
      if (
        isHydrationError({ message: errorMessage }) &&
        !hydrationErrorDetected
      ) {
        hydrationErrorDetected = true;
        const syntheticError = new Error(errorMessage);
        setTimeout(() => {
          handleHydrationFallback(syntheticError);
        }, 0);
      }
      originalError.apply(console, args);
    };
  }
}
