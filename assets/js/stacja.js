/* =========================================================================
   Program STACJA — skrypty interfejsu
   Wszystko działa z klawiatury i degraduje się bezpiecznie bez JS.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- Trwałe ustawienia (bezpieczne, gdy pamięć jest niedostępna) ---- */
  var KEY = "stacja-a11y";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { /* tryb prywatny — ustawienia działają do końca wizyty */ }
  }
  var state = load();

  /* ---- Komunikaty dla czytników ekranu ---- */
  var live = document.createElement("div");
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  live.className = "sr-only";
  document.body.appendChild(live);
  function announce(msg) { live.textContent = ""; setTimeout(function () { live.textContent = msg; }, 60); }

  /* ---- Zastosowanie ustawień ---- */
  var SIZES = { 1: "100%", 2: "125%", 3: "150%" };
  var SIZE_NAMES = { 1: "standardowy", 2: "powiększony", 3: "duży" };

  function apply() {
    document.documentElement.style.setProperty("--scale", (state.size === 2 ? 1.25 : state.size === 3 ? 1.5 : 1));
    document.body.classList.toggle("contrast", !!state.contrast);
    document.body.classList.toggle("no-motion", !!state.noMotion);
    document.body.classList.toggle("underline-links", !!state.underline);
    document.body.classList.toggle("etr", !!state.etr);
    sync();
  }

  function sync() {
    document.querySelectorAll("[data-a11y-size]").forEach(function (b) {
      b.setAttribute("aria-pressed", String((state.size || 1) === Number(b.dataset.a11ySize)));
    });
    [["contrast", "contrast"], ["noMotion", "motion"], ["underline", "underline"], ["etr", "etr"]]
      .forEach(function (pair) {
        document.querySelectorAll('[data-a11y="' + pair[1] + '"]').forEach(function (b) {
          b.setAttribute("aria-pressed", String(!!state[pair[0]]));
        });
      });
  }

  document.addEventListener("click", function (e) {
    if (!e.target || !e.target.closest) return;
    var sizeBtn = e.target.closest("[data-a11y-size]");
    if (sizeBtn) {
      state.size = Number(sizeBtn.dataset.a11ySize);
      save(state); apply();
      announce("Rozmiar tekstu: " + SIZE_NAMES[state.size] + ", " + SIZES[state.size] + ".");
      return;
    }
    var btn = e.target.closest("[data-a11y]");
    if (!btn) return;
    var what = btn.dataset.a11y;

    if (what === "contrast") {
      state.contrast = !state.contrast; save(state); apply();
      announce(state.contrast ? "Włączono tryb wysokiego kontrastu." : "Wyłączono tryb wysokiego kontrastu.");
    } else if (what === "motion") {
      state.noMotion = !state.noMotion; save(state); apply();
      announce(state.noMotion ? "Animacje wyłączone." : "Animacje włączone.");
    } else if (what === "underline") {
      state.underline = !state.underline; save(state); apply();
      announce(state.underline ? "Linki podkreślone." : "Podkreślenie linków wyłączone.");
    } else if (what === "etr") {
      state.etr = !state.etr; save(state); apply();
      announce(state.etr ? "Włączono tekst łatwy do czytania." : "Wrócono do wersji standardowej.");
    } else if (what === "reset") {
      state = {}; save(state); apply();
      announce("Przywrócono ustawienia domyślne.");
    }
  });

  apply();

  /* ---- Menu mobilne: Esc zamyka, focus nie ucieka poza panel ---- */
  var toggle = document.querySelector(".nav__toggle");
  var panel = document.getElementById("nav-panel");

  if (toggle && panel) {
    function isOpen() { return panel.classList.contains("open"); }

    function setOpen(open) {
      panel.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav__toggle-text").textContent = open ? "Zamknij" : "Menu";
      if (open) {
        var first = panel.querySelector("a, button");
        if (first) first.focus();
      }
    }

    toggle.addEventListener("click", function () { setOpen(!isOpen()); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { setOpen(false); toggle.focus(); }
      if (e.key !== "Tab" || !isOpen() || window.innerWidth > 900) return;

      var items = Array.prototype.slice.call(
        panel.querySelectorAll('a[href], button:not([disabled])')
      ).filter(function (el) { return el.offsetParent !== null; });
      items.unshift(toggle);
      if (!items.length) return;

      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Przy powrocie na desktop panel nie może zostać "zamknięty".
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  /* ---- Szybkie wyjście: przycisk lub trzykrotny Escape ---- */
  var exitBtn = document.querySelector(".exit");
  if (exitBtn) {
    var escCount = 0, escTimer = null;

    function leave() {
      // Podmienia bieżący wpis w historii, więc "wstecz" nie wraca na tę stronę.
      try { window.location.replace("https://www.google.pl/"); }
      catch (e) { window.location.href = "https://www.google.pl/"; }
    }

    exitBtn.addEventListener("click", leave);

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      escCount++;
      clearTimeout(escTimer);
      escTimer = setTimeout(function () { escCount = 0; }, 1200);
      if (escCount >= 3) leave();
    });
  }
})();
