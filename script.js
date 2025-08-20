function toggleTheme() {
  const body = document.body;
  const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
function loadTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
}
document.addEventListener('DOMContentLoaded', loadTheme);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href="#contact-section"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const tgt = document.querySelector('#contact-section');
      if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  let io = null;
  let listenersBound = false;

  const groups = [
    { root: '.landing-content', sel: '.landing-text h1, .landing-text h2 span, .icons a, .landing-image img', delay: 70 },
    { root: '.bio-container', sel: '.profile-section, .intro-text, .location, .bio-text', delay: 80 },
    { root: '.skills-container', sel: '.skill-item', delay: 55 },
    { root: '.projects-container', sel: '.project-card', delay: 65 },
    { root: '.education-page', sel: '.education-description h2, .education > *', delay: 75 },
    { root: '.contact-page', sel: '.contact-description h2, .contact-text, .contact-container .contact-item', delay: 75 },
  ];

  function orderByRows(els) {
    return els.slice().sort((a, b) => {
      const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
      const atop = ar.top + window.scrollY, btop = br.top + window.scrollY;
      if (atop !== btop) return atop - btop;
      return ar.left - br.left;
    });
  }

  function buildObserver() {
    if (io) io.disconnect();
    io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          markVisible(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.06, rootMargin: '15% 0px -8% 0px' });
  }

  function resetReveal() {
    document.body.classList.remove('reveal-ready');
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('is-visible');
      el.style.removeProperty('--reveal-delay');
    });
    if (io) io.disconnect();
  }

  function prepare() {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const all = [];
    groups.forEach(g => {
      const root = document.querySelector(g.root);
      if (!root) return;
      const items = Array.from(root.querySelectorAll(g.sel));
      if (!items.length) return;
      orderByRows(items).forEach((el, i) => {
        el.classList.add('reveal');
        const base = isCoarse ? Math.max(40, g.delay - 15) : g.delay;
        el.style.setProperty('--reveal-delay', `${i * base}ms`);
        all.push(el);
      });
    });

    const vh = window.innerHeight || document.documentElement.clientHeight;
    all.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) markVisible(el);
    });

    document.body.classList.add('reveal-ready');

    all.filter(el => !el.classList.contains('is-visible')).forEach(el => io.observe(el));
  }

  function markVisible(el) {
    el.classList.add('is-visible');
    el.style.removeProperty('--reveal-delay');
  }

  let ticking = false;
  function earlyReveal() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const margin = Math.max(120, vh * 0.15);
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < vh + margin && r.bottom > -margin) {
          markVisible(el);
          if (io) io.unobserve(el);
        }
      });
      ticking = false;
    });
  }

  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
        if (io) {
          io.unobserve(el);
          io.observe(el);
        }
      });
      earlyReveal();
    }, 120);
  }

  function bindImageFallbacks() {
    document.querySelectorAll('.projects-container img').forEach(img => {
      if (img.complete) return;
      img.addEventListener('load', () => {
        const card = img.closest('.project-card');
        if (!card) return;
        const r = card.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (r.top < vh * 1.2) markVisible(card);
      }, { once: true });
    });
  }

  function bindListenersOnce() {
    if (listenersBound) return;
    window.addEventListener('scroll', earlyReveal, { passive: true });
    window.addEventListener('touchmove', earlyReveal, { passive: true });
    window.addEventListener('resize', onResize);
    listenersBound = true;
  }

  function initReveal() {
    resetReveal();
    buildObserver();
    prepare();
    bindImageFallbacks();
    bindListenersOnce();
    earlyReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  window.addEventListener('pageshow', e => {
    if (e.persisted) initReveal();
  });

  const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (nav && nav.type === 'back_forward') setTimeout(initReveal, 0);

  try {
    if (!sessionStorage.getItem('session-refresh-done')) {
      sessionStorage.setItem('session-refresh-done', '1');
    }
  } catch (_) {}
})();

