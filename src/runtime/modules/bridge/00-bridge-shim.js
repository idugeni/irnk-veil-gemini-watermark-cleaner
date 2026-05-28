  var Ee = "GWR_EXTENSION_GM_XHR_REQUEST",
    he = "GWR_EXTENSION_GM_XHR_RESPONSE",
    Oe = "GWR_EXTENSION_STATE_REQUEST",
    be = "GWR_EXTENSION_STATE_RESPONSE";
  var nn = 1;

  function rn(A = {}) {
    return !A || typeof A != "object" ? {} : typeof Headers < "u" && A instanceof Headers ? Object.fromEntries(A.entries()) : {
      ...A
    }
  }

  function an(A = {}) {
    return Object.entries(A).map(([g, e]) => `${g}: ${e}`).join(`\r
`)
  }

  function Me(A = []) {
    return new Uint8Array(A).buffer
  }

  function sn(A, g = "") {
    let e = String(g || "").toLowerCase(),
      t = Me(A?.bytes || []);
    if (e === "arraybuffer") return t;
    if (e === "blob") {
      let n = A?.headers?.["content-type"] || A?.headers?.["Content-Type"] || "";
      return new Blob([t], {
        type: n
      })
    }
    let o = new TextDecoder().decode(t);
    return e === "json" ? o ? JSON.parse(o) : null : o
  }

  function Bn(A) {
    return function(e = {}) {
      let t = `gwr-gm-xhr-${Date.now()}-${nn++}`,
        o = Number(e.timeout) || 0,
        n = !1,
        r = null,
        a = () => {
          A.removeEventListener("message", D), r != null && A.clearTimeout(r)
        },
        s = (u, c) => {
          n || (n = !0, a(), u?.(c))
        },
        i = u => ({
          finalUrl: u?.finalUrl || e.url || "",
          readyState: 4,
          response: sn(u, e.responseType),
          responseHeaders: an(u?.headers || {}),
          responseText: new TextDecoder().decode(Me(u?.bytes || [])),
          status: Number(u?.status) || 0,
          statusText: u?.statusText || ""
        });

      function D(u) {
        if (u.source !== A) return;
        let c = u.data || {};
        if (!(c.type !== he || c.requestId !== t)) {
          if (c.error || c.response?.ok === !1) {
            s(e.onerror, {
              error: c.error || c.response?.error || "GM_xmlhttpRequest failed",
              status: Number(c.response?.status) || 0,
              statusText: c.response?.statusText || ""
            });
            return
          }
          s(e.onload, i(c.response))
        }
      }
      return A.addEventListener("message", D), o > 0 && (r = A.setTimeout(() => {
        s(e.ontimeout, {
          error: "timeout",
          status: 0,
          statusText: ""
        })
      }, o)), A.postMessage({
        type: Ee,
        requestId: t,
        request: {
          data: e.data ?? e.body ?? null,
          headers: rn(e.headers),
          method: e.method || "GET",
          responseType: e.responseType || "",
          url: e.url || ""
        }
      }, "*"), {
        abort() {
          s(e.onabort, {
            error: "abort",
            status: 0,
            statusText: ""
          })
        }
      }
    }
  }

  function Qe({
    targetWindow: A = globalThis.window
  } = {}) {
    return !A || typeof A != "object" ? null : (A.unsafeWindow = A, A.GM_xmlhttpRequest = Bn(A), A.GM = {
      ...A.GM && typeof A.GM == "object" ? A.GM : {},
      xmlHttpRequest: A.GM_xmlhttpRequest
    }, {
      GM_xmlhttpRequest: A.GM_xmlhttpRequest,
      unsafeWindow: A.unsafeWindow
    })
  }

  function Tg(A = null) {
    return A && typeof A == "object" ? A : null
  }

  function qA(A = null) {
    return !A || typeof A != "object" ? null : Tg(A.actionContext)
  }

  function CA({
    getActionContext: A = null
  } = {}) {
    return (...g) => cn({
      getActionContext: A,
      args: g
    })
  }

  function cn({
    getActionContext: A = null,
    args: g = []
  } = {}) {
    return typeof A == "function" ? A(...g) : null
  }

  function tA(A = {}, g = null) {
    return !g || typeof g != "object" ? {
      ...A
    } : {
      ...A,
      actionContext: g
    }
  }

  function Te(A = null, g = null) {
    return !A || typeof A != "object" ? null : typeof A.getRecentActionContext == "function" ? A.getRecentActionContext(g) : null
  }
  async function oA(A, g = "image/png", {
    unavailableMessage: e = "Canvas blob export API is unavailable",
    nullBlobMessage: t = "Failed to encode image blob"
  } = {}) {
    if (typeof A?.convertToBlob == "function") return await A.convertToBlob({
      type: g
    });
    if (typeof A?.toBlob == "function") return await new Promise((o, n) => {
      A.toBlob(r => {
        r ? o(r) : n(new Error(t))
