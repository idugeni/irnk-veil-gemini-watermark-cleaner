  function Bi({
    imageElement: A,
    sourceUrl: g,
    normalizedUrl: e,
    error: t,
    imageSessionStore: o = R(),
    logger: n = console,
    onLog: r = null
  } = {}) {
    let a = fg(A) || K(A),
      s = o?.getOrCreateByAssetIds?.(a) || "";
    s && o.markProcessing?.(s, MA(A), "failed", V(t)), ri(A)
  }

  function $t(A = null, g = null) {
    return !A || !g ? !1 : A.draftId && g.draftId ? A.draftId === g.draftId : !!(A.responseId && g.responseId && A.responseId === g.responseId && A.conversationId && g.conversationId && A.conversationId === g.conversationId)
  }

  function Ao(A) {
    return Vt(A)
  }

  function go({
    root: A = document,
    assetIds: g = null,
    sourceUrl: e = "",
    imageSessionStore: t = R()
  } = {}) {
    let o = typeof e == "string" ? e.trim() : "";
    if (!g || !o || (Os(g, o, {
        imageSessionStore: t
      }), !A)) return 0;
    let n = 0;
    for (let r of Ao(A)) {
      let a = {
          responseId: r?.dataset?.[pA] || null,
          draftId: r?.dataset?.[GA] || null,
          conversationId: r?.dataset?.[mA] || null
        },
        s = a.responseId || a.draftId || a.conversationId ? a : K(r);
      if (!$t(s, g)) continue;
      let i = r.dataset || (r.dataset = {});
      if (i.gwrSourceUrl === o) {
        let u = se(o, {
          imageSessionStore: t
        });
        u && QA(r, u.processedBlob, {
          imageSessionStore: t,
          processedMeta: u.processedMeta,
          processedFrom: u.processedFrom,
          processedSlot: "preview"
        });
        continue
      }
      i.gwrSourceUrl = o;
      let D = se(o, {
        imageSessionStore: t
      });
      D && QA(r, D.processedBlob, {
        imageSessionStore: t,
        processedMeta: D.processedMeta,
        processedFrom: D.processedFrom,
        processedSlot: "preview"
      }), n += 1
    }
    return n
  }

  function eo({
    root: A = document,
    sourceUrl: g = "",
    processedBlob: e = null,
    processedMeta: t = null,
    processedFrom: o = "request-preview",
    sessionKey: n = "",
    assetIds: r = null,
    imageSessionStore: a = R()
  } = {}) {
    let s = typeof g == "string" ? _(g.trim()) : "";
    if (!A || !s || !(e instanceof Blob)) return 0;
    let i = 0,
      D = typeof n == "string" ? n.trim() : "";
    for (let u of Ao(A)) {
      if (_(X(u) || "") !== s) continue;
      let P = u.dataset || (u.dataset = {});
      if (P.gwrSourceUrl || (P.gwrSourceUrl = s), QA(u, e, {
          imageSessionStore: a,
          processedMeta: t,
          processedFrom: o,
          processedSlot: "preview"
        }), !D) {
        let p = fg(u) || K(u);
        D = a.getOrCreateByAssetIds?.(p) || ""
      }
      i += 1
    }
    return Qs(s, {
      sessionKey: D,
      assetIds: r,
      processedMeta: t,
      processedFrom: o
    }, {
      imageSessionStore: a
    }), i
  }

  function ci({
    sourceUrl: A,
    assetIds: g = null,
    imageElement: e,
    fetchPreviewBlob: t,
    processWatermarkBlobImpl: o,
    removeWatermarkFromBlobImpl: n
  } = {}) {
    return {
      sourceUrl: A,
      assetIds: g,
      imageElement: e,
      fetchPreviewBlob: t,
      processWatermarkBlobImpl: o,
      removeWatermarkFromBlobImpl: n,
      captureRenderedImageBlob: og,
      fetchBlobDirectImpl: dg,
      validateBlob: JA,
      fetchBlobFromBackgroundImpl: Be
    }
  }

  function Pi({
    logger: A = console,
    onLog: g = null,
    targetDocument: e = globalThis.document,
    imageSessionStore: t = R(),
    fetchPreviewBlob: o = tg,
    processPageImageSourceImpl: n = ks,
    processWatermarkBlobImpl: r = VA,
    removeWatermarkFromBlobImpl: a = Yg,
    scheduleProcessingDrain: s = Vs,
    setTimeoutImpl: i = globalThis.setTimeout?.bind(globalThis) || null,
    clearTimeoutImpl: D = globalThis.clearTimeout?.bind(globalThis) || null
  } = {}) {
    let u = new WeakSet,
      c = new WeakSet,
      P = new WeakMap,
      p = [],
      I = null,
      l = !1,
      B = !1,
      G = null;

    function Y(E) {
      if (!E || typeof E != "object") return !1;
      let j = String(X(E) || "").trim(),
        q = typeof E?.dataset?.gwrSourceUrl == "string" ? E.dataset.gwrSourceUrl.trim() : "",
        z = typeof E?.dataset?.gwrStableSource == "string" ? E.dataset.gwrStableSource.trim() : "",
        iA = [q, z, j].filter(Boolean);
      for (let YA of iA) {
        let Z = se(YA, {
          imageSessionStore: t
        });
        if (!Z) continue;
        let J = E.dataset || (E.dataset = {});
        return J.gwrSourceUrl || (J.gwrSourceUrl = Z.sourceUrl), QA(E, Z.processedBlob, {
          imageSessionStore: t,
          processedMeta: Z.processedMeta,
          processedFrom: Z.processedFrom,
          processedSlot: "preview"
        }), !0
      }
      return !1
    }

    function w(E) {
      if (!E || typeof E != "object") return !1;
      let j = K(E),
        q = t?.getOrCreateByAssetIds?.(j) || "";
      if (!q) return !1;
      let z = t?.getBestResource?.(q, "display") || null;
      return z?.kind !== "processed" || !(z.blob instanceof Blob) ? !1 : (QA(E, z.blob, {
        imageSessionStore: t,
        processedMeta: z.processedMeta ?? null,
        processedFrom: z.source || "processed",
        processedSlot: z.slot === "full" ? "full" : "preview"
      }), !0)
    }

    function C(E) {
      let j = P.get(E);
      j && (typeof E?.removeEventListener == "function" && (E.removeEventListener("load", j.handleReady), E.removeEventListener("error", j.handleStop)), j.timeoutId !== null && typeof D == "function" && D(j.timeoutId), P.delete(E))
    }

    function f(E) {
      if (!E || P.has(E)) return;
      let j = () => {
          C(E), O(E)
        },
        q = () => {
          C(E)
        },
        z = typeof i == "function" ? i(j, Gs) : null;
      P.set(E, {
        handleReady: j,
        handleStop: q,
        timeoutId: z
      }), typeof E?.addEventListener == "function" && (E.addEventListener("load", j, {
        once: !0
      }), E.addEventListener("error", q, {
        once: !0
      }))
    }
    async function m(E) {
      if (Es(E, G), Y(E) || w(E)) return;
      let j = String(X(E) || "").trim();
      if (j && sA(j) && !Hs(E)) {
        f(E);
        return
      }
      C(E);
      let q = ai(E, {
        processing: u,
        imageSessionStore: t
      });
      if (!q) return;
      let {
        sourceUrl: z,
        normalizedUrl: iA,
        isPreviewSource: YA,
        assetIds: Z
      } = q;
      si({
        logger: A,
        onLog: g,
        sourceUrl: z,
        normalizedUrl: iA,
        isPreviewSource: YA
      });
      try {
        let J = await n(ci({
          sourceUrl: z,
          assetIds: Z,
          imageElement: E,
          fetchPreviewBlob: o,
          processWatermarkBlobImpl: r,
          removeWatermarkFromBlobImpl: a
        }));
        ii({
          imageElement: E,
          imageSessionStore: t,
          logger: A,
          onLog: g,
          sourceUrl: z,
          normalizedUrl: iA,
          isPreviewSource: YA,
          sourceResult: J
        })
      } catch (J) {
        Bi({
          imageElement: E,
          imageSessionStore: t,
          logger: A,
          onLog: g,
          sourceUrl: z,
          normalizedUrl: iA,
          error: J
        })
      } finally {
        u.delete(E)
      }
    }
    async function d() {
      if (!B) {
        B = !0;
        try {
          let E = p.shift();
          if (!E) return;
          c.delete(E), await m(E)
        } finally {
          B = !1, p.length > 0 && y()
        }
      }
    }

    function y() {
      l || B || (l = !0, s(() => {
        l = !1, d()
      }))
    }

    function O(E) {
      E && (c.has(E) || u.has(E) || (c.add(E), MA(E) === "fullscreen" ? p.unshift(E) : p.push(E), y()))
    }

    function h(E = document) {
      for (let j of Vt(E)) O(j)
    }
    let T = Xs({
      processRoot: h
    }).schedule;

    function S(E) {
      let j = hs(E?.target),
        q = ds(j);
      q && (G = q)
    }

    function Q() {
      let E = e?.body || e?.documentElement;
      !E || I || (I = new MutationObserver(j => {
        Zs(j, {
          scheduleProcess: T,
          HTMLImageElementClass: HTMLImageElement
        })
      }), I.observe(E, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: Is
      }))
    }
