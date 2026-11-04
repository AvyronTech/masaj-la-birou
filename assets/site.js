const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('sidebar-scrim');
const exploreToggle = document.getElementById('explore-toggle');
const exploreMenu = document.getElementById('explore-menu');

function closeMenu() {
  sidebar.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Deschide meniul');
  scrim.hidden = true;
  document.body.style.overflow = '';
}
menuToggle.addEventListener('click', () => {
  const open = !sidebar.classList.contains('is-open');
  sidebar.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
  scrim.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) sidebar.querySelector('nav a').focus();
});
scrim.addEventListener('click', closeMenu);
sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
exploreToggle.addEventListener('click', () => {
  exploreMenu.hidden = !exploreMenu.hidden;
  exploreToggle.setAttribute('aria-expanded', String(!exploreMenu.hidden));
});
document.addEventListener('click', event => {
  if (!event.target.closest('.explore-wrap')) {
    exploreMenu.hidden = true;
    exploreToggle.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (sidebar.classList.contains('is-open')) { closeMenu(); menuToggle.focus(); }
    if (!exploreMenu.hidden) { exploreMenu.hidden = true; exploreToggle.setAttribute('aria-expanded', 'false'); exploreToggle.focus(); }
  }
});
const desktopQuery = window.matchMedia('(min-width: 901px)');
const closeOnDesktop = event => { if (event.matches) closeMenu(); };
if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', closeOnDesktop);
else desktopQuery.addListener(closeOnDesktop);

const topbar = document.querySelector('.topbar');
const floatingActions = document.querySelector('.float-actions');
let scrollFrame = 0;
function updateFloatingControls() {
  scrollFrame = 0;
  const compact = window.scrollY > 72;
  topbar.classList.toggle('is-compact', compact);
  floatingActions.classList.toggle('is-compact', compact);
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFloatingControls);
}, { passive: true });
window.addEventListener('pageshow', updateFloatingControls);
updateFloatingControls();

const siteToast = document.getElementById('site-toast');
let toastTimer;
document.querySelectorAll('[data-coming-soon]').forEach(button => {
  button.addEventListener('click', () => {
    siteToast.textContent = button.dataset.comingSoon;
    siteToast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { siteToast.hidden = true; }, 4500);
    if (sidebar.contains(button)) {
      closeMenu();
      menuToggle.focus();
    } else if (exploreMenu.contains(button)) {
      exploreMenu.hidden = true;
      exploreToggle.setAttribute('aria-expanded', 'false');
      exploreToggle.focus();
    }
  });
});
