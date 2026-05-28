          alpha48: e,
          alpha96: t,
          getAlphaMap: o
        });
        if (G)
          for (let Y of Jg)
            for (let w of Jg) {
              let C = {
                x: I.position.x + Y,
                y: I.position.y + w,
                width: B,
                height: B
              };
              if (C.x < 0 || C.y < 0 || C.x + C.width > A.width || C.y + C.height > A.height) continue;
              let f = {
                  logoSize: B,
                  marginRight: A.width - C.x - B,
                  marginBottom: A.height - C.y - B
                },
                m = eA({
                  originalImageData: A,
                  alphaMap: G,
                  position: C,
                  source: "standard+preview-anchor",
                  config: f,
                  baselineNearBlackRatio: H(A, C),
                  adaptiveConfidence: r,
                  provenance: {
                    previewAnchor: !0,
                    previewAnchorLocalRefine: l !== 0 || Y !== 0 || w !== 0
                  },
                  includeImageData: !1
                });
              m?.accepted && (p = rA(p, m, .002))
            }
      }
    return p
  }

  function Dt({
    originalImageData: A,
    candidateSeeds: g
  }) {
    let e = g.map(a => eA({
        originalImageData: A,
        alphaMap: a.alphaMap,
        position: a.position,
        source: a.source,
        config: a.config,
        baselineNearBlackRatio: H(A, a.position),
        provenance: a.provenance,
        includeImageData: !1
      })).filter(Boolean),
      t = e.find(a => a.source === "standard") ?? e[0] ?? null,
      o = t?.originalSpatialScore ?? null,
      n = t?.originalGradientScore ?? null,
      r = kA({
        spatialScore: o,
        gradientScore: n
      });
    return {
      standardTrials: e,
      standardTrial: t,
      standardSpatialScore: o,
      standardGradientScore: n,
      hasReliableStandardMatch: r
    }
  }

  function da({
    originalImageData: A,
    config: g,
    position: e,
    alpha48: t,
    alpha96: o,
    alpha96Variants: n,
    getAlphaMap: r,
    resolveAlphaMap: a
  }) {
    let s = Pt({
        originalImageData: A,
        config: g,
        position: e,
        alpha48: t,
        alpha96: o,
        alpha96Variants: n,
        getAlphaMap: r,
        resolveAlphaMap: a,
        includeCatalogVariants: !1
      }),
      i = Dt({
        originalImageData: A,
        candidateSeeds: s
      });
    return !i.hasReliableStandardMatch && (!i.standardTrial || LA(i.standardTrial)) && (s = Pt({
      originalImageData: A,
      config: g,
      position: e,
      alpha48: t,
      alpha96: o,
      alpha96Variants: n,
      getAlphaMap: r,
      resolveAlphaMap: a,
      includeCatalogVariants: !0
    }), i = Dt({
      originalImageData: A,
      candidateSeeds: s
    })), {
      standardCandidateSeeds: s,
      ...i
    }
  }

  function ya(A, {
    reliableMatch: g = !1
  } = {}) {
    return A?.accepted ? g ? {
      candidate: A,
      decisionTier: "direct-match"
    } : {
      candidate: {
        ...A,
        source: `${A.source}+validated`
      },
      decisionTier: "validated-match"
    } : null
  }

  function dA(A, g, e, {
    reliableMatch: t = !1,
    minCostDelta: o = .002
  } = {}) {
    let n = ya(e, {
      reliableMatch: t
    });
    if (!n) return {
      baseCandidate: A,
      baseDecisionTier: g
    };
    if (Xg(A, n.candidate)) return {
      baseCandidate: A,
      baseDecisionTier: g
    };
    let r = A,
      a = rA(A, n.candidate, o);
    return {
      baseCandidate: a,
      baseDecisionTier: a !== r ? n.decisionTier : g
    }
  }

  function Ea({
    originalImageData: A,
    config: g,
    alpha96: e,
    resolveAlphaMap: t,
    allowAdaptiveSearch: o
  }) {
    if (!o || !e) return {
      adaptive: null,
      adaptiveConfidence: null,
      adaptiveTrial: null
    };
    let n = gt({
        imageData: A,
        alpha96: e,
        defaultConfig: g
      }),
      r = n?.confidence ?? null;
    if (!n?.region || !(UA(n) || n.confidence >= pr)) return {
      adaptive: n,
      adaptiveConfidence: r,
      adaptiveTrial: null
    };
    let a = n.region.size,
      s = {
        x: n.region.x,
        y: n.region.y,
        width: a,
        height: a
      },
      i = t(a);
    if (!i) throw new Error(`Missing alpha map for adaptive size ${a}`);
    let D = {
      logoSize: a,
      marginRight: A.width - s.x - a,
      marginBottom: A.height - s.y - a
    };
    return {
      adaptive: n,
      adaptiveConfidence: r,
      adaptiveTrial: eA({
        originalImageData: A,
        alphaMap: i,
        position: s,
        source: "adaptive",
        config: D,
        baselineNearBlackRatio: H(A, s),
        adaptiveConfidence: n.confidence,
        provenance: {
          adaptive: !0
        },
        includeImageData: !1
      })
    }
  }

  function ha({
    originalImageData: A,
    baseCandidate: g,
    baseDecisionTier: e,
    adaptiveConfidence: t,
    alphaGainCandidates: o
  }) {
    let n = yA(g, A),
      r = g.alphaMap,
      a = g.position,
      s = g.config,
      i = g.source,
      D = e || Vg(g),
      u = null,
      c = g.alphaGain ?? 1,
      P = pa({
        originalImageData: A,
        alphaMap: r,
        position: a,
        baselineSpatialScore: n.originalSpatialScore,
        baselineGradientScore: n.originalGradientScore,
        shiftCandidates: n.provenance?.previewAnchor === !0 ? Xr : It,
        scaleCandidates: n.provenance?.previewAnchor === !0 ? $r : lt
      });
    if (P) {
      let l = eA({
          originalImageData: A,
          alphaMap: P.alphaMap,
          position: a,
          source: `${i}+warp`,
          config: s,
          baselineNearBlackRatio: H(A, a),
          adaptiveConfidence: t,
          provenance: n.provenance,
          includeImageData: !1
        }),
        B = rA(n, l);
      B !== n && (r = l.alphaMap, i = B.source, n = yA(B, A), u = P.shift, D = Vg(B, {
        directMatch: D === "direct-match"
      }))
    }
    let p = n.provenance?.previewAnchor === !0 ? na(n) : LA(n),
      I = n;
    if (p)
      for (let l of o) {
        let B = eA({
          originalImageData: A,
          alphaMap: r,
          position: a,
          source: `${i}+gain`,
          config: s,
          baselineNearBlackRatio: H(A, a),
          adaptiveConfidence: t,
          alphaGain: l,
          provenance: n.provenance,
          includeImageData: !1
        });
        I = rA(I, B)
      }
    return I !== n && (n = yA(I, A), i = I.source, c = I.alphaGain, D = Vg(I, {
      directMatch: D === "direct-match"
    })), {
      selectedTrial: yA(n, A),
      source: i,
      alphaMap: r,
      position: a,
      config: s,
      templateWarp: u,
      alphaGain: c,
      decisionTier: D
    }
  }

  function mt({
    originalImageData: A,
    config: g,
    position: e,
    alpha48: t,
    alpha96: o,
    getAlphaMap: n,
    allowAdaptiveSearch: r,
    alphaGainCandidates: a,
    alpha96Variants: s = null
  }) {
    let i = oa({
        alpha48: t,
        alpha96: o,
        getAlphaMap: n
      }),
      D = g.logoSize === 96 ? o : t,
      {
        standardCandidateSeeds: u,
        standardTrials: c,
        standardTrial: P,
        standardSpatialScore: p,
        standardGradientScore: I,
        hasReliableStandardMatch: l
      } = da({
        originalImageData: A,
        config: g,
        position: e,
        alpha48: t,
        alpha96: o,
        alpha96Variants: s,
        getAlphaMap: n,
        resolveAlphaMap: i
      }),
      B = null,
      G = "insufficient";
    if (l && P?.accepted ? (B = P, G = "direct-match") : P?.accepted && (B = {
        ...P,
        source: `${P.source}+validated`
      }, G = "validated-match"), !B && P && l) {
