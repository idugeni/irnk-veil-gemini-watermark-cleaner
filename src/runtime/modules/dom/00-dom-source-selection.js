  async function Ke({
    sourceUrl: A,
    image: g,
    fetchBlobFromBackground: e,
    fetchBlobDirect: t,
    captureRenderedImageBlob: o,
    validateBlob: n,
    preferRenderedCaptureForPreview: r = !0,
    preferRenderedCaptureForBlobUrl: a = !1,
    allowRenderedCaptureFallbackOnValidationFailure: s = !0
  }) {
    let i = typeof A == "string" ? A.trim() : "";
    if (r && En(i)) return cg({
      image: g,
      captureRenderedImageBlob: o
    });
    if (a && yn(i)) return cg({
      image: g,
      captureRenderedImageBlob: o
    });
    if (AA(i)) {
      let D = await e(i);
      if (typeof n == "function") try {
        await n(D)
      } catch (u) {
        if (!s) throw u;
        return cg({
          image: g,
          captureRenderedImageBlob: o
        })
      }
      return D
    }
    return dn(i) ? t(i) : cg({
      image: g,
      captureRenderedImageBlob: o
    })
  }
  var KA = "generated-image,.generated-image-container",
    hn = 'expansion-dialog,[role="dialog"],.image-expansion-dialog-panel,.cdk-overlay-pane',
    On = '[data-test-id="image-preview"],uploader-file-preview,uploader-file-preview-container,.attachment-preview-wrapper,.file-preview-container',
    xe = 128,
    Rg = 4,
    bn = 3,
    ke = "data-test-draft-id";

  function DA(A, g) {
    if (typeof A != "string") return null;
    let e = A.trim();
    return !e.startsWith(g) || e.length <= g.length ? null : e
  }

  function Mn(A = "") {
    if (typeof A != "string" || A.length === 0) return null;
    let g = DA(A.match(/"((?:r|resp)_[^"]+)"/)?.[1] || null, "r_"),
      e = DA(A.match(/"((?:c|conv)_[^"]+)"/)?.[1] || null, "c_"),
      t = DA(A.match(/"((?:rc|draft)_[^"]+)"/)?.[1] || null, "rc_");
    return !g && !e && !t ? null : {
      responseId: g,
      draftId: t,
      conversationId: e
    }
  }

  function Ne(A, g) {
    return !A || typeof A.getAttribute != "function" ? "" : String(A.getAttribute(g) || "").trim()
  }

  function vA(A, g) {
    return !A || typeof A.closest != "function" ? null : A.closest(g)
  }

  function Qn(A) {
    let g = [],
      e = new Set,
      t = r => {
        !r || typeof r != "object" || e.has(r) || (e.add(r), g.push(r))
      };
    t(A), t(vA(A, "single-image")), t(vA(A, `[${ke}]`)), t(vA(A, KA));
    let o = A?.parentElement || null,
      n = 0;
    for (; o && n < Rg;) t(o), o = o.parentElement || null, n += 1;
    return g
  }

  function Tn(A) {
    let g = Number(A?.naturalWidth) || 0,
      e = Number(A?.naturalHeight) || 0,
      t = Number(A?.width) || 0,
      o = Number(A?.height) || 0,
      n = Number(A?.clientWidth) || 0,
      r = Number(A?.clientHeight) || 0;
    return {
      width: Math.max(g, t, n),
      height: Math.max(e, o, r)
    }
  }

  function Sn(A) {
    return !!(A?.responseId || A?.draftId || A?.conversationId)
  }

  function jn(A) {
    return A.startsWith("blob:") || A.startsWith("data:")
  }

  function Hn(A) {
    return !!vA(A, hn)
  }

  function Rn(A) {
    return !!vA(A, On)
  }

  function X(A) {
    if (!A || typeof A != "object" || A?.dataset?.gwrPreviewImage === "true") return "";
    let g = typeof A?.dataset?.gwrSourceUrl == "string" ? A.dataset.gwrSourceUrl.trim() : "";
    if (g) return g;
    let e = typeof A?.dataset?.gwrStableSource == "string" ? A.dataset.gwrStableSource.trim() : "";
    if (e) {
      let n = typeof A?.currentSrc == "string" ? A.currentSrc.trim() : "",
        r = typeof A?.src == "string" ? A.src.trim() : "";
      if (n.startsWith("blob:") || n.startsWith("data:") || r.startsWith("blob:") || r.startsWith("data:")) return e
    }
    let t = typeof A?.currentSrc == "string" ? A.currentSrc.trim() : "";
    return t || (typeof A?.src == "string" ? A.src.trim() : "")
  }

  function Pg(A) {
    if (!A || typeof A.closest != "function" || A?.dataset?.gwrPreviewImage === "true" || Rn(A)) return !1;
    let g = A.closest(KA),
      e = X(A);
    return AA(e) ? g ? !0 : Ue(A) : g && jn(e) && (Hn(A) || Sn(K(A))) ? !0 : _n(A)
  }

  function ug() {
    return KA
  }

  function xA() {
    return KA.split(",").map(A => `${A.trim()} img`).join(",")
  }

  function Ue(A) {
    let {
      width: g,
      height: e
    } = Tn(A);
    return g >= xe || e >= xe
  }

  function qg(A) {
    if (!A || typeof A != "object") return null;
    let g = typeof A.closest == "function" ? A.closest(KA) : null;
    if (g) return g;
    let e = A.parentElement || null,
      t = 0;
    for (; e && t < Rg;) {
      if (e.tagName && e.tagName !== "IMG") return e;
      e = e.parentElement || null, t += 1
    }
    return A.parentElement || null
  }

  function K(A) {
    let g = {
      responseId: null,
      draftId: null,
      conversationId: null
    };
    if (!A || typeof A != "object") return g;
    let e = DA(typeof A?.dataset?.gwrResponseId == "string" ? A.dataset.gwrResponseId : null, "r_");
    e && (g.responseId = e);
    let t = DA(typeof A?.dataset?.gwrDraftId == "string" ? A.dataset.gwrDraftId : null, "rc_");
    t && (g.draftId = t);
    let o = DA(typeof A?.dataset?.gwrConversationId == "string" ? A.dataset.gwrConversationId : null, "c_");
    o && (g.conversationId = o);
    for (let n of Qn(A)) {
      g.draftId || (g.draftId = DA(Ne(n, ke), "rc_"));
      let r = Mn(Ne(n, "jslog"));
      if (r && (g.responseId || (g.responseId = r.responseId), g.draftId || (g.draftId = r.draftId), g.conversationId || (g.conversationId = r.conversationId), g.responseId && g.draftId && g.conversationId)) break
    }
    return g
  }

  function qn(A) {
    let g = A?.parentElement || null,
      e = 0;
    for (; g && e < Rg;) {
      if (((typeof g.querySelectorAll == "function" ? g.querySelectorAll('button,[role="button"]') : [])?.length || 0) >= bn) return !0;
      g = g.parentElement || null, e += 1
    }
    return !1
  }

  function _n(A) {
    return Ue(A) && qn(A)
  }
