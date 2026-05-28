      });
    return r.open = function(u, c, ...P) {
      return this[hg] = {
        rpcUrl: typeof c == "string" ? c : String(c || ""),
        requestBody: null
      }, a.call(this, u, c, ...P)
    }, r.send = function(u) {
      let c = this[hg] || {
        rpcUrl: "",
        requestBody: null
      };
      if (c.requestBody = u, this[hg] = c, !this[co] && typeof this.addEventListener == "function") {
        let P = () => {
          let p = this[hg],
            I = p?.rpcUrl || "";
          if (!mo(I) || typeof this.status == "number" && (this.status < 200 || this.status >= 300) || this.responseType && this.responseType !== "text") return;
          let l = typeof this.responseText == "string" ? this.responseText : typeof this.response == "string" ? this.response : "";
          l && Eo({
            rpcUrl: I,
            requestAssetIds: Pe(p?.requestBody),
            responseText: l,
            provideActionContext: i,
            onOriginalAssetDiscovered: t
          }).catch(B => {
            o?.warn?.("[Gemini Watermark Remover] Download RPC XHR hook processing failed:", B)
          })
        };
        this[co] = P, this.addEventListener("loadend", P)
      }
      return s.call(this, u)
    }, {
      dispose() {
        r.open = a, r.send = s
      }
    }
  }

  function le({
    originalFetch: A,
    isTargetUrl: g,
    normalizeUrl: e,
    processBlob: t,
    provideActionContext: o = null,
    getActionContext: n = () => null,
    onOriginalAssetDiscovered: r = null,
    onProcessedBlobResolved: a = null,
    onActionCriticalFailure: s = null,
    shouldProcessRequest: i = () => !0,
    failOpenOnProcessingError: D = !1,
    logger: u = console,
    cache: c = new Map
  }) {
    if (typeof A != "function") throw new TypeError("originalFetch must be a function");
    if (typeof g != "function") throw new TypeError("isTargetUrl must be a function");
    if (typeof e != "function") throw new TypeError("normalizeUrl must be a function");
    if (typeof t != "function") throw new TypeError("processBlob must be a function");
    if (typeof i != "function") throw new TypeError("shouldProcessRequest must be a function");
    let P = typeof o == "function" ? o : CA({
      getActionContext: n
    });
    return async function(...I) {
      if (lo(I)) return A(...I);
      let l = I[0],
        B = typeof l == "string" ? l : l?.url;
      if (!g(B)) return A(...I);
      if (!i({
          args: I,
          url: B
        })) return A(...I);
      let G = e(B),
        Y = P({
          args: I,
          url: B,
          normalizedUrl: G
        });
      if (Qi(Y)) return bi(Y.resource.blob, Y.resource.mimeType || "");
      let w = Ei(I, G),
        C = await A(...w);
      if (!C?.ok || !Mi(C)) return C;
      let f = D && typeof C.clone == "function" ? C.clone() : null;
      try {
        let m = c.get(G);
        m || (m = C.blob().then(async y => {
          let O = {
            url: B,
            normalizedUrl: G,
            responseStatus: C.status,
            responseStatusText: C.statusText,
            responseHeaders: io(C.headers)
          };
          return Y != null && (O.actionContext = Y), typeof r == "function" && await r(tA(O, Y)), t(y, O)
        }).finally(() => {
          c.get(G) === m && c.delete(G)
        }), c.set(G, m));
        let d = await m;
        return typeof a == "function" && await a(tA({
          url: B,
          normalizedUrl: G,
          processedBlob: d,
          responseStatus: C.status,
          responseStatusText: C.statusText,
          responseHeaders: io(C.headers)
        }, Y)), Oi(C, d)
      } catch (m) {
        if (u?.warn?.("[Gemini Watermark Remover] Download hook processing failed:", m), D && f) return f;
        throw await Ti(s, tA({
          error: m,
          url: B,
          normalizedUrl: G
        }, Y)), m
      }
    }
  }

  function bo(A, g) {
    if (!A || typeof A != "object") throw new TypeError("targetWindow must be an object");
    let e = g?.intentGate || De({
        targetWindow: A,
        resolveActionContext: g?.resolveActionContext
      }),
      t = typeof g?.originalFetch == "function" ? g.originalFetch : A.fetch,
      r = le({
        ...g,
        getActionContext: ({
          url: a = "",
          normalizedUrl: s = ""
        } = {}) => Te(e, {
          normalizedUrl: s,
          url: a
        }),
        onProcessedBlobResolved: async a => {
          await g?.onProcessedBlobResolved?.(a), a?.actionContext?.action === "download" && e.release()
        },
        onActionCriticalFailure: async a => {
          await g?.onActionCriticalFailure?.(a), a?.actionContext?.action === "download" && e.release()
        },
        shouldProcessRequest: g?.shouldProcessRequest || (({
          url: a = "",
          normalizedUrl: s = ""
        } = {}) => e.hasRecentIntent({
          normalizedUrl: s,
          url: a
        })),
        originalFetch: t
      });
    return A.fetch = r, r
  }

  function gB(A) {
    if (typeof A != "string" || A.length === 0) return "";
    let g = A.split(/\r?\n/);
    for (let e of g) {
      let t = e.indexOf(":");
      if (!(t <= 0 || e.slice(0, t).trim().toLowerCase() !== "content-type")) return e.slice(t + 1).trim().split(";")[0].trim().toLowerCase()
    }
    return ""
  }
  async function eB(A, g) {
    let e = await A(g, {
      credentials: "omit",
      redirect: "follow"
    });
    if (!e?.ok) throw new Error(`Failed to fetch image: ${e?.status||0}`);
    return e.blob()
  }
  async function tB(A, g) {
    return new Promise((e, t) => {
      A({
        method: "GET",
        url: g,
        responseType: "arraybuffer",
        onload: o => {
          let n = Number(o?.status) || 0;
          if (n < 200 || n >= 300) {
            t(new Error(`Failed to fetch image: ${n}`));
            return
          }
          let r = gB(o?.responseHeaders) || "image/png";
          e(new Blob([o.response], {
            type: r
          }))
        },
        onerror: () => {
          t(new Error("Failed to fetch image"))
        },
        ontimeout: () => {
          t(new Error("Failed to fetch image: timeout"))
        }
      })
    })
  }

  function oB(A) {
    try {
      let g = new URL(String(A || ""));
      return /^https?:$/i.test(g.protocol) && /(^|\.)googleusercontent\.com$/i.test(g.hostname)
    } catch {
      return !1
    }
  }

  function Mo({
    gmRequest: A = globalThis.GM_xmlhttpRequest,
    fallbackFetch: g = globalThis.fetch?.bind(globalThis) || null
  } = {}) {
    return async function(t) {
      if (typeof A == "function") return tB(A, t);
      if (oB(t)) throw new Error("Cross-origin preview fetch requires GM_xmlhttpRequest");
      if (typeof g == "function") return eB(g, t);
      throw new Error("Failed to fetch image")
    }
  }

  function rg(A, g = null) {
    return {
      processedBlob: A,
      processedMeta: g
    }
  }
  async function pe(A, {
    invalidBlobMessage: g = "Bridge processor must return a Blob"
  } = {}) {
    let e = A instanceof Blob ? rg(A, null) : rg(A?.processedBlob, A?.processedMeta ?? null),
      t = e.processedBlob;
    if (!(t instanceof Blob)) throw new Error(g);
    return {
      processedBuffer: await t.arrayBuffer(),
      mimeType: t.type || "image/png",
      meta: e.processedMeta ?? null
    }
  }

  function Ge(A = {}) {
    return {
      processedBlob: new Blob([A.processedBuffer], {
        type: A.mimeType || "image/png"
      }),
      processedMeta: A.meta ?? null
    }
  }

  function me(A) {
    return `${A}-${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  function Ye({
    targetWindow: A = globalThis.window || null,
    bridgeFlag: g,
    createHandler: e
  } = {}) {
    if (!A || typeof A.addEventListener != "function") return null;
    if (!g) throw new Error("bridgeFlag is required");
    if (A[g]) return A[g];
    if (typeof e != "function") throw new Error("createHandler must be a function");
    let t = e(),
      o = n => {
        t(n)
      };
    return A.addEventListener("message", o), A[g] = {
      handler: t,
      dispose() {
        A.removeEventListener?.("message", o), delete A[g]
      }
    }, A[g]
  }
  var nB = "gwr:page-process-request",
    rB = "gwr:page-process-response";

  function aB(A, g) {
    if (!g || !A || A === g) return !0;
    try {
      if (A.window === g || A.self === g) return !0
    } catch {}
    try {
      if (g.window === A || g.self === A) return !0
    } catch {}
    return !1
  }

  function sB(A = null) {
    if (!A || typeof A != "object") return null;
    let g = {};
    for (let e of ["responseId", "draftId", "conversationId"]) typeof A[e] == "string" && A[e].trim() && (g[e] = A[e].trim());
    return Object.keys(g).length > 0 ? g : null
  }

  function iB(A = null) {
    if (!A || typeof A != "object") return null;
    let g = {};
    for (let e of ["kind", "url", "mimeType", "source", "slot"]) typeof A[e] == "string" && A[e].trim() && (g[e] = A[e].trim());
    return A.processedMeta != null && (g.processedMeta = A.processedMeta), Object.keys(g).length > 0 ? g : null
  }

  function BB(A = null) {
    if (!A || typeof A != "object") return null;
    let g = {};
    typeof A.action == "string" && A.action.trim() && (g.action = A.action.trim()), typeof A.sessionKey == "string" && A.sessionKey.trim() && (g.sessionKey = A.sessionKey.trim());
    let e = sB(A.assetIds);
    e && (g.assetIds = e);
    let t = iB(A.resource);
    return t && (g.resource = t), Object.keys(g).length > 0 ? g : null
  }

  function cB(A = {}) {
    if (!A || typeof A != "object") return {};
    let g = {
        ...A
      },
      e = BB(A.actionContext);
    return delete g.actionContext, e && (g.actionContext = e), g
  }

  function Qo({
    targetWindow: A = globalThis.window || null,
    timeoutMs: g = 12e4,
    fallbackProcessWatermarkBlob: e,
    fallbackRemoveWatermarkFromBlob: t,
    logger: o = console
  } = {}) {
    async function n(r, a, s, i) {
