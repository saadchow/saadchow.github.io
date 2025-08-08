function toggleTheme() {
  const body = document.body;
  const header = document.querySelector('header');
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  if (header) header.style.background = newTheme === 'dark' ? 'rgba(18, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  localStorage.setItem('theme', newTheme);
  body.style.transition = 'all 0.3s ease';
  setTimeout(() => { body.style.transition = ''; }, 300);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.body.setAttribute('data-theme', theme);
  const header = document.querySelector('header');
  if (header) header.style.background = theme === 'dark' ? 'rgba(18, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)';
}

document.addEventListener('DOMContentLoaded', function() {
  loadTheme();

  const contactButtons = document.querySelectorAll('a[href="#contact-section"]');
  contactButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSection = document.querySelector('#contact-section');
      if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-10px) scale(1.02)'; });
    item.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0) scale(1)'; });
  });

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(item => {
    item.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-10px)'; });
    item.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0)'; });
  });

  const animatedElements = document.querySelectorAll('.skill-item, .education, .contact-container, .project-card');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });

  const buttons = document.querySelectorAll('.contact-button, .theme-toggle');
  buttons.forEach(button => { button.addEventListener('click', createRipple); });
});

window.addEventListener('scroll', function() {
  const educationSection = document.getElementById('education-section');
  const scrollDownText = document.querySelector('.scroll-down-container');
  if (educationSection && scrollDownText) {
    const distanceToBottom = educationSection.getBoundingClientRect().bottom;
    scrollDownText.style.display = distanceToBottom <= window.innerHeight ? 'none' : 'block';
  }
});

const yearElement = document.getElementById('year');
if (yearElement) {
  const currentYear = new Date().getFullYear();
  yearElement.textContent = currentYear;
}

function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add('ripple');
  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) ripple.remove();
  button.appendChild(circle);
}

function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  (function type() { if (i < text.length) { element.innerHTML += text.charAt(i++); setTimeout(type, speed); } })();
}

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; } });
}, observerOptions);

const style = document.createElement('style');
style.textContent = `
  .ripple{position:absolute;border-radius:50%;transform:scale(0);animation:ripple 600ms linear;background-color:rgba(255,255,255,0.7)}
  @keyframes ripple{to{transform:scale(4);opacity:0}}
  .contact-button,.theme-toggle{position:relative;overflow:hidden}
`;
document.head.appendChild(style);

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.project-card, .skill-item, .education, .contact-container')
    .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; el.style.transition = 'none'; });
}
