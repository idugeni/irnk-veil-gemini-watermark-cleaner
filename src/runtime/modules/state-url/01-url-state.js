  function Bg(A, g) {
    let e = ve(g),
      t = A?.derived?.processedSlots?.[e] || null;
    return t?.objectUrl ? {
      kind: "processed",
      url: t.objectUrl,
      ...t.blob ? {
        blob: t.blob
      } : {},
      mimeType: t.blobType || "image/png",
      processedMeta: t.processedMeta,
      source: t.processedFrom || "processed",
      slot: e
    } : null
  }

  function Yn(A) {
    let g = Bg(A, "preview"),
      e = Bg(A, "full"),
      t = g || e;
    A.derived.processedBlobUrl = t?.url || "", A.derived.processedBlobType = t?.mimeType || "", A.derived.processedMeta = t?.processedMeta ?? null, A.derived.processedFrom = t?.source || ""
  }

  function _e(A) {
    return A?.sources?.originalUrl ? {
      kind: "original",
      url: A.sources.originalUrl,
      mimeType: "",
      processedMeta: null,
      source: "original"
    } : null
  }

  function Cn(A = "") {
    return A === "clipboard" || A === "download"
  }

  function wn({
    now: A = () => Date.now()
  } = {}) {
    let g = new Map,
      e = new WeakMap;

    function t(I = "") {
      return I && g.get(I) || null
    }

    function o(I = null) {
      let l = wA(I),
        B = zA(l);
      if (!B) return "";
      let G = g.get(B);
      return G ? (G.assetIds ? G.assetIds = {
        responseId: G.assetIds.responseId || l.responseId,
        draftId: G.assetIds.draftId || l.draftId,
        conversationId: G.assetIds.conversationId || l.conversationId
      } : G.assetIds = l, uA(G, A()), B) : (G = ln(B, l, A()), g.set(B, G), B)
    }

    function n(I = null) {
      let l = zA(I);
      return l && g.get(l) || null
    }

    function r(I, l, B) {
      let G = t(I);
      if (!G || !B || typeof B != "object") return !1;
      a(B);
      let Y = qe(l);
      return G.surfaces[Y].add(B), e.set(B, {
        sessionKey: I,
        surface: Y
      }), uA(G, A()), !0
    }

    function a(I) {
      let l = e.get(I);
      if (!l) return !1;
      let B = t(l.sessionKey);
      return B && (B.surfaces[l.surface]?.delete(I), uA(B, A())), e.delete(I), !0
    }

    function s(I, l = "") {
      let B = t(I),
        G = typeof l == "string" ? l.trim() : "";
      return !B || !G ? !1 : (B.sources.originalUrl = G, uA(B, A()), !0)
    }

    function i(I, {
      sourceUrl: l = "",
      isPreviewSource: B = !1
    } = {}) {
      var w;
      let G = t(I),
        Y = typeof l == "string" ? l.trim() : "";
      return !G || !Y ? !1 : (Y.startsWith("blob:") || Y.startsWith("data:") ? G.sources.currentBlobUrl = Y : B ? G.sources.previewUrl = Y : (w = G.sources).originalUrl || (w.originalUrl = Y), uA(G, A()), !0)
    }

    function D(I, {
      slot: l = "preview",
      objectUrl: B = "",
      blob: G = null,
      blobType: Y = "",
      processedMeta: w = null,
      processedFrom: C = ""
    } = {}) {
      let f = t(I),
        m = typeof B == "string" ? B.trim() : "";
      if (!f || !m) return !1;
      let d = ve(l);
      f.derived.processedSlots || (f.derived.processedSlots = ze()), f.derived.processedSlots[d] = {
        objectUrl: m,
        blob: G instanceof Blob ? G : null,
        blobType: typeof Y == "string" ? Y.trim() : "",
        processedMeta: w ?? null,
        processedFrom: typeof C == "string" ? C.trim() : ""
      }, Yn(f);
      let y = Number(A()) || Date.now();
      return uA(f, y), f.timestamps.lastProcessedAt = y, !0
    }

    function u(I, l, B, G = "") {
      let Y = t(I);
      if (!Y) return !1;
      let w = qe(l);
      return Y.state[w] = typeof B == "string" ? B : "idle", Y.state.lastError = typeof G == "string" ? G : "", uA(Y, A()), !0
    }

    function c(I, l = "display") {
      let B = t(I);
      if (!B) return null;
      let G = Bg(B, "full"),
        Y = Bg(B, "preview");
      if (Cn(l)) {
        if (G) return G;
        let C = _e(B);
        if (C) return C
      } else {
        if (Y) return Y;
        if (G) return G
      }
      let w = _e(B);
      return w || (B.sources.previewUrl ? {
        kind: "preview",
        url: B.sources.previewUrl,
        mimeType: "",
        processedMeta: null,
        source: "preview"
      } : B.sources.currentBlobUrl ? {
        kind: "blob",
        url: B.sources.currentBlobUrl,
        mimeType: "",
        processedMeta: null,
        source: "blob"
      } : null)
    }

    function P(I, l = "display") {
      let B = t(I);
      if (!B) return null;
      let G = c(I, l),
        Y = G?.kind === "processed" && G.url || "",
        w = ["preview", "fullscreen", "unknown"];
      for (let C of w) {
        let f = mn(B.surfaces?.[C] || [], Y);
        if (f) return f
      }
      return null
    }

    function p(I) {
      let l = t(I);
      return l ? {
        sessionKey: l.sessionKey,
        assetIds: l.assetIds ? {
          ...l.assetIds
        } : null,
        sources: {
          ...l.sources
        },
        derived: {
          ...l.derived,
          processedSlots: {
            preview: {
              ...l.derived.processedSlots.preview,
              blob: l.derived.processedSlots.preview.blob || null
            },
            full: {
              ...l.derived.processedSlots.full,
              blob: l.derived.processedSlots.full.blob || null
            }
          }
        },
        state: {
          ...l.state
        },
        surfaces: {
          previewCount: l.surfaces.preview.size,
          fullscreenCount: l.surfaces.fullscreen.size,
          unknownCount: l.surfaces.unknown.size
        },
        timestamps: {
          ...l.timestamps
        }
      } : null
    }
    return {
      buildSessionKey: zA,
      getOrCreateByAssetIds: o,
      getByAssetIds: n,
      getSnapshot: p,
      getBestResource: c,
      getPreferredElement: P,
      attachElement: r,
      detachElement: a,
      updateOriginalSource: s,
      updateSourceSnapshot: i,
      updateProcessedResult: D,
      markProcessing: u
    }
  }
  var fn = wn();

  function R() {
    return fn
  }

  function dn(A) {
    return typeof A == "string" && (A.startsWith("blob:") || A.startsWith("data:"))
  }

  function yn(A) {
    return typeof A == "string" && A.startsWith("blob:")
  }

  function En(A) {
    return He(A)
  }
  async function cg({
    image: A,
    captureRenderedImageBlob: g
  }) {
    if (typeof g != "function") throw new Error("Rendered capture unavailable");
    return g(A)
  }
