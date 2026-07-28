(() => {
  const REQUEST_TYPE = 'GWR_EXTENSION_GM_XHR_REQUEST';
  const RESPONSE_TYPE = 'GWR_EXTENSION_GM_XHR_RESPONSE';
  const STATE_REQUEST_TYPE = 'GWR_EXTENSION_STATE_REQUEST';
  const STATE_RESPONSE_TYPE = 'GWR_EXTENSION_STATE_RESPONSE';
  const SETTINGS_PUSH_TYPE = 'GWR_EXTENSION_SETTINGS_PUSH';
  const STATS_REPORT_TYPE = 'GWR_EXTENSION_STATS_REPORT';
  const ENABLED_KEY = 'gwrEnabled';

  function getRuntimeApi() {
    if (globalThis.chrome?.runtime?.sendMessage) return globalThis.chrome;
    if (globalThis.browser?.runtime?.sendMessage) return globalThis.browser;
    return null;
  }

  function readEnabled(callback) {
    const storage = globalThis.chrome?.storage?.local || globalThis.browser?.storage?.local || null;
    if (!storage) {
      callback(true);
      return;
    }

    try {
      storage.get({ [ENABLED_KEY]: true }, (result) => {
        callback(result?.[ENABLED_KEY] !== false);
      });
    } catch {
      callback(true);
    }
  }

  // Push current settings to MAIN world on load
  function pushSettingsToPage() {
    const storage = globalThis.chrome?.storage?.local || globalThis.browser?.storage?.local || null;
    if (!storage) return;

    try {
      storage.get(['gwc_settings', ENABLED_KEY], (result) => {
        const settings = result?.gwc_settings || null;
        const enabled = result?.[ENABLED_KEY] !== false;
        window.postMessage({
          type: SETTINGS_PUSH_TYPE,
          settings: settings ? { ...settings, enabled } : { enabled },
        }, '*');
      });
    } catch { /* ignore */ }
  }

  // Listen for storage changes and relay to MAIN world
  const storageApi = globalThis.chrome?.storage || globalThis.browser?.storage || null;
  if (storageApi?.onChanged) {
    storageApi.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes.gwc_settings || changes[ENABLED_KEY]) {
        pushSettingsToPage();
      }
    });
  }

  // Listen for stats reports from MAIN world and forward to background
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const payload = event.data || {};

    if (payload.type === STATS_REPORT_TYPE && payload.stats) {
      const storage = globalThis.chrome?.storage?.local || globalThis.browser?.storage?.local || null;
      if (storage) {
        try {
          storage.set({ gwc_stats: payload.stats });
        } catch { /* ignore */ }
      }
      return;
    }

    if (payload.type === STATE_REQUEST_TYPE && payload.requestId) {
      readEnabled((enabled) => {
        window.postMessage(
          {
            type: STATE_RESPONSE_TYPE,
            requestId: payload.requestId,
            enabled,
          },
          '*'
        );
      });
      // Also push full settings on state request
      pushSettingsToPage();
      return;
    }

    if (payload.type !== REQUEST_TYPE || !payload.requestId) return;

    const runtimeApi = getRuntimeApi();
    if (!runtimeApi) {
      postFailure(payload.requestId);
      return;
    }

    try {
      runtimeApi.runtime.sendMessage(
        {
          type: REQUEST_TYPE,
          requestId: payload.requestId,
          request: payload.request || {},
        },
        (response) => {
          const errorMessage = runtimeApi.runtime.lastError?.message || 'No extension response';
          postFailure(
            payload.requestId,
            response || {
              ok: false,
              status: 0,
              statusText: '',
              headers: {},
              bytes: [],
              error: errorMessage,
            }
          );
        }
      );
    } catch (error) {
      postFailure(payload.requestId, {
        ok: false,
        status: 0,
        statusText: '',
        headers: {},
        bytes: [],
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  function postFailure(requestId, response = null) {
    window.postMessage(
      {
        type: RESPONSE_TYPE,
        requestId,
        response: response || {
          ok: false,
          status: 0,
          statusText: '',
          headers: {},
          bytes: [],
          error: 'Extension runtime unavailable',
        },
      },
      '*'
    );
  }

  // Push settings on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pushSettingsToPage, { once: true });
  } else {
    pushSettingsToPage();
  }
})();
