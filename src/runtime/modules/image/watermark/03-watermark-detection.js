    Mr = .02,
    Qr = .03,
    Tr = .25,
    Sr = .4,
    jr = .3,
    Hr = .22,
    Rr = .18,
    qr = .25,
    _r = .1,
    zr = .1,
    vr = .9,
    Kr = .7,
    xr = .08,
    Nr = .1,
    kr = .7,
    Ur = .01,
    It = [-.5, -.25, 0, .25, .5],
    lt = [.99, 1, 1.01],
    nt = [-12, -8, -4, 0, 4, 8, 12],
    Lr = [-2, -1, 0, 1, 2],
    Fr = [-12, -10, -8, -6, -4, -2, 2, 4, 6, 8, 10, 12],
    rt = 24,
    Wr = 1.05,
    Zr = .55,
    at = 16,
    st = 8,
    Jr = 2,
    it = 2,
    Bt = 8,
    Vr = .2,
    Jg = [-1, 0, 1],
    Xr = [-1, -.5, 0, .5, 1],
    $r = [.985, 1, 1.015],
    Aa = .22,
    ga = .24,
    ct = Object.freeze({
      x: 0,
      y: 0
    });

  function WA(...A) {
    let g = {};
    for (let e of A) !e || typeof e != "object" || Object.assign(g, e);
    return Object.keys(g).length > 0 ? g : null
  }

  function Pt({
    originalImageData: A,
    config: g,
    position: e,
    alpha48: t,
    alpha96: o,
    alpha96Variants: n = null,
    getAlphaMap: r,
    resolveAlphaMap: a = null,
    includeCatalogVariants: s = !0
  }) {
    let i = s ? Ig(A.width, A.height, g) : [g],
      D = [];
    for (let u of i) {
      let c = u === g ? e : {
        x: A.width - u.marginRight - u.logoSize,
        y: A.height - u.marginBottom - u.logoSize,
        width: u.logoSize,
        height: u.logoSize
      };
      if (c.x < 0 || c.y < 0 || c.x + c.width > A.width || c.y + c.height > A.height) continue;
      let P = ta(u, {
        alpha48: t,
        alpha96: o,
        alpha96Variants: n,
        getAlphaMap: r,
        resolveAlphaMap: a
      });
      P && D.push({
        config: u,
        position: c,
        alphaMap: P,
        source: u === g ? "standard" : "standard+catalog",
        provenance: WA(u === g ? null : {
          catalogVariant: !0
        }, u.alphaVariant ? {
          alphaVariant: u.alphaVariant
        } : null)
      })
    }
    return D
  }

  function Vg(A, {
    directMatch: g = !1
  } = {}) {
    return A ? g ? "direct-match" : A.source?.includes("validated") || A.accepted ? "validated-match" : "safe-removal" : "insufficient"
  }

  function LA(A) {
    return A ? Math.abs(A.processedSpatialScore) > Gr || Math.max(0, A.processedGradientScore) > mr : !0
  }

  function ea(A, g) {
    return A ? Number(A.position?.width) >= 72 && Number(g?.height) > Number(g?.width) * 1.25 && (Math.abs(A.processedSpatialScore) > Yr || Math.max(0, A.processedGradientScore) > Cr) : !0
  }

  function FA(A, {
    alpha48: g,
    alpha96: e,
    getAlphaMap: t
  } = {}) {
    if (A === 48) return g;
    if (A === 96) return e;
    let o = typeof t == "function" ? t(A) : null;
    return o || (e ? nA(e, 96, A) : null)
  }

  function ta(A, {
    alpha48: g,
    alpha96: e,
    alpha96Variants: t = null,
    getAlphaMap: o,
    resolveAlphaMap: n = null
  } = {}) {
    return A ? A.alphaVariant && A.logoSize === 96 && t ? t[A.alphaVariant] ?? null : typeof n == "function" ? n(A.logoSize) : FA(A.logoSize, {
      alpha48: g,
      alpha96: e,
      getAlphaMap: o
    }) : null
  }

  function oa({
    alpha48: A,
    alpha96: g,
    getAlphaMap: e
  }) {
    let t = new Map;
    return o => {
      if (t.has(o)) return t.get(o);
      let n = FA(o, {
        alpha48: A,
        alpha96: g,
        getAlphaMap: e
      });
      return t.set(o, n), n
    }
  }

  function na(A) {
    return A ? Math.abs(A.processedSpatialScore) > Aa || Math.max(0, A.processedGradientScore) > ga : !0
  }

  function eA({
    originalImageData: A,
    alphaMap: g,
    position: e,
    source: t,
    config: o,
    baselineNearBlackRatio: n,
    adaptiveConfidence: r = null,
    alphaGain: a = 1,
    provenance: s = null,
    includeImageData: i = !0
  }) {
    if (!g || !e) return null;
    let D = IA(A, g, e),
      u = aa({
        originalImageData: A,
        alphaMap: g,
        position: e,
        alphaGain: a
      }),
      c = {
        x: ct.x,
        y: ct.y,
        width: e.width,
        height: e.height
      },
      P = IA(u, g, c),
      p = H(u, c),
      I = p - n,
      l = D.spatialScore - P.spatialScore,
      B = P.gradientScore - D.gradientScore,
      G = Zg({
        originalImageData: A,
        referenceImageData: A,
        candidateTextureStats: tt(u, c),
        position: e
      }),
      Y = G.texturePenalty,
      w = D.gradientScore - P.gradientScore,
      C = I <= ur || t === "standard" && D.spatialScore >= Hr && D.gradientScore >= Rr && l >= qr && Math.abs(P.spatialScore) <= _r && w >= zr;
    return {
      accepted: (G.hardReject !== !0 || lA({
        source: t
      }) && D.spatialScore >= vr && D.gradientScore >= Kr && Math.abs(P.spatialScore) <= xr && P.gradientScore <= Nr && l >= kr && I <= Ur) && C && l >= Dr && (Math.abs(P.spatialScore) <= Ir || B <= lr),
      source: t,
      config: o,
      position: e,
      alphaMap: g,
      adaptiveConfidence: r,
      alphaGain: a,
      provenance: WA(s),
      imageData: i ? pt(A, g, e, a) : null,
      originalSpatialScore: D.spatialScore,
      originalGradientScore: D.gradientScore,
      processedSpatialScore: P.spatialScore,
      processedGradientScore: P.gradientScore,
      improvement: l,
      nearBlackRatio: p,
      nearBlackIncrease: I,
      gradientIncrease: B,
      tooDark: G.tooDark,
      tooFlat: G.tooFlat,
      hardReject: G.hardReject,
      texturePenalty: Y,
      validationCost: Math.abs(P.spatialScore) + Math.max(0, P.gradientScore) * .6 + Math.max(0, I) * 3 + Y
    }
  }

  function ra(A) {
    let g = A.filter(e => e?.accepted);
    return g.length === 0 ? null : (g.sort((e, t) => e.validationCost !== t.validationCost ? e.validationCost - t.validationCost : t.improvement - e.improvement), g[0])
  }

  function aa({
    originalImageData: A,
    alphaMap: g,
    position: e,
    alphaGain: t
  }) {
    let o = {
      width: e.width,
      height: e.height,
      data: new Uint8ClampedArray(e.width * e.height * 4)
    };
    for (let n = 0; n < e.height; n++) {
      let r = ((e.y + n) * A.width + e.x) * 4,
        a = r + e.width * 4,
        s = n * e.width * 4;
      o.data.set(A.data.subarray(r, a), s)
    }
    return gA(o, g, {
      x: 0,
      y: 0,
      width: e.width,
      height: e.height
    }, {
      alphaGain: t
    }), o
  }

  function pt(A, g, e, t) {
    let o = NA(A);
    return gA(o, g, e, {
      alphaGain: t
    }), o
  }

  function yA(A, g) {
    return !A || A.imageData ? A : {
      ...A,
      imageData: pt(g, A.alphaMap, A.position, A.alphaGain ?? 1)
    }
  }

  function rA(A, g, e = .005) {
    return g?.accepted ? A ? Da(A, g) ? A : ut(A, g) ? g : ut(g, A) ? A : g.validationCost < A.validationCost - e || Math.abs(g.validationCost - A.validationCost) <= e && g.improvement > A.improvement + .01 ? g : A : g : A
  }

  function lA(A) {
    return typeof A?.source == "string" && A.source.startsWith("standard")
  }

  function sa(A) {
    return lA(A) && (A?.provenance?.localShift === !0 || A?.provenance?.sizeJitter === !0 || A?.provenance?.previewAnchor === !0 || String(A?.source || "").includes("+warp"))
  }

  function ia(A) {
    return lA(A) && A?.provenance?.localShift !== !0 && A?.provenance?.sizeJitter !== !0 && A?.provenance?.previewAnchor !== !0
  }

  function Ba(A) {
    let g = Number(A?.originalSpatialScore),
      e = Number(A?.originalGradientScore);
    return !Number.isFinite(g) || !Number.isFinite(e) ? !1 : e >= dr && g >= yr || e >= wr || g >= fr
  }

  function ca(A) {
    let g = Number(A?.originalSpatialScore),
      e = Number(A?.originalGradientScore);
    return !Number.isFinite(g) || !Number.isFinite(e) ? !1 : e < Er || g < hr
  }

  function Pa(A, g) {
    let e = Number(A?.processedGradientScore),
      t = Number(g?.processedGradientScore);
    return !Number.isFinite(e) || !Number.isFinite(t) ? !1 : Math.max(0, e) <= Mr && Math.max(0, t) >= Qr
  }

  function ua(A, g) {
    let e = Number(A?.processedSpatialScore),
      t = Number(A?.processedGradientScore),
      o = Number(A?.improvement),
      n = Number(g?.processedGradientScore);
    return !Number.isFinite(e) || !Number.isFinite(t) || !Number.isFinite(o) || !Number.isFinite(n) ? !1 : Math.abs(e) <= Sr && o >= jr && n >= t + Tr
  }

  function Xg(A, g) {
    if (!ia(A) || !sa(g)) return !1;
    let e = Number(A.validationCost) - Number(g.validationCost);
    return Number.isFinite(e) ? Ba(A) && ca(g) && e < Or || Pa(A, g) || ua(A, g) : !1
  }

  function Da(A, g) {
    return A?.provenance?.localShift === !0 || !lA(g) ? !1 : Xg(A, g)
  }

  function Ia(A, g) {
    return A?.provenance?.localShift !== !0 || !lA(A) || !lA(g) || !g?.accepted ? !1 : Xg(g, A)
  }

  function Gt(A) {
