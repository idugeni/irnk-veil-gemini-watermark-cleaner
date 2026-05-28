        processedGradientScore: BA,
        suppressionGain: HA,
        templateWarp: w,
        alphaGain: G,
        passCount: f,
        attemptedPassCount: m,
        passStopReason: d,
        passes: y,
        source: l,
        decisionTier: C,
        applied: !0,
        subpixelShift: Y,
        selectionDebug: wt({
          selectedTrial: M,
          selectionSource: h.source,
          initialConfig: c,
          initialPosition: EA(a.width, a.height, c)
        })
      }),
      debugTimings: o
    }
  }

  function ns(A, g) {
    if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(A, g);
    if (typeof document < "u") {
      let e = document.createElement("canvas");
      return e.width = A, e.height = g, e
    }
    throw new Error("Canvas runtime not available")
  }

  function rs(A) {
    let g = A.getContext("2d", {
      willReadFrequently: !0
    });
    if (!g) throw new Error("Failed to get 2D canvas context");
    return g
  }
  var hA = class A {
    constructor() {
      this.alphaMaps = {}
    }
    static async create() {
      return new A
    }
    async getAlphaMap(g) {
      if (g === "96-20260520") {
        if (this.alphaMaps[g]) return this.alphaMaps[g];
        let t = zg(g);
        if (!t) throw new Error(`Missing embedded alpha map for size ${g}`);
        return this.alphaMaps[g] = t, t
      }
      if (g !== 48 && g !== 96) {
        if (this.alphaMaps[g]) return this.alphaMaps[g];
        let t = await this.getAlphaMap(96),
          o = nA(t, 96, g);
        return this.alphaMaps[g] = o, o
      }
      if (this.alphaMaps[g]) return this.alphaMaps[g];
      let e = zg(g);
      if (!e) throw new Error(`Missing embedded alpha map for size ${g}`);
      return this.alphaMaps[g] = e, e
    }
    async removeWatermarkFromImage(g, e = {}) {
      let t = () => typeof globalThis.performance?.now == "function" ? globalThis.performance.now() : Date.now(),
        o = ns(g.width, g.height),
        n = rs(o),
        r = t();
      n.drawImage(g, 0, 0);
      let a = t() - r,
        s = t(),
        i = n.getImageData(0, 0, o.width, o.height),
        D = t() - s,
        u = await this.getAlphaMap(48),
        c = await this.getAlphaMap(96),
        P = await this.getAlphaMap("96-20260520"),
        p = t(),
        I = Qt(i, {
          alpha48: u,
          alpha96: c,
          alpha96Variants: {
            20260520: P
          },
          adaptiveMode: e.adaptiveMode,
          maxPasses: e.maxPasses,
          debugTimings: e.debugTimings === !0,
          getAlphaMap: Y => this.alphaMaps[Y] || nA(c, 96, Y)
        }),
        l = t() - p,
        B = t();
      n.putImageData(I.imageData, 0, 0);
      let G = t() - B;
      return o.__watermarkMeta = I.meta, o.__watermarkTiming = {
        drawMs: a,
        getImageDataMs: D,
        processWatermarkImageDataMs: l,
        putImageDataMs: G,
        processor: I.debugTimings ?? null
      }, o
    }
    getWatermarkInfo(g, e) {
      let t = mg(g, e),
        o = EA(g, e, t);
      return {
        size: t.logoSize,
        position: o,
        config: t
      }
    }
  };

  function as(A) {
    return new Promise((g, e) => {
      let t = new Image;
      t.onload = () => g(t), t.onerror = () => e(new Error("Failed to decode Gemini image blob")), t.src = A
    })
  }
  async function ee(A) {
    let g = URL.createObjectURL(A);
    try {
      return await as(g)
    } finally {
      URL.revokeObjectURL(g)
    }
  }
  async function ss(A, g) {
    if (typeof createImageBitmap != "function") throw g;
    try {
      return await createImageBitmap(A)
    } catch {
      throw g
    }
  }
  async function JA(A) {
    try {
      return await ee(A)
    } catch (g) {
      return await ss(A, g)
    }
  }

  function Tt(A, g) {
    let e = A && typeof A == "object" ? {
      ...A
    } : null;
    return g != null ? {
      ...e || {},
      processorPath: g
    } : e
  }

  function is(A, g = "main-thread") {
    return {
      processedBlob: A?.processedBlob || null,
      processedMeta: Tt(A?.processedMeta || null, g)
    }
  }

  function St(A = {}) {
    return {
      adaptiveMode: "always",
      ...A && typeof A == "object" ? A : {}
    }
  }

  function te({
    createEngine: A = () => hA.create()
  } = {}) {
    let g = null;
    return async function() {
      return g || (g = Promise.resolve(A()).catch(t => {
        throw g = null, t
      })), g
    }
  }

  function oe({
    createEngine: A = () => hA.create(),
    getEngine: g = null
  } = {}) {
    let e = typeof g == "function" ? g : te({
      createEngine: A
    });
    return async function(o, n = {}) {
      let r = await e(),
        a = St(n);
      return r.removeWatermarkFromImage(o, a)
    }
  }

  function Bs({
    createEngine: A = () => hA.create(),
    encodeCanvas: g = oA,
    processorPath: e = "main-thread"
  } = {}) {
    let t = oe({
      createEngine: A
    });
    return async function(n, r = {}) {
      let a = await t(n, r);
      return {
        processedBlob: await g(a),
        processedMeta: Tt(a.__watermarkMeta || null, e)
      }
    }
  }

  function jt({
    loadRenderable: A = JA,
    processRenderable: g = Bs()
  } = {}) {
    return async function(t, o = {}) {
      let n = await A(t);
      return g(n, o)
    }
  }

  function cs({
    processMainThread: A = jt(),
    getWorkerProcessor: g = null,
    onWorkerError: e = null
  } = {}) {
    return async function(o, n = {
      adaptiveMode: "always"
    }) {
      let r = St(n),
        a = typeof g == "function" ? g() : null;
      if (typeof a == "function") try {
        return await a(o, r)
      } catch (s) {
        e?.(s)
      }
      return is(await A(o, r), "main-thread")
    }
  }
  var jc = jt(),
    Ps = cs();
  async function VA(A, g = {
    adaptiveMode: "always"
  }) {
    return Ps(A, g)
  }
  async function Yg(A, g = {
    adaptiveMode: "always"
  }) {
    return (await VA(A, g)).processedBlob
  }
  var Ag = "gwrPageImageState",
    Ht = "gwrPageImageSource",
    gg = "gwrWatermarkObjectUrl",
    us = "gwrProcessingOverlay",
    vt = "gwrProcessingVisual",
    Ds = "gwrPreviewImage",
    pA = "gwrResponseId",
    GA = "gwrDraftId",
    mA = "gwrConversationId",
    Is = ["src", "srcset", "data-gwr-source-url"],
    ls = "gwr:page-fetch-request",
    ps = "gwr:page-fetch-response",
    Kt = 180,
    Gs = 1500,
    ms = 5e3,
    Rt = 32,
    kc = Rt * Rt;
  var xt = 'expansion-dialog,[role="dialog"],.image-expansion-dialog-panel,.cdk-overlay-pane',
    $A = new WeakMap,
    ae = new WeakMap,
    OA = new Map,
    bA = new Map,
    Ys = 32;

  function Cs(A, g, e = {}) {
    typeof A == "function" && A(g, e)
  }

  function sA(A = "") {
    return typeof A == "string" && A.startsWith("blob:")
  }

  function wg(A = "") {
    return typeof A == "string" && A.startsWith("data:")
  }

  function Nt(A, g = "") {
    let e = typeof A?.dataset?.gwrSourceUrl == "string" ? A.dataset.gwrSourceUrl.trim() : "",
      t = typeof g == "string" ? g.trim() : "";
    return !!(e && t && e === t)
  }

  function kt(A, g = "") {
    return sA(g) ? !0 : PA(g) ? !Nt(A, g) : !1
  }

  function ie(A) {
    let g = Number(A?.naturalWidth) || Number(A?.clientWidth) || Number(A?.width) || 0,
      e = Number(A?.naturalHeight) || Number(A?.clientHeight) || Number(A?.height) || 0;
    return g <= 0 || e <= 0 ? null : {
      width: g,
      height: e
    }
  }

  function fg(A) {
    if (!A?.dataset) return null;
    let g = typeof A.dataset[pA] == "string" ? A.dataset[pA].trim() : "",
      e = typeof A.dataset[GA] == "string" ? A.dataset[GA].trim() : "",
      t = typeof A.dataset[mA] == "string" ? A.dataset[mA].trim() : "";
    return !g && !e && !t ? null : {
      responseId: g || null,
      draftId: e || null,
      conversationId: t || null
    }
  }

  function MA(A) {
    return typeof A?.closest == "function" && A.closest(xt) ? "fullscreen" : "preview"
  }

  function Ut(A, g) {
