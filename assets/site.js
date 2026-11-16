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
let compactControls = false;
function updateCompactControls() {
  scrollFrame = 0;
  const nextCompact = compactControls ? window.scrollY > 40 : window.scrollY > 120;
  if (nextCompact === compactControls) return;
  compactControls = nextCompact;
  topbar.classList.toggle('is-compact', nextCompact);
  floatingActions.classList.toggle('is-compact', nextCompact);
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateCompactControls);
}, { passive: true });
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    closeMenu();
  }
  updateCompactControls();
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
const privacyBanner = document.getElementById('privacy-banner');
const privacyDismiss = document.getElementById('privacy-dismiss');
const privacyReopen = document.getElementById('privacy-reopen');
const privacyPreferenceKey = 'benvora-privacy-notice-v1';
let privacyNoticeDismissed = false;
let privacyOpenedFromFooter = false;
try { privacyNoticeDismissed = localStorage.getItem(privacyPreferenceKey) === 'acknowledged'; } catch { /* Private browsing can block storage. */ }
if (!privacyNoticeDismissed) privacyBanner.hidden = false;
privacyDismiss.addEventListener('click', () => {
  privacyBanner.hidden = true;
  try { localStorage.setItem(privacyPreferenceKey, 'acknowledged'); } catch { /* Keep this visit usable without storage. */ }
  if (privacyOpenedFromFooter) privacyReopen.focus({ preventScroll: true });
  privacyOpenedFromFooter = false;
});
privacyReopen.addEventListener('click', () => {
  privacyOpenedFromFooter = true;
  privacyBanner.hidden = false;
  privacyBanner.querySelector('summary').focus({ preventScroll: true });
});
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

const massageCarousel = document.querySelector('[data-carousel]');
if (massageCarousel) {
  const carouselCards = [...massageCarousel.querySelectorAll('.massage-card')];
  const carouselPrevious = document.querySelector('[data-carousel-prev]');
  const carouselNext = document.querySelector('[data-carousel-next]');
  const carouselControls = carouselPrevious?.closest('.carousel-controls');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let carouselFrame = 0;
  const updateCarouselControls = () => {
    carouselFrame = 0;
    const hasOverflow = massageCarousel.scrollWidth > massageCarousel.clientWidth + 2;
    if (carouselControls) carouselControls.hidden = !hasOverflow;
    if (carouselPrevious) carouselPrevious.disabled = !hasOverflow || massageCarousel.scrollLeft <= 2;
    if (carouselNext) carouselNext.disabled = !hasOverflow || massageCarousel.scrollLeft + massageCarousel.clientWidth >= massageCarousel.scrollWidth - 2;
  };
  const scheduleCarouselUpdate = () => {
    if (!carouselFrame) carouselFrame = requestAnimationFrame(updateCarouselControls);
  };
  const moveCarousel = direction => {
    const firstCard = carouselCards[0];
    if (!firstCard) return;
    const styles = getComputedStyle(massageCarousel);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    massageCarousel.scrollBy({
      left: direction * (firstCard.getBoundingClientRect().width + gap),
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });
  };
  carouselPrevious?.addEventListener('click', () => moveCarousel(-1));
  carouselNext?.addEventListener('click', () => moveCarousel(1));
  massageCarousel.addEventListener('scroll', scheduleCarouselUpdate, { passive: true });
  massageCarousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveCarousel(event.key === 'ArrowRight' ? 1 : -1);
  });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleCarouselUpdate).observe(massageCarousel);
  else window.addEventListener('resize', scheduleCarouselUpdate, { passive: true });
  scheduleCarouselUpdate();
}
