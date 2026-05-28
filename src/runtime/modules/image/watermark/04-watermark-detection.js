    return A ? Math.max(0, Number(A.processedGradientScore)) <= br : !1
  }

  function la(A, g) {
    if (!g || g.logoSize !== 48) return !1;
    let e = Number(A?.width),
      t = Number(A?.height);
    return !Number.isFinite(e) || !Number.isFinite(t) || e < 384 || e > 1536 || t < 384 || t > 1536 || Math.max(e, t) < 512 ? !1 : vg(e, t) === null
  }

  function ut(A, g) {
    if (g?.provenance?.previewAnchor !== !0 || !A || A?.provenance?.previewAnchor === !0) return !1;
    let e = Number(A.originalSpatialScore),
      t = Number(A.originalGradientScore),
      o = Number(g.originalSpatialScore),
      n = Number(g.originalGradientScore);
    if (!Number.isFinite(e) || !Number.isFinite(t) || !Number.isFinite(o) || !Number.isFinite(n)) return !1;
    let r = kA({
      spatialScore: e,
      gradientScore: t
    });
    return kA({
      spatialScore: o,
      gradientScore: n
    }) && !r ? !0 : n >= t + .2 && o >= e + .05
  }

  function pa({
    originalImageData: A,
    alphaMap: g,
    position: e,
    baselineSpatialScore: t,
    baselineGradientScore: o,
    shiftCandidates: n = It,
    scaleCandidates: r = lt
  }) {
    let a = e.width;
    if (!a || a <= 8) return null;
    let s = {
      spatialScore: t,
      gradientScore: o,
      shift: {
        dx: 0,
        dy: 0,
        scale: 1
      },
      alphaMap: g
    };
    for (let u of r)
      for (let c of n)
        for (let P of n) {
          if (P === 0 && c === 0 && u === 1) continue;
          let p = Gg(g, a, {
              dx: P,
              dy: c,
              scale: u
            }),
            I = x({
              imageData: A,
              alphaMap: p,
              region: {
                x: e.x,
                y: e.y,
                size: a
              }
            }),
            l = W({
              imageData: A,
              alphaMap: p,
              region: {
                x: e.x,
                y: e.y,
                size: a
              }
            }),
            B = Math.max(0, I) * .7 + Math.max(0, l) * .3,
            G = Math.max(0, s.spatialScore) * .7 + Math.max(0, s.gradientScore) * .3;
          B > G + .01 && (s = {
            spatialScore: I,
            gradientScore: l,
            shift: {
              dx: P,
              dy: c,
              scale: u
            },
            alphaMap: p
          })
        }
    let i = s.spatialScore >= t + .01,
      D = s.gradientScore >= o + .01;
    return i || D ? s : null
  }

  function Ga({
    originalImageData: A,
    candidateSeeds: g,
    adaptiveConfidence: e = null
  }) {
    if (!Array.isArray(g) || g.length === 0) return null;
    let t = null;
    for (let o of g)
      if (!Gt(o))
        for (let n of nt)
          for (let r of nt) {
            if (r === 0 && n === 0) continue;
            let a = {
              x: o.position.x + r,
              y: o.position.y + n,
              width: o.position.width,
              height: o.position.height
            };
            if (a.x < 0 || a.y < 0 || a.x + a.width > A.width || a.y + a.height > A.height) continue;
            let s = eA({
              originalImageData: A,
              alphaMap: o.alphaMap,
              position: a,
              source: `${o.source}+local`,
              config: o.config,
              baselineNearBlackRatio: H(A, a),
              adaptiveConfidence: e,
              provenance: WA(o.provenance, {
                localShift: !0
              }),
              includeImageData: !1
            });
            s?.accepted && (t = rA(t, s, .002))
          }
    return t
  }

  function ma({
    originalImageData: A,
    candidateSeeds: g,
    alpha48: e,
    alpha96: t,
    getAlphaMap: o,
    resolveAlphaMap: n = null,
    adaptiveConfidence: r = null
  }) {
    if (!Array.isArray(g) || g.length === 0) return null;
    let a = null;
    for (let s of g)
      for (let i of Fr) {
        let D = s.position.width + i;
        if (D <= 24 || D === s.position.width) continue;
        let u = {
          x: A.width - s.config.marginRight - D,
          y: A.height - s.config.marginBottom - D,
          width: D,
          height: D
        };
        if (u.x < 0 || u.y < 0 || u.x + u.width > A.width || u.y + u.height > A.height) continue;
        let c = typeof n == "function" ? n(D) : FA(D, {
          alpha48: e,
          alpha96: t,
          getAlphaMap: o
        });
        if (!c) continue;
        let P = eA({
          originalImageData: A,
          alphaMap: c,
          position: u,
          source: `${s.source}+size`,
          config: {
            logoSize: D,
            marginRight: s.config.marginRight,
            marginBottom: s.config.marginBottom
          },
          baselineNearBlackRatio: H(A, u),
          adaptiveConfidence: r,
          provenance: WA(s.provenance, {
            sizeJitter: !0
          }),
          includeImageData: !1
        });
        P?.accepted && (a = rA(a, P, .002))
      }
    return a
  }

  function Ya({
    originalImageData: A,
    seedCandidate: g,
    adaptiveConfidence: e = null,
    shiftCandidates: t = Lr
  }) {
    if (!g?.alphaMap || !g?.position || Gt(g)) return null;
    let o = null;
    for (let n of t)
      for (let r of t) {
        if (r === 0 && n === 0) continue;
        let a = {
          x: g.position.x + r,
          y: g.position.y + n,
          width: g.position.width,
          height: g.position.height
        };
        if (a.x < 0 || a.y < 0 || a.x + a.width > A.width || a.y + a.height > A.height) continue;
        let s = eA({
          originalImageData: A,
          alphaMap: g.alphaMap,
          position: a,
          source: `${g.source}+local`,
          config: g.config,
          baselineNearBlackRatio: H(A, a),
          adaptiveConfidence: e,
          provenance: WA(g.provenance, {
            localShift: !0
          }),
          includeImageData: !1
        });
        s?.accepted && (o = rA(o, s, .002))
      }
    return o
  }

  function Ca({
    originalImageData: A,
    seedCandidate: g,
    adaptiveConfidence: e = null,
    alphaGainCandidates: t = []
  }) {
    if (!g?.alphaMap || !g?.position) return null;
    let o = null;
    for (let n of t) {
      if (!Number.isFinite(n) || n <= 1) continue;
      let r = eA({
        originalImageData: A,
        alphaMap: g.alphaMap,
        position: g.position,
        source: `${g.source}+gain`,
        config: g.config,
        baselineNearBlackRatio: H(A, g.position),
        adaptiveConfidence: e,
        alphaGain: n,
        provenance: g.provenance,
        includeImageData: !1
      });
      r?.accepted && (o = rA(o, r, .002))
    }
    return o
  }

  function wa(A, g) {
    A.push(g), A.sort((e, t) => t.coarseScore - e.coarseScore), A.length > Bt && (A.length = Bt)
  }

  function fa({
    originalImageData: A,
    config: g,
    alpha48: e,
    alpha96: t,
    getAlphaMap: o,
    resolveAlphaMap: n = null,
    adaptiveConfidence: r = null
  }) {
    if (!la(A, g)) return null;
    let a = Math.max(rt, Math.round(g.logoSize * Zr)),
      s = Math.max(a, Math.round(g.logoSize * Wr)),
      i = Math.max(8, g.marginRight - at),
      D = g.marginRight + st,
      u = Math.max(8, g.marginBottom - at),
      c = g.marginBottom + st,
      P = [];
    for (let I = a; I <= s; I += Jr) {
      let l = typeof n == "function" ? n(I) : FA(I, {
        alpha48: e,
        alpha96: t,
        getAlphaMap: o
      });
      if (l)
        for (let B = i; B <= D; B += it) {
          let G = A.width - B - I;
          if (!(G < 0 || G + I > A.width))
            for (let Y = u; Y <= c; Y += it) {
              let w = A.height - Y - I;
              if (w < 0 || w + I > A.height) continue;
              let C = x({
                  imageData: A,
                  alphaMap: l,
                  region: {
                    x: G,
                    y: w,
                    size: I
                  }
                }),
                f = W({
                  imageData: A,
                  alphaMap: l,
                  region: {
                    x: G,
                    y: w,
                    size: I
                  }
                }),
                m = Math.max(0, f) * .6 + Math.max(0, C) * .4;
              m < Vr || wa(P, {
                coarseScore: m,
                alphaMap: l,
                position: {
                  x: G,
                  y: w,
                  width: I,
                  height: I
                },
                config: {
                  logoSize: I,
                  marginRight: B,
                  marginBottom: Y
                }
              })
            }
        }
    }
    let p = null;
    for (let I of P)
      for (let l of Jg) {
        let B = I.position.width + l;
        if (B < rt) continue;
        let G = typeof n == "function" ? n(B) : FA(B, {
