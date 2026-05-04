/* InfoVisa.lu — site.js
   Interactivités globales : thème, recherche, carte du monde, panneau pays,
   bandeau cookies, calculateur, header sticky.
*/
(() => {
  'use strict';

  /* ============ THEME (light/dark/auto) ============ */
  const THEME_KEY = 'infovisa_theme_v1';
  function applyTheme(theme) {
    if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }
  const stored = localStorage.getItem(THEME_KEY) || 'auto';
  applyTheme(stored);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const cur = localStorage.getItem(THEME_KEY) || 'auto';
    const next = cur === 'auto' ? 'light' : cur === 'light' ? 'dark' : 'auto';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    btn.setAttribute('aria-label', `Thème: ${next}`);
  });

  /* ============ HEADER SCROLL EFFECT ============ */
  const header = document.querySelector('.site-header');
  if (header) {
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 12);
      last = y;
    }, { passive: true });
  }

  /* ============ MOBILE MENU ============ */
  const menuBtn = document.querySelector('.menu-btn');
  const navMain = document.querySelector('.nav-main');
  if (menuBtn && navMain) {
    menuBtn.addEventListener('click', () => {
      const open = navMain.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
    });
  }

  /* ============ FOOTER YEAR ============ */
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ============ COOKIE BANNER ============ */
  const COOKIE_KEY = 'infovisa_consent_v2';
  const banner = document.querySelector('.cookie-banner');
  if (banner) {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setTimeout(() => banner.classList.add('show'), 800);
    banner.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      localStorage.setItem(COOKIE_KEY, btn.dataset.cookie);
      banner.classList.remove('show');
    });
  }

  /* ============ GLOBAL SEARCH ============ */
  const searchInputs = document.querySelectorAll('.search-box input');
  searchInputs.forEach(inp => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && inp.value.trim()) {
        e.preventDefault();
        const q = encodeURIComponent(inp.value.trim());
        // Simple Google site search until we ship local search
        window.location.href = `https://www.google.com/search?q=site%3Ainfovisa.lu+${q}`;
      }
    });
  });
  // Cmd/Ctrl+K to focus first search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      const inp = document.querySelector('.search-box input');
      if (inp) { e.preventDefault(); inp.focus(); inp.select(); }
    }
  });

  /* ============ MAP FILTERS ============ */
  // Used in conjunction with WorldMap class (see map.js)
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip || !window.__worldMap) return;
    const filter = chip.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c === chip));
    window.__worldMap.applyFilter(filter);
  });

  /* ============ COUNTRY PANEL CLOSE ============ */
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-panel-close]')) {
      const panel = document.querySelector('.country-panel');
      if (panel) panel.classList.remove('open');
    }
  });
  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const panel = document.querySelector('.country-panel.open');
      if (panel) panel.classList.remove('open');
    }
  });

})();
