      outsideAlphaMax: .08
    }, {
      minAlpha: .1,
      maxAlpha: .7,
      radius: 3,
      strength: .8,
      outsideAlphaMax: .12
    }, {
      minAlpha: .01,
      maxAlpha: .35,
      radius: 4,
      strength: 1.4,
      outsideAlphaMax: .05
    }]),
    Ua = .45,
    La = Object.freeze([{
      minAlpha: .01,
      maxAlpha: .55,
      radius: 2,
      strength: 1.3,
      outsideAlphaMax: .05,
      minGradientImprovement: .12,
      maxSpatialDrift: .18,
      maxAcceptedSpatial: .18
    }]),
    Fa = .08,
    Wa = .2;

  function v() {
    return typeof globalThis.performance?.now == "function" ? globalThis.performance.now() : Date.now()
  }

  function ZA(A) {
    return typeof ImageData < "u" && A instanceof ImageData ? new ImageData(new Uint8ClampedArray(A.data), A.width, A.height) : {
      width: A.width,
      height: A.height,
      data: new Uint8ClampedArray(A.data)
    }
  }

  function Za(A) {
    if (!A) return null;
    let {
      x: g,
      y: e,
      width: t,
      height: o
    } = A;
    return [g, e, t, o].every(n => Number.isFinite(n)) ? {
      x: g,
      y: e,
      width: t,
      height: o
    } : null
  }

  function Ja(A) {
    if (!A) return null;
    let {
      logoSize: g,
      marginRight: e,
      marginBottom: t
    } = A;
    return [g, e, t].every(o => Number.isFinite(o)) ? {
      logoSize: g,
      marginRight: e,
      marginBottom: t
    } : null
  }

  function yt({
    position: A = null,
    config: g = null,
    adaptiveConfidence: e = null,
    originalSpatialScore: t = null,
    originalGradientScore: o = null,
    processedSpatialScore: n = null,
    processedGradientScore: r = null,
    suppressionGain: a = null,
    templateWarp: s = null,
    alphaGain: i = 1,
    passCount: D = 0,
    attemptedPassCount: u = 0,
    passStopReason: c = null,
    passes: P = null,
    source: p = "standard",
    decisionTier: I = null,
    applied: l = !0,
    skipReason: B = null,
    subpixelShift: G = null,
    selectionDebug: Y = null
  } = {}) {
    let w = Za(A);
    return {
      applied: l,
      skipReason: l ? null : B,
      size: w ? w.width : null,
      position: w,
      config: Ja(g),
      detection: {
        adaptiveConfidence: e,
        originalSpatialScore: t,
        originalGradientScore: o,
        processedSpatialScore: n,
        processedGradientScore: r,
        suppressionGain: a
      },
      templateWarp: s ?? null,
      alphaGain: i,
      passCount: D,
      attemptedPassCount: u,
      passStopReason: c,
      passes: Array.isArray(P) ? P : null,
      source: p,
      decisionTier: I,
      subpixelShift: G ?? null,
      selectionDebug: Y
    }
  }

  function Va({
    originalScore: A,
    processedScore: g,
    suppressionGain: e
  }) {
    return A >= .6 && g >= Ma && e <= Qa
  }

  function Xa({
    originalSpatialScore: A,
    originalGradientScore: g,
    firstPassSpatialScore: e,
    firstPassGradientScore: t
  }) {
    return Math.abs(e) <= .25 ? !0 : A >= 0 && e < 0 && t <= Fa && g - t >= Wa
  }

  function $a({
    sourceImageData: A,
    alphaMap: g,
    position: e,
    alphaGain: t,
    originalNearBlackRatio: o,
    baselineSpatialScore: n,
    baselineGradientScore: r,
    baselineShift: a,
    minGain: s = Et,
    shiftCandidates: i = ht,
    scaleCandidates: D = Ot,
    minGradientImprovement: u = .04,
    maxSpatialDrift: c = .08
  }) {
    let P = e.width;
    if (!P || P <= 8 || t < s) return null;
    let p = Math.min(1, o + ge),
      I = [t],
      l = Math.max(1, Number((t - .01).toFixed(2))),
      B = Number((t + .01).toFixed(2));
    l !== t && I.push(l), B !== t && I.push(B);
    let G = a?.dx ?? 0,
      Y = a?.dy ?? 0,
      w = a?.scale ?? 1,
      C = null;
    for (let d of D) {
      let y = Number((w * d).toFixed(4));
      for (let O of i) {
        let h = Y + O;
        for (let M of i) {
          let T = G + M,
            S = Gg(g, P, {
              dx: T,
              dy: h,
              scale: y
            });
          for (let Q of I) {
            let b = ZA(A);
            gA(b, S, e, {
              alphaGain: Q
            });
            let U = H(b, e);
            if (U > p) continue;
            let E = x({
                imageData: b,
                alphaMap: S,
                region: {
                  x: e.x,
                  y: e.y,
                  size: P
                }
              }),
              j = W({
                imageData: b,
                alphaMap: S,
                region: {
                  x: e.x,
                  y: e.y,
                  size: P
                }
              }),
              q = Math.abs(E) * .6 + Math.max(0, j);
            (!C || q < C.cost) && (C = {
              imageData: b,
              alphaMap: S,
              alphaGain: Q,
              shift: {
                dx: T,
                dy: h,
                scale: y
              },
              spatialScore: E,
              gradientScore: j,
              nearBlackRatio: U,
              cost: q
            })
          }
        }
      }
    }
    if (!C) return null;
    let f = C.gradientScore <= r - u,
      m = Math.abs(C.spatialScore) <= Math.abs(n) + c;
    return !f || !m ? null : C
  }

  function As({
    sourceImageData: A,
    alphaMap: g,
    position: e,
    originalSpatialScore: t,
    processedSpatialScore: o,
    originalNearBlackRatio: n
  }) {
    let r = o,
      a = 1,
      s = null,
      i = Math.min(1, n + ge);
    for (let c of bt) {
      let P = ZA(A);
      if (gA(P, g, e, {
          alphaGain: c
        }), H(P, e) > i) continue;
      let I = x({
        imageData: P,
        alphaMap: g,
        region: {
          x: e.x,
          y: e.y,
          size: e.width
        }
      });
      I < r && (r = I, a = c, s = P)
    }
    let D = [];
    for (let c = -.05; c <= .05; c += .01) D.push(Number((a + c).toFixed(2)));
    for (let c of D) {
      if (c <= 1 || c >= 3) continue;
      let P = ZA(A);
      if (gA(P, g, e, {
          alphaGain: c
        }), H(P, e) > i) continue;
      let I = x({
        imageData: P,
        alphaMap: g,
        region: {
          x: e.x,
          y: e.y,
          size: e.width
        }
      });
      I < r && (r = I, a = c, s = P)
    }
    let u = o - r;
    return !s || u < Ta ? null : {
      imageData: s,
      alphaGain: a,
      processedSpatialScore: r,
      suppressionGain: t - r
    }
  }

  function gs({
    source: A,
    position: g,
    baselineSpatialScore: e,
    baselineGradientScore: t,
    baselinePositiveHalo: o
  }) {
    return typeof A == "string" && A.includes("preview-anchor") && g?.width >= 24 && g?.width <= Mt && (Math.abs(e) <= ja || o >= Ae && Math.abs(e) <= ka) && t >= Ha
  }

  function es(A, g) {
    return A?.provenance?.previewAnchor === !0 && g?.width >= 24 && g?.width <= Mt
  }

  function ts({
    sourceImageData: A,
    alphaMap: g,
    position: e,
    minAlpha: t,
    maxAlpha: o,
    radius: n,
    strength: r,
    outsideAlphaMax: a
  }) {
    let s = ZA(A),
      {
        width: i,
        height: D,
        data: u
      } = A,
      c = e.width,
      P = Math.max(o, 1e-6);
    for (let p = 0; p < c; p++)
      for (let I = 0; I < c; I++) {
        let l = g[p * c + I];
        if (l < t || l > o) continue;
        let B = 0,
          G = 0,
          Y = 0,
          w = 0;
