    return !A || !g ? 0 : Math.abs(A.width / A.height - g.width / g.height)
  }

  function ws(A) {
    let g = Number(A?.naturalWidth) || Number(A?.width) || 0,
      e = Number(A?.naturalHeight) || Number(A?.height) || 0;
    return g <= 0 || e <= 0 ? null : {
      width: g,
      height: e
    }
  }

  function fs(A, g, {
    maxAspectRatioDelta: e = .02
  } = {}) {
    let t = ws(A),
      o = ie(g);
    return !t || !o ? !1 : Ut(t, o) > e
  }

  function Cg(A = null) {
    return !!(A?.responseId || A?.draftId || A?.conversationId)
  }

  function ds(A, {
    now: g = Date.now(),
    resolveSourceUrl: e = X,
    resolveAssetIds: t = K
  } = {}) {
    let o = typeof t == "function" ? t(A) : null,
      n = typeof e == "function" ? String(e(A) || "").trim() : "",
      r = !!n && !sA(n) && !wg(n);
    return !r && !Cg(o) ? null : {
      sourceUrl: r ? n : "",
      createdAt: Number(g) || 0,
      size: ie(A),
      assetIds: o
    }
  }

  function ys(A, g = Date.now()) {
    if (!A || typeof A != "object") return !1;
    let e = Number(A.createdAt) || 0,
      t = Number(g) || 0;
    return e > 0 && t >= e && t - e <= ms
  }

  function Es(A, g, {
    now: e = Date.now()
  } = {}) {
    if (!ys(g, e) || !A || typeof A != "object") return !1;
    let t = A.dataset || (A.dataset = {}),
      o = X(A);
    if (!sA(o) && !wg(o)) return !1;
    let n = K(A);
    if (Cg(n) && (!Cg(g.assetIds) || !$t(n, g.assetIds))) return !1;
    let r = g.size,
      a = ie(A);
    if (r && a && Ut(r, a) > .02) return !1;
    let s = !1,
      i = !g.sourceUrl && Cg(g.assetIds) ? Jt(g.assetIds) : "",
      D = g.sourceUrl || i;
    return D && !(typeof t.gwrSourceUrl == "string" && t.gwrSourceUrl.trim()) && (t.gwrSourceUrl = D, s = !0), !t[pA] && g.assetIds?.responseId && (t[pA] = g.assetIds.responseId, s = !0), !t[GA] && g.assetIds?.draftId && (t[GA] = g.assetIds.draftId, s = !0), !t[mA] && g.assetIds?.conversationId && (t[mA] = g.assetIds.conversationId, s = !0), s
  }

  function hs(A) {
    if (!A || typeof A != "object") return null;
    if ((typeof A.tagName == "string" ? A.tagName.toUpperCase() : "") === "IMG" && Pg(A)) return A;
    let e = typeof A.closest == "function" ? A.closest(ug()) || A.closest("single-image") || A.closest(xt) || A.closest("[data-test-draft-id]") : null;
    return !e || typeof e.querySelector != "function" ? null : e.querySelector("img")
  }

  function eg({
    logger: A,
    onLog: g,
    level: e = "info",
    consoleMessage: t,
    eventType: o,
    payload: n
  }) {
    A?.[e]?.(t, n), Cs(g, o, n)
  }

  function aA() {
    return typeof globalThis.performance?.now == "function" ? globalThis.performance.now() : Date.now()
  }

  function Lt(A) {
    return Array.isArray(A?.candidateDiagnostics) ? A.candidateDiagnostics : null
  }

  function Ft(A) {
    return typeof A?.candidateDiagnosticsSummary == "string" ? A.candidateDiagnosticsSummary : ""
  }

  function Wt(A = null) {
    let g = typeof A?.draftId == "string" ? A.draftId.trim() : "";
    return g ? `draft:${g}` : ""
  }

  function Zt(A = null) {
    let g = typeof A?.responseId == "string" ? A.responseId.trim() : "",
      e = typeof A?.conversationId == "string" ? A.conversationId.trim() : "";
    return g && e ? `response:${g}|conversation:${e}` : ""
  }

  function Os(A = null, g = "", {
    imageSessionStore: e = R()
  } = {}) {
    let t = typeof g == "string" ? g.trim() : "";
    if (!A || !t) return;
    let o = Wt(A),
      n = Zt(A);
    o && OA.set(o, t), n && OA.set(n, t);
    let r = e?.getOrCreateByAssetIds?.(A) || "";
    r && e.updateOriginalSource?.(r, t)
  }

  function Jt(A = null) {
    if (!A) return "";
    let g = Wt(A);
    if (g && OA.has(g)) return OA.get(g) || "";
    let e = Zt(A);
    return e && OA.has(e) && OA.get(e) || ""
  }

  function bs(A = null, {
    imageSessionStore: g = R()
  } = {}) {
    let e = g?.getOrCreateByAssetIds?.(A) || "";
    if (!e) return "";
    let t = g?.getSnapshot?.(e)?.sources?.previewUrl || "";
    return typeof t == "string" ? t.trim() : ""
  }

  function Ms() {
    for (; bA.size > Ys;) {
      let A = bA.keys().next().value;
      if (typeof A != "string" || !A) break;
      bA.delete(A)
    }
  }

  function Qs(A = "", g = {}, {
    imageSessionStore: e = R()
  } = {}) {
    let t = typeof A == "string" ? _(A.trim()) : "",
      o = typeof g?.sessionKey == "string" && g.sessionKey.trim() ? g.sessionKey.trim() : e?.getOrCreateByAssetIds?.(g?.assetIds) || "";
    return !t || !o ? "" : (bA.delete(t), bA.set(t, {
      sourceUrl: t,
      sessionKey: o,
      processedMeta: g?.processedMeta ?? null,
      processedFrom: typeof g?.processedFrom == "string" && g.processedFrom.trim() ? g.processedFrom.trim() : "request-preview"
    }), Ms(), t)
  }

  function se(A = "", {
    imageSessionStore: g = R()
  } = {}) {
    let e = typeof A == "string" ? _(A.trim()) : "";
    if (!e) return null;
    let t = bA.get(e) || null;
    if (!t?.sessionKey) return null;
    let o = g?.getBestResource?.(t.sessionKey, "display") || null;
    return o?.kind !== "processed" || o.slot !== "preview" || !(o.blob instanceof Blob) ? null : {
      sourceUrl: e,
      sessionKey: t.sessionKey,
      processedBlob: o.blob,
      processedMeta: o.processedMeta ?? t.processedMeta ?? null,
      processedFrom: o.source || t.processedFrom || "request-preview"
    }
  }

  function Ts(A, g = null) {
    return async e => {
      let t = await e.getOriginalBlob();
      try {
        let o = t?.__gwrCaptureTiming || null;
        return {
          ...await A(t, g ? {
            ...g
          } : void 0),
          captureTiming: o,
          sourceBlobType: t.type || "",
          sourceBlobSize: t.size || 0
        }
      } catch (o) {
        throw o && typeof o == "object" && (o.sourceBlobType = t.type || "", o.sourceBlobSize = t.size || 0), o
      }
    }
  }
