import { readFile, stat } from 'node:fs/promises';
const pages = ['/', '/masaj-la-birou/', '/pentru-companii/', '/despre-noi/', '/contact/', '/confidentialitate/'];
for (const path of pages) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  for (const item of ['<html lang="ro">', '<main id="main"', '<h1 ', 'rel="canonical"', 'name="description"', 'application/ld+json']) {
    if (!html.includes(item)) throw new Error(`${path}: missing ${item}`);
  }
  if (path === '/confidentialitate/' && !html.includes('noindex,follow')) throw new Error('Privacy draft must be noindex');
  console.log(`OK ${path}`);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
if (sitemap.includes('/confidentialitate/')) throw new Error('Privacy draft appears in sitemap');
for (const asset of ['hero.webp', 'service.webp']) {
  const size = (await stat(`dist/assets/${asset}`)).size;
  if (size > 350_000) throw new Error(`${asset} too large: ${size}`);
  console.log(`OK ${asset} ${size} bytes`);
}
