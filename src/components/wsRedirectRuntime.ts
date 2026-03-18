/**
 * WebSocket redirect runtime — injected into the preview iframe.
 * Compiled to JS at build time and loaded via <script src> tag.
 *
 * Redirects WebSocket connections from the studio host to the dev server
 * so that HMR works correctly inside the preview iframe.
 *
 * The dev server host is passed via a data attribute on the script tag:
 *   <script src="/ws-redirect.[hash].js" data-dev-host="localhost:3000"></script>
 */
(function () {
  const scriptEl = document.currentScript as HTMLScriptElement | null;
  if (!scriptEl) return;

  const devHost = scriptEl.getAttribute("data-dev-host");
  if (!devHost) return;

  const studioHost = location.host;
  const OriginalWebSocket = WebSocket;

  window.WebSocket = function (
    url: string | URL,
    protocols?: string | string[],
  ) {
    if (typeof url === "string") {
      url = url.replace(studioHost, devHost);
    }
    return protocols !== undefined
      ? new OriginalWebSocket(url, protocols)
      : new OriginalWebSocket(url);
  } as unknown as typeof WebSocket;

  Object.defineProperties(window.WebSocket, {
    prototype: { value: OriginalWebSocket.prototype },
    CONNECTING: { value: 0 },
    OPEN: { value: 1 },
    CLOSING: { value: 2 },
    CLOSED: { value: 3 },
  });
})();
