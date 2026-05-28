      }, g)
    });
    throw new Error(e)
  }

  function k(A) {
    return typeof A == "number" && Number.isFinite(A) ? A : null
  }

  function Pn(A) {
    let g = k(A?.width),
      e = k(A?.height);
    return g !== null && e !== null
  }

  function Se({
    spatialScore: A,
    gradientScore: g
  }) {
    let e = k(A),
      t = k(g);
    return e === null || t === null ? {
      tier: "insufficient"
    } : e >= .3 && t >= .12 || e >= .295 && t >= .45 ? {
      tier: "direct-match"
    } : e > 0 || t > 0 ? {
      tier: "needs-validation"
    } : {
      tier: "insufficient"
    }
  }

  function je(A) {
    if (!A || A.found !== !0) return {
      tier: "insufficient"
    };
    let g = k(A.confidence),
      e = k(A.spatialScore),
      t = k(A.gradientScore),
      o = k(A?.region?.size);
    return g === null || e === null || t === null || o === null ? {
      tier: "insufficient"
    } : g >= .5 && e >= .45 && t >= .12 && o >= 40 && o <= 192 ? {
      tier: "direct-match"
    } : o >= 40 && o <= 192 && t >= .12 && (g > 0 || e > 0) ? {
      tier: "needs-validation"
    } : {
      tier: "insufficient"
    }
  }

  function Sg(A) {
    if (!A || typeof A != "object") return {
      tier: "insufficient"
    };
    if (A.applied === !1) return {
      tier: "insufficient"
    };
    let g = k(A.size);
    if (g === null || g < 24 || g > 192) return {
      tier: "insufficient"
    };
    if (!Pn(A.position)) return {
      tier: "insufficient"
    };
    let e = A.detection || {},
      t = k(e.adaptiveConfidence),
      o = k(e.originalSpatialScore),
      n = k(e.processedSpatialScore),
      r = k(e.suppressionGain),
      a = typeof A.source == "string" ? A.source : "";
    return t !== null && r !== null && t >= .35 && r >= .16 ? {
      tier: "adaptive-match"
    } : a.includes("validated") && o !== null && n !== null && r !== null && o >= .2 && n <= .2 && r >= .3 ? {
      tier: "validated-match"
    } : o !== null && n !== null && r !== null && o >= .22 && n <= .2 && r >= .25 ? {
      tier: "safe-removal"
    } : {
      tier: "insufficient"
    }
  }

  function jg(A) {
    return A === "googleusercontent.com" || A.endsWith(".googleusercontent.com")
  }

  function _A(A) {
    return /=(?:d|d-I)$/i.test(String(A || ""))
  }

  function ag(A) {
    if (typeof A != "string" || A.length === 0) return null;
    let g = A.split("/").filter(Boolean)[0] || "";
    if (!g) return null;
    if (g.startsWith("rd-")) {
      let n = g.slice(3);
      return {
        family: "rd",
        variant: n.endsWith("-dl") ? n.slice(0, -3) : n,
        isPreview: !1,
        isDownload: n.endsWith("-dl")
      }
    }
    if (g === "gg") return {
      family: "gg",
      variant: "",
      isPreview: !0,
      isDownload: !1
    };
    if (!g.startsWith("gg-")) return null;
    let e = g.slice(3),
      t = e === "dl" || e.endsWith("-dl");
    return {
      family: "gg",
      variant: t ? e === "dl" ? "" : e.slice(0, -3) : e,
      isPreview: !t,
      isDownload: t
    }
  }

  function un(A) {
    return ag(A) !== null
  }

  function sg(A) {
    if (typeof A != "string" || A.length === 0) return null;
    try {
      let g = new URL(A);
      return jg(g.hostname) ? ag(g.pathname) : null
    } catch {
      return null
    }
  }

  function AA(A) {
    return sg(A) !== null
  }

  function He(A) {
    return sg(A)?.isPreview === !0
  }

  function PA(A) {
    if (typeof A != "string" || A.length === 0) return !1;
    try {
      let g = new URL(A);
      if (!jg(g.hostname)) return !1;
      let e = ag(g.pathname);
      return !e || e.family !== "gg" ? !1 : e.isPreview === !0 ? _A(g.pathname) === !1 : _A(g.pathname) ? !1 : e.isDownload === !0 && /-rj$/i.test(g.pathname) && _A(g.pathname) === !1
    } catch {
      return !1
    }
  }

  function ig(A) {
    if (typeof A != "string" || A.length === 0) return !1;
    try {
      let g = new URL(A);
      if (!jg(g.hostname)) return !1;
      let e = ag(g.pathname);
      return e ? e.isPreview === !1 || _A(g.pathname) : !1
    } catch {
      return !1
    }
  }

  function _(A) {
    if (!AA(A)) return A;
    try {
      let g = new URL(A);
      if (!un(g.pathname)) return A;
      let e = g.pathname,
        t = /=w\d+-h\d+([^/]*)$/i;
      if (t.test(e)) return g.pathname = e.replace(t, "=s0$1"), g.toString();
      if (_A(e)) return g.pathname = e.replace(/=(?:d|d-I)$/i, n => `=s0-${n.slice(1)}`), g.toString();
      let o = /=(?:s|w|h)\d+([^/]*)$/i;
      return o.test(e) ? (g.pathname = e.replace(o, "=s0$1"), g.toString()) : (g.pathname = `${e}=s0`, g.toString())
    } catch {
      return A
    }
  }

  function Dn(A) {
    try {
      return JSON.stringify(A)
    } catch {
      return ""
    }
  }

  function V(A, g = "Unknown error") {
    if (A instanceof Error) return A.message || g;
    if (typeof A == "string") return A.trim() || g;
    if (A && typeof A == "object") {
      if (typeof A.message == "string" && A.message.trim()) return A.message.trim();
      if (typeof A.error == "string" && A.error.trim()) return A.error.trim();
      let e = Number.isFinite(A.status) ? String(A.status) : "",
        t = typeof A.statusText == "string" ? A.statusText.trim() : "",
        o = `${e} ${t}`.trim();
      if (o) return o;
      let n = Dn(A);
      if (n && n !== "{}") return n
    }
    return g
  }

  function Hg(A, g) {
    if (typeof A != "string") return "";
    let e = A.trim();
    return !e.startsWith(g) || e.length <= g.length ? "" : e
  }

  function wA(A = null) {
    let g = {
      responseId: Hg(A?.responseId, "r_"),
      draftId: Hg(A?.draftId, "rc_"),
      conversationId: Hg(A?.conversationId, "c_")
    };
    return !g.responseId && !g.draftId && !g.conversationId ? null : g
  }

  function zA(A = null) {
    let g = wA(A);
    return g ? g.draftId ? `draft:${g.draftId}` : g.responseId && g.conversationId ? `response:${g.responseId}|conversation:${g.conversationId}` : "" : ""
  }

  function In() {
    return {
      preview: new Set,
      fullscreen: new Set,
      unknown: new Set
    }
  }

  function Re() {
    return {
      objectUrl: "",
      blob: null,
      blobType: "",
      processedMeta: null,
      processedFrom: ""
    }
  }

  function ze() {
    return {
      preview: Re(),
      full: Re()
    }
  }

  function ln(A, g, e = Date.now()) {
    return {
      sessionKey: A,
      assetIds: wA(g),
      sources: {
        originalUrl: "",
        previewUrl: "",
        currentBlobUrl: ""
      },
      derived: {
        processedBlobUrl: "",
        processedBlobType: "",
        processedMeta: null,
        processedFrom: "",
        processedSlots: ze()
      },
      state: {
        preview: "idle",
        fullscreen: "idle",
        unknown: "idle",
        lastError: ""
      },
      surfaces: In(),
      timestamps: {
        createdAt: Number(e) || Date.now(),
        updatedAt: Number(e) || Date.now(),
        lastProcessedAt: 0
      }
    }
  }

  function uA(A, g = Date.now()) {
    return A.timestamps.updatedAt = Number(g) || Date.now(), A
  }

  function qe(A = "") {
    let g = typeof A == "string" ? A.trim().toLowerCase() : "";
    return g === "preview" || g === "fullscreen" ? g : "unknown"
  }

  function ve(A = "") {
    return (typeof A == "string" ? A.trim().toLowerCase() : "") === "full" ? "full" : "preview"
  }

  function pn(A) {
    return (typeof A?.dataset?.gwrWatermarkObjectUrl == "string" ? A.dataset.gwrWatermarkObjectUrl.trim() : "") || ""
  }

  function Gn(A) {
    return !A || typeof A != "object" ? !1 : "isConnected" in A ? !!A.isConnected : !0
  }

  function mn(A, g = "") {
    let e = null,
      t = null,
      o = null;
    for (let n of A) {
      if (!Gn(n)) continue;
      let r = pn(n);
      if (r && g && r === g) return n;
      if (r) {
        t || (t = n);
        continue
      }
      o || (o = n)
    }
    return e || (e = t), e || o || null
  }
