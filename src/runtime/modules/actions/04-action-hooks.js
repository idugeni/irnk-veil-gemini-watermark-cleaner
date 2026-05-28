      if (!(a instanceof Blob)) throw new TypeError("blob must be a Blob");
      if (!A || typeof A.addEventListener != "function" || typeof A.removeEventListener != "function" || typeof A.postMessage != "function") return i(a, s);
      let D = await a.arrayBuffer(),
        u = me("gwr-page-bridge"),
        c = cB(s);
      try {
        return await new Promise((P, p) => {
          let I = () => {
              A.removeEventListener("message", l), globalThis.clearTimeout(B)
            },
            l = G => {
              if (aB(G?.source, A) && !(!G?.data || G.data.type !== rB) && G.data.requestId === u) {
                if (I(), G.data.ok === !1) {
                  p(new Error(V(G.data.error, "Page bridge failed")));
                  return
                }
                P(Ge(G.data.result))
              }
            },
            B = globalThis.setTimeout(() => {
              I(), p(new Error(`Page bridge timed out: ${r}`))
            }, g);
          A.addEventListener("message", l), A.postMessage({
            type: nB,
            requestId: u,
            action: r,
            inputBuffer: D,
            mimeType: a.type || "image/png",
            options: c
          }, "*", [D])
        })
      } catch (P) {
        return o?.warn?.("[Gemini Watermark Remover] Page bridge fallback:", P), i(a, s)
      }
    }
    return {
      async processWatermarkBlob(r, a = {}) {
        if (typeof e != "function") throw new Error("fallbackProcessWatermarkBlob must be a function");
        return n("process-watermark-blob", r, a, e)
      },
      async removeWatermarkFromBlob(r, a = {}) {
        if (typeof t != "function") throw new Error("fallbackRemoveWatermarkFromBlob must be a function");
        return (await n("remove-watermark-blob", r, a, async (i, D) => {
          let u = await t(i, D);
          return rg(u, null)
        })).processedBlob
      }
    }
  }
  var To = "hNvQHb";

  function PB(A = "") {
    let g = String(A || "").trim().replace(/^\/+|\/+$/g, "");
    return !g || g === "app" ? "" : g.startsWith("c_") ? g : `c_${g}`
  }

  function uB(A = "") {
    let g = String(A || "").trim();
    if (!g) return "";
    let e = g.split("/").filter(Boolean),
      t = e.indexOf("app");
    return t < 0 ? "" : PB(e[t + 1] || "")
  }

  function DB(A = globalThis.window || null) {
    let g = A?.WIZ_global_data;
    if (!g || typeof g != "object") return null;
    let e = typeof g.SNlM0e == "string" ? g.SNlM0e.trim() : "",
      t = typeof g.cfb2h == "string" ? g.cfb2h.trim() : "",
      o = typeof g.FdrFJe == "string" ? g.FdrFJe.trim() : "",
      n = typeof g.eptZe == "string" ? g.eptZe.trim() : "";
    return !e || !t || !o || !n ? null : {
      at: e,
      buildLabel: t,
      sessionId: o,
      endpointBase: n
    }
  }

  function IB({
    origin: A = "https://gemini.google.com",
    sourcePath: g = "/app",
    hl: e = "en",
    reqId: t = 1e5,
    conversationId: o = "",
    rpcConfig: n = null,
    pageSize: r = 10
  } = {}) {
    if (!o || !n) return null;
    let a = String(n.endpointBase || "").trim(),
      s = a.endsWith("/") ? `${a}data/batchexecute` : `${a}/data/batchexecute`,
      i = new URL(s, A);
    i.searchParams.set("rpcids", To), i.searchParams.set("source-path", g || "/app"), i.searchParams.set("bl", n.buildLabel), i.searchParams.set("f.sid", n.sessionId), i.searchParams.set("hl", e || "en"), i.searchParams.set("_reqid", String(t)), i.searchParams.set("rt", "c");
    let D = [
      [
        [To, JSON.stringify([o, r, null, 1, [0],
          [4], null, 1
        ]), null, "generic"]
      ]
    ];
    return {
      url: i.toString(),
      init: {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: `f.req=${encodeURIComponent(JSON.stringify(D))}&at=${encodeURIComponent(n.at)}&`
      }
    }
  }
  var Ce = 0;

  function lB() {
    return Ce = (Ce + 1e5) % 9e5, 1e5 + Ce
  }
  async function So({
    targetWindow: A = globalThis.window || null,
    fetchImpl: g = null,
    onResponseText: e = null,
    logger: t = console
  } = {}) {
    if (!A || typeof A != "object") return !1;
    let o = uB(A.location?.pathname || "");
    if (!o) return !1;
    let n = DB(A);
    if (!n) return !1;
    let r = IB({
      origin: A.location?.origin || "https://gemini.google.com",
      sourcePath: A.location?.pathname || "/app",
      hl: A.document?.documentElement?.lang || A.navigator?.language || "en",
      reqId: lB(),
      conversationId: o,
      rpcConfig: n
    });
    if (!r) return !1;
    let a = typeof g == "function" ? g : A.fetch?.bind(A);
    if (typeof a != "function") return !1;
    try {
      let s = await a(r.url, r.init);
      if (typeof e == "function" && s) {
        let i = typeof s.clone == "function" ? await s.clone().text() : await s.text();
        await e(i, {
          request: r,
          response: s
        })
      }
      return !0
    } catch (s) {
      return t?.warn?.("[Gemini Watermark Remover] Conversation history bootstrap failed:", s), !1
    }
  }
  var pB = "gwr:userscript-process-request",
    jo = "gwr:userscript-process-response",
    GB = "__gwrUserscriptProcessBridgeInstalled__";

  function mB({
    targetWindow: A = globalThis.window || null,
    processWatermarkBlob: g,
    removeWatermarkFromBlob: e,
    logger: t = console
  } = {}) {
    return async function(n) {
      if (!n?.data || n.data.type !== pB || A && n.source && n.source !== A || !A || typeof A.postMessage != "function") return;
      let r = typeof n.data.requestId == "string" ? n.data.requestId : "",
        a = typeof n.data.action == "string" ? n.data.action : "";
      if (!(!r || !a)) try {
        let s = new Blob([n.data.inputBuffer], {
            type: n.data.mimeType || "image/png"
          }),
          i;
        if (a === "process-watermark-blob") {
          if (typeof g != "function") throw new Error("processWatermarkBlob bridge handler unavailable");
          i = await g(s, n.data.options || {})
        } else if (a === "remove-watermark-blob") {
          if (typeof e != "function") throw new Error("removeWatermarkFromBlob bridge handler unavailable");
          i = await e(s, n.data.options || {})
        } else throw new Error(`Unknown bridge action: ${a}`);
        let D = await pe(i, {
          invalidBlobMessage: "Bridge processor must return a Blob"
        });
        A.postMessage({
          type: jo,
          requestId: r,
          ok: !0,
          action: a,
          result: D
        }, "*", [D.processedBuffer])
      } catch (s) {
        t?.warn?.("[Gemini Watermark Remover] Userscript bridge request failed:", s), A.postMessage({
          type: jo,
          requestId: r,
          ok: !1,
          action: a,
          error: V(s, "Userscript bridge failed")
        }, "*")
      }
    }
  }
