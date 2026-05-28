      let U = Ca({
        originalImageData: A,
        seedCandidate: {
          ...P,
          source: "standard+validated"
        },
        adaptiveConfidence: null,
        alphaGainCandidates: a
      });
      U && (B = U, G = "validated-match")
    }
    let Y = null,
      w = null,
      C = null;
    for (let b of c) !b || b === P || ({
      baseCandidate: B,
      baseDecisionTier: G
    } = dA(B, G, b, {
      reliableMatch: kA({
        spatialScore: b.originalSpatialScore,
        gradientScore: b.originalGradientScore
      })
    }));
    let f = fa({
      originalImageData: A,
      config: g,
      alpha48: t,
      alpha96: o,
      getAlphaMap: n,
      resolveAlphaMap: i,
      adaptiveConfidence: w
    });
    if (f && ({
        baseCandidate: B,
        baseDecisionTier: G
      } = dA(B, G, f)), G !== "direct-match" && !B?.provenance?.previewAnchor && LA(B)) {
      let b = ma({
        originalImageData: A,
        candidateSeeds: u,
        alpha48: t,
        alpha96: o,
        getAlphaMap: n,
        resolveAlphaMap: i
      });
      b && ({
        baseCandidate: B,
        baseDecisionTier: G
      } = dA(B, G, b))
    }
    if (G !== "direct-match" && B?.provenance?.sizeJitter === !0 && !B?.provenance?.previewAnchor && lA(B) && LA(B)) {
      let b = Ya({
        originalImageData: A,
        seedCandidate: B,
        adaptiveConfidence: w
      });
      b && ({
        baseCandidate: B,
        baseDecisionTier: G
      } = dA(B, G, b))
    }
    if ((!r || !o ? !1 : B ? LA(B) ? (B = yA(B, A), At({
        processedImageData: B.imageData,
        alphaMap: B.alphaMap,
        position: B.position,
        originalImageData: A,
        originalSpatialMismatchThreshold: 0
      })) : !1 : !0) && ({
        adaptive: Y,
        adaptiveConfidence: w,
        adaptiveTrial: C
      } = Ea({
        originalImageData: A,
        config: g,
        alpha96: o,
        resolveAlphaMap: i,
        allowAdaptiveSearch: r
      })), C && ({
        baseCandidate: B,
        baseDecisionTier: G
      } = dA(B, G, C, {
        reliableMatch: UA(Y)
      })), !B?.provenance?.previewAnchor && !UA(Y) && ea(B, A)) {
      let b = Ga({
        originalImageData: A,
        candidateSeeds: u,
        adaptiveConfidence: w
      });
      b && ({
        baseCandidate: B,
        baseDecisionTier: G
      } = dA(B, G, b))
    }
    if (B || (l && P ? (B = P, G = "direct-match") : UA(Y) && C && (B = C, G = "direct-match")), !B) {
      let b = ra([P, C]);
      if (!b) return {
        selectedTrial: null,
        source: "skipped",
        alphaMap: D,
        position: e,
        config: g,
        adaptiveConfidence: w,
        standardSpatialScore: p,
        standardGradientScore: I,
        templateWarp: null,
        alphaGain: 1,
        decisionTier: "insufficient"
      };
      B = {
        ...b,
        source: `${b.source}+validated`
      }, G = "validated-match"
    }
    Ia(B, P) && (B = P, G = l ? "direct-match" : "validated-match");
    let {
      selectedTrial: d,
      source: y,
      alphaMap: O,
      position: h,
      config: M,
      templateWarp: T,
      alphaGain: S,
      decisionTier: Q
    } = ha({
      originalImageData: A,
      baseCandidate: B,
      baseDecisionTier: G,
      adaptiveConfidence: w,
      alphaGainCandidates: a
    });
    return {
      selectedTrial: yA(d, A),
      source: y,
      alphaMap: O,
      position: h,
      config: M,
      adaptiveConfidence: w,
      standardSpatialScore: p,
      standardGradientScore: I,
      templateWarp: T,
      alphaGain: S,
      decisionTier: Q
    }
  }

  function Yt(A) {
    if (!A || typeof A != "object") return null;
    let {
      logoSize: g,
      marginRight: e,
      marginBottom: t
    } = A;
    return [g, e, t].every(Number.isFinite) ? {
      logoSize: g,
      marginRight: e,
      marginBottom: t
    } : null
  }

  function Ct(A) {
    if (!A || typeof A != "object") return null;
    let {
      x: g,
      y: e,
      width: t,
      height: o
    } = A;
    return [g, e, t, o].every(Number.isFinite) ? {
      x: g,
      y: e,
      width: t,
      height: o
    } : null
  }

  function wt({
    selectedTrial: A,
    selectionSource: g = null,
    initialConfig: e = null,
    initialPosition: t = null
  } = {}) {
    return A ? {
      candidateSource: typeof g == "string" && g ? g : typeof A.source == "string" ? A.source : null,
      initialConfig: Yt(e),
      initialPosition: Ct(t),
      finalConfig: Yt(A.config),
      finalPosition: Ct(A.position),
      texturePenalty: Number.isFinite(A.texturePenalty) ? A.texturePenalty : null,
      tooDark: A.tooDark === !0,
      tooFlat: A.tooFlat === !0,
      hardReject: A.hardReject === !0,
      usedCatalogVariant: A.provenance?.catalogVariant === !0,
      usedSizeJitter: A.provenance?.sizeJitter === !0,
      usedLocalShift: A.provenance?.localShift === !0,
      usedAdaptive: A.provenance?.adaptive === !0,
      usedPreviewAnchor: A.provenance?.previewAnchor === !0
    } : null
  }

  function mg(A, g) {
    let e = Kg(A, g);
    return e ? {
      ...e
    } : A > 1024 && g > 1024 ? {
      logoSize: 96,
      marginRight: 64,
      marginBottom: 64
    } : {
      logoSize: 48,
      marginRight: 32,
      marginBottom: 32
    }
  }

  function EA(A, g, e) {
    let {
      logoSize: t,
      marginRight: o,
      marginBottom: n
    } = e;
    return {
      x: A - o - t,
      y: g - n - t,
      width: t,
      height: t
    }
  }

  function $g(A) {
    return A === 96 ? {
      logoSize: 96,
      marginRight: 64,
      marginBottom: 64
    } : {
      logoSize: 48,
      marginRight: 32,
      marginBottom: 32
    }
  }

  function Oa(A, g, e) {
    return A ? A.logoSize === 48 ? g : A.logoSize === 96 ? e : e ? nA(e, 96, A.logoSize) : null : null
  }

  function ba(A, g) {
    return g.x >= 0 && g.y >= 0 && g.x + g.width <= A.width && g.y + g.height <= A.height
  }

  function ft({
    imageData: A,
    defaultConfig: g,
    alpha48: e,
    alpha96: t,
    minSwitchScore: o = .25,
    minScoreDelta: n = .08
  }) {
    if (!A || !g || !e || !t) return g;
    let r = $g(48),
      a = g.logoSize === 96 ? $g(96) : r,
      s = g.logoSize === 96 ? r : $g(96),
      i = [a, s];
    for (let c of xg(A.width, A.height, {
        limit: 1
      })) i.some(P => P.logoSize === c.logoSize && P.marginRight === c.marginRight && P.marginBottom === c.marginBottom) || i.push(c);
    let D = null,
      u = Number.NEGATIVE_INFINITY;
    for (let c of i) {
      let P = EA(A.width, A.height, c);
      if (!ba(A, P)) continue;
      let p = Oa(c, e, t);
      if (!p) continue;
      let I = x({
        imageData: A,
        alphaMap: p,
        region: {
          x: P.x,
          y: P.y,
          size: P.width
        }
      });
      if (!D) {
        D = c, u = I;
        continue
      }
      I >= o && I > u + n && (D = c, u = I)
    }
    return D ?? g
  }
  var Ma = .5,
    Qa = .18,
    Ta = .18,
    ge = .05,
    Sa = .42,
    Et = 1.2,
    ht = [-.25, 0, .25],
    Ot = [.99, 1, 1.01],
    bt = [1.05, 1.12, 1.2, 1.28, 1.36, 1.45, 1.52, 1.6, 1.7, 1.85, 2, 2.2, 2.4, 2.6],
    Mt = 40,
    ja = .08,
    Ha = .1,
    Ra = .03,
    qa = .04,
    _a = 3,
    za = .16,
    va = .005,
    Ka = .01,
    xa = .02,
    Na = 1.5,
    Ae = 4,
    ka = .18,
    dt = Object.freeze([{
      minAlpha: .02,
      maxAlpha: .45,
      radius: 2,
      strength: .7,
      outsideAlphaMax: .05
    }, {
      minAlpha: .05,
      maxAlpha: .55,
      radius: 3,
      strength: .7,
