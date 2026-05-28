  function GwcFetchBlobViaBridge(A, g = 15e3) {
    return new Promise((e, t) => {
      let o = typeof globalThis.GM_xmlhttpRequest == "function" ? globalThis.GM_xmlhttpRequest : globalThis.GM && typeof globalThis.GM.xmlHttpRequest == "function" ? globalThis.GM.xmlHttpRequest : null;
      if (!o) {
        t(new Error("Extension fetch bridge unavailable"));
        return
      }
      let n = !1,
        r = globalThis.setTimeout(() => {
          n = !0, t(new Error("Extension fetch bridge timed out"))
        }, g);
      o({
        url: A,
        method: "GET",
        responseType: "blob",
        timeout: g,
        onload: a => {
          if (n) return;
          globalThis.clearTimeout(r);
          let s = Number(a && a.status) || 0;
          if (s < 200 || s >= 300) {
            t(new Error(`Failed to fetch image via extension bridge: ${s}`));
            return
          }
          let i = a && a.response instanceof Blob ? a.response : new Blob([a && a.response || ""]);
          e(i)
        },
        onerror: a => {
          if (n) return;
          globalThis.clearTimeout(r), t(new Error(V(a && a.error || a, "Extension fetch bridge failed")))
        },
        ontimeout: () => {
          if (n) return;
          globalThis.clearTimeout(r), t(new Error("Extension fetch bridge timed out"))
        },
        onabort: () => {
          if (n) return;
          globalThis.clearTimeout(r), t(new Error("Extension fetch bridge aborted"))
        }
      })
    })
  }
  async function dg(A) {
    return GwcFetchBlobViaBridge(A)
  }
  async function Be(A, g = null) {
    return GwcFetchBlobViaBridge(A).catch(e => typeof g == "function" ? g(A) : Promise.reject(e))
  }
  var Ss = 0;
  async function tg(A, g = 15e3) {
    if (typeof window > "u" || typeof window.postMessage != "function" || typeof window.addEventListener != "function") throw new Error("Page fetch bridge unavailable");
    let e = `gwr-page-fetch-${Date.now()}-${Ss+=1}`;
    return new Promise((t, o) => {
      let n = !1,
        r = () => {
          n || (n = !0, window.removeEventListener("message", a), globalThis.clearTimeout(s))
        },
        a = i => {
          if (i.source !== window || i.data?.type !== ps || i.data?.requestId !== e) return;
          if (r(), i.data?.ok === !1) {
            o(new Error(V(i.data?.error, "Page fetch failed")));
            return
          }
          let D = resolveFetchedImageMimeType(i.data?.mimeType, i.data?.buffer);
          t(new Blob([i.data.buffer], {
            type: D
          }))
        },
        s = globalThis.setTimeout(() => {
          r(), o(new Error("Page fetch bridge timed out"))
        }, g);
      window.addEventListener("message", a), window.postMessage({
        type: ls,
        requestId: e,
        url: A
      }, "*")
    })
  }
  async function og(A) {
    let g = aA(),
      e = aA(),
      {
        width: t,
        height: o
      } = await Rs(A),
      n = aA() - e,
      r = document.createElement("canvas");
    r.width = t, r.height = o;
    let a = r.getContext("2d");
    if (!a) throw new Error("2D canvas context unavailable");
    let s = aA();
    a.drawImage(A, 0, 0, t, o);
    let i = aA() - s,
      D = aA(),
      u = await oA(r),
      c = aA() - D;
    return u.__gwrCaptureTiming = {
      waitRenderableMs: n,
      drawMs: i,
      encodeMs: c,
      totalMs: aA() - g,
      width: t,
      height: o
    }, u
  }

  function qt(A) {
    if (!A || typeof A != "object") return null;
    let g = Number(A.left),
      e = Number(A.top),
      t = Number(A.width),
      o = Number(A.height);
    return [g, e, t, o].every(Number.isFinite) ? {
      left: g,
      top: e,
      width: Math.max(0, t),
      height: Math.max(0, o)
    } : null
  }

  function js() {
    return new Promise(A => {
      if (typeof requestAnimationFrame == "function") {
        requestAnimationFrame(() => A());
        return
      }
      globalThis.setTimeout(A, 16)
    })
  }

  function ne(A) {
    let g = Number(A?.naturalWidth) || Number(A?.width) || Number(A?.clientWidth) || 0,
      e = Number(A?.naturalHeight) || Number(A?.height) || Number(A?.clientHeight) || 0;
    return {
      width: g,
      height: e
    }
  }

  function Hs(A) {
    return !!A?.complete && (Number(A?.naturalWidth) || 0) > 0 && (Number(A?.naturalHeight) || 0) > 0
  }
  async function Rs(A, g = 1500) {
    let e = ne(A);
    if (e.width > 0 && e.height > 0) return e;
    if (typeof A?.decode == "function") {
      try {
        await A.decode()
      } catch {}
      if (e = ne(A), e.width > 0 && e.height > 0) return e
    }
    let t = Date.now() + Math.max(0, g);
    for (; Date.now() < t;)
      if (await js(), e = ne(A), e.width > 0 && e.height > 0) return e;
    throw new Error("Image has no renderable size")
  }

  function qs(A) {
    return Sg(A).tier !== "insufficient"
  }

  function _s(A) {
    return A === "rendered-capture"
  }

  function zs(A) {
    return !!A && typeof A == "object" && typeof A.size == "number" && typeof A.type == "string" && typeof A.arrayBuffer == "function"
  }

  function XA(A) {
    return !Array.isArray(A) || A.length === 0 ? "" : A.map(g => {
      let e = [g.strategy || "unknown", g.status || "unknown"];
      return g.decisionTier && e.push(`tier=${g.decisionTier}`), g.processorPath && e.push(`processor=${g.processorPath}`), typeof g.sourceBlobSize == "number" && e.push(`sourceSize=${g.sourceBlobSize}`), g.sourceBlobType && e.push(`sourceType=${g.sourceBlobType}`), typeof g.processedBlobSize == "number" && e.push(`processedSize=${g.processedBlobSize}`), g.processedBlobType && e.push(`processedType=${g.processedBlobType}`), g.error && e.push(`error=${g.error}`), e.join(",")
    }).join(" | ")
  }

  function vs(A = []) {
    if (!Array.isArray(A) || A.length === 0) return !1;
    let g = A.find(n => n?.strategy === "page-fetch"),
      e = A.find(n => n?.strategy === "rendered-capture"),
      t = String(g?.error || ""),
      o = String(e?.error || "");
    return g?.status === "error" && /failed to fetch image: 403/i.test(t) && e?.status === "error" && /tainted canvases may not be exported/i.test(o)
  }
  async function Ks({
    candidates: A = [],
    processCandidate: g
  }) {
    let e = null,
      t = !1,
      o = null,
      n = [];
    for (let a of A) try {
      let s = await g(a),
        i = qs(s?.processedMeta),
        D = Sg(s?.processedMeta).tier || "insufficient";
      if (n.push({
          strategy: a.strategy || "",
          status: i ? "confirmed" : "insufficient",
          decisionTier: D,
          captureTiming: s?.captureTiming || null,
          processorPath: typeof s?.processedMeta?.processorPath == "string" ? s.processedMeta.processorPath : "",
          sourceBlobType: s?.sourceBlobType || "",
          sourceBlobSize: typeof s?.sourceBlobSize == "number" ? s.sourceBlobSize : void 0,
          processedBlobType: s?.processedBlob?.type || "",
          processedBlobSize: typeof s?.processedBlob?.size == "number" ? s.processedBlob.size : void 0
        }), i) return {
        ...s,
        strategy: a.strategy || "",
        diagnostics: n,
        diagnosticsSummary: XA(n)
      };
      if (t = !0, _s(a.strategy) && zs(s?.processedBlob)) {
        let u = {
          ...s,
          strategy: a.strategy || "",
          diagnostics: [...n],
          diagnosticsSummary: XA(n)
        };
        o || (o = u)
      }
    } catch (s) {
      e = s, n.push({
        strategy: a.strategy || "",
        status: "error",
        sourceBlobType: typeof s?.sourceBlobType == "string" ? s.sourceBlobType : "",
        sourceBlobSize: typeof s?.sourceBlobSize == "number" ? s.sourceBlobSize : void 0,
        error: V(s)
      })
    }
    if (o) return o;
    if (e) {
      let a = new Error(V(e, "Preview candidate failed"));
      throw a.candidateDiagnostics = n, a.candidateDiagnosticsSummary = XA(n), a
    }
    if (t) {
      let a = new Error("No confirmed Gemini preview candidate succeeded");
      throw a.candidateDiagnostics = n, a.candidateDiagnosticsSummary = XA(n), a
    }
    let r = new Error("No preview candidate succeeded");
    throw r.candidateDiagnostics = n, r.candidateDiagnosticsSummary = XA(n), r
  }

  function xs({
    imageElement: A,
    sourceUrl: g = "",
    fetchPreviewBlob: e = tg,
    captureRenderedImageBlob: t = og
  }) {
    let o = [],
      n = g ? _(g) : "";
    return typeof e == "function" && n && o.push({
      strategy: "page-fetch",
      getOriginalBlob: () => e(n)
    }), typeof t == "function" && o.push({
      strategy: "rendered-capture",
      getOriginalBlob: () => t(A)
    }), o
  }
  async function Ns({
    sourceUrl: A,
    imageElement: g,
    fetchPreviewBlob: e = tg,
    processWatermarkBlobImpl: t = VA,
    captureRenderedImageBlob: o = og
  }) {
    try {
      let n = await Ks({
        candidates: xs({
          imageElement: g,
          sourceUrl: A,
          fetchPreviewBlob: e,
          captureRenderedImageBlob: o
        }),
        processCandidate: Ts(t)
      });
      return {
        skipped: !1,
        processedBlob: n.processedBlob,
        selectedStrategy: n.strategy || "",
        candidateDiagnostics: n.diagnostics || null,
        candidateDiagnosticsSummary: n.diagnosticsSummary || "",
        captureTiming: n.captureTiming || null
      }
    } catch (n) {
      let r = Lt(n) || [];
      if (vs(r)) return {
        skipped: !0,
        reason: "preview-fetch-unavailable",
        candidateDiagnostics: r,
        candidateDiagnosticsSummary: Ft(n)
      };
      throw n
    }
  }
  async function _t({
    sourceUrl: A,
    imageElement: g,
    fetchPreviewBlob: e = tg,
    removeWatermarkFromBlobImpl: t = Yg,
    captureRenderedImageBlob: o = og,
    fetchBlobDirectImpl: n = dg,
    validateBlob: r = JA,
    fetchBlobFromBackgroundImpl: a = Be,
    preferRenderedCaptureForPreview: s = !0,
    allowRenderedCaptureFallbackOnValidationFailure: i = !0,
    rejectPreviewAspectMismatch: D = !1
  }) {
    let u = null,
      P = await Ke({
        sourceUrl: A,
        image: g,
        fetchBlobFromBackground: async p => a(_(p), e),
        fetchBlobDirect: n,
        captureRenderedImageBlob: o,
        validateBlob: typeof r == "function" ? async p => {
          let I = await r(p);
          return u = I, I
        } : null,
        preferRenderedCaptureForPreview: s,
