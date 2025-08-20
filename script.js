function toggleTheme(){
  const body = document.body;
  const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

function loadTheme(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.body.setAttribute('data-theme', theme);
}

function setYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function wireSmoothContactScroll(){
  document.querySelectorAll('a[href="#contact-section"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector('#contact-section');
      if (t) t.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });
}

/* Waterfall reveal */
const STAGGER_MAP = [
  ['.landing-page',   ['.landing-text h1', '.landing-text h2', '.icons a', '.landing-image img']],
  ['.bio-page',       ['.profile-photo', '.description h3', '.intro-text', '.location', '.bio-text']],
  ['.tools-page',     ['.tools-description h2', '.skills-text', '.skills-text-1', '.skills-container .skill-item']],
  ['.projects-page',  ['.projects-description h2', '.projects-container .project-card']],
  ['.education-page', ['.education-description h2', '.education']],
  ['.contact-page',   ['.contact-description h2', '.contact-text', '.contact-container']]
];

function prepareReveals(){
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
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.4, rootMargin: '-10% 0px -30% 0px' });

/* Optional: ripple on buttons */
function createRipple(event){
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add('ripple');
  const old = button.getElementsByClassName('ripple')[0];
  if (old) old.remove();
  button.appendChild(circle);
}

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  setYear();
  wireSmoothContactScroll();

  prepareReveals();
  document.querySelectorAll('.section').forEach(s => revealObserver.observe(s));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  }

  document.querySelectorAll('.contact-button, .theme-toggle').forEach(b => {
    b.addEventListener('click', createRipple);
  });

  const style = document.createElement('style');
  style.textContent = `
    .ripple{position:absolute;border-radius:50%;transform:scale(0);animation:ripple 600ms linear;background-color:rgba(255,255,255,.7)}
    @keyframes ripple{to{transform:scale(4);opacity:0}}
    .contact-button,.theme-toggle{position:relative;overflow:hidden}
  `;
  document.head.appendChild(style);
});
