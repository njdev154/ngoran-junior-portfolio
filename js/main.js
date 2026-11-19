/* ============================================================
   Portfolio N'Goran Junior
   Curseur contextuel · filtres · bilingue FR/EN ·
   formulaire · horloge · interactions de projets
   ============================================================ */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Sélection au clavier ---------- */
  document.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "a") return;
    const target = event.target;
    const isTextInput = target instanceof HTMLInputElement &&
      ["text", "search", "email", "url", "tel", "password", "number"].includes(target.type);
    const isTextArea = target instanceof HTMLTextAreaElement;
    const isEditable = target instanceof HTMLElement &&
      (target.isContentEditable || target.getAttribute("role") === "textbox");
    if (!isTextInput && !isTextArea && !isEditable) event.preventDefault();
  });

  /* ---------- 1. Intro de première visite ---------- */
  const intro = document.querySelector(".intro");
  if (intro instanceof HTMLDialogElement) {
    const introKey = "nj-portfolio-intro-seen-v4";
    let seen = false;
    try { seen = localStorage.getItem(introKey) === "1"; }
    catch (error) { console.warn("Impossible de lire la préférence de l'intro.", error); }

    if (!reduced && !seen && typeof intro.showModal === "function") {
      try { localStorage.setItem(introKey, "1"); }
      catch (error) { console.warn("Impossible de mémoriser l'intro.", error); }
      intro.classList.add("is-entering");
      intro.showModal();
      const finishIntro = () => { if (intro.open) intro.close(); };
      intro.addEventListener("animationend", (event) => {
        if (event.target === intro) finishIntro();
      });
      window.setTimeout(() => intro.classList.add("is-leaving"), 3850);
      window.setTimeout(finishIntro, 4500);
    } else {
      intro.remove();
    }
  } else if (intro) {
    intro.remove();
  }

  /* ---------- 2. Curseur contextuel ---------- */
  const cursor = document.querySelector(".cursor");
  if (cursor && finePointer && !reduced) {
    let ring = cursor.querySelector(".cursor-ring");
    let dot = cursor.querySelector(".cursor-dot");
    let label = cursor.querySelector(".cursor-label");
    if (!label) {
      label = document.createElement("span");
      label.className = "cursor-label";
      cursor.appendChild(label);
    }
    if (!ring) {
      ring = document.createElement("span");
      ring.className = "cursor-ring";
      cursor.insertBefore(ring, label);
    }
    if (!dot) {
      dot = document.createElement("span");
      dot.className = "cursor-dot";
      cursor.insertBefore(dot, label);
    }
    let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0, positioned = false;
    const followPointer = () => {
      frame = 0;
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (Math.abs(targetX - x) > 0.2 || Math.abs(targetY - y) > 0.2) {
        frame = requestAnimationFrame(followPointer);
      }
    };
    addEventListener("pointermove", (e) => {
      document.body.classList.add("cursor-on");
      cursor.classList.remove("is-out");
      targetX = e.clientX; targetY = e.clientY;
      if (!positioned) {
        x = targetX; y = targetY; positioned = true;
        cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      } else if (!frame) {
        frame = requestAnimationFrame(followPointer);
      }
      const t = e.target instanceof Element ? e.target : null;
      const zone = t?.closest("[data-cursor]");
      const link = t?.closest("a,button");
      const field = t?.closest("input,textarea,select,[contenteditable='true']");
      cursor.classList.toggle("is-field", !!field);
      cursor.classList.toggle("is-link", !!link && !zone && !field);
      cursor.classList.toggle("is-choice", !!zone && !field);
      if (zone && !field) {
        label.textContent = document.documentElement.lang === "en"
          ? zone.dataset.cursorEn || "OPEN"
          : zone.dataset.cursor || "VOIR";
      }
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => {
      cursor.classList.add("is-out");
      document.body.classList.remove("cursor-on");
    });
  }

  /* ---------- 3. Boutons magnétiques ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll("[data-magnet]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = Math.max(-6, Math.min(6, (e.clientX - (r.left + r.width / 2)) * 0.12));
        const dy = Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) * 0.12));
        el.style.setProperty("--magnet-x", `${dx}px`);
        el.style.setProperty("--magnet-y", `${dy}px`);
      });
      el.addEventListener("pointerleave", () => {
        el.style.removeProperty("--magnet-x");
        el.style.removeProperty("--magnet-y");
      });
    });
  }

  /* ---------- 4. Mouvement discret du portrait ---------- */
  const portrait = document.querySelector(".portrait .ph");
  if (portrait && finePointer && !reduced) {
    portrait.addEventListener("pointermove", (event) => {
      const bounds = portrait.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      portrait.style.setProperty("--photo-tilt-x", `${-y * 5}deg`);
      portrait.style.setProperty("--photo-tilt-y", `${x * 5}deg`);
      portrait.style.setProperty("--photo-pan-x", `${-x * 8}px`);
      portrait.style.setProperty("--photo-pan-y", `${-y * 8}px`);
      portrait.style.setProperty("--photo-lift", "-3px");
    }, { passive: true });
    portrait.addEventListener("pointerleave", () => {
      portrait.style.removeProperty("--photo-tilt-x");
      portrait.style.removeProperty("--photo-tilt-y");
      portrait.style.removeProperty("--photo-pan-x");
      portrait.style.removeProperty("--photo-pan-y");
      portrait.style.removeProperty("--photo-lift");
    });
  }

  /* ---------- 5. Révélations au défilement ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window) {
    document.documentElement.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealItems.forEach((element) => revealObserver.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add("in"));
  }

  /* ---------- 6. Compteurs animés ---------- */
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
        if (show && !reduced) { c.style.animation = "none"; void c.offsetWidth; c.style.animation = "cardIn .6s var(--ease)"; }
      });
    }));
    const st = document.createElement("style");
    st.textContent = "@keyframes cardIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}";
    document.head.appendChild(st);
  }

  /* ---------- 7. Menu mobile ---------- */
  const burger = document.querySelector(".burger"), menu = document.querySelector(".menu");
  if (burger && menu) {
    const closeMenu = () => {
      burger.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
    };
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("open")) closeMenu();
    });
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
        setTimeout(() => { location.href = href; }, 600);
      });
    });
  }

  /* ---------- 9. Bilingue FR / EN ---------- */
  window.PF_COMMON_EN = Object.assign({
    "skip": "Skip to content",
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

  /* Vague des titres : le libellé complet reste disponible aux lecteurs d'écran. */
  if (finePointer && !reduced) {
    function initTitleWaves() {
      document.querySelectorAll("main h1, main h2, main h3").forEach((heading) => {
        heading.classList.add("titre-vague");
        heading.querySelectorAll(".titre-vague__lettre").forEach((letter) =>
          letter.replaceWith(document.createTextNode(letter.textContent || "")));

        const labelContent = heading.cloneNode(true);
        labelContent.querySelectorAll("[aria-hidden='true']").forEach((element) => element.remove());
        const label = labelContent.textContent.replace(/\s+/g, " ").trim();
        if (!label) return;
        if (!heading.hasAttribute("aria-label") || heading.dataset.titreVagueLabel) {
          heading.setAttribute("aria-label", label);
          heading.dataset.titreVagueLabel = "true";
        }

        let index = 0;
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (node.nodeValue.trim() && !node.parentElement?.closest("svg,[aria-hidden='true']")) {
            textNodes.push(node);
          }
        }
        textNodes.forEach((node) => {
          const fragment = document.createDocumentFragment();
          (node.nodeValue.match(/\s+|[^\s]+/gu) || []).forEach((part) => {
            if (/^\s+$/u.test(part)) {
              fragment.appendChild(document.createTextNode(part));
              return;
            }
            const word = document.createElement("span");
            word.className = "titre-vague__mot";
            Array.from(part).forEach((character) => {
              const letter = document.createElement("span");
              letter.className = "titre-vague__lettre";
              letter.setAttribute("aria-hidden", "true");
              letter.style.setProperty("--titre-index", String(index++));
              letter.textContent = character;
              word.appendChild(letter);
            });
            fragment.appendChild(word);
          });
          node.replaceWith(fragment);
        });
      });
    }

    initTitleWaves();
    document.querySelectorAll(".lang button").forEach((button) =>
      button.addEventListener("click", () => requestAnimationFrame(initTitleWaves)));
  }

  /* ---------- 10. Formulaires de contact (Formspree) ---------- */
  document.querySelectorAll("#contact-form, #pj-contact-form").forEach((form) => {
    const msg = form.querySelector(".form-msg, .pj-form-msg");
    const statusClass = form.id === "pj-contact-form" ? "pj-form-msg" : "form-msg";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (msg) { msg.textContent = "…"; msg.className = statusClass; }
      const btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("send failed");
        if (msg) {
          msg.textContent = form.id === "pj-contact-form"
            ? (document.documentElement.lang === "en" ? DICT["pj.formSuccess"] : "Demande envoyée. Je vous réponds bientôt.")
            : msg.dataset.ok || "Message envoyé. Je vous réponds vite.";
          msg.classList.add("ok");
        }
        form.reset();
      } catch (err) {
        if (msg) {
          msg.textContent = form.id === "pj-contact-form"
            ? (document.documentElement.lang === "en" ? DICT["pj.formError"] : "La demande n'a pas pu être envoyée. Contactez-moi par WhatsApp ou e-mail.")
            : msg.dataset.ko || "Échec de l'envoi. Écrivez-moi directement par email.";
          msg.classList.add("err");
        }
      } finally { if (btn) btn.disabled = false; }
    });
  });

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

  /* Parcours de prise de contact : besoin, fonctions, délai, coordonnées */
  const wizard = document.querySelector("#pj-wizard");
  if (!wizard) return;
  const cards = [...wizard.querySelectorAll(".pj-card[data-type]")];
  const modules = [...wizard.querySelectorAll(".pj-module")];
  const pills = [...wizard.querySelectorAll(".pj-pill[data-delay]")];
  const panels = [...wizard.querySelectorAll("[data-pj-step]")];
  const progressItems = [...wizard.querySelectorAll(".pj-progress li")];
  const wa = wizard.querySelector("#pj-wa");
  const requestForm = wizard.querySelector("#pj-contact-form");
  const isEnglish = () => document.documentElement.lang === "en";
  const labelOf = (button) => button?.dataset[isEnglish() ? "labelEn" : "labelFr"] || "";
  const selectedType = () => cards.find((button) => button.classList.contains("selected"));
  const selectedDelay = () => pills.find((button) => button.classList.contains("selected"));
  const selectedModules = () => modules.filter((button) => button.classList.contains("selected"));
  let currentStep = 0;

  function selection() {
    return {
      type: labelOf(selectedType()),
      modules: selectedModules().map(labelOf),
      delay: labelOf(selectedDelay())
    };
  }

  function updateSummary() {
    const data = selection();
    const undecided = isEnglish() ? "To be discussed" : "À préciser ensemble";
    const summaryType = wizard.querySelector("#pj-summary-type");
    const summaryModules = wizard.querySelector("#pj-summary-modules");
    const summaryDelay = wizard.querySelector("#pj-summary-delay");
    if (summaryType) summaryType.textContent = data.type;
    if (summaryModules) summaryModules.textContent = data.modules.length ? data.modules.join(", ") : undecided;
    if (summaryDelay) summaryDelay.textContent = data.delay;
    if (requestForm) {
      const features = data.modules.length ? data.modules.join(", ") : undecided;
      const subject = requestForm.querySelector("#pj-subject");
      const typeField = requestForm.querySelector("#pj-type-field");
      const featuresField = requestForm.querySelector("#pj-features-field");
      const timelineField = requestForm.querySelector("#pj-timeline-field");
      if (subject) subject.value = (isEnglish() ? "Project request: " : "Demande de projet : ") + data.type;
      if (typeField) typeField.value = data.type;
      if (featuresField) featuresField.value = features;
      if (timelineField) timelineField.value = data.delay;
    }
  }

  function updateWhatsApp() {
    if (!wa) return;
    const data = selection();
    const en = isEnglish();
    const parts = [];
    if (data.type) parts.push((en ? "Type: " : "Type : ") + data.type);
    if (data.modules.length) parts.push((en ? "Functions: " : "Fonctions : ") + data.modules.join(", "));
    if (data.delay) parts.push((en ? "Preferred timeline: " : "Délai souhaité : ") + data.delay);
    const introText = en ? "Hello, I would like to discuss a web project." : "Bonjour N'Goran, j'aimerais discuter d'un projet web.";
    wa.href = "https://wa.me/2250161506296?text=" + encodeURIComponent([introText, ...parts].join("\n"));
  }

  function showStep(step) {
    if (step < 0 || step >= panels.length) return;
    currentStep = step;
    panels.forEach((panel, index) => { panel.hidden = index !== step; });
    progressItems.forEach((item, index) => {
      item.classList.toggle("active", index === step);
      item.classList.toggle("complete", index < step);
      if (index === step) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    if (step === 3) updateSummary();
    updateWhatsApp();
    const heading = panels[step].querySelector(".pj-stepname");
    heading?.focus({ preventScroll: true });
    panels[step].scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    const live = wizard.querySelector("#pj-live");
    if (live) live.textContent = isEnglish() ? `Step ${step + 1} of 4` : `Étape ${step + 1} sur 4`;
  }

  cards.forEach((button) => button.addEventListener("click", () => {
    const changed = selectedType()?.dataset.type !== button.dataset.type;
    cards.forEach((card) => {
      const selected = card === button;
      card.classList.toggle("selected", selected);
      card.setAttribute("aria-pressed", String(selected));
    });
    if (changed) {
      modules.forEach((module) => {
        module.classList.remove("selected");
        module.setAttribute("aria-pressed", "false");
      });
    }
    wizard.querySelectorAll(".pj-module-set").forEach((set) => {
      set.hidden = set.dataset.moduleSet !== button.dataset.type;
    });
    const next = wizard.querySelector("#pj-next-type");
    if (next) next.disabled = false;
    updateWhatsApp();
  }));
  modules.forEach((button) => button.addEventListener("click", () => {
    const selected = button.classList.toggle("selected");
    button.setAttribute("aria-pressed", String(selected));
    updateWhatsApp();
  }));
  pills.forEach((button) => button.addEventListener("click", () => {
    pills.forEach((pill) => {
      const selected = pill === button;
      pill.classList.toggle("selected", selected);
      pill.setAttribute("aria-pressed", String(selected));
    });
    const next = wizard.querySelector("#pj-next-delay");
    if (next) next.disabled = false;
    updateWhatsApp();
  }));

  wizard.querySelector("#pj-next-type")?.addEventListener("click", () => showStep(1));
  wizard.querySelector('[data-pj-next="2"]')?.addEventListener("click", () => showStep(2));
  wizard.querySelector("#pj-next-delay")?.addEventListener("click", () => showStep(3));
  wizard.querySelectorAll("[data-pj-back]").forEach((button) =>
    button.addEventListener("click", () => showStep(Number(button.dataset.pjBack))));

  document.querySelectorAll(".lang button").forEach((button) => {
    button.addEventListener("click", () => window.setTimeout(() => {
      updateSummary();
      updateWhatsApp();
      const live = wizard.querySelector("#pj-live");
      if (live) live.textContent = isEnglish() ? `Step ${currentStep + 1} of 4` : `Étape ${currentStep + 1} sur 4`;
    }, 120));
  });
  updateWhatsApp();
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
  const viewport = sc.querySelector(".sc-viewport");
  const n = slides.length;
  let i = 0, timer = null;
  const fitActiveSlide = () => {
    if (slides[i]) viewport.style.height = `${slides[i].offsetHeight}px`;
  };
  if ("ResizeObserver" in window) {
    const slideObserver = new ResizeObserver(fitActiveSlide);
    slides.forEach((slide) => slideObserver.observe(slide));
  }

  function go(k, dir) {
    const ni = (k + n) % n;
    dir = dir || (ni > i || (i === n - 1 && ni === 0) ? 1 : -1);
    i = ni;
    track.style.transform = "translateX(-" + i * 100 + "%)";
    fitActiveSlide();
    dots.forEach((d, j) => {
      d.classList.toggle("active", j === i);
      d.setAttribute("aria-selected", j === i ? "true" : "false");
      d.tabIndex = j === i ? 0 : -1;
    });
    if (count) count.textContent = String(i + 1).padStart(2, "0");
    slides.forEach((s, j) => {
      const on = j === i;
      s.classList.toggle("active", on);
      s.setAttribute("aria-hidden", on ? "false" : "true");
      if ("inert" in s) s.inert = !on;
      const link = s.querySelector(".sc-link");
      if (link) link.tabIndex = on ? 0 : -1;
      const image = s.querySelector("img");
      if (on && image) image.loading = "eager";
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
  let swipeStart = null, suppressClick = false;
  viewport.addEventListener("pointerdown", (e) => {
    if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    swipeStart = { x: e.clientX, y: e.clientY, id: e.pointerId };
    stop();
  });
  addEventListener("pointerup", (e) => {
    if (!swipeStart || e.pointerId !== swipeStart.id) return;
    const dx = e.clientX - swipeStart.x;
    const dy = e.clientY - swipeStart.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      go(i + (dx < 0 ? 1 : -1));
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 400);
    }
    swipeStart = null;
    auto();
  });
  addEventListener("pointercancel", () => {
    swipeStart = null;
    auto();
  });
  sc.addEventListener("click", (e) => {
    if (!suppressClick) return;
    e.preventDefault();
    e.stopPropagation();
    suppressClick = false;
  }, true);
  viewport.addEventListener("dragstart", (e) => e.preventDefault());

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
