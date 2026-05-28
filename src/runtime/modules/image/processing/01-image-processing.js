    function b() {
      if (h(e), e?.addEventListener?.("pointerdown", S, !0), e?.addEventListener?.("click", S, !0), e?.readyState === "loading") {
        e.addEventListener("DOMContentLoaded", () => {
          Q(), T(e)
        }, {
          once: !0
        });
        return
      }
      Q()
    }

    function U() {
      I && (I.disconnect(), I = null), e?.removeEventListener?.("pointerdown", S, !0), e?.removeEventListener?.("click", S, !0)
    }
    return {
      install: b,
      dispose: U,
      processRoot: h
    }
  }
