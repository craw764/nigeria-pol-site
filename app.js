(function () {
  'use strict';

  /* ============================================================
     NAVIGATION — Single Page Router
     ============================================================ */
  const allSections = ['home', 'about', 'mandate', 'why-kene', 'news', 'donate', 'contact'];

  function showSection(id) {
    allSections.forEach(s => {
      const el = document.getElementById(s);
      if (!el) return;
      if (s === id) {
        el.classList.remove('hidden');
        el.classList.add('active');
      } else {
        el.classList.add('hidden');
        el.classList.remove('active');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.nav === id);
    });

    const nav = document.getElementById('main-nav');
    const ham = document.getElementById('hamburger');
    if (nav) nav.classList.remove('open');
    if (ham) { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id === 'home') initCounters();
    if (id === 'why-kene') initTabs();
  }

  /* ============================================================
     iOS SAFE CLICK DELEGATION
     ============================================================ */
  let _tx = 0, _ty = 0;
  document.addEventListener('touchstart', e => {
    _tx = e.touches[0].clientX;
    _ty = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const t = e.changedTouches[0];
    if (Math.abs(t.clientX - _tx) > 8 || Math.abs(t.clientY - _ty) > 8) return;
    const el = e.target;
    const tag = el.tagName.toLowerCase();
    if (['a', 'button', 'input', 'select', 'textarea', 'label'].includes(tag)) return;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }, { passive: true });

  /* ============================================================
     GLOBAL CLICK DELEGATION
     ============================================================ */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-nav]');
    if (!el) return;
    e.preventDefault();
    showSection(el.dataset.nav);
  });

  /* ============================================================
     HAMBURGER
     ============================================================ */
  const ham = document.getElementById('hamburger');
  if (ham) {
    ham.addEventListener('click', () => {
      const isOpen = ham.classList.toggle('open');
      document.getElementById('main-nav').classList.toggle('open', isOpen);
      ham.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ============================================================
     SCROLL — header shadow
     ============================================================ */
  window.addEventListener('scroll', () => {
    document.getElementById('site-header').classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  function initCounters() {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const steps = Math.ceil(duration / 16);
      let current = 0;
      const inc = target / steps;
      const timer = setInterval(() => {
        current += inc;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = formatNum(Math.floor(current));
      }, 16);
    });
  }

  function formatNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M+';
    if (n >= 1000) return n.toLocaleString();
    return n.toString();
  }

  /* ============================================================
     TABS (Why Kene section)
     ============================================================ */
  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tab = document.getElementById('tab-' + btn.dataset.tab);
        if (tab) tab.classList.add('active');
      });
    });
  }

  /* ============================================================
     SCROLL ANIMATIONS
     ============================================================ */
  function initAnimations() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));
  }

  /* ============================================================
     CONTACT FORM
     ============================================================ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('c-name').value.trim();
      const email = document.getElementById('c-email').value.trim();
      const msg   = document.getElementById('c-message').value.trim();
      if (!name || !email || !msg) { alert('Please fill in all required fields.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email.'); return; }
      document.getElementById('contact-success').classList.remove('hidden');
      contactForm.reset();
    });
  }

  /* ============================================================
     DONATE FORM
     ============================================================ */
  const donateForm = document.getElementById('donate-form-el');
  if (donateForm) {
    donateForm.addEventListener('submit', e => {
      e.preventDefault();
      const name   = document.getElementById('d-name').value.trim();
      const email  = document.getElementById('d-email').value.trim();
      const phone  = document.getElementById('d-phone').value.trim();
      const amount = document.getElementById('d-amount').value;
      if (!name || !email || !phone || !amount) { alert('Please fill in all required fields.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email.'); return; }
      document.getElementById('donate-success').classList.remove('hidden');
      donateForm.reset();
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    showSection('home');
    initAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
