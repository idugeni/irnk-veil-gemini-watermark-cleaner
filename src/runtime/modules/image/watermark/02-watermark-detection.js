      confidence: 0,
      spatialScore: 0,
      gradientScore: 0,
      varianceScore: 0
    };
    for (let y of f) {
      let O = N(y.size - 10, p, I),
        h = N(y.size + 10, p, I);
      for (let M = O; M <= h; M += 2) {
        let T = kg(i, g, M);
        for (let S = y.x - 8; S <= y.x + 8; S += 2)
          if (!(S < 0 || S + M > o))
            for (let Q = y.y - 8; Q <= y.y + 8; Q += 2) {
              if (Q < 0 || Q + M > n) continue;
              let b = Ng(s, T.alpha, T.grad, {
                x: S,
                y: Q,
                size: M
              });
              b && b.confidence > d.confidence && (d = {
                x: S,
                y: Q,
                size: M,
                ...b
              })
            }
      }
    }
    return {
      found: d.confidence >= t,
      confidence: d.confidence,
      spatialScore: d.spatialScore,
      gradientScore: d.gradientScore,
      varianceScore: d.varianceScore,
      region: {
        x: d.x,
        y: d.y,
        size: d.size
      }
    }
  }
  var Ug = 5,
    et = 1,
    gr = .8,
    er = 1.5,
    tr = .5,
    or = .2,
    nr = .12,
    rr = .35,
    ar = .01,
    sr = 3;

  function NA(A) {
    return typeof ImageData < "u" && A instanceof ImageData ? new ImageData(new Uint8ClampedArray(A.data), A.width, A.height) : {
      width: A.width,
      height: A.height,
      data: new Uint8ClampedArray(A.data)
    }
  }

  function H(A, g) {
    let e = 0,
      t = 0;
    for (let o = 0; o < g.height; o++)
      for (let n = 0; n < g.width; n++) {
        let r = ((g.y + o) * A.width + (g.x + n)) * 4,
          a = A.data[r],
          s = A.data[r + 1],
          i = A.data[r + 2];
        a <= Ug && s <= Ug && i <= Ug && e++, t++
      }
    return t > 0 ? e / t : 0
  }

  function Lg(A, g) {
    let e = 0,
      t = 0,
      o = 0;
    for (let a = 0; a < g.height; a++)
      for (let s = 0; s < g.width; s++) {
        let i = ((g.y + a) * A.width + (g.x + s)) * 4,
          D = .2126 * A.data[i] + .7152 * A.data[i + 1] + .0722 * A.data[i + 2];
        e += D, t += D * D, o++
      }
    let n = o > 0 ? e / o : 0,
      r = o > 0 ? Math.max(0, t / o - n * n) : 0;
    return {
      meanLum: n,
      stdLum: Math.sqrt(r)
    }
  }

  function tt(A, g) {
    return Lg(A, g)
  }

  function Fg({
    imageData: A,
    position: g,
    alphaMap: e,
    minAlpha: t = nr,
    maxAlpha: o = rr,
    outsideAlphaMax: n = ar,
    outerMargin: r = sr
  }) {
    let a = 0,
      s = 0,
      i = 0,
      D = 0,
      u = 0,
      c = 0;
    for (let Y = -r; Y < g.height + r; Y++)
      for (let w = -r; w < g.width + r; w++) {
        let C = g.x + w,
          f = g.y + Y;
        if (C < 0 || f < 0 || C >= A.width || f >= A.height) continue;
        let m = (f * A.width + C) * 4,
          d = .2126 * A.data[m] + .7152 * A.data[m + 1] + .0722 * A.data[m + 2],
          y = Y >= 0 && w >= 0 && Y < g.height && w < g.width,
          O = y ? e[Y * g.width + w] : 0;
        if (y && O >= t && O <= o) {
          a += d, s += d * d, i++;
          continue
        }(!y || O <= n) && (D += d, u += d * d, c++)
      }
    let P = i > 0 ? a / i : 0,
      p = c > 0 ? D / c : 0,
      I = i > 0 ? Math.sqrt(Math.max(0, s / i - P * P)) : 0,
      l = c > 0 ? Math.sqrt(Math.max(0, u / c - p * p)) : 0,
      B = P - p,
      G = B / Math.max(1, l);
    return {
      bandCount: i,
      outerCount: c,
      bandMeanLum: P,
      outerMeanLum: p,
      bandStdLum: I,
      outerStdLum: l,
      deltaLum: B,
      positiveDeltaLum: Math.max(0, B),
      visibility: G
    }
  }

  function ir(A, g) {
    let e = A.y - A.height;
    return e < 0 ? null : {
      x: A.x,
      y: e,
      width: A.width,
      height: A.height
    }
  }

  function Wg({
    originalImageData: A,
    referenceImageData: g,
    candidateImageData: e,
    position: t
  }) {
    let o = e ? Lg(e, t) : null;
    return Zg({
      originalImageData: A,
      referenceImageData: g,
      candidateTextureStats: o,
      position: t
    })
  }

  function Zg({
    originalImageData: A,
    referenceImageData: g,
    candidateTextureStats: e,
    position: t
  }) {
    let o = g ?? A,
      n = o ? ir(t, o) : null,
      r = n ? Lg(o, n) : null,
      a = r && e ? Math.max(0, r.meanLum - e.meanLum - et) / Math.max(1, r.meanLum) : 0,
      s = r && e ? Math.max(0, r.stdLum * gr - e.stdLum) / Math.max(1, r.stdLum) : 0,
      i = r && e ? Math.max(0, r.meanLum - e.meanLum - et) / Math.max(1, r.stdLum) : 0,
      D = a > 0,
      u = s > 0,
      c = D && i >= er,
      P = D && u && a >= tr && s >= or;
    return {
      referenceTextureStats: r,
      candidateTextureStats: e,
      darknessPenalty: a,
      flatnessPenalty: s,
      darknessVisibility: i,
      texturePenalty: a * 2 + s * 2,
      tooDark: D,
      tooFlat: u,
      visibleDarkHole: c,
      hardReject: P || c
    }
  }

  function IA(A, g, e) {
    return {
      spatialScore: x({
        imageData: A,
        alphaMap: g,
        region: {
          x: e.x,
          y: e.y,
          size: e.width
        }
      }),
      gradientScore: W({
        imageData: A,
        alphaMap: g,
        region: {
          x: e.x,
          y: e.y,
          size: e.width
        }
      })
    }
  }
  var Br = 4,
    cr = .25,
    Pr = .05;

  function ot(A, g, e, t = {}) {
    let o = A && typeof A == "object" && "imageData" in A && g === void 0,
      n = o ? A.imageData : A,
      r = o ? A.alphaMap : g,
      a = o ? A.position : e,
      s = o ? A : t,
      i = Math.max(1, s.maxPasses ?? Br),
      D = s.residualThreshold ?? cr,
      u = Math.max(0, s.startingPassIndex ?? 0),
      c = Number.isFinite(s.alphaGain) && s.alphaGain > 0 ? s.alphaGain : 1,
      P = NA(n),
      p = P,
      I = H(P, a),
      l = Math.min(1, I + Pr),
      B = [],
      G = "max-passes",
      Y = u,
      w = u;
    for (let C = 0; C < i; C++) {
      w = u + C + 1;
      let f = IA(P, r, a),
        m = NA(P);
      gA(m, r, a, {
        alphaGain: c
      });
      let d = IA(m, r, a),
        y = H(m, a),
        O = Math.abs(f.spatialScore) - Math.abs(d.spatialScore),
        h = d.gradientScore - f.gradientScore,
        M = Wg({
          referenceImageData: p,
          candidateImageData: m,
          position: a
        });
      if (y > l) {
        G = "safety-near-black";
        break
      }
      if (M.hardReject) {
        G = "safety-texture-collapse";
        break
      }
      if (P = m, Y = u + C + 1, B.push({
          index: Y,
          beforeSpatialScore: f.spatialScore,
          beforeGradientScore: f.gradientScore,
          afterSpatialScore: d.spatialScore,
          afterGradientScore: d.gradientScore,
          improvement: O,
          gradientDelta: h,
          nearBlackRatio: y
        }), Math.abs(d.spatialScore) <= D) {
        G = "residual-low";
        break
      }
    }
    return {
      imageData: P,
      passCount: Y,
      attemptedPassCount: w,
      stopReason: G,
      passes: B
    }
  }

  function kA({
    spatialScore: A,
    gradientScore: g
  }) {
    return Se({
      spatialScore: A,
      gradientScore: g
    }).tier === "direct-match"
  }

  function UA(A) {
    return je(A).tier === "direct-match"
  }
  var ur = .05,
    Dr = .08,
    Ir = .22,
    lr = .04,
    pr = .25,
    Gr = .22,
    mr = .08,
    Yr = .18,
    Cr = .05,
    wr = .35,
    fr = .8,
    dr = .2,
    yr = .22,
    Er = .12,
    hr = .65,
    Or = .3,
    br = .02,
