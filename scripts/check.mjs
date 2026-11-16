import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const SITE_URL = process.env.BENVORA_SITE_URL ?? 'https://benvora-grup.avyron.eu';
const PREVIEW_MODE = (process.env.BENVORA_RELEASE_MODE ?? 'preview') === 'preview';
const legalPages = ['/confidentialitate/', '/cookie-uri/', '/termeni-si-conditii/'];
const pages = ['/', '/masaj-la-birou/', '/beneficiu-pentru-echipa/', '/pentru-companii/', '/programari/', '/contact/', ...legalPages];
for (const path of pages) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  for (const item of ['<html lang="ro">', '<main id="main"', '<h1 ', 'rel="canonical"', 'name="description"', 'application/ld+json']) {
    if (!html.includes(item)) throw new Error(`${path}: missing ${item}`);
  }
  if (!html.includes(`rel="canonical" href="${SITE_URL}${path}"`)) throw new Error(`${path}: incorrect canonical`);
  if ([...html.matchAll(/<h1\b/g)].length !== 1) throw new Error(`${path}: expected exactly one h1`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`${path}: duplicate HTML id`);
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(match[0])) throw new Error(`${path}: image without alt`);
  }
  for (const match of html.matchAll(/\b(?:href|src)="(\/[^"?#]*)[^\"]*"/g)) {
    const target = match[1].startsWith('/assets/') ? `dist${match[1]}` : `dist${match[1]}index.html`;
    try { await stat(target); } catch { throw new Error(`${path}: broken local reference ${match[1]}`); }
  }
  for (const match of html.matchAll(/\/assets\/([a-z0-9.-]+)(?:\?v=([a-f0-9]{12}))?/gi)) {
    if (!match[2]) throw new Error(`${path}: unversioned asset ${match[1]}`);
    const bytes = await readFile(`dist/assets/${match[1]}`);
    const expected = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    if (match[2] !== expected) throw new Error(`${path}: stale asset hash ${match[1]}`);
  }
  const jsonLd = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
  if (!jsonLd) throw new Error(`${path}: missing JSON-LD contents`);
  JSON.parse(jsonLd);
  if (PREVIEW_MODE && !html.includes('name="robots" content="noindex,nofollow"')) throw new Error(`${path}: public preview must be noindex`);
  if (!PREVIEW_MODE && !legalPages.includes(path) && html.includes('name="robots" content="noindex')) throw new Error(`${path}: indexable page still has noindex`);
  if (html.includes('brand-intro') || html.includes('intro.js') || html.includes('intro-active')) throw new Error(`${path}: blocking intro must be removed`);
  if (!html.includes('Conectează-te / Înregistrează-te') || !html.includes('id="site-toast"')) throw new Error(`${path}: missing account announcement`);
  if (!html.includes('id="menu-toggle"') || !html.includes('role="dialog" aria-modal="true" aria-label="Meniu de navigare"')) throw new Error(`${path}: missing accessible overlay menu`);
  if (html.includes('id="explore-toggle"')) throw new Error(`${path}: duplicate navigation control remains`);
  const mainNav = html.match(/<nav aria-label="Navigația principală">([\s\S]*?)<\/nav>/)?.[1] ?? '';
  if (mainNav.includes('<span>01</span>') || mainNav.includes('<span>02</span>')) throw new Error(`${path}: numbered menu labels remain`);
  for (const legalPath of legalPages) {
    if (!html.includes(`href="${legalPath}"`)) throw new Error(`${path}: missing footer link to ${legalPath}`);
  }
  console.log(`OK ${path}`);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const legalPath of legalPages) {
  if (sitemap.includes(legalPath)) throw new Error(`${legalPath}: legal draft appears in sitemap`);
}
if (PREVIEW_MODE && sitemap.includes('<loc>')) throw new Error('Preview sitemap must not advertise noindex pages');
if (!PREVIEW_MODE && [...sitemap.matchAll(/<loc>/g)].length !== pages.length - legalPages.length) throw new Error('Release sitemap must list all indexable pages');
const home = await readFile('dist/index.html', 'utf8');
if (!home.includes('<main id="main" class="home-main"')) throw new Error('Home needs scoped landing-page spacing');
if (!home.includes('class="booking-teaser section-pad"') || !home.includes('href="/programari/">Deschide calendarul')) throw new Error('Home must link to the booking calendar');
if (!home.includes('class="team-benefit-teaser section-pad"') || !home.includes('href="/beneficiu-pentru-echipa/">Vezi tipurile de masaj')) throw new Error('Home must introduce the team-benefit page');
if (!home.includes('href="/contact/">Solicită ofertă') || !home.includes('class="topbar-cta" href="/contact/">Solicită ofertă')) throw new Error('Offer calls to action must use the same label');
if (!home.includes('class="about-teaser section-pad" id="despre-noi"') || !home.includes('href="/#despre-noi">Despre noi')) throw new Error('Home must contain and link its about section');
if (home.includes('href="/despre-noi/"')) throw new Error('Separate about page must be removed from navigation');
if (home.indexOf('class="about-teaser section-pad"') > home.indexOf('class="social-section section-pad"')) throw new Error('About introduction must precede social channels');
if (!/<source type="image\/webp" srcset="\/assets\/hero-480\.webp\?v=[a-f0-9]{12} 480w, \/assets\/hero-720\.webp\?v=[a-f0-9]{12} 720w, \/assets\/hero-800\.webp\?v=[a-f0-9]{12} 800w, \/assets\/hero-960\.webp\?v=[a-f0-9]{12} 960w, \/assets\/hero-1280\.webp\?v=[a-f0-9]{12} 1280w, \/assets\/hero\.webp\?v=[a-f0-9]{12} 1752w" sizes="\(min-width: 1800px\) 760px, \(min-width: 1141px\) 44vw, \(min-width: 1000px\) 820px, \(min-width: 901px\) 82vw, 88vw"/.test(home)) throw new Error('Hero must offer progressive sizes of the complete original photo');
if (!/<img src="\/assets\/hero\.webp\?v=[a-f0-9]{12}" width="1752" height="897"/.test(home)) throw new Error('Hero must retain the uncropped landscape source');
if (home.includes('/assets/hero-portrait')) throw new Error('Oversized portrait hero should not be shipped');
if (!/<img src="\/assets\/service-480\.webp\?v=[a-f0-9]{12}" srcset="\/assets\/service-480\.webp\?v=[a-f0-9]{12} 480w, \/assets\/service-720\.webp\?v=[a-f0-9]{12} 720w, \/assets\/service-800\.webp\?v=[a-f0-9]{12} 800w, \/assets\/service-960\.webp\?v=[a-f0-9]{12} 960w, \/assets\/service-1280\.webp\?v=[a-f0-9]{12} 1280w, \/assets\/service\.webp\?v=[a-f0-9]{12} 1752w" sizes="\(min-width: 1640px\) 784px, \(min-width: 1440px\) 48vw, \(min-width: 691px\) 49vw, 88vw"[^>]*loading="lazy" fetchpriority="low"/.test(home)) throw new Error('Service image should be progressively sized and lazy loaded');
if (!/<img src="\/assets\/brand-mark-96\.webp\?v=[a-f0-9]{12}" srcset="\/assets\/brand-mark-96\.webp\?v=[a-f0-9]{12} 96w, \/assets\/brand-mark-192\.webp\?v=[a-f0-9]{12} 192w, \/assets\/brand-mark-384\.webp\?v=[a-f0-9]{12} 384w" sizes="\(max-width: 420px\) 48px, 55px"/.test(home)) throw new Error('Footer logo should use its displayed dimensions');
if (home.includes('class="image-break"')) throw new Error('Repeated cropped image section remains');
for (const name of ['TikTok', 'Instagram', 'Facebook', 'LinkedIn']) {
  if (!home.includes(`Profilul Benvora Grup pe ${name} este în pregătire.`) && !home.includes(`aria-label="Benvora Grup pe ${name}"`)) throw new Error(`${name}: missing social channel`);
  if (!home.includes(`social-button--${name.toLowerCase()}`)) throw new Error(`${name}: missing distinct social card styling`);
}
const service = await readFile('dist/masaj-la-birou/index.html', 'utf8');
if (!service.includes('class="faq-list"')) throw new Error('Service page is missing practical questions');
const teamBenefit = await readFile('dist/beneficiu-pentru-echipa/index.html', 'utf8');
if ([...teamBenefit.matchAll(/class="massage-card"/g)].length !== 3) throw new Error('Team-benefit page must present exactly three massage types');
if (!teamBenefit.includes('data-carousel-prev') || !teamBenefit.includes('data-carousel-next') || !teamBenefit.includes('data-carousel tabindex="0"')) throw new Error('Massage carousel needs accessible controls');
if (!teamBenefit.includes('Modul recenzii · în pregătire') || !teamBenefit.includes('Prima recenzie aprobată va fi afișată aici.') || !teamBenefit.includes('fără testimoniale inventate')) throw new Error('Review section must remain a truthful visual preview');
const contact = await readFile('dist/contact/index.html', 'utf8');
if (!contact.includes('id="contact-form"') || !contact.includes('Continuă pe WhatsApp')) throw new Error('Contact page needs its guided WhatsApp action');
if (contact.includes('data-open-email') || contact.includes('data-email-domain=')) throw new Error('Contact page must not activate an unconfigured email action');
if ([...contact.matchAll(/class="email-address"/g)].length !== 2 || [...contact.matchAll(/class="visually-hidden">contact la masajlabirou punct ro/g)].length !== 2 || contact.includes('class="email-address" aria-label=') || contact.includes('contact@masajlabirou.ro') || !contact.includes('E-MAIL · ÎN CURS DE ACTIVARE')) throw new Error('Contact page must show only the accessible static pending contact address in content and footer');
for (const forbiddenAddress of ['office@masajlabirou.ro', 'programari@masajlabirou.ro', 'colaborari@masajlabirou.ro']) {
  if (contact.includes(forbiddenAddress)) throw new Error(`Contact page still includes ${forbiddenAddress}`);
}
if (!contact.includes('name="phone" type="tel"') || !contact.includes('name="email" type="email"') || !contact.includes('class="select-wrap"')) throw new Error('Offer form needs separate contact fields and a styled native selector');
if (!contact.includes('<main id="main" class="request-main"') || contact.indexOf('class="contact-form-section') > contact.indexOf('class="contact-grid"')) throw new Error('Offer form should appear before secondary contact details');
const booking = await readFile('dist/programari/index.html', 'utf8');
if (!booking.includes('id="booking-days"') || !booking.includes('id="booking-form"') || !booking.includes('name="slot"')) throw new Error('Booking page needs its calendar, interval selection and WhatsApp action');
if (booking.includes('data-open-email') || booking.includes('data-email-domain=') || !booking.includes('E-mail în curs de activare')) throw new Error('Booking page must not activate the pending email address');
if (!booking.includes('Ziua și intervalul sunt preferințe, nu locuri rezervate.')) throw new Error('Booking calendar must not imply confirmed availability');
if (!booking.includes('src="/assets/requests.js?v=') || !booking.includes('href="/assets/booking.css?v=')) throw new Error('Booking page needs its interactive assets');
const requestsScript = await readFile('dist/assets/requests.js', 'utf8');
if (!requestsScript.includes('button.tabIndex = -1;') || !requestsScript.includes('active.tabIndex = 0;')) throw new Error('Booking calendar must expose only one day in the keyboard tab order');
const privacy = await readFile('dist/confidentialitate/index.html', 'utf8');
if (!privacy.includes('Formularele de ofertă și programare pregătesc mesaje în browser')) throw new Error('Privacy page must describe both local forms');
if (!privacy.includes('BENVORA GRUP SRL') || !privacy.includes('class="email-address"') || privacy.includes('contact@masajlabirou.ro') || !privacy.includes('va putea primi mesaje numai după activarea domeniului')) throw new Error('Privacy page must accurately describe the pending contact address without activating it');
if (!home.includes('id="privacy-banner"') || !home.includes('id="privacy-dismiss"') || !home.includes('id="privacy-reopen"')) throw new Error('Privacy notice and reopen control must be present on all pages');
if (!home.includes('Nu activăm cookie-uri de analiză sau publicitate.') || home.includes('Accept toate')) throw new Error('Privacy notice must describe the current technical-only setup without false optional consent');
const redirects = await readFile('dist/_redirects', 'utf8');
if (!redirects.includes('/despre-noi/ / 301')) throw new Error('Former about URL must redirect to the combined home page');
const robots = await readFile('dist/robots.txt', 'utf8');
if (!robots.includes('User-agent: *\nAllow: /')) throw new Error('Crawlers must be able to see noindex directives and the final sitemap');
if (PREVIEW_MODE && robots.includes('Sitemap:')) throw new Error('Preview robots must not advertise an empty sitemap');
if (!PREVIEW_MODE && !robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) throw new Error('Release robots must advertise the canonical sitemap');
const headers = await readFile('dist/_headers', 'utf8');
if (PREVIEW_MODE && !headers.includes('X-Robots-Tag: noindex, nofollow')) throw new Error('Public preview needs noindex response header');
if (!PREVIEW_MODE && headers.includes('X-Robots-Tag: noindex')) throw new Error('Release headers must not block indexing globally');
const llms = await readFile('dist/llms.txt', 'utf8');
if (!llms.startsWith('# Benvora Grup') || !llms.includes(`](${SITE_URL}/masaj-la-birou/)`) || !llms.includes(`](${SITE_URL}/beneficiu-pentru-echipa/)`) || !llms.includes(`](${SITE_URL}/programari/)`) || !llms.includes(`](${SITE_URL}/contact/)`)) throw new Error('llms.txt needs an H1 and real page links');
const aiCatalog = JSON.parse(await readFile('dist/ai-catalog.json', 'utf8'));
const wellKnownCatalog = JSON.parse(await readFile('dist/.well-known/ai-catalog.json', 'utf8'));
const ardManifest = JSON.parse(await readFile('dist/.well-known/ard.json', 'utf8'));
if (aiCatalog.specVersion !== '1.0' || aiCatalog.host?.displayName !== 'Benvora Grup' || !Array.isArray(aiCatalog.entries) || aiCatalog.entries.length || JSON.stringify(aiCatalog) !== JSON.stringify(wellKnownCatalog) || !Array.isArray(ardManifest.entries) || ardManifest.entries.length) throw new Error('AI discovery manifests must be valid and must not advertise unavailable resources');
const notFound = await readFile('dist/404.html', 'utf8');
if (!notFound.includes('name="robots" content="noindex,follow"') || !notFound.includes('href="/contact/"')) throw new Error('Custom 404 must be useful and noindex');
if (notFound.includes('rel="canonical"')) throw new Error('Custom 404 must not claim a canonical URL');
try { await stat('dist/assets/intro.js'); throw new Error('Unused intro script is still shipped'); } catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
for (const asset of ['hero.webp', 'hero-480.webp', 'hero-720.webp', 'hero-800.webp', 'hero-960.webp', 'hero-1280.webp', 'service.webp', 'service-480.webp', 'service-720.webp', 'service-800.webp', 'service-960.webp', 'service-1280.webp', 'brand-mark-96.webp', 'brand-mark-192.webp', 'brand-mark-384.webp']) {
  const size = (await stat(`dist/assets/${asset}`)).size;
  const limit = asset === 'brand-mark-96.webp' ? 5_000 : (/-(480|720|800)\.webp$/.test(asset)) ? 35_000 : (/-(960|1280)\.webp$/.test(asset)) ? 100_000 : asset.startsWith('brand-mark-') ? 50_000 : 350_000;
  if (size > limit) throw new Error(`${asset} too large: ${size}`);
  console.log(`OK ${asset} ${size} bytes`);
}
