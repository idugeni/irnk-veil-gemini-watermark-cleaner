  function $e(A, g) {
    let {
      width: e,
      height: t,
      data: o
    } = A, n = g.size ?? Math.min(g.width, g.height);
    if (!n || n <= 0) return new Float32Array(0);
    if (g.x < 0 || g.y < 0 || g.x + n > e || g.y + n > t) return new Float32Array(0);
    let r = new Float32Array(n * n);
    for (let a = 0; a < n; a++)
      for (let s = 0; s < n; s++) {
        let i = ((g.y + a) * e + (g.x + s)) * 4;
        r[a * n + s] = (.2126 * o[i] + .7152 * o[i + 1] + .0722 * o[i + 2]) / 255
      }
    return r
  }

  function Vn(A) {
    let {
      width: g,
      height: e,
      data: t
    } = A, o = new Float32Array(g * e);
    for (let n = 0; n < o.length; n++) {
      let r = n * 4;
      o[n] = (.2126 * t[r] + .7152 * t[r + 1] + .0722 * t[r + 2]) / 255
    }
    return o
  }

  function pg(A, g, e) {
    let t = new Float32Array(g * e);
    for (let o = 1; o < e - 1; o++)
      for (let n = 1; n < g - 1; n++) {
        let r = o * g + n,
          a = -A[r - g - 1] - 2 * A[r - 1] - A[r + g - 1] + A[r - g + 1] + 2 * A[r + 1] + A[r + g + 1],
          s = -A[r - g - 1] - 2 * A[r - g] - A[r - g + 1] + A[r + g - 1] + 2 * A[r + g] + A[r + g + 1];
        t[r] = Math.sqrt(a * a + s * s)
      }
    return t
  }

  function Ve(A, g, e, t, o) {
    let n = 0,
      r = 0,
      a = 0;
    for (let D = 0; D < o; D++) {
      let u = (t + D) * g + e;
      for (let c = 0; c < o; c++) {
        let P = A[u + c];
        n += P, r += P * P, a++
      }
    }
    if (a === 0) return 0;
    let s = n / a,
      i = Math.max(0, r / a - s * s);
    return Math.sqrt(i)
  }

  function Xn(A, g) {
    return pg(A, g, g)
  }

  function Ng({
    gray: A,
    grad: g,
    width: e,
    height: t
  }, o, n, r) {
    let {
      x: a,
      y: s,
      size: i
    } = r;
    if (a < 0 || s < 0 || a + i > e || s + i > t) return null;
    let D = Je(A, e, a, s, i),
      u = Je(g, e, a, s, i),
      c = lg(D, o),
      P = lg(u, n),
      p = 0;
    if (s > 8) {
      let l = Math.max(0, s - i),
        B = Math.min(i, s - l);
      if (B > 8) {
        let G = Ve(A, e, a, s, i),
          Y = Ve(A, e, a, l, B);
        Y > Xe && (p = N(1 - G / Y, 0, 1))
      }
    }
    let I = Math.max(0, c) * .5 + Math.max(0, P) * .3 + p * .2;
    return {
      confidence: N(I, 0, 1),
      spatialScore: c,
      gradientScore: P,
      varianceScore: p
    }
  }

  function $n(A, g) {
    let e = new Set;
    for (let t = A; t <= g; t += 8) e.add(t);
    return 48 >= A && 48 <= g && e.add(48), 96 >= A && 96 <= g && e.add(96), [...e].sort((t, o) => t - o)
  }

  function Ar(A, g, e) {
    return Ig(A, g, e)
  }

  function kg(A, g, e) {
    if (A.has(e)) return A.get(e);
    let t = e === 96 ? g : nA(g, 96, e),
      o = Xn(t, e),
      n = {
        alpha: t,
        grad: o
      };
    return A.set(e, n), n
  }

  function Gg(A, g, {
    dx: e = 0,
    dy: t = 0,
    scale: o = 1
  } = {}) {
    if (g <= 0) return new Float32Array(0);
    if (!Number.isFinite(e) || !Number.isFinite(t) || !Number.isFinite(o) || o <= 0) return new Float32Array(0);
    if (e === 0 && t === 0 && o === 1) return new Float32Array(A);
    let n = (s, i) => {
        let D = Math.floor(s),
          u = Math.floor(i),
          c = s - D,
          P = i - u,
          p = N(D, 0, g - 1),
          I = N(u, 0, g - 1),
          l = N(D + 1, 0, g - 1),
          B = N(u + 1, 0, g - 1),
          G = A[I * g + p],
          Y = A[I * g + l],
          w = A[B * g + p],
          C = A[B * g + l],
          f = G + (Y - G) * c,
          m = w + (C - w) * c;
        return f + (m - f) * P
      },
      r = new Float32Array(g * g),
      a = (g - 1) / 2;
    for (let s = 0; s < g; s++)
      for (let i = 0; i < g; i++) {
        let D = (i - a) / o + a + e,
          u = (s - a) / o + a + t;
        r[s * g + i] = n(D, u)
      }
    return r
  }

  function nA(A, g, e) {
    if (e <= 0) return new Float32Array(0);
    if (g === e) return new Float32Array(A);
    let t = new Float32Array(e * e),
      o = (g - 1) / Math.max(1, e - 1);
    for (let n = 0; n < e; n++) {
      let r = n * o,
        a = Math.floor(r),
        s = Math.min(g - 1, a + 1),
        i = r - a;
      for (let D = 0; D < e; D++) {
        let u = D * o,
          c = Math.floor(u),
          P = Math.min(g - 1, c + 1),
          p = u - c,
          I = A[a * g + c],
          l = A[a * g + P],
          B = A[s * g + c],
          G = A[s * g + P],
          Y = I + (l - I) * p,
          w = B + (G - B) * p;
        t[n * e + D] = Y + (w - Y) * i
      }
    }
    return t
  }

  function x({
    imageData: A,
    alphaMap: g,
    region: e
  }) {
    let t = $e(A, e);
    return t.length === 0 || t.length !== g.length ? 0 : lg(t, g)
  }

  function W({
    imageData: A,
    alphaMap: g,
    region: e
  }) {
    let t = $e(A, e);
    if (t.length === 0 || t.length !== g.length) return 0;
    let o = e.size ?? Math.min(e.width, e.height);
    if (!o || o <= 2) return 0;
    let n = pg(t, o, o),
      r = pg(g, o, o);
    return lg(n, r)
  }

  function At({
    processedImageData: A,
    alphaMap: g,
    position: e,
    residualThreshold: t = .22,
    originalImageData: o = null,
    originalSpatialMismatchThreshold: n = 0
  }) {
    return !!(x({
      imageData: A,
      alphaMap: g,
      region: {
        x: e.x,
        y: e.y,
        size: e.width ?? e.size
      }
    }) >= t || o && x({
      imageData: o,
      alphaMap: g,
      region: {
        x: e.x,
        y: e.y,
        size: e.width ?? e.size
      }
    }) <= n)
  }

  function gt({
    imageData: A,
    alpha96: g,
    defaultConfig: e,
    threshold: t = Jn
  }) {
    let {
      width: o,
      height: n
    } = A, r = Vn(A), a = pg(r, o, n), s = {
      gray: r,
      grad: a,
      width: o,
      height: n
    }, i = new Map, u = Ar(o, n, e).map(y => {
      let O = y.logoSize,
        h = {
          size: O,
          x: o - y.marginRight - O,
          y: n - y.marginBottom - O
        };
      if (h.x < 0 || h.y < 0 || h.x + O > o || h.y + O > n) return null;
      let M = kg(i, g, O),
        T = Ng(s, M.alpha, M.grad, h);
      return T ? {
        ...h,
        ...T
      } : null
    }).filter(Boolean), c = u.reduce((y, O) => !y || O.confidence > y.confidence ? O : y, null);
    if (c && c.confidence >= t + .08) return {
      found: !0,
      confidence: c.confidence,
      spatialScore: c.spatialScore,
      gradientScore: c.gradientScore,
      varianceScore: c.varianceScore,
      region: {
        x: c.x,
        y: c.y,
        size: c.size
      }
    };
    let P = e.logoSize,
      p = N(Math.round(P * .65), 24, 144),
      I = N(Math.min(Math.round(P * 2.8), Math.floor(Math.min(o, n) * .4)), p, 192),
      l = $n(p, I),
      B = Math.max(32, Math.round(P * .75)),
      G = N(e.marginRight - B, 8, o - p - 1),
      Y = N(e.marginRight + B, G, o - p - 1),
      w = N(e.marginBottom - B, 8, n - p - 1),
      C = N(e.marginBottom + B, w, n - p - 1),
      f = [],
      m = y => {
        f.push(y), f.sort((O, h) => h.adjustedScore - O.adjustedScore), f.length > 5 && (f.length = 5)
      };
    for (let y of u) m({
      size: y.size,
      x: y.x,
      y: y.y,
      adjustedScore: y.confidence * Math.min(1, Math.sqrt(y.size / 96))
    });
    for (let y of l) {
      let O = kg(i, g, y);
      for (let h = G; h <= Y; h += 8) {
        let M = o - h - y;
        if (!(M < 0))
          for (let T = w; T <= C; T += 8) {
            let S = n - T - y;
            if (S < 0) continue;
            let Q = Ng(s, O.alpha, O.grad, {
              x: M,
              y: S,
              size: y
            });
            if (!Q) continue;
            let b = Q.confidence * Math.min(1, Math.sqrt(y / 96));
            b < .08 || m({
              size: y,
              x: M,
              y: S,
              adjustedScore: b
            })
          }
      }
    }
    let d = c ?? {
      x: o - e.marginRight - e.logoSize,
      y: n - e.marginBottom - e.logoSize,
      size: e.logoSize,
