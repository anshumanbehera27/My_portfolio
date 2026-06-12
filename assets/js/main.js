/* ============================================================
   Anshuman Behera — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = $("#theme-toggle");
  const setTheme = (t) => {
    root.setAttribute("data-theme", t);
    localStorage.setItem("portfolio-theme", t);
    themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
  };
  setTheme(localStorage.getItem("portfolio-theme") || "dark");
  themeBtn.addEventListener("click", () =>
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
  );

  /* ---------- mobile nav ---------- */
  const burger = $("#nav-burger");
  const navLinks = $("#nav-links");
  burger.addEventListener("click", () => navLinks.classList.toggle("open"));
  $$("#nav-links a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );

  /* ---------- navbar scroll state + progress + back-to-top ---------- */
  const navbar = $("#navbar");
  const progress = $("#progress-bar");
  const toTop = $("#to-top");
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 30);
    toTop.classList.toggle("show", y > 600);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- active nav link ---------- */
  const linkFor = {};
  $$("#nav-links a").forEach((a) => (linkFor[a.getAttribute("href").slice(1)] = a));
  const navObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting && linkFor[e.target.id]) {
          $$("#nav-links a").forEach((a) => a.classList.remove("active"));
          linkFor[e.target.id].classList.add("active");
        }
      }),
    { rootMargin: "-40% 0px -55% 0px" }
  );
  $$("section[id]").forEach((s) => navObserver.observe(s));

  /* ---------- typing effect ---------- */
  const roles = [
    "Java Full-Stack Developer",
    "GenAI Builder 🤖",
    "Spring Boot + Microservices",
    "Android Dev — Kotlin & Compose",
    "Event-Driven Systems with Kafka",
  ];
  const typedEl = $("#typed");
  if (typedEl) {
    let ri = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = roles[ri];
      typedEl.textContent = word.slice(0, ci);
      if (!deleting) {
        ci++;
        if (ci > word.length) { deleting = true; setTimeout(tick, 1700); return; }
      } else {
        ci--;
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(tick, deleting ? 38 : 78);
    };
    if (reducedMotion) { typedEl.textContent = roles[0]; } else { tick(); }
  }

  /* ---------- particle canvas ---------- */
  const canvas = $("#particles");
  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, pts;
    const init = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      const n = Math.min(70, Math.floor(W / 18));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.6,
      }));
    };
    const tone = () =>
      root.getAttribute("data-theme") === "light" ? "99,102,241" : "139,160,255";
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const c = tone();
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},0.55)`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${c},${0.16 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      requestAnimationFrame(draw);
    };
    init();
    window.addEventListener("resize", init);
    draw();
  }

  /* ---------- scroll reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObserver.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- animated counters ---------- */
  const countObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        countObserver.unobserve(e.target);
        const el = e.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || "";
        if (reducedMotion) { el.textContent = target + suffix; return; }
        const dur = 1600, t0 = performance.now();
        const step = (t) => {
          const k = Math.min((t - t0) / dur, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - k, 3))) + suffix;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }),
    { threshold: 0.5 }
  );
  $$(".stat .num").forEach((el) => countObserver.observe(el));

  /* ---------- skills tabs ---------- */
  $$(".skill-tabs .skill-tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      $$(".skill-tabs .skill-tab").forEach((t) => t.classList.remove("active"));
      $$(".skill-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      $("#panel-" + tab.dataset.panel).classList.add("active");
    })
  );

  /* ---------- project filters ---------- */
  $$(".project-filters .skill-tab").forEach((btn) =>
    btn.addEventListener("click", () => {
      $$(".project-filters .skill-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      $$(".project-card").forEach((card) => {
        const show = f === "all" || card.dataset.cat.split(" ").includes(f);
        card.classList.toggle("hide", !show);
      });
    })
  );

  /* ---------- timeline expand ---------- */
  $$(".tl-card").forEach((card) =>
    card.addEventListener("click", () => card.classList.toggle("open"))
  );

  /* ---------- footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
