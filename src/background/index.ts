(() => {
  console.log('GWC Enterprise | Background service online.');

  interface GwrProxyRequest {
    url?: string;
    method?: string;
    headers?: Record<string, unknown>;
    data?: BodyInit | null;
  }

  const GWR_XHR_REQUEST = 'GWR_EXTENSION_GM_XHR_REQUEST';

  const defaultSettings = {
    enabled: true,
    alphaThreshold: 0.002,
    maxAlpha: 0.99,
    debug: false,
  };

  const defaultStats = {
    total_images: 0,
    last_processed: 0,
    last_image_stats: null,
  };

  function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  function sanitizeHeaders(headers: unknown): Record<string, string> {
    if (!isRecord(headers)) return {};

    return Object.fromEntries(
      Object.entries(headers)
        .filter(([key, value]) => key && value != null)
        .map(([key, value]) => [key, String(value)])
    );
  }

  function toProxyRequest(value: unknown): GwrProxyRequest {
    return isRecord(value) ? value as GwrProxyRequest : {};
  }

  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason !== 'install') return;

    console.log('GWC Enterprise | Installed.');

    await chrome.storage.local.set({
      gwc_settings: defaultSettings,
      gwrEnabled: true,
      gwc_stats: defaultStats,
    });
  });

  chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
    if (!isRecord(message) || typeof message.type !== 'string') {
      return false;
    }

    if (message.type === GWR_XHR_REQUEST) {
      const request = toProxyRequest(message.request);

      fetch(String(request.url || ''), {
        method: request.method || 'GET',
        headers: sanitizeHeaders(request.headers),
        body: request.data ?? undefined,
        credentials: 'omit',
        redirect: 'follow',
      })
        .then(async (response) => {
          const buffer = await response.arrayBuffer();
          sendResponse({
            ok: response.ok,
            finalUrl: response.url,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            bytes: Array.from(new Uint8Array(buffer)),
          });
        })
        .catch((error: unknown) => {
          sendResponse({
            ok: false,
            finalUrl: request.url || '',
            status: 0,
            statusText: '',
            headers: {},
            bytes: [],
            error: error instanceof Error ? error.message : String(error),
          });
        });

      return true;
    }

    if (message.type === 'GWC_STATS_UPDATE') {
      // Badge intentionally disabled: no persistent global state in MV3 service worker.
      return false;
    }

    if (message.type === 'GWC_GET_STATS') {
      chrome.storage.local
        .get(['gwc_stats'])
        .then((data) => sendResponse(data.gwc_stats || null))
        .catch(() => sendResponse(null));

      return true;
    }

    return false;
  });
})();
