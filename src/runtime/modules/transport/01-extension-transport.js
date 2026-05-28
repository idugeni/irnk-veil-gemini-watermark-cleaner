        preferRenderedCaptureForBlobUrl: !0,
        allowRenderedCaptureFallbackOnValidationFailure: i
      });
    if (D && fs(u, g)) throw new Error("Preview source aspect ratio mismatches visible preview");
    return {
      skipped: !1,
      processedBlob: await t(P),
      selectedStrategy: "",
      candidateDiagnostics: null,
      candidateDiagnosticsSummary: ""
    }
  }
  async function ks({
    sourceUrl: A,
    imageElement: g,
    fetchPreviewBlob: e = tg,
    processWatermarkBlobImpl: t = VA,
    removeWatermarkFromBlobImpl: o = Yg,
    captureRenderedImageBlob: n = og,
    fetchBlobDirectImpl: r = dg,
    validateBlob: a = JA,
    fetchBlobFromBackgroundImpl: s = Be
  }) {
    if (kt(g, A)) {
      if (!sA(A) && PA(A)) try {
        return await _t({
          sourceUrl: A,
          imageElement: g,
          fetchPreviewBlob: e,
          removeWatermarkFromBlobImpl: o,
          captureRenderedImageBlob: n,
          fetchBlobDirectImpl: r,
          validateBlob: a,
          fetchBlobFromBackgroundImpl: s,
          preferRenderedCaptureForPreview: !1,
          rejectPreviewAspectMismatch: !0
        })
      } catch {}
      return Ns({
        sourceUrl: A,
        imageElement: g,
        fetchPreviewBlob: sA(A) ? null : e,
        processWatermarkBlobImpl: t,
        captureRenderedImageBlob: n
      })
    }
    return _t({
      sourceUrl: A,
      imageElement: g,
      fetchPreviewBlob: e,
      removeWatermarkFromBlobImpl: o,
      captureRenderedImageBlob: n,
      fetchBlobDirectImpl: r,
      validateBlob: a,
      fetchBlobFromBackgroundImpl: s,
      preferRenderedCaptureForPreview: PA(A) && !Nt(g, A)
    })
  }

  function re(A, g) {
    Pg(g) && A.add(g)
  }

  function Vt(A) {
    let g = new Set;
    if (A instanceof HTMLImageElement && re(g, A), typeof A?.querySelectorAll == "function") {
      for (let e of A.querySelectorAll(xA())) re(g, e);
      for (let e of A.querySelectorAll("img")) re(g, e)
    }
    return [...g]
  }

  function Us(A) {
    if (!A || typeof A.querySelector != "function") return !1;
    let g = ug();
    return A.querySelector(g) ? !0 : !!(A.querySelector("img") && A.querySelector('button,[role="button"]'))
  }

  function Ls(A) {
    if (!A || typeof A != "object") return !1;
    let g = typeof A.tagName == "string" ? A.tagName.toUpperCase() : "";
    if (!g) return !1;
    if (g === "IMG" || g === "GENERATED-IMAGE") return !0;
    let e = ug();
    return typeof A.matches == "function" && A.matches(e) ? !0 : Us(A)
  }

  function Fs(A, g = "") {
    if (!A || typeof A != "object") return !1;
    let e = typeof g == "string" ? g.trim().toLowerCase() : "";
    return e ? e === "data-gwr-stable-source" ? !1 : e !== "src" && e !== "srcset" ? !0 : !Ws(A) : !0
  }

  function Ws(A) {
    let g = typeof A?.dataset?.[gg] == "string" ? A.dataset[gg].trim() : "";
    if (!g) return !1;
    let e = typeof A?.currentSrc == "string" ? A.currentSrc.trim() : "",
      t = typeof A?.src == "string" ? A.src.trim() : "";
    return e === g || t === g
  }

  function Zs(A, {
    scheduleProcess: g,
    HTMLImageElementClass: e = globalThis.HTMLImageElement
  } = {}) {
    if (typeof g != "function" || !Array.isArray(A) || A.length === 0) return;
    let t = typeof e == "function";
    for (let o of A) {
      if (o?.type === "attributes") {
        if (!t || !(o.target instanceof e) || !Fs(o.target, o.attributeName)) continue;
        g(o.target);
        continue
      }
      if (!(o?.type !== "childList" || !o.addedNodes))
        for (let n of o.addedNodes) Ls(n) && g(n)
    }
  }

  function Js(A) {
    if (typeof requestAnimationFrame == "function") {
      requestAnimationFrame(() => A());
      return
    }
    globalThis.setTimeout(A, 16)
  }

  function Vs(A) {
    if (typeof requestIdleCallback == "function") {
      requestIdleCallback(() => A(), {
        timeout: 120
      });
      return
    }
    globalThis.setTimeout(A, 32)
  }

  function zt(A, g) {
    if (!A || !g || A === g) return !1;
    if (typeof A.contains == "function") try {
      return A.contains(g)
    } catch {
      return !1
    }
    return !1
  }

  function Xs({
    processRoot: A,
    scheduleFlush: g = Js
  } = {}) {
    let e = new Set,
      t = !1;

    function o() {
      t = !1;
      let r = [...e];
      e.clear();
      for (let a of r) A(a)
    }

    function n(r = document) {
      for (let a of e)
        if (a === r || zt(a, r)) return;
      for (let a of [...e]) zt(r, a) && e.delete(a);
      e.add(r), !t && (t = !0, g(o))
    }
    return {
      schedule: n,
      flush: o
    }
  }

  function $s(A) {
    let g = A("div");
    return g.dataset[us] = "true", g.textContent = "Processing...", g.style && typeof g.style == "object" && Object.assign(g.style, {
      position: "absolute",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      pointerEvents: "none",
      borderRadius: "inherit",
      background: "rgba(17, 17, 17, 0.16)",
      backdropFilter: "blur(2px)",
      color: "rgba(255, 255, 255, 0.92)",
      fontSize: "13px",
      fontWeight: "500",
      letterSpacing: "0.02em",
      opacity: "1",
      transition: `opacity ${Kt}ms ease`
    }), g
  }

  function Ai(A = "") {
    return [A.trim(), "blur(4px)", "brightness(0.78)"].filter(Boolean).join(" ")
  }

  function gi(A, {
    container: g = qg(A) || A?.parentElement || null,
    createElement: e = o => document.createElement(o),
    clearTimeoutImpl: t = globalThis.clearTimeout?.bind(globalThis) || null
  } = {}) {
    if (!A || !g || typeof g.appendChild != "function") return null;
    let o = $A.get(A);
    if (o) return o.hideTimerId !== null && typeof t == "function" && (t(o.hideTimerId), o.hideTimerId = null, o.hideSequence += 1), o.overlay?.style && typeof o.overlay.style == "object" && (o.overlay.style.opacity = "1"), o.overlay;
    let n = $s(e),
      r = typeof A?.style?.filter == "string" ? A.style.filter : "",
      a = typeof g?.style?.position == "string" ? g.style.position : "",
      s = !!(g.style && (!g.style.position || g.style.position === "static"));
    return s && (g.style.position = "relative"), g.appendChild(n), A.style && typeof A.style == "object" && (A.style.filter = Ai(r)), A.dataset && (A.dataset[vt] = "true"), $A.set(A, {
      overlay: n,
      container: g,
      previousFilter: r,
      previousContainerPosition: a,
      didOverrideContainerPosition: s,
      hideTimerId: null,
      hideSequence: 0
    }), n
  }

  function yg(A, {
    removeImmediately: g = !1,
    setTimeoutImpl: e = globalThis.setTimeout?.bind(globalThis) || null,
    clearTimeoutImpl: t = globalThis.clearTimeout?.bind(globalThis) || null
  } = {}) {
    let o = $A.get(A);
    if (!o) return;
    let n = o.hideSequence + 1;
    o.hideSequence = n;
    let r = () => {
      $A.get(A) === o && o.hideSequence === n && (o.overlay?.parentNode && typeof o.overlay.parentNode.removeChild == "function" && o.overlay.parentNode.removeChild(o.overlay), A?.style && typeof A.style == "object" && (A.style.filter = o.previousFilter), A?.dataset && delete A.dataset[vt], o.didOverrideContainerPosition && o.container?.style && typeof o.container.style == "object" && o.container.style.position === "relative" && (o.container.style.position = o.previousContainerPosition), o.hideTimerId = null, $A.delete(A))
    };
    if (g || typeof e != "function") {
      o.hideTimerId !== null && typeof t == "function" && (t(o.hideTimerId), o.hideTimerId = null), r();
      return
    }
    o.hideTimerId !== null && typeof t == "function" && t(o.hideTimerId), o.overlay?.style && typeof o.overlay.style == "object" && (o.overlay.style.opacity = "0"), o.hideTimerId = e(r, Kt)
  }

  function Xt(A) {
    let g = ae.get(A);
    g?.overlay?.parentNode && typeof g.overlay.parentNode.removeChild == "function" && g.overlay.parentNode.removeChild(g.overlay), g?.overlay?.style && typeof g.overlay.style == "object" && (g.overlay.style.opacity = "0"), ae.delete(A);
    let e = A?.dataset?.[gg];
    e && (URL.revokeObjectURL(e), delete A.dataset[gg])
  }

  function ei(A, g) {
    let e = qt(A?.getBoundingClientRect?.()),
      t = qt(g?.getBoundingClientRect?.());
    if (!e || !t) return null;
    let o = e.left - t.left,
      n = e.top - t.top;
    return ![o, n].every(Number.isFinite) || e.width <= 0 || e.height <= 0 ? null : {
      left: o,
      top: n,
      width: e.width,
      height: e.height
    }
  }

  function ti(A, g) {
    let e = g,
      t = o => o?.parentElement || o?.parentNode || null;
    for (; t(e) && t(e) !== A;) e = t(e);
    return t(e) === A ? e : null
  }

  function oi(A) {
    let g = qg(A) || A?.parentElement || null;
    if (!g) return {
      container: null,
      referenceNode: null
    };
    let e = typeof g.querySelector == "function" ? g.querySelector(".generated-image-controls") : null,
      t = e?.parentElement || e?.parentNode || null;
    return t && typeof t.appendChild == "function" ? {
      container: t,
      referenceNode: e
    } : {
      container: g,
      referenceNode: ti(g, e)
    }
  }

  function ni(A) {
    A.dataset[Ag] = "skipped", yg(A, {
      removeImmediately: !0
    })
  }

  function QA(A, g, {
    imageSessionStore: e = R(),
    processedMeta: t = null,
    processedFrom: o = "",
    processedSlot: n = "preview"
  } = {}) {
    let r = URL.createObjectURL(g);
    Xt(A), A.dataset[gg] = r, A.dataset[Ag] = "ready";
    let a = fg(A) || K(A),
      s = e?.getOrCreateByAssetIds?.(a) || "";
    s && (e.attachElement?.(s, MA(A), A), e.updateProcessedResult?.(s, {
      slot: n,
      objectUrl: r,
      blob: g || null,
      blobType: g?.type || "",
      processedMeta: t,
      processedFrom: o
    }), e.markProcessing?.(s, MA(A), "ready"));
    let {
      container: i,
      referenceNode: D
    } = oi(A);
    if (i && typeof i.appendChild == "function") {
      let u = document.createElement("div");
      u.dataset[Ds] = "true";
      let c = ei(A, i);
      u.style && typeof u.style == "object" && Object.assign(u.style, {
        position: "absolute",
        inset: c ? "auto" : "0",
