  function to(A = {}) {
    let g = Pi(A);
    return g.install(), g
  }

  function oo(...A) {
    let g = {
      responseId: "",
      draftId: "",
      conversationId: ""
    };
    for (let e of A) {
      let t = wA(e);
      t && (g.responseId || (g.responseId = t.responseId || ""), g.draftId || (g.draftId = t.draftId || ""), g.conversationId || (g.conversationId = t.conversationId || ""))
    }
    return wA(g)
  }

  function ui(A) {
    return (typeof A?.tagName == "string" ? A.tagName.toUpperCase() : "") === "IMG" ? A : null
  }

  function ng({
    action: A = "display",
    actionContext: g = null,
    target: e = null,
    imageElement: t = null,
    resolveImageElement: o = null,
    resolveAssetIds: n = K,
    imageSessionStore: r = R()
  } = {}) {
    let a = Tg(g),
      s = t || a?.imageElement || ui(e) || null;
    !s && typeof o == "function" && (s = o(a) || null);
    let i = typeof n == "function" && s ? n(s) : null,
      D = typeof n == "function" && e ? n(e) : null,
      u = oo(a?.assetIds, i, D),
      P = (typeof a?.sessionKey == "string" ? a.sessionKey.trim() : "") || r?.getOrCreateByAssetIds?.(u) || zA(u),
      p = P && r?.getSnapshot?.(P) || null,
      I = oo(u, p?.assetIds),
      l = P && r?.getBestResource?.(P, A) || null,
      B = P && r?.getPreferredElement?.(P, A) || null;
    return B && (s = B), {
      action: A,
      sessionKey: P || "",
      assetIds: I,
      imageElement: s,
      resource: l
    }
  }

  function Eg(A) {
    return typeof A == "string" && /^image\//i.test(A)
  }

  function Di(A) {
    return typeof A == "string" && /^blob:/i.test(A)
  }

  function Ii(A) {
    return Array.from(A || []).some(g => Array.isArray(g?.types) && g.types.some(Eg))
  }
  async function li(A) {
    for (let g of Array.from(A || [])) {
      let e = Array.isArray(g?.types) ? g.types.filter(Eg) : [];
      for (let t of e) {
        if (typeof g?.getType != "function") continue;
        let o = await g.getType(t);
        if (o instanceof Blob) return o
      }
    }
    return null
  }

  function pi(A) {
    if (!A || typeof A != "object") return !1;
    if (A.action === "clipboard" || typeof A.sessionKey == "string" && A.sessionKey.trim()) return !0;
    let g = A.assetIds;
    return !!(g && typeof g == "object" && (g.responseId || g.draftId || g.conversationId))
  }
  async function Gi(A, g) {
    if (typeof A == "function") try {
      await A(g)
    } catch {}
  }
  async function mi(A, g, e = globalThis) {
    let t = e?.Image || globalThis.Image,
      o = g?.ownerDocument || e?.document || globalThis.document;
    if (typeof t != "function" || !o?.createElement) throw new Error("Image decode fallback unavailable");
    let n = new t;
    n.decoding = "async", n.src = A, typeof n.decode == "function" ? await n.decode() : await new Promise((D, u) => {
      n.onload = () => D(), n.onerror = () => u(new Error("Failed to load processed object URL"))
    });
    let r = Number(n.naturalWidth) || Number(n.width) || Number(g?.naturalWidth) || Number(g?.width) || 0,
      a = Number(n.naturalHeight) || Number(n.height) || Number(g?.naturalHeight) || Number(g?.height) || 0;
    if (r <= 0 || a <= 0) throw new Error("Processed object URL image has no renderable size");
    let s = o.createElement("canvas");
    s.width = r, s.height = a;
    let i = s.getContext?.("2d", {
      willReadFrequently: !0
    });
    if (!i) throw new Error("2D canvas context unavailable");
    return i.drawImage(n, 0, 0, r, a), oA(s, "image/png", {
      unavailableMessage: "Canvas toBlob unavailable",
      nullBlobMessage: "Canvas toBlob returned null"
    })
  }
  async function Yi(A, g, e) {
    let t = [],
      o = !1;
    for (let n of Array.from(A || [])) {
      let r = Array.isArray(n?.types) ? n.types.filter(Boolean) : [];
      if (!r.some(Eg) || typeof e != "function") {
        t.push(n);
        continue
      }
      let a = {};
      for (let s of r) Eg(s) || typeof n.getType == "function" && (a[s] = n.getType(s));
      a[g.type || "image/png"] = g, t.push(new e(a)), o = !0
    }
    return o ? t : A
  }
  async function Ci(A, {
    processClipboardImageBlob: g = null,
    actionContext: e = null
  } = {}) {
    if (typeof g != "function") return null;
    let t = await li(A);
    if (!(t instanceof Blob)) return null;
    let o = await g(t, {
      actionContext: e,
      items: A
    });
    return o instanceof Blob ? o : o?.processedBlob instanceof Blob ? o.processedBlob : null
  }
  async function wi({
    actionContext: A = null,
    resolveImageElement: g,
    imageSessionStore: e = R(),
    fetchBlobDirect: t,
    resolveBlobViaImageElement: o,
    requireFullProcessedResource: n = !1
  }) {
    let r = ng({
        action: "clipboard",
        actionContext: A,
        resolveImageElement: g,
        imageSessionStore: e
      }),
      a = r?.imageElement || A?.imageElement || null,
      s = r?.resource?.kind === "processed" && r.resource.blob instanceof Blob ? r.resource.blob : null;
    if (s) return s;
    let i = r?.resource?.kind === "processed" ? r.resource : null,
      D = typeof a?.dataset?.gwrWatermarkObjectUrl == "string" ? a.dataset.gwrWatermarkObjectUrl.trim() : "",
      u = !!(D && (!n || !r?.resource || r.resource.kind === "preview" || r.resource.kind === "blob"));
    if (n && !i && !u) return null;
    let P = (i && typeof r.resource.url == "string" ? r.resource.url.trim() : "") || (u ? D : "");
    if (!P) return null;
    if (a && Di(P) && typeof o == "function") try {
      return await o({
        objectUrl: P,
        imageElement: a
      })
    } catch (p) {
      if (!n && typeof t == "function") return t(P);
      throw p
    }
    return typeof t != "function" ? null : t(P)
  }

  function no(A, {
    provideActionContext: g = null,
    getActionContext: e = () => null,
    resolveImageElement: t = null,
    imageSessionStore: o = R(),
    onActionCriticalFailure: n = null,
    onProcessedBlobResolved: r = null,
    processClipboardImageBlob: a = null,
    fetchBlobDirect: s = async u => GwcFetchBlobViaBridge(u),
    resolveBlobViaImageElement: i = ({
      objectUrl: u,
      imageElement: c
    }) => mi(u, c, A),
    logger: D = console
  } = {}) {
    let u = A?.navigator?.clipboard;
    if (!u || typeof u.write != "function") return () => {};
    let c = u.write.bind(u),
      P = A?.ClipboardItem || globalThis.ClipboardItem,
      p = typeof g == "function" ? g : CA({
        getActionContext: e
      }),
      I = async function(B) {
        let G = p(),
          Y = Ii(B),
          w = Y && pi(G),
          C = null;
        try {
          if (!Y) return c(B);
          let f = null;
          try {
            f = await wi({
              actionContext: G,
              resolveImageElement: t,
              imageSessionStore: o,
              fetchBlobDirect: s,
              resolveBlobViaImageElement: i,
              requireFullProcessedResource: w
            })
          } catch (d) {
            C = d
          }
          if (!f && w && (f = await Ci(B, {
              processClipboardImageBlob: a,
              actionContext: G
            }), f && typeof r == "function" && await r({
              actionContext: G,
              processedBlob: f
            })), !f) {
            if (w) throw C || new Error("Original image is unavailable for clipboard processing");
            return c(B)
          }
          let m = await Yi(B, f, P);
          return c(m)
        } catch (f) {
          if (D?.warn?.("[Gemini Watermark Remover] Clipboard image hook failed, falling back:", f), w) throw await Gi(n, {
            error: f,
            actionContext: G,
            items: B
          }), f;
          return c(B)
        }
      };
    return u.write = I, () => {
      u.write === I && (u.write = c)
    }
  }

  function ro(A = null, g = null) {
    return !A || !g ? !1 : A.draftId && g.draftId ? A.draftId === g.draftId : !!(A.responseId && g.responseId && A.responseId === g.responseId && A.conversationId && g.conversationId && A.conversationId === g.conversationId)
  }

  function fi(A, g) {
    if (!A || !g || typeof A.querySelectorAll != "function") return null;
    let e = null;
    for (let t of A.querySelectorAll(xA()))
      if (ro(K(t), g)) {
        if (t?.dataset?.gwrWatermarkObjectUrl) return t;
        e || (e = t)
      } return e
  }

  function ao(A, g = "") {
    if (!A || typeof A.querySelectorAll != "function") return null;
    let e = typeof g == "string" ? _(g.trim()) : "";
    if (!e) return null;
    let t = null,
      o = [];
    for (let n of A.querySelectorAll(xA())) {
      let r = _(X(n) || "");
      if (!r || r !== e) {
        let a = typeof n?.currentSrc == "string" ? n.currentSrc.trim() : "",
          s = typeof n?.src == "string" ? n.src.trim() : "";
        !(typeof n?.dataset?.gwrSourceUrl == "string" && n.dataset.gwrSourceUrl.trim()) && (a.startsWith("blob:") || s.startsWith("blob:")) && o.push(n);
        continue
      }
      if (n?.dataset?.gwrWatermarkObjectUrl) return n;
      t || (t = n)
    }
    return !t && o.length === 1 ? o[0] : t
  }

  function di(A) {
    if (!A || typeof A != "object") return [];
    let g = [];
    return typeof A.tagName == "string" && A.tagName.toUpperCase() === "IMG" && g.push(A), typeof A.querySelectorAll == "function" && g.push(...A.querySelectorAll("img")), g.filter(Boolean)
  }

  function yi(A, g) {
    let e = di(A);
    if (e.length === 0) return null;
    let t = g ? e.find(r => ro(K(r), g)) : null,
      o = t?.dataset?.gwrWatermarkObjectUrl ? t : null;
    if (o) return o;
    if (t) return t;
    let n = e.find(r => typeof r?.dataset?.gwrWatermarkObjectUrl == "string" && r.dataset.gwrWatermarkObjectUrl.trim());
    return n || e[0] || null
  }

  function ce(A, g, e) {
    let t = typeof g?.closest == "function" ? g.closest('button,[role="button"]') : null,
      o = e ? fi(A?.document || document, e) : null,
      n = [t?.closest?.("generated-image,.generated-image-container"), t?.closest?.("single-image"), t?.closest?.('expansion-dialog,[role="dialog"],.image-expansion-dialog-panel,.cdk-overlay-pane'), t?.closest?.("[data-test-draft-id]")].filter(Boolean);
    for (let r of n) {
      let a = yi(r, e);
      if (a?.dataset?.gwrWatermarkObjectUrl) return a;
      if (o?.dataset?.gwrWatermarkObjectUrl) return o;
      if (a) return a
    }
    return o
  }

  function so({
    targetWindow: A,
    imageSessionStore: g = R()
  } = {}) {
    function e(o, {
      action: n = "display"
    } = {}) {
      let r = ce(A, o, null),
        a = ng({
          action: n,
          target: o,
          imageElement: r,
          imageSessionStore: g
        }),
        s = a?.assetIds ? ce(A, o, a.assetIds) : null;
      return !s || s === r ? a : ng({
        action: n,
        target: o,
