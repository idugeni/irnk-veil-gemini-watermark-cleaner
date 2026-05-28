        continue
      }
      if (Array.isArray(o))
        for (let n of o) {
          let r = Array.isArray(n) ? n[1] : "",
            a = Array.isArray(n) ? n[2] : "";
          if (!(r !== "hNvQHb" || typeof a != "string" || a.length === 0)) try {
            let s = JSON.parse(a);
            Array.isArray(s) && g.push(s)
          } catch {}
        }
    }
    return g
  }

  function Yo(A) {
    return Array.isArray(A) && A.length >= 2 && typeof A[0] == "string" && A[0].startsWith("c_") && typeof A[1] == "string" && A[1].startsWith("r_")
  }

  function Co(A, g = [], e = new Map, t = {
    order: 0
  }) {
    if (!Array.isArray(A)) return g;
    if (Yo(A)) {
      let o = A[0],
        n = A[1],
        r = typeof A[2] == "string" && A[2].startsWith("rc_") ? A[2] : null,
        a = `${o}|${n}`,
        s = t.order;
      t.order += 1;
      let i = e.get(a);
      if (i) return !i.draftId && r && (i.draftId = r, i.firstDraftOrder = s), g;
      let D = {
        conversationId: o,
        responseId: n,
        draftId: r,
        firstOrder: s,
        firstDraftOrder: r ? s : Number.POSITIVE_INFINITY
      };
      return e.set(a, D), g.push(D), g
    }
    for (let o of A) Co(o, g, e, t);
    return g
  }

  function Og(A, g = new Set) {
    if (typeof A == "string") {
      let e = _(bg(A));
      return AA(e) && g.add(e), g
    }
    if (!Array.isArray(A)) {
      if (A && typeof A == "object")
        for (let e of Object.values(A)) Og(e, g);
      return g
    }
    for (let e of A) Og(e, g);
    return g
  }

  function wo(A, g = []) {
    if (!Array.isArray(A)) return g;
    if (typeof A[0] == "string" && A[0].startsWith("rc_")) {
      let e = Array.from(Og(A));
      return e.length > 0 && g.push({
        draftId: A[0],
        discoveredUrls: e
      }), g
    }
    for (let e of A) wo(e, g);
    return g
  }

  function fo(A, g = []) {
    if (!Array.isArray(A)) return g;
    typeof A[0] == "string" && A[0].startsWith("rc_") && g.push(A[0]);
    for (let e of A) fo(e, g);
    return g
  }

  function yo(A, g = [], e = new Set) {
    if (!Array.isArray(A)) return g;
    let t = A.filter(Yo),
      o = Array.from(Og(A)),
      n = fo(A);
    if (t.length > 0 && o.length > 0 && n.length > 0) {
      let r = t[0],
        a = typeof r[2] == "string" && r[2].startsWith("rc_") ? r[2] : null,
        s = n[n.length - 1] || a || null,
        i = r[0],
        D = r[1];
      for (let u of o) {
        let c = `${i||""}|${D||""}|${s||""}|${u}`;
        e.has(c) || (e.add(c), g.push({
          discoveredUrl: u,
          assetIds: {
            responseId: D,
            draftId: s,
            conversationId: i
          }
        }))
      }
      return g
    }
    for (let r of A) yo(r, g, e);
    return g
  }

  function Xi(A) {
    if (!Array.isArray(A)) return [];
    let g = Co(A).slice().sort((t, o) => {
        let n = Number.isFinite(t.firstDraftOrder) ? t.firstDraftOrder : t.firstOrder,
          r = Number.isFinite(o.firstDraftOrder) ? o.firstDraftOrder : o.firstOrder;
        return n - r
      }),
      e = wo(A);
    if (g.length > 0 && e.length > 0) {
      let t = [...g],
        o = new Map;
      for (let r of g) {
        if (!r.draftId) continue;
        let a = o.get(r.draftId);
        a ? a.push(r) : o.set(r.draftId, [r])
      }
      let n = [];
      for (let r of e) {
        let s = (r.draftId ? o.get(r.draftId) || [] : []).shift() || t.shift();
        if (!s) continue;
        let i = t.indexOf(s);
        i >= 0 && t.splice(i, 1);
        let D = g.length === 1 && e.length === 1 && s.draftId ? s.draftId : r.draftId || s.draftId || null;
        for (let u of r.discoveredUrls) n.push({
          discoveredUrl: u,
          assetIds: {
            responseId: s.responseId,
            draftId: D,
            conversationId: s.conversationId
          }
        })
      }
      if (n.length > 0) return n
    }
    return yo(A)
  }

  function $i(A) {
    if (typeof A != "string" || A.length === 0) return [];
    let g = [];
    for (let e of A.matchAll(Ni)) {
      let t = e.groups?.conversationId || null,
        o = e.groups?.responseId || null,
        n = e.groups?.draftId || null;
      !t && !o && !n || g.push({
        index: e.index ?? 0,
        assetIds: {
          responseId: o,
          draftId: n,
          conversationId: t
        }
      })
    }
    return g
  }

  function AB(A) {
    if (typeof A != "string" || A.length === 0) return [];
    let g = [];
    for (let e of A.matchAll(ki)) {
      let t = e.groups?.draftId || null,
        o = _(bg(e.groups?.discoveredUrl || ""));
      !t || !AA(o) || g.push({
        index: e.index ?? 0,
        draftId: t,
        discoveredUrl: o
      })
    }
    return g
  }

  function Ie(A) {
    if (typeof A != "string" || A.length === 0) return [];
    let g = [],
      e = new Set;
    for (let a of Vi(A))
      for (let s of a)
        for (let i of Xi(s)) {
          let D = `${i.assetIds.conversationId||""}|${i.assetIds.responseId||""}|${i.assetIds.draftId||""}|${i.discoveredUrl}`;
          e.has(D) || (e.add(D), g.push(i))
        }
    if (g.length > 0) return g;
    let t = $i(A);
    if (t.length === 0) return [];
    let o = [],
      n = new Set,
      r = AB(A);
    for (let a of r) {
      let s = [...t].reverse().find(D => D.index < a.index && D.assetIds.draftId === a.draftId);
      if (!s) continue;
      let i = `${s.assetIds.conversationId||""}|${s.assetIds.responseId||""}|${s.assetIds.draftId||""}|${a.discoveredUrl}`;
      n.has(i) || (n.add(i), o.push({
        discoveredUrl: a.discoveredUrl,
        assetIds: {
          ...s.assetIds
        }
      }))
    }
    if (o.length > 0) return o;
    for (let a = 0; a < t.length; a += 1) {
      let s = t[a],
        i = t[a + 1],
        D = A.slice(s.index, i?.index ?? A.length),
        u = Ji(D);
      for (let c of u) {
        let P = `${s.assetIds.conversationId||""}|${s.assetIds.responseId||""}|${s.assetIds.draftId||""}|${c}`;
        n.has(P) || (n.add(P), o.push({
          discoveredUrl: c,
          assetIds: {
            ...s.assetIds
          }
        }))
      }
    }
    return o
  }

  function Io(A, g) {
    let e = A && typeof A == "object" ? {
        ...A
      } : {},
      t = {
        ...e.assetIds && typeof e.assetIds == "object" ? e.assetIds : {},
        ...g && typeof g == "object" ? g : {}
      };
    return !t.responseId && !t.draftId && !t.conversationId ? Object.keys(e).length > 0 ? e : null : {
      ...e,
      assetIds: t
    }
  }
  async function Eo({
    rpcUrl: A,
    requestAssetIds: g = null,
    responseText: e = "",
    provideActionContext: t = () => null,
    onOriginalAssetDiscovered: o = null
  } = {}) {
    let n = t({
        rpcUrl: A
      }),
      r = Io(n, g);
    if (typeof o != "function") return;
    let a = Ie(e);
    if (a.length > 0) {
      for (let i of a) {
        let D = Io(r, i.assetIds);
        await o(tA({
          rpcUrl: A,
          discoveredUrl: i.discoveredUrl
        }, D))
      }
      return
    }
    if (!r) return;
    let s = Zi(e);
    for (let i of s) await o(tA({
      rpcUrl: A,
      discoveredUrl: i
    }, r))
  }

  function ho({
    originalFetch: A,
    provideActionContext: g = null,
    getActionContext: e = () => null,
    onOriginalAssetDiscovered: t = null,
    logger: o = console
  }) {
    if (typeof A != "function") throw new TypeError("originalFetch must be a function");
    let n = typeof g == "function" ? g : CA({
      getActionContext: e
    });
    return async function(...a) {
      if (lo(a)) return A(...a);
      let s = a[0],
        i = typeof s == "string" ? s : s?.url;
      if (!mo(i)) return A(...a);
      let D = await A(...a);
      if (!D?.ok || typeof D.clone != "function") return D;
      try {
        let u = await Wi(a),
          c = await D.clone().text();
        await Eo({
          rpcUrl: i,
          requestAssetIds: u,
          responseText: c,
          provideActionContext: () => n({
            args: a,
            rpcUrl: i
          }),
          onOriginalAssetDiscovered: t
        })
      } catch (u) {
        o?.warn?.("[Gemini Watermark Remover] Download RPC hook processing failed:", u)
      }
      return D
    }
  }

  function Oo(A, {
    provideActionContext: g = null,
    getActionContext: e = () => null,
    onOriginalAssetDiscovered: t = null,
    logger: o = console
  } = {}) {
    if (!A || typeof A != "object") throw new TypeError("targetWindow must be an object");
    let n = A.XMLHttpRequest,
      r = n?.prototype;
    if (typeof n != "function" || !r || typeof r.open != "function" || typeof r.send != "function") return null;
    let a = r.open,
      s = r.send,
      i = typeof g == "function" ? g : CA({
        getActionContext: e
