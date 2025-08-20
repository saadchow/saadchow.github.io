function toggleTheme() {
  const body = document.body;
  const header = document.querySelector('header');
  const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  if (header) {
    header.style.background =
      next === 'dark' ? 'rgba(18, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  }
  localStorage.setItem('theme', next);
}

function loadTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.body.setAttribute('data-theme', theme);
  const header = document.querySelector('header');
  if (header) {
    header.style.background =
      theme === 'dark' ? 'rgba(18, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  }
}

const STAGGER_MAP = [
  ['.landing-page', [
    '.landing-text h1', '.landing-text h2', '.icons a', '.landing-image img'
  ]],
  ['.bio-page', [
    '.profile-photo', '.description h3', '.intro-text', '.location', '.bio-text'
  ]],
  ['.tools-page', [
    '.tools-description h2', '.skills-text', '.skills-text-1', '.skills-container .skill-item'
  ]],
  ['.projects-page', [
    '.projects-description h2', '.projects-container .project-card'
  ]],
  ['.education-page', [
    '.education-description h2', '.education'
  ]],
  ['.contact-page', [
    '.contact-description h2', '.contact-text', '.contact-container'
  ]]
];

function prepareReveals() {
  STAGGER_MAP.forEach(([sectionSel, itemSels]) => {
    const section = document.querySelector(sectionSel);
    if (!section) return;
    let i = 0;
    itemSels.forEach(sel => {
      section.querySelectorAll(sel).forEach(el => {
        el.setAttribute('data-reveal', '');
        el.style.setProperty('--stagger', i++);
      });
    });
  });
}

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });


function wireSmoothContactScroll() {
  document.querySelectorAll('a[href="#contact-section"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#contact-section');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function wireScrollDownHelper() {
  const educationSection = document.getElementById('education-section');
  const hint = document.querySelector('.scroll-down-container');
  if (!educationSection || !hint) return;
  window.addEventListener('scroll', () => {
    const dist = educationSection.getBoundingClientRect().bottom;
    hint.style.display = dist <= window.innerHeight ? 'none' : 'block';
  });
}

function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  setYear();
  wireSmoothContactScroll();
  wireScrollDownHelper();

prepareReveals();
  document.querySelectorAll('.section').forEach(s => revealObserver.observe(s));

  /* If user prefers reduced motion, reveal everything immediately */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  }
});
