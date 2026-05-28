(() => {
  const REQUEST_TYPE = 'GWR_EXTENSION_GM_XHR_REQUEST';
  const RESPONSE_TYPE = 'GWR_EXTENSION_GM_XHR_RESPONSE';
  const STATE_REQUEST_TYPE = 'GWR_EXTENSION_STATE_REQUEST';
  const STATE_RESPONSE_TYPE = 'GWR_EXTENSION_STATE_RESPONSE';
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

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    const payload = event.data || {};
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
})();
