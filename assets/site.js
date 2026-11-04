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
window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
