        left: c ? `${c.left}px` : "0",
        top: c ? `${c.top}px` : "0",
        width: c ? `${c.width}px` : "100%",
        height: c ? `${c.height}px` : "100%",
        pointerEvents: "none",
        backgroundImage: `url("${r}")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
      }), i.style && typeof i.style == "object" && (!i.style.position || i.style.position === "static") && (i.style.position = "relative"), D && typeof i.insertBefore == "function" ? i.insertBefore(u, D) : i.appendChild(u), ae.set(A, {
        overlay: u
      })
    }
    yg(A)
  }

  function ri(A) {
    A.dataset[Ag] = "failed", yg(A, {
      removeImmediately: !0
    })
  }

  function ai(A, {
    processing: g = null,
    HTMLImageElementClass: e = globalThis.HTMLImageElement,
    isProcessableImage: t = Pg,
    resolveSourceUrl: o = X,
    resolveAssetIds: n = K,
    imageSessionStore: r = R(),
    hideProcessingOverlayImpl: a = yg,
    revokeTrackedObjectUrlImpl: s = Xt,
    showProcessingOverlayImpl: i = gi
  } = {}) {
    let D = typeof e == "function" && A instanceof e,
      u = typeof A?.tagName == "string" && A.tagName.toUpperCase() === "IMG";
    if (!D && !u || typeof t == "function" && !t(A)) return null;
    let c = typeof o == "function" ? String(o(A) || "").trim() : "",
      P = A.dataset || (A.dataset = {}),
      p = typeof n == "function" ? n(A) : null,
      I = Jt(p),
      l = sA(c) || wg(c) ? bs(p, {
        imageSessionStore: r
      }) : "",
      B = I || l;
    if (B && (!P.gwrSourceUrl || sA(c) || wg(c)) && (P.gwrSourceUrl = B, c = B), !c) return null;
    let G = P[Ht] || "",
      Y = P[Ag] || "";
    if (G === c && Y === "ready" || typeof g?.has == "function" && g.has(A)) return null;
    G && G !== c && (a(A, {
      removeImmediately: !0
    }), s(A)), typeof g?.add == "function" && g.add(A);
    let w = MA(A),
      C = r?.getOrCreateByAssetIds?.(p) || "",
      f = kt(A, c);
    if (C) {
      if (r.attachElement?.(C, w, A), f) {
        let m = r.getBestResource?.(C, "display") || null;
        if (m?.kind === "processed" && m.slot === "preview" && m.source === "request-preview") return null
      }
      r.updateSourceSnapshot?.(C, {
        sourceUrl: c,
        isPreviewSource: f
      }), r.markProcessing?.(C, w, "processing")
    }
    return P.gwrStableSource = c, P[Ht] = c, P[Ag] = "processing", p?.responseId ? P[pA] = p.responseId : delete P[pA], p?.draftId ? P[GA] = p.draftId : delete P[GA], p?.conversationId ? P[mA] = p.conversationId : delete P[mA], i(A), {
      sessionKey: C,
      surfaceType: w,
      sourceUrl: c,
      normalizedUrl: _(c),
      isPreviewSource: f,
      assetIds: {
        responseId: p?.responseId || null,
        draftId: p?.draftId || null,
        conversationId: p?.conversationId || null
      }
    }
  }

  function si({
    logger: A = console,
    onLog: g = null,
    sourceUrl: e,
    normalizedUrl: t,
    isPreviewSource: o = !1
  } = {}) {
    eg({
      logger: A,
      onLog: g,
      consoleMessage: "[Gemini Watermark Remover] page image process start",
      eventType: "page-image-process-start",
      payload: {
        sourceUrl: e,
        normalizedUrl: t
      }
    }), o && eg({
      logger: A,
      onLog: g,
      consoleMessage: "[Gemini Watermark Remover] page image process strategy",
      eventType: "page-image-process-strategy",
      payload: {
        sourceUrl: e,
        strategy: "preview-candidate-fallback"
      }
    })
  }

  function ii({
    imageElement: A,
    sourceUrl: g,
    normalizedUrl: e,
    isPreviewSource: t = !1,
    sourceResult: o,
    imageSessionStore: n = R(),
    logger: r = console,
    onLog: a = null
  } = {}) {
    if (o?.skipped) {
      ni(A);
      let P = fg(A) || K(A),
        p = n?.getOrCreateByAssetIds?.(P) || "";
      p && n.markProcessing?.(p, MA(A), "idle"), eg({
        logger: r,
        onLog: a,
        consoleMessage: "[Gemini Watermark Remover] page image process skipped",
        eventType: "page-image-process-skipped",
        payload: {
          sourceUrl: g,
          normalizedUrl: e,
          reason: o.reason || "preview-fetch-unavailable",
          candidateDiagnostics: o.candidateDiagnostics,
          candidateDiagnosticsSummary: o.candidateDiagnosticsSummary || ""
        }
      });
      return
    }
    let s = o?.processedBlob,
      i = o?.selectedStrategy || "",
      D = o?.candidateDiagnostics || null,
      u = o?.candidateDiagnosticsSummary || "",
      c = o?.captureTiming || null;
    QA(A, s, {
      imageSessionStore: n,
      processedMeta: o?.processedMeta || null,
      processedFrom: i || (t ? "preview-candidate" : "default"),
      processedSlot: t ? "preview" : "full"
    }), eg({
      logger: r,
      onLog: a,
      consoleMessage: "[Gemini Watermark Remover] page image process success",
      eventType: "page-image-process-success",
      payload: {
        sourceUrl: g,
        normalizedUrl: e,
        strategy: i || (t ? "preview-candidate" : "default"),
        candidateDiagnostics: D,
        candidateDiagnosticsSummary: u,
        captureTiming: c,
        selectionDebug: o?.processedMeta?.selectionDebug ?? null,
        blobType: s?.type || "",
        blobSize: s?.size || 0
      }
    })
  }
