import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const legalPages = ['/confidentialitate/', '/cookie-uri/', '/termeni-si-conditii/'];
const pages = ['/', '/masaj-la-birou/', '/pentru-companii/', '/despre-noi/', '/contact/', ...legalPages];
for (const path of pages) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  for (const item of ['<html lang="ro">', '<main id="main"', '<h1 ', 'rel="canonical"', 'name="description"', 'application/ld+json']) {
    if (!html.includes(item)) throw new Error(`${path}: missing ${item}`);
  }
  if (!html.includes(`rel="canonical" href="https://benvora-grup.avyron.eu${path}"`)) throw new Error(`${path}: incorrect canonical`);
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
  if (!html.includes('name="robots" content="noindex,nofollow"')) throw new Error(`${path}: public preview must be noindex`);
  if (html.includes('brand-intro') || html.includes('intro.js') || html.includes('intro-active')) throw new Error(`${path}: blocking intro must be removed`);
  if (!html.includes('Conectează-te / Înregistrează-te') || !html.includes('id="site-toast"')) throw new Error(`${path}: missing account announcement`);
  if (!html.includes('id="menu-toggle"') || !html.includes('role="dialog" aria-modal="true" aria-label="Meniu de navigare"')) throw new Error(`${path}: missing accessible overlay menu`);
  if (html.includes('id="explore-toggle"')) throw new Error(`${path}: duplicate navigation control remains`);
  for (const legalPath of legalPages) {
    if (!html.includes(`href="${legalPath}"`)) throw new Error(`${path}: missing footer link to ${legalPath}`);
  }
  console.log(`OK ${path}`);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const legalPath of legalPages) {
  if (sitemap.includes(legalPath)) throw new Error(`${legalPath}: legal draft appears in sitemap`);
}
const home = await readFile('dist/index.html', 'utf8');
if (!/<source media="\(max-width: 1140px\)" type="image\/webp" srcset="\/assets\/hero-960\.webp\?v=[a-f0-9]{12} 960w, \/assets\/hero-1280\.webp\?v=[a-f0-9]{12} 1280w, \/assets\/hero\.webp\?v=[a-f0-9]{12} 1752w"/.test(home)) throw new Error('Narrow-view hero must offer both sizes of the complete original photo');
if (!/<source media="\(min-width: 1141px\)" type="image\/webp" srcset="\/assets\/hero-portrait-720\.webp\?v=[a-f0-9]{12} 720w, \/assets\/hero-portrait\.webp\?v=[a-f0-9]{12} 1086w"/.test(home)) throw new Error('Desktop hero needs responsive portrait images');
if (!/<img src="\/assets\/hero-portrait\.jpg\?v=[a-f0-9]{12}"/.test(home)) throw new Error('Desktop hero must use the portrait adaptation');
if (!/<img src="\/assets\/service-960\.webp\?v=[a-f0-9]{12}" srcset="\/assets\/service-960\.webp\?v=[a-f0-9]{12} 960w, \/assets\/service-1280\.webp\?v=[a-f0-9]{12} 1280w, \/assets\/service\.webp\?v=[a-f0-9]{12} 1752w"/.test(home)) throw new Error('Service image should be responsive and uncropped');
if (home.includes('class="image-break"')) throw new Error('Repeated cropped image section remains');
for (const name of ['TikTok', 'Instagram', 'Facebook']) {
  if (!home.includes(`Profilul Benvora Grup pe ${name} este în pregătire.`) && !home.includes(`aria-label="Benvora Grup pe ${name}"`)) throw new Error(`${name}: missing social channel`);
}
const service = await readFile('dist/masaj-la-birou/index.html', 'utf8');
if (!service.includes('class="faq-list"')) throw new Error('Service page is missing practical questions');
const contact = await readFile('dist/contact/index.html', 'utf8');
if (!contact.includes('id="contact-form"') || !contact.includes('Continuă pe WhatsApp')) throw new Error('Contact page needs the guided WhatsApp request');
if ([...contact.matchAll(/<!--email_off--><strong>[^<]+@masajlabirou\.ro<\/strong><!--\/email_off-->/g)].length !== 4) throw new Error('Pending emails must stay readable without Cloudflare email-decoder script');
const privacy = await readFile('dist/confidentialitate/index.html', 'utf8');
if (!privacy.includes('Formularul de ofertă pregătește mesajul în browser')) throw new Error('Privacy page must describe the local form');
const robots = await readFile('dist/robots.txt', 'utf8');
if (!robots.includes('Disallow: /')) throw new Error('Public preview must disallow crawling');
const headers = await readFile('dist/_headers', 'utf8');
if (!headers.includes('X-Robots-Tag: noindex, nofollow')) throw new Error('Public preview needs noindex response header');
try { await stat('dist/assets/intro.js'); throw new Error('Unused intro script is still shipped'); } catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
for (const asset of ['hero.webp', 'hero-960.webp', 'hero-1280.webp', 'hero-portrait.jpg', 'hero-portrait.webp', 'hero-portrait-720.webp', 'service.webp', 'service-960.webp', 'service-1280.webp', 'brand-mark-192.webp', 'brand-mark-384.webp']) {
  const size = (await stat(`dist/assets/${asset}`)).size;
  const limit = asset === 'hero-portrait.jpg' ? 650_000 : (/-(720|960|1280)\.webp$/.test(asset)) ? 100_000 : asset.startsWith('brand-mark-') ? 50_000 : 350_000;
  if (size > limit) throw new Error(`${asset} too large: ${size}`);
  console.log(`OK ${asset} ${size} bytes`);
}
