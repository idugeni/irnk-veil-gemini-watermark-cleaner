  function Ho(A = {}) {
    let {
      targetWindow: g = globalThis.window || null
    } = A;
    return Ye({
      targetWindow: g,
      bridgeFlag: GB,
      createHandler() {
        return mB({
          ...A,
          targetWindow: g
        })
      }
    })
  }
  var Ro = "gemini-watermark-remover";

  function qo(A = globalThis) {
    let g = A?.trustedTypes;
    if (!g || typeof g.createPolicy != "function") return null;
    try {
      return (typeof g.getPolicy == "function" ? g.getPolicy(Ro) : null) || g.createPolicy(Ro, {
        createScript: t => t,
        createScriptURL: t => t
      })
    } catch {
      return null
    }
  }

  function _o(A, g = globalThis) {
    let e = qo(g);
    if (!e) return A;
    if (typeof e.createScript != "function") return null;
    try {
      return e.createScript(A)
    } catch {
      return null
    }
  }

  function we(A, g = globalThis) {
    let e = qo(g);
    if (!e) return A;
    if (typeof e.createScriptURL != "function") return null;
    try {
      return e.createScriptURL(A)
    } catch {
      return null
    }
  }

  function zo(A, g = globalThis) {
    return we(A, g)
  }
  var TA = "__gwrPageProcessorScriptInstalled__",
    SA = "__gwrPageProcessRuntimeInstalled__",
    YB = 5e3;

  function CB(A) {
    let g = A?.querySelector?.("script[nonce]"),
      e = g?.nonce || g?.getAttribute?.("nonce") || "";
    return typeof e == "string" && e.length > 0 ? e : ""
  }

  function wB(A, g) {
    !A || !g || (A.nonce = g, A.setAttribute?.("nonce", g))
  }

  function vo(A, g) {
    let e = A.createElement("script");
    return wB(e, g), e
  }

  function Ko(A, g) {
    (A.head || A.documentElement || A.body)?.appendChild(g)
  }
  async function fB({
    targetWindow: A,
    documentRef: g,
    scriptCode: e,
    nonce: t
  }) {
    let o = vo(g, t),
      n = _o(e, A);
    if (!n) throw new Error("Trusted Types script injection unavailable");
    return o.textContent = n, Ko(g, o), o.remove(), A[SA] || null
  }
  async function dB({
    targetWindow: A,
    documentRef: g,
    scriptCode: e,
    nonce: t
  }) {
    let o = vo(g, t),
      n = URL.createObjectURL(new Blob([e], {
        type: "text/javascript"
      })),
      r = we(n, A);
    if (!r) throw URL.revokeObjectURL(n), new Error("Trusted Types script URL injection unavailable");
    try {
      await new Promise((a, s) => {
        let i = () => {
            A.clearTimeout?.(D), o.onload = null, o.onerror = null
          },
          D = A.setTimeout?.(() => {
            i(), s(new Error("Page runtime blob injection timed out"))
          }, YB);
        o.onload = () => {
          i(), a()
        }, o.onerror = () => {
          i(), s(new Error("Page runtime blob injection failed"))
        }, o.src = r, Ko(g, o)
      })
    } finally {
      o.remove(), URL.revokeObjectURL(n)
    }
    return A[SA] || null
  }
  async function xo({
    targetWindow: A = globalThis.window || null,
    scriptCode: g = "",
    logger: e = console
  } = {}) {
    if (!A || typeof g != "string" || g.length === 0) return null;
    if (A[SA]) return A[SA];
    if (A[TA]) return A[TA];
    let t = A.document;
    if (!t || typeof t.createElement != "function") return null;
    let o = CB(t);
    try {
      let n = await fB({
        targetWindow: A,
        documentRef: t,
        scriptCode: g,
        nonce: o
      });
      if (n) return A[TA] = n, n;
      e?.info?.("[Gemini Watermark Remover] Page runtime inline injection did not register, retrying with blob script");
      let r = await dB({
        targetWindow: A,
        documentRef: t,
        scriptCode: g,
        nonce: o
      });
      if (r) return A[TA] = r, r
    } catch (n) {
      return e?.warn?.("[Gemini Watermark Remover] Page runtime injection failed:", n), null
    }
    return A[SA] ? (A[TA] = A[SA], A[TA]) : (e?.warn?.("[Gemini Watermark Remover] Page runtime injection did not register a bridge"), null)
  }
  var No = "__gwr_force_inline_worker__",
    ko = "__gwr_debug_timings__";

  function Mg(A) {
    return A === !0 || A === "1" || A === "true"
  }

  function Qg(A, g) {
    try {
      let e = A?.localStorage?.getItem?.(g);
      return Mg(e)
    } catch {
      return !1
    }
  }

  function Uo(A) {
    try {
      return Mg(A?.__GWR_FORCE_INLINE_WORKER__)
    } catch {
      return !1
    }
  }

  function Lo(A, g = globalThis) {
    let e = g?.unsafeWindow;
    return !(Uo(g) || Uo(e) || Qg(g, No) || Qg(e, No)) || typeof A != "string" || A.length === 0 ? !1 : typeof g?.Worker < "u" && typeof g?.Blob < "u"
  }

  function Fo(A = globalThis) {
    let g = A?.unsafeWindow;
    return Mg(A?.__GWR_DEBUG_TIMINGS__) || Mg(g?.__GWR_DEBUG_TIMINGS__) || Qg(A, ko) || Qg(g, ko)
  }
  var yB = 12e4,
    EB = 3e3;

  function hB(A, g = "Inline worker error") {
    return A instanceof Error ? A : typeof A == "string" && A.length > 0 ? new Error(A) : A && typeof A.message == "string" && A.message.length > 0 ? new Error(A.message) : new Error(g)
  }

  function $() {
    return typeof globalThis.performance?.now == "function" ? globalThis.performance.now() : Date.now()
  }
  var fe = class {
    constructor(g) {
      let e = new Blob([g], {
        type: "text/javascript"
      });
      this.workerUrl = URL.createObjectURL(e);
      let t = zo(this.workerUrl);
      if (!t) throw URL.revokeObjectURL(this.workerUrl), this.workerUrl = null, new Error("Trusted Types policy unavailable for inline worker");
      try {
        this.worker = new Worker(t)
      } catch (o) {
        throw URL.revokeObjectURL(this.workerUrl), this.workerUrl = null, o
      }
      this.pending = new Map, this.requestId = 0, this.handleMessage = this.handleMessage.bind(this), this.handleError = this.handleError.bind(this), this.worker.addEventListener("message", this.handleMessage), this.worker.addEventListener("error", this.handleError)
    }
    dispose() {
      this.worker.removeEventListener("message", this.handleMessage), this.worker.removeEventListener("error", this.handleError), this.worker.terminate(), this.workerUrl && (URL.revokeObjectURL(this.workerUrl), this.workerUrl = null);
      let g = new Error("Inline worker disposed");
      for (let e of this.pending.values()) clearTimeout(e.timeoutId), e.reject(g);
      this.pending.clear()
    }
    handleMessage(g) {
      let e = g?.data;
      if (!e || typeof e.id > "u") return;
      let t = this.pending.get(e.id);
      if (t) {
        if (this.pending.delete(e.id), clearTimeout(t.timeoutId), e.ok) {
          t.resolve(e.result);
          return
        }
        t.reject(new Error(e.error?.message || "Inline worker request failed"))
      }
    }
    handleError(g) {
      let e = new Error(g?.message || "Inline worker crashed");
      for (let t of this.pending.values()) clearTimeout(t.timeoutId), t.reject(e);
      this.pending.clear()
    }
    request(g, e, t = [], o = yB) {
      let n = ++this.requestId;
      return new Promise((r, a) => {
        let s = setTimeout(() => {
          this.pending.delete(n), a(new Error(`Inline worker request timed out: ${g}`))
        }, o);
        this.pending.set(n, {
          resolve: r,
          reject: a,
          timeoutId: s
        });
        try {
          this.worker.postMessage({
            id: n,
            type: g,
            ...e
          }, t)
        } catch (i) {
          clearTimeout(s), this.pending.delete(n), a(hB(i))
        }
      })
    }
    async ping(g = EB) {
      await this.request("ping", {}, [], g)
    }
    async processWatermarkBlob(g, e = {}) {
      let t = await g.arrayBuffer(),
        o = await this.request("process-image", {
          inputBuffer: t,
          mimeType: g.type || "image/png",
          options: e
        }, [t]);
      return {
        processedBlob: new Blob([o.processedBuffer], {
          type: o.mimeType || "image/png"
        }),
        processedMeta: o.meta || null
      }
    }
  };

  function Wo({
    workerCode: A = "",
    env: g = globalThis,
    logger: e = console
  } = {}) {
    let t = null,
      o = Fo(g);

    function n(P = {}) {
      return {
        adaptiveMode: "always",
        ...P && typeof P == "object" ? P : {}
      }
    }
    let r = te(),
      a = oe({
        getEngine: r
      });

    function s(P) {
      t && (e?.warn?.("[Gemini Watermark Remover] Disable worker path:", P), t.dispose(), t = null)
    }

    function i(P, p = {}) {
      o && e?.info?.(`[Gemini Watermark Remover] timing ${P}`, p)
    }
    async function D(P, p = {}) {
      let I = $(),
        l = $();
      await r();
      let B = $() - l,
        G = $(),
        Y = await ee(P),
        w = $() - G,
        C = $(),
        f = await a(Y, {
          ...p,
          debugTimings: o
        }),
        m = $() - C,
        d = $(),
        y = await oA(f),
        O = $() - d,
        h = $() - I,
        M = f?.__watermarkTiming ?? null,
        T = M?.processor ?? null,
        S = f?.__watermarkMeta?.selectionDebug ?? null;
