(function () {
  const D = window.PHD;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- language (shared with the home page through localStorage) ---------- */
  let lang = "es";
  try {
    lang = localStorage.getItem("lang") || ((navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en");
  } catch (e) { /* storage unavailable */ }

  const t = (key, ...args) => {
    const v = (window.I18N[lang] || {})[key];
    return typeof v === "function" ? v(...args) : (v ?? key);
  };
  const L = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.es : v);

  // "2026-10" -> "octubre de 2026" / "October 2026"; "2026" stays as is
  const when = (d) => {
    const [y, m] = String(d).split("-");
    if (!m) return y;
    const month = t("phd.months")[+m - 1];
    return lang === "es" ? `${month} de ${y}` : `${month} ${y}`;
  };

  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    const btn = $("#langToggle");
    btn.textContent = t("lang.other");
    btn.lang = t("lang.otherCode");
  }

  /* ---------- hero ---------- */
  function renderHero() {
    $("#phdAcronym").textContent = D.project.acronym;
    $("#phdTitle").textContent = L(D.project.title);
    $("#phdLede").textContent = L(D.project.lede);
    const [a, b] = D.status.range;
    $("#statusValue").textContent = `${a}–${b} %`;
    const bar = $("#statusBar");
    bar.style.setProperty("--from", a + "%");
    bar.style.setProperty("--to", b + "%");
    bar.setAttribute("aria-label", t("phd.rangeLabel", a, b));
    $("#statusText").textContent = L(D.status.text);
    $("#statusUpdated").textContent = t("phd.updated", when(D.updated.slice(0, 7)));
    $("#facts").innerHTML = D.facts.map((f) => `<div><dt>${esc(L(f.label))}</dt><dd>${esc(L(f.value))}</dd></div>`).join("");
  }

  /* ---------- project ---------- */
  function renderProject() {
    $("#why").innerHTML = D.why.map((w) => `<article class="card"><h3>${esc(L(w.title))}</h3><p>${esc(L(w.text))}</p></article>`).join("");
    $("#flow").innerHTML = D.pipeline.map((s) => `<li class="flow__step">
        <h3>${esc(L(s.title))}</h3>
        <ul>${L(s.items).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </li>`).join("");
    $("#objectives").innerHTML = D.objectives.map((o) => `<li>${esc(L(o))}</li>`).join("");
    $("#dataFigures").innerHTML = D.data.map((d) => `<div class="figure">
        <span class="figure__value">${esc(d.value)}</span>
        <span class="figure__label">${esc(L(d.label))}</span>
        <p>${esc(L(d.text))}</p>
      </div>`).join("");
  }

  /* ---------- results ---------- */
  function renderResults() {
    $("#resultCards").innerHTML = D.results.map((r) => {
      const src = r.doi
        ? `<a href="https://doi.org/${esc(r.doi)}" target="_blank" rel="noopener">${esc(L(r.source))}</a>`
        : esc(L(r.source));
      return `<article class="result">
        <p class="result__metric"><span>${esc(r.metric)}</span> <small>${esc(L(r.unit))}</small></p>
        <h3>${esc(L(r.title))}</h3>
        <p>${esc(L(r.text))}</p>
        <p class="result__src">${src}</p>
      </article>`;
    }).join("");
  }

  /* ---------- plan ---------- */
  function renderPlan() {
    $("#packages").innerHTML = D.packages.map((p) => {
      const [a, b] = p.done;
      return `<li class="pkg">
        <div class="item__top"><span class="item__title"><span class="pkg__id">${esc(p.id)}</span> ${esc(L(p.title))}</span><span class="item__when">${a}–${b} %</span></div>
        <div class="bar bar--thin" role="img" aria-label="${esc(t("phd.rangeLabel", a, b))}" style="--from:${a}%;--to:${b}%"><span class="bar__done"></span><span class="bar__range"></span></div>
      </li>`;
    }).join("");
    $("#log").innerHTML = D.log.map((e) => `<li>
        <div class="item__top"><span class="item__title">${esc(L(e.title))}</span><span class="item__when">${esc(when(e.date))}</span></div>
        ${e.text ? `<p class="item__text">${esc(L(e.text))}</p>` : ""}
      </li>`).join("");
    $("#next").innerHTML = D.next.map((n) => `<li class="item__text">${esc(L(n))}</li>`).join("");
  }

  /* ---------- outputs ---------- */
  const STATUSES = ["all", ...new Set(D.outputs.map((o) => o.status))];
  let outStatus = "all";
  function renderOutputs() {
    $("#outFilter").innerHTML = STATUSES.map((s) =>
      `<button type="button" role="radio" aria-checked="${s === outStatus}" data-status="${s}">${esc(t("phd.st." + s))}</button>`).join("");
    $("#outList").innerHTML = D.outputs.filter((o) => outStatus === "all" || o.status === outStatus).map((o) => `<li>
        <div class="item__top"><span class="item__title">${esc(o.title)}</span><span class="item__when">${o.year}</span></div>
        <div class="out__meta"><span class="chip chip--${o.status}">${esc(t("phd.st." + o.status))}</span><span>${esc(L(o.venue))}</span>${o.doi ? `<a href="https://doi.org/${esc(o.doi)}" target="_blank" rel="noopener">DOI</a>` : ""}</div>
      </li>`).join("");
  }
  $("#outFilter").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    outStatus = b.dataset.status;
    renderOutputs();
    $(`#outFilter [data-status="${outStatus}"]`).focus();
  });

  /* ---------- glossary ---------- */
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  let glossQ = "";
  function renderGlossary() {
    const q = norm(glossQ.trim());
    const items = D.glossary.filter((g) => !q || norm(L(g.term) + " " + L(g.def)).includes(q));
    $("#glossList").innerHTML = items.map((g) => `<details class="gloss__item"${q ? " open" : ""}>
        <summary><svg class="chev" viewBox="0 0 14 14" aria-hidden="true"><path d="M5 2.5 9.5 7 5 11.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${esc(L(g.term))}</summary>
        <p>${esc(L(g.def))}</p>
      </details>`).join("");
    $("#glossEmpty").hidden = items.length > 0;
  }
  $("#glossSearch").addEventListener("input", (e) => { glossQ = e.target.value; renderGlossary(); });

  function renderAll() {
    applyStatic();
    renderHero();
    renderProject();
    renderResults();
    renderPlan();
    renderOutputs();
    renderGlossary();
  }

  $("#langToggle").addEventListener("click", () => {
    lang = lang === "es" ? "en" : "es";
    try { localStorage.setItem("lang", lang); } catch (e) {}
    renderAll();
  });

  /* ---------- navigation ---------- */
  const nav = $("#nav"), links = $("#navLinks"), menu = $("#menuToggle");
  const closeMenu = () => { links.classList.remove("is-open"); menu.setAttribute("aria-expanded", "false"); };
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 4);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  menu.addEventListener("click", () => {
    const open = !links.classList.contains("is-open");
    links.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && links.classList.contains("is-open")) { closeMenu(); menu.focus(); } });

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      $$("#navLinks a").forEach((a) => {
        a.getAttribute("href") === "#" + en.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["top", "project", "results", "plan", "outputs", "glossary"].forEach((id) => spy.observe(document.getElementById(id)));

  /* ---------- motion ---------- */
  const calm = matchMedia("(prefers-reduced-motion: reduce)");
  const revealables = $$(".reveal, .stagger");
  if (!("IntersectionObserver" in window) || calm.matches) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    document.documentElement.classList.add("js");          // content stays visible if this script never runs
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach((el) => io.observe(el));
  }

  $("#year").textContent = new Date().getFullYear();
  renderAll();
})();
