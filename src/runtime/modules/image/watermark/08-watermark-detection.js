        for (let m = -n; m <= n; m++)
          for (let d = -n; d <= n; d++) {
            if (d === 0 && m === 0) continue;
            let y = p + m,
              O = I + d,
              h = e.x + O,
              M = e.y + y;
            if (h < 0 || M < 0 || h >= i || M >= D) continue;
            let T = 0;
            if (y >= 0 && O >= 0 && y < c && O < c && (T = g[y * c + O]), T > a) continue;
            let Q = 1 / (Math.sqrt(d * d + m * m) || 1),
              b = (M * i + h) * 4;
            B += u[b] * Q, G += u[b + 1] * Q, Y += u[b + 2] * Q, w += Q
          }
        if (w <= 0) continue;
        let C = Math.max(0, Math.min(1, r * l / P)),
          f = ((e.y + p) * i + (e.x + I)) * 4;
        s.data[f] = Math.round(u[f] * (1 - C) + B / w * C), s.data[f + 1] = Math.round(u[f + 1] * (1 - C) + G / w * C), s.data[f + 2] = Math.round(u[f + 2] * (1 - C) + Y / w * C)
      }
    return s
  }

  function os({
    sourceImageData: A,
    alphaMap: g,
    position: e,
    source: t,
    baselineSpatialScore: o,
    baselineGradientScore: n,
    minGradientImprovement: r = Ra,
    maxSpatialDrift: a = qa,
    allowAggressivePresets: s = !1
  }) {
    let D = Fg({
      imageData: A,
      position: e,
      alphaMap: g
    }).positiveDeltaLum;
    if (!gs({
        source: t,
        position: e,
        baselineSpatialScore: o,
        baselineGradientScore: n,
        baselinePositiveHalo: D
      })) return null;
    let u = H(A, e),
      c = Math.min(1, u + ge),
      P = n <= za ? va : D >= Ae ? Ka : r,
      p = s && n >= Ua && Math.abs(o) <= .05 ? [...dt, ...La] : dt,
      I = null;
    for (let l of p) {
      let B = ts({
        sourceImageData: A,
        alphaMap: g,
        position: e,
        ...l
      });
      if (H(B, e) > c) continue;
      let Y = x({
          imageData: B,
          alphaMap: g,
          region: {
            x: e.x,
            y: e.y,
            size: e.width
          }
        }),
        w = W({
          imageData: B,
          alphaMap: g,
          region: {
            x: e.x,
            y: e.y,
            size: e.width
          }
        }),
        C = Fg({
          imageData: B,
          position: e,
          alphaMap: g
        }),
        f = l.minGradientImprovement ?? P,
        m = l.maxSpatialDrift ?? a,
        d = l.maxAcceptedSpatial ?? .22,
        y = w <= n - f,
        O = Math.abs(Y) <= Math.abs(o) + m,
        h = Math.abs(Y) <= d,
        M = C.positiveDeltaLum,
        T = D < Ae || M <= D - Na;
      if (!y || !O || !h || !T) continue;
      let S = Math.abs(Y) * .6 + Math.max(0, w) + M * xa;
      (!I || S < I.cost) && (I = {
        imageData: B,
        spatialScore: Y,
        gradientScore: w,
        halo: C,
        cost: S
      })
    }
    return I
  }

  function Qt(A, g = {}) {
    let e = v(),
      t = g.debugTimings === !0,
      o = t ? {} : null,
      n = g.adaptiveMode || "auto",
      r = n !== "never" && n !== "off",
      a = ZA(A),
      {
        alpha48: s,
        alpha96: i
      } = g,
      D = bt;
    if (!s || !i) throw new Error("processWatermarkImageData requires alpha48 and alpha96");
    let u = mg(a.width, a.height),
      c = ft({
        imageData: a,
        defaultConfig: u,
        alpha48: s,
        alpha96: i
      }),
      P = c,
      p = EA(a.width, a.height, P),
      I = P.logoSize === 96 ? i : s,
      l = "standard",
      B = null,
      G = 1,
      Y = null,
      w = null,
      C = null,
      f = 0,
      m = 0,
      d = null,
      y = null,
      O = v(),
      h = mt({
        originalImageData: a,
        config: P,
        position: p,
        alpha48: s,
        alpha96: i,
        alpha96Variants: g.alpha96Variants ?? null,
        getAlphaMap: g.getAlphaMap,
        allowAdaptiveSearch: r,
        alphaGainCandidates: D
      });
    if (t && (o.initialSelectionMs = v() - O), !h.selectedTrial) return t && (o.totalMs = v() - e), {
      imageData: a,
      meta: yt({
        adaptiveConfidence: h.adaptiveConfidence,
        originalSpatialScore: h.standardSpatialScore,
        originalGradientScore: h.standardGradientScore,
        processedSpatialScore: h.standardSpatialScore,
        processedGradientScore: h.standardGradientScore,
        suppressionGain: 0,
        alphaGain: 1,
        source: "skipped",
        decisionTier: h.decisionTier ?? "insufficient",
        applied: !1,
        skipReason: "no-watermark-detected",
        selectionDebug: null
      }),
      debugTimings: o
    };
    p = h.position, I = h.alphaMap, P = h.config, l = h.source, B = h.adaptiveConfidence, w = h.templateWarp, G = h.alphaGain, C = h.decisionTier;
    let M = h.selectedTrial,
      T = es(M, p),
      S = M?.provenance?.previewAnchor === !0,
      Q = M.imageData,
      b = M.originalSpatialScore,
      U = M.originalGradientScore,
      E = v(),
      j = x({
        imageData: Q,
        alphaMap: I,
        region: {
          x: p.x,
          y: p.y,
          size: p.width
        }
      }),
      q = W({
        imageData: Q,
        alphaMap: I,
        region: {
          x: p.x,
          y: p.y,
          size: p.width
        }
      }),
      z = H(Q, p),
      iA = {
        index: 1,
        beforeSpatialScore: b,
        beforeGradientScore: U,
        afterSpatialScore: j,
        afterGradientScore: q,
        improvement: Math.abs(b) - Math.abs(j),
        gradientDelta: q - U,
        nearBlackRatio: z
      };
    t && (o.firstPassMetricsMs = v() - E);
    let YA = Math.max(1, g.maxPasses ?? 4),
      Z = Math.max(0, YA - 1),
      J = Xa({
        originalSpatialScore: b,
        originalGradientScore: U,
        firstPassSpatialScore: j,
        firstPassGradientScore: q
      }),
      Xo = v(),
      jA = Z > 0 && !J && !S ? ot({
        imageData: Q,
        alphaMap: I,
        position: p,
        maxPasses: Z,
        startingPassIndex: 1,
        alphaGain: G
      }) : null;
    t && (o.extraPassMs = v() - Xo), Q = jA?.imageData ?? Q, f = jA?.passCount ?? 1, m = jA?.attemptedPassCount ?? 1, d = jA?.stopReason ?? (J ? "residual-low" : S ? "preview-anchor-single-pass" : "max-passes"), y = [iA, ...jA?.passes ?? []], f > 1 && (l = `${l}+multipass`);
    let $o = v(),
      An = x({
        imageData: Q,
        alphaMap: I,
        region: {
          x: p.x,
          y: p.y,
          size: p.width
        }
      }),
      gn = W({
        imageData: Q,
        alphaMap: I,
        region: {
          x: p.x,
          y: p.y,
          size: p.width
        }
      });
    t && (o.finalMetricsMs = v() - $o);
    let L = An,
      BA = gn,
      HA = b - L,
      en = v();
    if (Va({
        originalScore: b,
        processedScore: L,
        suppressionGain: HA
      })) {
      let RA = H(Q, p),
        F = As({
          sourceImageData: Q,
          alphaMap: I,
          position: p,
          originalSpatialScore: b,
          processedSpatialScore: L,
          originalNearBlackRatio: RA
        });
      F && (Q = F.imageData, G = F.alphaGain, L = F.processedSpatialScore, BA = W({
        imageData: Q,
        alphaMap: I,
        region: {
          x: p.x,
          y: p.y,
          size: p.width
        }
      }), HA = F.suppressionGain, l = l === "adaptive" ? "adaptive+gain" : `${l}+gain`)
    }
    t && (o.recalibrationMs = v() - en);
    let de = 0,
      tn = () => {
        let RA = v(),
          F = os({
            sourceImageData: Q,
            alphaMap: I,
            position: p,
            source: l,
            baselineSpatialScore: L,
            baselineGradientScore: BA,
            allowAggressivePresets: T
          });
        return de += v() - RA, F ? (Q = F.imageData, L = F.spatialScore, BA = F.gradientScore, HA = b - L, l = `${l}+edge-cleanup`, !0) : !1
      },
      on = v();
    if (!T && L <= .3 && BA >= Sa) {
      let RA = H(Q, p),
        cA = $a({
          sourceImageData: Q,
          alphaMap: I,
          position: p,
          alphaGain: G,
          originalNearBlackRatio: RA,
          baselineSpatialScore: L,
          baselineGradientScore: BA,
          baselineShift: w ?? {
            dx: 0,
            dy: 0,
            scale: 1
          },
          minGain: Et,
          shiftCandidates: ht,
          scaleCandidates: Ot,
          minGradientImprovement: .04,
          maxSpatialDrift: .08
        });
      cA && (Q = cA.imageData, I = cA.alphaMap, G = cA.alphaGain, L = cA.spatialScore, BA = cA.gradientScore, HA = b - L, l = `${l}+subpixel`, Y = cA.shift)
    }
    t && (o.subpixelRefinementMs = v() - on);
    let ye = 0;
    for (; ye < _a && tn();) ye++;
    return t && (o.previewEdgeCleanupMs = de, o.totalMs = v() - e), {
      imageData: Q,
      meta: yt({
        position: p,
        config: P,
        adaptiveConfidence: B,
        originalSpatialScore: b,
        originalGradientScore: U,
        processedSpatialScore: L,
