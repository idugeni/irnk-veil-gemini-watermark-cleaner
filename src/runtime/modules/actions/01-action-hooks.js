        imageElement: s,
        imageSessionStore: g
      })
    }

    function t(o = null) {
      if (o?.imageElement) return o.imageElement;
      let n = o?.assetIds || null,
        r = o?.target || null;
      return ce(A, r, n)
    }
    return {
      resolveActionContext: e,
      resolveImageElement: t
    }
  }

  function Ei(A, g) {
    let e = [...A],
      t = e[0],
      o = e[1];
    return typeof t == "string" ? (e[0] = g, o && typeof o == "object" && (e[1] = {
      ...o,
      credentials: "omit"
    }), e) : typeof Request < "u" && t instanceof Request ? (e[0] = new Request(new Request(g, t), {
      credentials: "omit"
    }), o && typeof o == "object" && (e[1] = {
      ...o,
      credentials: "omit"
    }), e) : (e[0] = g, o && typeof o == "object" && (e[1] = {
      ...o,
      credentials: "omit"
    }), e)
  }

  function hi(A, g) {
    if (!A) return !1;
    let e = String(g || "").toLowerCase();
    if (typeof Headers < "u" && A instanceof Headers) return A.get(e) === "1";
    if (Array.isArray(A)) return A.some(([t, o]) => String(t || "").toLowerCase() === e && String(o || "") === "1");
    if (typeof A == "object") {
      for (let [t, o] of Object.entries(A))
        if (String(t || "").toLowerCase() === e && String(o || "") === "1") return !0
    }
    return !1
  }

  function lo(A) {
    let g = A[0],
      e = A[1];
    return e?.gwrBypass === !0 || g && typeof g == "object" && g.gwrBypass === !0 || typeof Request < "u" && g instanceof Request && g.headers?.get("x-gwr-bypass") === "1" ? !0 : hi(e?.headers, "x-gwr-bypass")
  }

  function Oi(A, g) {
    let e = new Headers(A.headers);
    return g.type && e.set("content-type", g.type), new Response(g, {
      status: A.status,
      statusText: A.statusText,
      headers: e
    })
  }

  function bi(A, g = "") {
    let e = new Headers,
      t = g || A?.type || "application/octet-stream";
    return t && e.set("content-type", t), new Response(A, {
      status: 200,
      statusText: "OK",
      headers: e
    })
  }

  function Mi(A) {
    let g = A?.headers?.get?.("content-type") || "";
    return g ? /^image\//i.test(g) : !0
  }

  function io(A) {
    let g = {};
    return !A || typeof A.forEach != "function" || A.forEach((e, t) => {
      g[t] = e
    }), g
  }

  function Qi(A) {
    return A?.action === "download" && A?.resource?.kind === "processed" && A?.resource?.slot === "full" && A.resource.blob instanceof Blob
  }
  async function Ti(A, g) {
    if (typeof A == "function") try {
      await A(g)
    } catch {}
  }
  var Si = /(download|copy|下载|复制)/i,
    ji = /(copy|复制)/i,
    Hi = /(download|下载)/i,
    Bo = ["click", "keydown"],
    Ri = 5e3,
    qi = 3e4;
  var _i = "gemini.google.com",
    zi = "/_/BardChatUi/data/batchexecute";
  var po = /https:(?:(?:\\\\\/)|(?:\\\/)|\/){2}[^\s"'\]]*googleusercontent\.com(?:(?:\\\\\/)|(?:\\\/)|\/)[^\s"'\]]+/gi,
    vi = /\br_[a-z0-9]+\b/i,
    Ki = /\brc_[a-z0-9]+\b/i,
    xi = /\bc_[a-z0-9]+\b/i,
    Ni = /(?<conversationId>c_[a-z0-9]+)[\s\S]{0,96}?(?<responseId>r_[a-z0-9]+)[\s\S]{0,96}?(?<draftId>rc_[a-z0-9]+)/gi,
    ki = /(?<draftId>rc_[a-z0-9]+)(?:(?:\\\\")|")?,\[(?:(?:\\\\")|")http:\/\/googleusercontent\.com\/image_generation_content\/\d+(?:(?:\\\\")|")?\][\s\S]{0,2400}?(?<discoveredUrl>https:(?:(?:\\\\\/)|(?:\\\/)|\/){2}[^\s"'\]]*googleusercontent\.com(?:(?:\\\\\/)|(?:\\\/)|\/)[^\s"'\]]+)/gi,
    hg = Symbol("gwrGeminiRpcXhrState"),
    co = Symbol("gwrGeminiRpcXhrListener");

  function Ui(A) {
    return typeof A == "string" ? A.trim() : ""
  }

  function Po(A) {
    return typeof A == "string" ? A.trim() : !A || typeof A != "object" ? "" : typeof A.normalizedUrl == "string" && A.normalizedUrl.trim() ? A.normalizedUrl.trim() : typeof A.url == "string" && A.url.trim() ? A.url.trim() : ""
  }

  function uo(A) {
    return sg(A)?.isDownload === !0
  }

  function Go(A) {
    if (!A || typeof A != "object") return [];
    let g = typeof A.closest == "function" ? A.closest('button,[role="button"]') : null;
    return !g || typeof g != "object" ? [] : [g.getAttribute?.("aria-label") || "", g.getAttribute?.("title") || "", g.innerText || "", g.textContent || ""].map(Ui).filter(Boolean)
  }

  function Li(A) {
    return Go(A).some(g => Si.test(g))
  }

  function ue(A) {
    let g = Go(A);
    return g.some(e => ji.test(e)) ? "clipboard" : g.some(e => Hi.test(e)) ? "download" : ""
  }

  function De({
    targetWindow: A = globalThis,
    now: g = () => Date.now(),
    windowMs: e = Ri,
    downloadWindowMs: t = qi,
    resolveActionContext: o = null
  } = {}) {
    let n = 0,
      r = 0,
      a = null,
      s = null;

    function i(l = null) {
      return l && typeof l == "object" ? {
        ...l
      } : null
    }

    function D(l = null, B = null) {
      if (n = Math.max(n, g() + e), a = i(l), s = B || s || null, (l?.action || ue(B) || "") === "download") {
        r = Math.max(r, g() + Math.max(e, t));
        return
      }
      r = 0
    }

    function u(l = null) {
      return g() > r ? !1 : uo(Po(l))
    }

    function c(l = null) {
      return g() <= n || u(l)
    }

    function P(l = null) {
      if (!c(l)) return null;
      if (s && typeof o == "function") {
        let B = i(o(s, null));
        if (B) return a = B, B
      }
      return a
    }

    function p(l = null) {
      (l == null || uo(Po(l))) && (n = 0, r = 0, a = null, s = null)
    }

    function I(l) {
      if (!(!l || typeof l != "object")) {
        if (l.type === "keydown") {
          let B = typeof l.key == "string" ? l.key : "";
          if (B && B !== "Enter" && B !== " ") return
        }
        if (Li(l.target)) {
          let B = typeof o == "function" ? o(l.target, l) : null;
          D(B, l.target)
        }
      }
    }
    for (let l of Bo) A?.addEventListener?.(l, I, !0);
    return {
      arm: D,
      hasRecentIntent: c,
      getRecentActionContext: P,
      release: p,
      handleEvent: I,
      dispose() {
        for (let l of Bo) A?.removeEventListener?.(l, I, !0)
      }
    }
  }

  function mo(A) {
    if (typeof A != "string" || A.length === 0) return !1;
    try {
      let g = new URL(A);
      return g.hostname === _i && g.pathname === zi
    } catch {
      return !1
    }
  }

  function bg(A) {
    let g = String(A || "").trim();
    if (!g) return "";
    g = g.replace(/\\u003d/gi, "=").replace(/\\u0026/gi, "&").replace(/\\u002f/gi, "/").replace(/\\u003f/gi, "?").replace(/\\u003a/gi, ":");
    let e = "";
    for (; g !== e;) e = g, g = g.replace(/\\\\\//g, "/").replace(/\\\//g, "/");
    return g.replace(/[\\"]+$/g, "").trim()
  }

  function Fi(A) {
    let g = String(A || "").trim();
    if (!g) return "";
    let e = "",
      t = 0;
    for (; g !== e && t < 3;) {
      e = g, t += 1;
      try {
        g = decodeURIComponent(g.replace(/\+/g, "%20"))
      } catch {
        break
      }
    }
    return g
  }

  function Do(A) {
    if (typeof A != "string" || A.length === 0) return null;
    let g = A.match(vi)?.[0] || null,
      e = A.match(Ki)?.[0] || null,
      t = A.match(xi)?.[0] || null;
    return !g && !e && !t ? null : {
      responseId: g,
      draftId: e,
      conversationId: t
    }
  }

  function Pe(A) {
    let g = [];
    if (typeof A == "string") {
      g.push(A);
      try {
        let t = new URLSearchParams(A).get("f.req");
        t && g.push(t)
      } catch {}
    } else if (A instanceof URLSearchParams) {
      g.push(A.toString());
      let e = A.get("f.req");
      e && g.push(e)
    } else return null;
    for (let e of g) {
      let t = Do(e) || Do(Fi(e));
      if (t) return t
    }
    return null
  }
  async function Wi(A) {
    let g = A[0],
      e = A[1],
      t = Pe(e?.body);
    if (t) return t;
    if (typeof Request < "u" && g instanceof Request) try {
      let o = await g.clone().text();
      return Pe(o)
    } catch {
      return null
    }
    return null
  }

  function Zi(A) {
    if (typeof A != "string" || A.length === 0) return [];
    let g = new Set;
    for (let e of A.matchAll(po)) {
      let t = bg(e[0]),
        o = _(t);
      ig(o) && g.add(o)
    }
    return Array.from(g)
  }

  function Ji(A) {
    if (typeof A != "string" || A.length === 0) return [];
    let g = new Set;
    for (let e of A.matchAll(po)) {
      let t = bg(e[0]),
        o = _(t);
      AA(o) && g.add(o)
    }
    return Array.from(g)
  }

  function Vi(A) {
    if (typeof A != "string" || A.length === 0) return [];
    let g = [];
    for (let e of A.split(/\r?\n/)) {
      let t = e.trim();
      if (!t.startsWith("[[")) continue;
      let o = null;
      try {
        o = JSON.parse(t)
      } catch {
