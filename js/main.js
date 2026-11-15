/* ============================================================
   Portfolio N'Goran Junior
   Curseur contextuel · filtres · bilingue FR/EN ·
   formulaire · horloge · interactions de projets
   ============================================================ */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 1. Nettoyer l'ancienne intro ---------- */
  const intro = document.querySelector(".intro");
  if (intro) intro.remove();
  document.documentElement.classList.remove("lock");

  /* ---------- 2. Curseur contextuel ---------- */
  const cursor = document.querySelector(".cursor");
  if (cursor && finePointer && !reduced) {
    document.body.classList.add("cursor-on");
    const label = cursor.querySelector(".cursor-label");
    addEventListener("pointermove", (e) => {
      cursor.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
      const t = e.target instanceof Element ? e.target : null;
      const zone = t?.closest("[data-cursor]");
      const link = t?.closest("a,button");
      cursor.classList.toggle("link", !!link && !zone);
      if (zone) { label.textContent = zone.dataset.cursor || "VOIR"; cursor.classList.add("badge"); cursor.classList.remove("link"); }
      else cursor.classList.remove("badge");
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => { cursor.style.opacity = "0"; });
    document.documentElement.addEventListener("pointerenter", () => { cursor.style.opacity = ""; });
  }

  /* ---------- 3. Boutons magnétiques ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll("[data-magnet]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = Math.max(-6, Math.min(6, (e.clientX - (r.left + r.width / 2)) * 0.12));
        const dy = Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) * 0.12));
        el.style.transform = `translate(${dx}px,${dy}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- 5. Compteurs animés ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const b = en.target, target = parseInt(b.dataset.count || "0", 10);
      cio.unobserve(b);
      if (reduced || !target) { b.firstChild.nodeValue = target; return; }
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        b.firstChild.nodeValue = Math.round(target * e);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((b) => {
    if (!b.firstChild || b.firstChild.nodeType !== 3) b.prepend(document.createTextNode("0"));
    cio.observe(b);
  });

  /* ---------- 6. Filtres projets ---------- */
  const fbtns = document.querySelectorAll(".fbtn");
  const cards = document.querySelectorAll(".card[data-cat]");
  if (fbtns.length) {
    fbtns.forEach((btn) => btn.addEventListener("click", () => {
      fbtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      const f = btn.dataset.filter;
      cards.forEach((c) => {
        const show = f === "all" || (c.dataset.cat || "").split(" ").includes(f);
        c.classList.toggle("hide", !show);
        if (show && !reduced) { c.style.animation = "none"; void c.offsetWidth; c.style.animation = "cardIn .5s var(--ease)"; }
      });
    }));
    const st = document.createElement("style");
    st.textContent = "@keyframes cardIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}";
    document.head.appendChild(st);
  }

  /* ---------- 7. Menu mobile ---------- */
  const burger = document.querySelector(".burger"), menu = document.querySelector(".menu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
    }));
  }

  /* ---------- 8. Voile de transition entre pages ---------- */
  const veil = document.querySelector(".veil");
  if (veil && !reduced) {
    const vlabel = document.createElement("span");
    vlabel.className = "veil-label"; vlabel.setAttribute("aria-hidden", "true");
    veil.appendChild(vlabel);
    document.querySelectorAll('a[href$=".html"]').forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || a.target === "_blank" || a.hasAttribute("download")) return;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        vlabel.textContent = (a.dataset.veil || a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28);
        veil.classList.remove("go"); void veil.offsetWidth; veil.classList.add("go");
        setTimeout(() => { location.href = href; }, 420);
      });
    });
  }

  /* ---------- 9. Bilingue FR / EN ---------- */
  window.PF_COMMON_EN = Object.assign({
    "skip": "Skip to content", "intro.skip": "Skip intro",
    "nav.home": "Home", "nav.projects": "Projects", "nav.journey": "Journey",
    "nav.about": "About", "nav.contact": "Contact", "nav.cv": "Résumé",
    "foot.role": "Computer science student", "foot.certs": "Certificates", "foot.top": "Top ↑",
    "status.live": "Live", "status.wip": "In progress",
    "f.all": "All", "f.front": "Front end", "f.laravel": "Laravel · PHP", "f.live": "Live", "f.wip": "In progress",
    "f.name": "Name", "f.subject": "Subject", "f.send": "Send message",
    "k.time": "Time in Abidjan", "back.projects": "← All projects"
  }, window.PF_COMMON_EN || {});
  const DICT = Object.assign({}, window.PF_COMMON_EN, window.PF_PAGE_EN || {});
  const applyLang = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.dataset.i18n;
      if (el.dataset.fr === undefined) el.dataset.fr = el.innerHTML;
      el.innerHTML = (lang === "en" && DICT[k] !== undefined) ? DICT[k] : el.dataset.fr;
    });
    document.querySelectorAll("[data-alt-en]").forEach((el) => {
      if (lang === "en") { el.dataset.altFr = el.dataset.altFr || el.alt; el.alt = el.dataset.altEn; }
      else if (el.dataset.altFr) el.alt = el.dataset.altFr;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const k = el.getAttribute("data-i18n-aria");
      if (el.dataset.ariaFr === undefined) el.dataset.ariaFr = el.getAttribute("aria-label") || "";
      const v = (lang === "en" && DICT[k] !== undefined) ? DICT[k] : el.dataset.ariaFr;
      if (v) el.setAttribute("aria-label", v);
    });
    if (lang === "en" && window.PF_TITLE_EN) document.title = window.PF_TITLE_EN;
    else if (window.PF_TITLE_FR) document.title = window.PF_TITLE_FR;
    document.querySelectorAll(".lang button").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    try { localStorage.setItem("pf-lang", lang); } catch (e) {}
  };
  let lang = "fr";
  try { lang = localStorage.getItem("pf-lang") || "fr"; } catch (e) {}
  if (Object.keys(DICT).length) applyLang(lang);
  document.querySelectorAll(".lang button").forEach((b) =>
    b.addEventListener("click", () => applyLang(b.dataset.lang)));

  /* ---------- 10. Formulaire de contact (Formspree) ---------- */
  const form = document.querySelector("#contact-form");
  if (form) {
    const msg = form.querySelector(".form-msg");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (msg) { msg.textContent = "…"; msg.className = "form-msg"; }
      const btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("send failed");
        if (msg) { msg.textContent = msg.dataset.ok || "Message envoyé. Je vous réponds vite."; msg.classList.add("ok"); }
        form.reset();
      } catch (err) {
        if (msg) { msg.textContent = msg.dataset.ko || "Échec de l'envoi. Écrivez-moi directement par email."; msg.classList.add("err"); }
      } finally { if (btn) btn.disabled = false; }
    });
  }

  /* ---------- 11. Horloge d'Abidjan ---------- */
  const clock = document.querySelector("#clock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Abidjan" });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick(); setInterval(tick, 30000);
  }

  /* ---------- 12. Année + retour en haut ---------- */
  document.querySelectorAll("#year").forEach((el) => { el.textContent = new Date().getFullYear(); });
  document.querySelectorAll(".to-top").forEach((b) =>
    b.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })));

  /* ---------- 13. Progression de la timeline ---------- */
  const tl = document.querySelector(".timeline");
  if (tl) {
    const fill = tl.querySelector(".fill");
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = tl.getBoundingClientRect(), vp = innerHeight * 0.7;
      const p = Math.max(0, Math.min(1, (vp - r.top) / r.height));
      if (fill) fill.style.height = (p * 100).toFixed(1) + "%";
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
})();

/* ============================================================
   Effets visuels complémentaires
   ============================================================ */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- A. Barre de progression du scroll ---------- */
  const prog = document.createElement("div");
  prog.className = "scroll-progress"; prog.setAttribute("aria-hidden", "true");
  document.body.appendChild(prog);
  let pTick = false;
  const updateProg = () => {
    pTick = false;
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    prog.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
  };
  addEventListener("scroll", () => { if (!pTick) { pTick = true; requestAnimationFrame(updateProg); } }, { passive: true });
  updateProg();

})();

/* ============================================================
   SÉLECTEUR PROJET + HEADER PILULE
   ============================================================ */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header : devient une pilule flottante après le hero */
  const header = document.querySelector(".site-header");
  if (header) {
    let fTick = false;
    addEventListener("scroll", () => {
      if (fTick) return; fTick = true;
      requestAnimationFrame(() => {
        fTick = false;
        header.classList.toggle("floating", scrollY > 420);
      });
    }, { passive: true });
  }

  /* Sélecteur "Et votre projet ?" */
  const cards = [...document.querySelectorAll(".pj-card")];
  const pills = [...document.querySelectorAll(".pj-pill")];
  const go = document.querySelector("#pj-go");
  const wa = document.querySelector("#pj-wa");
  if (!cards.length) return;
  const langKey = () => (document.documentElement.lang === "en" ? "labelEn" : "labelFr");

  function pick(list, btn) {
    list.forEach((b) => { b.classList.remove("selected"); b.setAttribute("aria-pressed", "false"); });
    btn.classList.add("selected");
    btn.setAttribute("aria-pressed", "true");
    syncWa();
    /* Étape 2 : se déplie quand un type est choisi */
    const step2 = document.querySelector("#pj-step2");
    if (step2 && !step2.classList.contains("open")) {
      step2.classList.add("open");
      step2.setAttribute("aria-hidden", "false");
      setTimeout(() => step2.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" }), 120);
    }
  }
  cards.forEach((b) => b.addEventListener("click", () => pick(cards, b)));
  pills.forEach((b) => b.addEventListener("click", () => pick(pills, b)));

  function selectionText() {
    const k = langKey(), en = document.documentElement.lang === "en";
    const t = document.querySelector(".pj-card.selected");
    const d = document.querySelector(".pj-pill.selected");
    const parts = [];
    if (t) parts.push(t.dataset[k]);
    if (d) parts.push((en ? "timeline: " : "délai : ") + d.dataset[k]);
    return parts.join(" — ");
  }
  function syncWa() {
    if (!wa) return;
    const txt = selectionText();
    const base = "https://wa.me/2250161506296";
    wa.href = txt
      ? base + "?text=" + encodeURIComponent((document.documentElement.lang === "en" ? "Hello, I have a project: " : "Bonjour, j'ai un projet : ") + txt)
      : base;
  }
  if (go) go.addEventListener("click", () => {
    const t = document.querySelector(".pj-card.selected");
    const grid = document.querySelector(".pj-grid");
    if (!t) {
      if (grid && !reduced) { grid.classList.remove("nudge"); void grid.offsetWidth; grid.classList.add("nudge"); }
      return;
    }
    const en = document.documentElement.lang === "en";
    const input = document.querySelector('#contact-form input[name="subject"]');
    if (input) input.value = (en ? "Project: " : "Projet : ") + selectionText();
    const contact = document.querySelector("#contact");
    if (contact) contact.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    setTimeout(() => document.querySelector('#contact-form textarea')?.focus({ preventScroll: true }), 900);
  });
  document.querySelectorAll(".lang button").forEach((b) =>
    b.addEventListener("click", () => setTimeout(syncWa, 120)));
  syncWa();
})();

/* ============================================================
   VITRINE PROJETS (accueil) : un projet par vue, tourne-page
   ============================================================ */
(() => {
  "use strict";
  const sc = document.querySelector("#proj-showcase");
  if (!sc) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const track = sc.querySelector(".sc-track");
  const slides = [...track.children];
  const dots = [...sc.querySelectorAll(".sc-dot")];
  const prev = sc.querySelector("#sc-prev");
  const next = sc.querySelector("#sc-next");
  const count = sc.querySelector("#sc-i");
  const n = slides.length;
  let i = 0, timer = null;

  function go(k, dir) {
    const ni = (k + n) % n;
    dir = dir || (ni > i || (i === n - 1 && ni === 0) ? 1 : -1);
    i = ni;
    track.style.transform = "translateX(-" + i * 100 + "%)";
    dots.forEach((d, j) => {
      d.classList.toggle("active", j === i);
      d.setAttribute("aria-selected", j === i ? "true" : "false");
    });
    if (count) count.textContent = String(i + 1).padStart(2, "0");
    slides.forEach((s, j) => {
      const on = j === i;
      s.classList.toggle("active", on);
      s.setAttribute("aria-hidden", on ? "false" : "true");
      if ("inert" in s) s.inert = !on;
      const link = s.querySelector(".sc-link");
      if (link) link.tabIndex = on ? 0 : -1;
    });
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function auto() { stop(); if (!reduced) timer = setInterval(() => go(i + 1, 1), 7000); }

  prev.addEventListener("click", () => { go(i - 1, -1); auto(); });
  next.addEventListener("click", () => { go(i + 1, 1); auto(); });
  dots.forEach((d, j) => d.addEventListener("click", () => { go(j); auto(); }));
  sc.addEventListener("pointerenter", stop);
  sc.addEventListener("pointerleave", auto);
  sc.addEventListener("focusin", stop);
  sc.addEventListener("focusout", auto);
  sc.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { go(i - 1, -1); auto(); }
    if (e.key === "ArrowRight") { go(i + 1, 1); auto(); }
  });
  let tx = null;
  sc.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  sc.addEventListener("touchend", (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    tx = null; auto();
  }, { passive: true });

  go(0, 1); auto();
})();

/* ============================================================
   MANIFESTE : les mots s'illuminent au fil du scroll
   ============================================================ */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = document.querySelector("[data-manifesto]");
  if (!el) return;
  function split() {
    const src = el.textContent.replace(/\s+/g, " ").trim();
    el.setAttribute("aria-label", src);
    el.innerHTML = "";
    src.split(" ").forEach((w) => {
      if (!w) return;
      const s = document.createElement("span");
      s.className = "w"; s.textContent = w; s.setAttribute("aria-hidden", "true");
      el.appendChild(s);
      el.appendChild(document.createTextNode(" "));
    });
    if (reduced) el.querySelectorAll(".w").forEach((w) => w.classList.add("lit"));
  }
  split();
  document.querySelectorAll(".lang button").forEach((b) =>
    b.addEventListener("click", () => setTimeout(split, 160)));
  if (reduced) return;
  let tick = false;
  function onScroll() {
    tick = false;
    const r = el.getBoundingClientRect();
    const total = r.height + innerHeight;
    const progress = Math.min(1, Math.max(0, (innerHeight - r.top) / total));
    const ws = el.querySelectorAll(".w"), n = ws.length;
    for (let i = 0; i < n; i++) ws[i].classList.toggle("lit", progress * (n + 3) - 1.5 > i);
  }
  addEventListener("scroll", () => {
    if (!tick) { tick = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
})();
