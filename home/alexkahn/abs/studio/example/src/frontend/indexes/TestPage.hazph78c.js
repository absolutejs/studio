import {
  hideErrorOverlay,
  showErrorOverlay,
} from "../../../../../../../../studio/example/chunk-by5rgrj5.js";
import "../../../../../../../../studio/example/chunk-nbv5v51q.js";

// src/frontend/indexes/TestPage.tsx
import { hydrateRoot, createRoot } from "/react/vendor/react-dom_client.js";
import { createElement, Component } from "/react/vendor/react.js";

// src/frontend/pages/TestPage.tsx
import { jsxDEV } from "/react/vendor/react_jsx-dev-runtime.js";
function TestPage({ cssPath }) {
  return /* @__PURE__ */ jsxDEV(
    "html",
    {
      lang: "en",
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
                "meta",
                {
                  name: "viewport",
                  content: "width=device-width, initial-scale=1",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              /* @__PURE__ */ jsxDEV(
                "title",
                {
                  children: "TestPage",
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
                    rel: "stylesheet",
                    href: cssPath,
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
            children: /* @__PURE__ */ jsxDEV(
              "main",
              {
                children: /* @__PURE__ */ jsxDEV(
                  "h1",
                  {
                    children: "TestPage",
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
  );
}
$RefreshReg$(TestPage, "src/frontend/pages/TestPage.tsx:TestPage");

// src/frontend/indexes/TestPage.tsx
window.__HMR_FRAMEWORK__ = "react";
window.__REACT_COMPONENT_KEY__ = "TestPageIndex";

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
var componentPath = "../pages/TestPage";
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
            componentName: "TestPage",
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
  logHydrationError(error, "TestPage");
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
      createElement(ErrorBoundary, null, createElement(TestPage, mergedProps)),
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
      createElement(ErrorBoundary, null, createElement(TestPage, mergedProps)),
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
