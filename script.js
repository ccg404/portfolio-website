(function () {
  var root = document.documentElement;

  /* Theme */
  try { var s = localStorage.getItem("theme"); if (s) root.setAttribute("data-theme", s); } catch (e) {}
  document.getElementById("theme").addEventListener("click", function () {
    var cur = root.getAttribute("data-theme");
    if (!cur) cur = "light";
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* Copy email */
  var btn = document.getElementById("copy"), done = document.getElementById("copied");
  btn.addEventListener("click", function () {
    var el = document.getElementById("email");
    function say(m) { done.textContent = m; setTimeout(function () { done.textContent = ""; }, 2200); }
    function pick() { var r = document.createRange(); r.selectNodeContents(el); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); say("selected"); }
    try { navigator.clipboard.writeText(el.textContent).then(function () { say("copied"); }, pick); } catch (e) { pick(); }
  });

  /* Portrait follows the cursor */
  var stage = document.querySelector(".portrait .stage");
  if (stage && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, raf = 0;
    function clamp(v) { return Math.max(-1, Math.min(1, v)); }
    function frame() {
      cur.x += (tgt.x - cur.x) * 0.12; cur.y += (tgt.y - cur.y) * 0.12;
      var st = stage.style;
      st.setProperty("--ry", (cur.x * 14).toFixed(2) + "deg");
      st.setProperty("--rx", (-cur.y * 12).toFixed(2) + "deg");
      st.setProperty("--tx", (cur.x * 12).toFixed(2) + "px");
      st.setProperty("--ty", (cur.y * 10).toFixed(2) + "px");
      st.setProperty("--hx", (-cur.x * 10).toFixed(2) + "px");
      st.setProperty("--hy", (-cur.y * 10).toFixed(2) + "px");
      if (Math.abs(tgt.x - cur.x) > 0.002 || Math.abs(tgt.y - cur.y) > 0.002) raf = requestAnimationFrame(frame); else raf = 0;
    }
    function go() { if (!raf) raf = requestAnimationFrame(frame); }
    window.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      tgt.x = clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth * 0.5));
      tgt.y = clamp((e.clientY - (r.top + r.height / 2)) / (innerHeight * 0.5));
      go();
    }, { passive: true });
    document.addEventListener("pointerleave", function () { tgt.x = 0; tgt.y = 0; go(); });
  }

  /* Active nav link */
  var links = {};
  document.querySelectorAll(".links a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window) {
    var nav = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("on"); });
          links[en.target.id].classList.add("on");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("section[id]").forEach(function (sec) { nav.observe(sec); });

    /* Reveal: movement only, content stays visible */
    if (!reduce) {
      var rv = document.querySelectorAll(".rv");
      rv.forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight) el.classList.add("pre"); });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); }
        });
      }, { threshold: 0.08 });
      rv.forEach(function (el) { io.observe(el); });
    }
  }
})();