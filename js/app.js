(function () {
  const C = window.CONTENT;
  const PUBS = window.PUBLICATIONS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- language ---------- */
  let lang = "es";
  try {
    lang = localStorage.getItem("lang") || ((navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en");
  } catch (e) { /* storage unavailable */ }

  const t = (key, ...args) => {
    const v = (window.I18N[lang] || {})[key];
    return typeof v === "function" ? v(...args) : (v ?? key);
  };
  const L = (v) => (v && typeof v === "object" ? v[lang] ?? v.es : v);

  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$("[data-i18n-alt]").forEach((el) => { el.alt = t(el.dataset.i18nAlt); });
    $$("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    const btn = $("#langToggle");
    btn.textContent = t("lang.other");
    btn.lang = t("lang.otherCode");
  }

  function renderAll() {
    applyStatic();
    renderProfiles();
    renderAbout();
    renderExperience();
    renderTypeFilter();
    renderPubs();
    renderTalks();
  }

  $("#langToggle").addEventListener("click", () => {
    lang = lang === "es" ? "en" : "es";
    try { localStorage.setItem("lang", lang); } catch (e) {}
    renderAll();
  });

  /* ---------- feedback ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2200);
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (_) {}
      ta.remove();
    }
    toast(msg);
  }

  /* ---------- profiles ---------- */
  function renderProfiles() {
    const p = C.profiles;
    const html = [["ORCID", p.orcid], ["Google Scholar", p.scholar], ["ResearchGate", p.researchgate], ["LinkedIn", p.linkedin], ["GitHub", p.github]]
      .map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noopener">${label}</a></li>`).join("");
    $("#heroProfiles").innerHTML = html;
    $("#contactProfiles").innerHTML = html;
    $("#mailLink").href = "mailto:" + p.email;
    $("#mailLink").textContent = p.email;
  }
  $("#copyMail").addEventListener("click", () => copy(C.profiles.email, t("toast.mail")));

  /* ---------- about ---------- */
  function renderAbout() {
    $("#skills").innerHTML = C.skills.map((s) => `<div><dt>${esc(L(s.group))}</dt><dd>${esc(L(s.items))}</dd></div>`).join("");
    $("#areas").innerHTML = C.areas.map((a) => `<li><h4>${esc(L(a.title))}</h4><p>${esc(L(a.text))}</p></li>`).join("");
  }

  /* ---------- experience ---------- */
  const WORK_SHOW = 5;
  let workOpen = false;
  const span = (e) => e.end === null ? `${e.start}–${t("exp.now")}` : e.start === e.end ? `${e.start}` : `${e.start}–${e.end}`;
  const item = (e, hidden) => `<li${hidden ? " hidden" : ""}>
      <div class="item__top"><span class="item__title">${esc(L(e.role))}</span><span class="item__when">${span(e)}</span></div>
      <div class="item__org">${esc(e.org)}</div>
      ${e.text ? `<p class="item__text">${esc(L(e.text))}</p>` : ""}
    </li>`;
  function renderExperience() {
    $("#workList").innerHTML = C.experience.map((e, i) => item(e, !workOpen && i >= WORK_SHOW)).join("");
    $("#eduList").innerHTML = C.education.map((e) => item(e, false)).join("");
    $("#courseList").innerHTML = C.courses.map((c) => `<li>
      <div class="item__top"><span class="item__title">${esc(c.title)}</span><span class="item__when">${c.year}</span></div>
      <div class="item__org">${esc(c.org)}</div></li>`).join("");
    const more = $("#workMore");
    more.hidden = C.experience.length <= WORK_SHOW;
    more.textContent = workOpen ? t("exp.less") : t("exp.more", C.experience.length - WORK_SHOW);
    more.setAttribute("aria-expanded", String(workOpen));
  }
  $("#workMore").addEventListener("click", () => { workOpen = !workOpen; renderExperience(); });

  /* ---------- publications ---------- */
  const state = { q: "", type: "all", first: false, open: new Set(), authorsOpen: new Set() };
  const TYPES = ["all", "article", "conference", "chapter", "preprint"];
  const YEARS = [...new Set(PUBS.map((p) => p.year))].sort((a, b) => b - a);
  state.open.add(YEARS[0]);                                  // most recent year starts expanded
  const totalCites = PUBS.reduce((s, p) => s + (p.cites || 0), 0);

  function renderTypeFilter() {
    $("#pubsSummary").textContent = t("pubs.summary", PUBS.length, totalCites);
    $("#typeFilter").innerHTML = TYPES.map((k) => `<button type="button" role="radio" aria-checked="${state.type === k}" tabindex="${state.type === k ? 0 : -1}" data-type="${k}">${t("type." + k)}</button>`).join("");
  }
  $("#typeFilter").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    state.type = b.dataset.type;
    renderTypeFilter(); renderPubs();
    $(`#typeFilter [data-type="${state.type}"]`).focus();
  });
  $("#typeFilter").addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const i = TYPES.indexOf(state.type) + (e.key === "ArrowRight" ? 1 : -1);
    state.type = TYPES[(i + TYPES.length) % TYPES.length];
    renderTypeFilter(); renderPubs();
    $(`#typeFilter [data-type="${state.type}"]`).focus();
  });

  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const fullName = (a) => `${a[0]} ${a[1]}`.trim();
  const isMe = (a) => /alzate|álzate/i.test(a[1]);
  const filtering = () => Boolean(state.q.trim() || state.type !== "all" || state.first);

  function matches(p) {
    const q = norm(state.q.trim());
    return (state.type === "all" || p.type === state.type) && (!state.first || p.first) &&
      (!q || norm([p.title, p.venue, p.authors.map(fullName).join(" "), p.doi || ""].join(" ")).includes(q));
  }

  const AUTH_SHOW = 6;
  function authorsHTML(p, idx) {
    const names = p.authors.map((a) => (isMe(a) ? `<strong>${esc(fullName(a))}</strong>` : esc(fullName(a))));
    const extra = names.length - AUTH_SHOW;
    if (extra <= 1) return names.join(", ");
    if (state.authorsOpen.has(idx)) return names.join(", ") + ` <button type="button" data-authors="${idx}" aria-expanded="true">${t("pub.less")}</button>`;
    const meIdx = p.authors.findIndex(isMe);
    let shown = names.slice(0, AUTH_SHOW);
    if (meIdx >= AUTH_SHOW) shown = names.slice(0, AUTH_SHOW - 1).concat("…", names[meIdx]);
    return shown.join(", ") + ` <button type="button" data-authors="${idx}" aria-expanded="false">${t("pub.more", extra)}</button>`;
  }
  function venueHTML(p) {
    let s = `<i>${esc(p.venue)}</i>`;
    if (p.volume) s += `, ${esc(p.volume)}`;
    if (p.issue) s += `(${esc(p.issue)})`;
    if (p.pages) s += `, ${esc(p.pages)}`;
    return s;
  }
  function pubHTML(p) {
    const idx = PUBS.indexOf(p);
    const url = p.doi ? `https://doi.org/${p.doi}` : null;
    const meta = [
      p.note ? esc(L(p.note)) : "",
      p.cites ? t("pub.cites", p.cites) : "",
      url ? `<a class="link" href="${url}" target="_blank" rel="noopener">DOI</a>` : "",
      `<button class="link" type="button" data-cite="${idx}">${t("pub.copy")}</button>`,
      `<button class="link" type="button" data-bib="${idx}">${t("pub.bib")}</button>`
    ].filter(Boolean).map((x) => x.startsWith("<") ? x : `<span>${x}</span>`).join("");
    return `<li class="pub" id="pub-${idx}">
      <h4 class="pub__title">${url ? `<a href="${url}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)}</h4>
      <p class="pub__authors">${authorsHTML(p, idx)}</p>
      <p class="pub__venue">${venueHTML(p)}</p>
      <div class="pub__meta">${meta}</div>
    </li>`;
  }

  const chevron = '<svg class="chev" viewBox="0 0 14 14" aria-hidden="true"><path d="M5 2.5 9.5 7 5 11.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderPubs() {
    const list = PUBS.filter(matches);
    const auto = filtering();                               // while filtering, every year with results is open
    $("#pubYears").innerHTML = YEARS.map((y) => {
      const items = list.filter((p) => p.year === y).sort((a, b) => b.cites - a.cites);
      if (!items.length) return "";
      const open = auto || state.open.has(y);
      return `<section class="year" aria-labelledby="yh-${y}">
        <h3><button class="year__head" id="yh-${y}" type="button" aria-expanded="${open}" aria-controls="yb-${y}" data-year="${y}">
          ${chevron}<span class="year__label">${y}</span><span class="year__count">${t("pubs.yearCount", items.length)}</span>
        </button></h3>
        <ol class="year__body" id="yb-${y}"${open ? "" : " hidden"}>${items.map(pubHTML).join("")}</ol>
      </section>`;
    }).join("");
    $("#pubEmpty").hidden = list.length > 0;
    $("#pubCount").textContent = t("pubs.count", list.length, PUBS.length);
    const allOpen = auto || YEARS.every((y) => state.open.has(y));
    const ex = $("#expandAll");
    ex.hidden = auto || !list.length;
    ex.textContent = allOpen ? t("pubs.collapse") : t("pubs.expand");
  }

  $("#pubYears").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.year) {
      if (filtering()) return;
      const y = +b.dataset.year;
      state.open.has(y) ? state.open.delete(y) : state.open.add(y);
      const open = state.open.has(y);
      b.setAttribute("aria-expanded", String(open));
      const body = $("#yb-" + y);
      body.hidden = !open;
      if (open) { body.classList.add("is-opening"); setTimeout(() => body.classList.remove("is-opening"), 700); }
      const allOpen = YEARS.every((x) => state.open.has(x));
      $("#expandAll").textContent = allOpen ? t("pubs.collapse") : t("pubs.expand");
    } else if (b.dataset.authors) {
      const i = +b.dataset.authors;
      state.authorsOpen.has(i) ? state.authorsOpen.delete(i) : state.authorsOpen.add(i);
      const li = $("#pub-" + i);
      $(".pub__authors", li).innerHTML = authorsHTML(PUBS[i], i);
      $(".pub__authors button", li)?.focus();
    } else if (b.dataset.cite) copy(apa(PUBS[+b.dataset.cite]), t("toast.cite"));
    else if (b.dataset.bib) copy(bibtex(PUBS[+b.dataset.bib]), t("toast.bib"));
  });
  $("#expandAll").addEventListener("click", () => {
    const allOpen = YEARS.every((y) => state.open.has(y));
    state.open = allOpen ? new Set() : new Set(YEARS);
    renderPubs();
  });

  let searchTimer;
  $("#pubSearch").addEventListener("input", (e) => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { state.q = e.target.value; renderPubs(); }, 120); });
  $("#firstOnly").addEventListener("change", (e) => { state.first = e.target.checked; renderPubs(); });
  $("#exportBib").addEventListener("click", () => {
    const blob = new Blob([PUBS.map(bibtex).join("\n\n") + "\n"], { type: "application/x-bibtex" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "alzate-grisales.bib";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(t("toast.bibfile"));
  });

  /* citation formats */
  const initials = (g) => /\./.test(g) ? g : g.split(/\s+/).filter(Boolean).map((w) => w.split("-").map((x) => x[0].toUpperCase() + ".").join("-")).join(" ");
  function apa(p) {
    const a = p.authors.map((x) => `${x[1]}, ${initials(x[0])}`);
    const names = a.length > 20 ? a.slice(0, 19).join(", ") + ", … " + a[a.length - 1] : a.length > 1 ? a.slice(0, -1).join(", ") + ", & " + a[a.length - 1] : a[0];
    let s = `${names} (${p.year}). ${p.title}. ${p.venue}`;
    if (p.volume) s += `, ${p.volume}`;
    if (p.issue) s += `(${p.issue})`;
    if (p.pages) s += `, ${p.pages}`;
    s += ".";
    if (p.doi) s += ` https://doi.org/${p.doi}`;
    return s;
  }
  function bibtex(p) {
    const word = p.title.split(/\s+/).find((w) => w.length > 3) || "";
    const key = (p.authors[0][1].split(/[\s-]/)[0] + p.year + word).normalize("NFD").replace(/[^\w]/g, "").toLowerCase();
    const type = { article: "article", conference: "inproceedings", chapter: "incollection", preprint: "misc" }[p.type];
    const venueField = { article: "journal", conference: "booktitle", chapter: "booktitle", preprint: "howpublished" }[p.type];
    const f = [
      ["title", `{${p.title}}`], ["author", p.authors.map((x) => `${x[1]}, ${x[0]}`).join(" and ")],
      [venueField, p.venue], ["year", p.year], ["volume", p.volume], ["number", p.issue],
      ["pages", p.pages && String(p.pages).replace(/-/g, "--")], ["doi", p.doi], ["note", p.note && p.note.en]
    ].filter(([, v]) => v);
    return `@${type}{${key},\n` + f.map(([k, v]) => `  ${k} = {${v}}`).join(",\n") + "\n}";
  }

  /* ---------- talks & awards ---------- */
  const TALKS_SHOW = 5;
  let talksOpen = false;
  function renderTalks() {
    $("#talkList").innerHTML = C.talks.map((x, i) => `<li${!talksOpen && i >= TALKS_SHOW ? " hidden" : ""}>
      <div class="item__top"><span class="item__title">${esc(L(x.title))}</span><span class="item__when">${x.year}</span></div>
      <div class="item__org">${esc(L(x.event))}</div></li>`).join("");
    const more = $("#talksMore");
    more.hidden = C.talks.length <= TALKS_SHOW;
    more.textContent = talksOpen ? t("talks.less") : t("talks.more", C.talks.length - TALKS_SHOW);
    more.setAttribute("aria-expanded", String(talksOpen));
    $("#awardList").innerHTML = C.awards.map((x) => `<li>
      <div class="item__top"><span class="item__title">${esc(L(x.title))}</span><span class="item__when">${x.year}</span></div>
      <div class="item__org">${esc(L(x.text))}</div></li>`).join("");
  }
  $("#talksMore").addEventListener("click", () => { talksOpen = !talksOpen; renderTalks(); });

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

  const sections = ["top", "about", "experience", "publications", "talks", "contact"].map((id) => document.getElementById(id));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      $$("#navLinks a").forEach((a) => {
        a.getAttribute("href") === "#" + en.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));


  /* ---------- motion ---------- */
  const calm = matchMedia("(prefers-reduced-motion: reduce)");
  const revealables = $$(".reveal, .stagger");
  if (!("IntersectionObserver" in window) || calm.matches) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    document.documentElement.classList.add("js");          // content stays visible if this script never runs
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        // reveal on entry, and also anything already scrolled past (deep links, reloads mid-page)
        if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach((el) => io.observe(el));
  }

  const figure = $(".hero__figure");
  let ticking = false;
  function parallax() {
    const y = window.scrollY;
    if (!calm.matches && y < window.innerHeight) figure.style.setProperty("--py", (y * -0.06).toFixed(1) + "px");
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });
  parallax();

  $("#year").textContent = new Date().getFullYear();
  renderAll();
})();
