(function () {
  'use strict';

  /* ============================================================
     NAVIGATION — Single Page Router
     ============================================================ */
  const allSections = ['home', 'about', 'mandate', 'achievements', 'news', 'support', 'contact'];

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

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.nav === id);
    });

    // Close mobile menu
    const nav = document.getElementById('main-nav');
    const ham = document.getElementById('hamburger');
    if (nav) nav.classList.remove('open');
    if (ham) { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Section-specific init
    if (id === 'home') initCounters();
    if (id === 'achievements') initTabs();
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
     GLOBAL CLICK DELEGATION — nav links
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
      const step = 16;
      const steps = Math.ceil(duration / step);
      let current = 0;
      const inc = target / steps;
      const timer = setInterval(() => {
        current += inc;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = formatNum(Math.floor(current));
      }, step);
    });
  }

  function formatNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M+';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K+';
    return n.toString();
  }

  /* ============================================================
     ACHIEVEMENTS TABS
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
     SUPPORT FORM
     ============================================================ */
  const supportForm = document.getElementById('support-form');
  if (supportForm) {
    supportForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('s-name').value.trim();
      const email = document.getElementById('s-email').value.trim();
      const phone = document.getElementById('s-phone').value.trim();
      if (!name || !email || !phone) { alert('Please fill in all required fields.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address.'); return; }
      document.getElementById('support-success').classList.remove('hidden');
      supportForm.reset();
    });
  }

  /* ============================================================
     CONTACT FORM
     ============================================================ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('c-name').value.trim();
      const email = document.getElementById('c-email').value.trim();
      const msg = document.getElementById('c-message').value.trim();
      if (!name || !email || !msg) { alert('Please fill in all required fields.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address.'); return; }
      document.getElementById('contact-success').classList.remove('hidden');
      contactForm.reset();
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
