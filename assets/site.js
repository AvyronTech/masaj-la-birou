const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');
const scrim = document.getElementById('sidebar-scrim');
const pageArea = document.querySelector('.page-area');

function closeMenu() {
  const wasOpen = sidebar.classList.contains('is-open');
  sidebar.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Deschide meniul');
  scrim.hidden = true;
  pageArea.inert = false;
  document.body.style.overflow = '';
  if (wasOpen) menuToggle.focus({ preventScroll: true });
}
menuToggle.addEventListener('click', () => {
  const open = !sidebar.classList.contains('is-open');
  sidebar.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
  scrim.hidden = !open;
  pageArea.inert = open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) sidebarClose.focus({ preventScroll: true });
});
sidebarClose.addEventListener('click', closeMenu);
scrim.addEventListener('click', closeMenu);
sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Tab' && sidebar.classList.contains('is-open')) {
    const focusable = [...sidebar.querySelectorAll('a, button')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  if (event.key === 'Escape') {
    if (sidebar.classList.contains('is-open')) closeMenu();
  }
});
const desktopQuery = window.matchMedia('(min-width: 901px)');
const closeOnDesktop = event => { if (event.matches) closeMenu(); };
if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', closeOnDesktop);
else desktopQuery.addListener(closeOnDesktop);

const topbar = document.querySelector('.topbar');
const floatingActions = document.querySelector('.float-actions');
const floatingClearZones = [...document.querySelectorAll('.hero, .page-hero, .social-section, .footer')];
let scrollFrame = 0;
function updateCompactControls() {
  scrollFrame = 0;
  const compact = window.scrollY > 72;
  topbar.classList.toggle('is-compact', compact);
  floatingActions.classList.toggle('is-compact', compact);
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateCompactControls);
}, { passive: true });
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    closeMenu();
    updateCompactControls();
  }
});

// IntersectionObserver does the visibility work without synchronous layout reads on scroll.
if ('IntersectionObserver' in window) {
  const observed = new Set();
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      observed.add(entry.target);
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    floatingActions.classList.toggle('is-context-hidden', visible.size > 0);
    if (observed.size === floatingClearZones.length) floatingActions.classList.add('is-ready');
  });
  floatingClearZones.forEach(element => observer.observe(element));
}

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
    }
  });
});

const contactForm = document.getElementById('contact-form');
if (contactForm) contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const values = new FormData(contactForm);
  const field = name => String(values.get(name) || '').trim();
  const lines = [
    'Bună ziua, Benvora Grup! Doresc o ofertă de masaj la birou.',
    `Companie: ${field('company')}`,
    `Persoană de contact: ${field('person')}`,
    `Telefon sau e-mail: ${field('reply')}`,
    `Participanți estimați: ${field('participants') || 'de stabilit'}`,
    `Program dorit: ${field('schedule') || 'de stabilit'}`,
  ];
  if (field('message')) lines.push(`Alte detalii: ${field('message')}`);
  window.location.href = `https://wa.me/${contactForm.dataset.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
});
