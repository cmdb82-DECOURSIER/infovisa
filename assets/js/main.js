/* InfoVisa.lu — main.js
   - Mobile menu toggle
   - Cookie consent (RGPD)
   - Cost calculator
   - Footer year
*/
(function () {
  'use strict';

  // === Mobile menu ===
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // === Footer year ===
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  // === Cookie consent (RGPD-friendly placeholder) ===
  // Note: real AdSense compliance needs a CMP (e.g. Funding Choices). This is a basic banner.
  const COOKIE_KEY = 'infovisa_consent_v1';
  const banner = document.querySelector('.cookie-banner');
  if (banner) {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      // Slight delay so it doesn't block first paint
      setTimeout(() => banner.classList.add('show'), 600);
    }
    const acceptBtn = banner.querySelector('[data-cookie="accept"]');
    const rejectBtn = banner.querySelector('[data-cookie="reject"]');
    if (acceptBtn) acceptBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'accept');
      banner.classList.remove('show');
      // Trigger AdSense personalization (placeholder)
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        try { window.adsbygoogle.requestNonPersonalizedAds = 0; } catch (e) {}
      }
    });
    if (rejectBtn) rejectBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'reject');
      banner.classList.remove('show');
      // Tell AdSense to serve non-personalized ads
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        try { window.adsbygoogle.requestNonPersonalizedAds = 1; } catch (e) {}
      }
    });
  }

  // === Cost calculator ===
  const calc = document.querySelector('.calc');
  if (calc) {
    const ageSel = calc.querySelector('[data-calc="age"]');
    const typeSel = calc.querySelector('[data-calc="type"]');
    const provSel = calc.querySelector('[data-calc="provider"]');
    const insSel = calc.querySelector('[data-calc="insurance"]');
    const out = calc.querySelector('[data-calc="out"]');
    const date = new Date();
    // Fee schedule: pre-2026-06-11 = €80, after = €90
    const cutOff = new Date('2026-06-11T00:00:00Z');
    function compute() {
      const age = ageSel.value; // adult | child6_12 | child_under6
      const type = typeSel.value; // C | D | A
      const provider = provSel.value; // none | vfs | tls | bls
      const insurance = insSel.value === 'yes' ? 35 : 0;
      let consular = 0;
      if (type === 'C' || type === 'A') {
        if (age === 'adult') consular = (date >= cutOff ? 90 : 80);
        else if (age === 'child6_12') consular = (date >= cutOff ? 45 : 40);
        else consular = 0;
      } else if (type === 'D') {
        // Long-stay D: highly variable, typical range 75–150€. We show 99 as illustrative average.
        consular = 99;
      }
      let provFee = 0;
      if (provider === 'vfs') provFee = 40;
      else if (provider === 'tls') provFee = 38;
      else if (provider === 'bls') provFee = 35;
      const total = consular + provFee + insurance;
      if (out) {
        out.querySelector('[data-out="consular"]').textContent = consular + ' €';
        out.querySelector('[data-out="provider"]').textContent = provFee + ' €';
        out.querySelector('[data-out="insurance"]').textContent = insurance + ' €';
        out.querySelector('[data-out="total"]').textContent  = total + ' €';
      }
    }
    [ageSel, typeSel, provSel, insSel].forEach(el => el && el.addEventListener('change', compute));
    compute('change', compute));
    compute();
  }

  // === FAQ search ===
  const faqSearch = document.querySelector('[data-faq-search]');
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.faq details').forEach(d => {
        const txt = d.textContent.toLowerCase();
        d.style.display = (!q || txt.includes(q)) ? '' : 'none';
      });
    });
  }
})();
