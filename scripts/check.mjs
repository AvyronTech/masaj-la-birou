import { readFile, stat } from 'node:fs/promises';
const legalPages = ['/confidentialitate/', '/cookie-uri/', '/termeni-si-conditii/'];
const pages = ['/', '/masaj-la-birou/', '/pentru-companii/', '/despre-noi/', '/contact/', ...legalPages];
for (const path of pages) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  for (const item of ['<html lang="ro">', '<main id="main"', '<h1 ', 'rel="canonical"', 'name="description"', 'application/ld+json']) {
    if (!html.includes(item)) throw new Error(`${path}: missing ${item}`);
  }
  if (!html.includes('name="robots" content="noindex,nofollow"')) throw new Error(`${path}: public preview must be noindex`);
  if (!html.includes('Conectează-te / Înregistrează-te') || !html.includes('id="site-toast"')) throw new Error(`${path}: missing account announcement`);
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
if (!home.includes('<img src="/assets/service.webp"')) throw new Error('Service image should be a complete image, not a cropped background');
if (home.includes('class="image-break"')) throw new Error('Repeated cropped image section remains');
for (const name of ['TikTok', 'Instagram', 'Facebook']) {
  if (!home.includes(`Profilul Benvora Grup pe ${name} este în pregătire.`) && !home.includes(`aria-label="Benvora Grup pe ${name}"`)) throw new Error(`${name}: missing social channel`);
}
const service = await readFile('dist/masaj-la-birou/index.html', 'utf8');
if (!service.includes('class="faq-list"')) throw new Error('Service page is missing practical questions');
const robots = await readFile('dist/robots.txt', 'utf8');
if (!robots.includes('Disallow: /')) throw new Error('Public preview must disallow crawling');
const headers = await readFile('dist/_headers', 'utf8');
if (!headers.includes('X-Robots-Tag: noindex, nofollow')) throw new Error('Public preview needs noindex response header');
for (const asset of ['hero.webp', 'service.webp']) {
  const size = (await stat(`dist/assets/${asset}`)).size;
  if (size > 350_000) throw new Error(`${asset} too large: ${size}`);
  console.log(`OK ${asset} ${size} bytes`);
}
