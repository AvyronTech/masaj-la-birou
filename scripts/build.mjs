import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SITE_URL = 'https://benvora-grup.avyron.eu';
// Public preview until the client validates the legal identification and email setup.
const PREVIEW_MODE = true;
const PHONE_DISPLAY = '0767 834 296';
const PHONE = '+40767834296';
const WHATSAPP = 'https://wa.me/40767834296?text=Bun%C4%83%20ziua%2C%20doresc%20o%20ofert%C4%83%20pentru%20masaj%20la%20birou.';
const nav = [
  ['/', 'Acasă', '01'],
  ['/masaj-la-birou/', 'Masaj la birou', '02'],
  ['/pentru-companii/', 'Pentru companii', '03'],
  ['/despre-noi/', 'Despre noi', '04'],
  ['/contact/', 'Contact', '05'],
];
const icon = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3H5a2 2 0 0 0-2 2c0 8.84 7.16 16 16 16a2 2 0 0 0 2-2v-2l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8.5 8.5 0 0 1-12.4 7.53L3 20l.97-4.6A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8.5 9c.6 2.5 2 4 4.5 5l1.5-1.2 2.2 1.1c-.6 1.4-1.4 2-2.5 2-3.6-.2-6.3-2.8-6.5-6.5 0-1 .4-1.7 1.1-2.4L10 8l-1.5 1Z"/></svg>',
};
const pages = [
  {
    path: '/', title: 'Masaj la birou în București | Benvora Grup',
    description: 'Masaj de relaxare la birou în București, organizat direct la sediul companiei. Program flexibil, sesiuni individuale și o pauză de wellbeing simplu de oferit echipei.',
    heading: 'O pauză bună schimbă ritmul zilei.',
    eyebrow: 'MASAJ LA BIROU · WELLBEING PENTRU ECHIPE',
    body: `
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy"><p class="eyebrow">MASAJ LA BIROU · WELLBEING PENTRU ECHIPE</p><h1 id="page-title">O pauză bună schimbă ritmul zilei.</h1><p class="lead">Masaj de relaxare la sediul companiei, organizat în jurul programului echipei. Simplu pentru HR. Plăcut pentru oameni.</p><div class="actions"><a class="button button-primary" href="/contact/">Solicită o ofertă ${icon.arrow}</a><a class="button button-light" href="/masaj-la-birou/">Cum funcționează</a></div><p class="hero-note">La sediul tău · Pe bază de programare · Adaptat echipei</p></div>
        <div class="hero-photo" role="img" aria-label="Sesiune ilustrativă de masaj pe scaun într-un birou luminos"></div>
      </section>
      <section class="intro-grid section-pad" aria-labelledby="intro-title"><div><p class="eyebrow">UN BENEFICIU UȘOR DE INTEGRAT</p><h2 id="intro-title">Wellbeing care vine la birou.</h2></div><div><p class="large-copy">Terapeutul se deplasează la sediul companiei, iar colegii participă la sesiuni individuale, programate succesiv. Fără drumuri suplimentare și fără să scoți echipa din ritmul de lucru.</p><a class="text-link" href="/masaj-la-birou/">Descoperă serviciul ${icon.arrow}</a></div></section>
      <section class="video-section section-pad" aria-labelledby="video-title"><div class="video-card"><div class="video-visual"><span class="play-emblem" aria-hidden="true">▶</span><span class="video-state">Video demonstrativ în pregătire</span></div><div class="video-copy"><p class="eyebrow">VEZI EXPERIENȚA</p><h2 id="video-title">O pauză reală, chiar în mijlocul zilei.</h2><p>În curând vei putea vedea cum se desfășoară o sesiune de masaj la birou. Până atunci, îți explicăm fiecare pas.</p><a class="text-link" href="/masaj-la-birou/">Află cum funcționează ${icon.arrow}</a></div></div></section>
      <section class="section-pad" aria-labelledby="benefits-title"><div class="section-heading"><div><p class="eyebrow">DE CE FUNCȚIONEAZĂ</p><h2 id="benefits-title">Gândit pentru oameni. Simplu pentru companii.</h2></div><p>Un serviciu clar, ușor de planificat și potrivit pentru mai multe formate de colaborare.</p></div><div class="feature-grid"><article class="feature"><span class="feature-index">01 / LA SEDIU</span><h3>Fără deplasări</h3><p>Angajații beneficiază de sesiuni chiar la locul de muncă, într-un spațiu pus la dispoziție de companie.</p></article><article class="feature"><span class="feature-index">02 / FLEXIBIL</span><h3>În ritmul echipei</h3><p>Alegem împreună ziua, intervalul orar, numărul de participanți și frecvența potrivită.</p></article><article class="feature"><span class="feature-index">03 / ORGANIZAT</span><h3>Programări clare</h3><p>Sesiunile sunt planificate pe intervale, cu evidența participării și a orelor efectuate.</p></article></div></section>
      <section class="image-break" aria-label="Masaj de relaxare la birou"><div><p class="eyebrow eyebrow-light">O EXPERIENȚĂ DISCRETĂ</p><h2>Un moment de respiro, fără să părăsești biroul.</h2></div></section>
      <section class="section-pad" aria-labelledby="formats-title"><div class="section-heading"><div><p class="eyebrow">FORMATE DE COLABORARE</p><h2 id="formats-title">Alege ce se potrivește companiei tale.</h2></div><a class="text-link" href="/pentru-companii/">Toate opțiunile ${icon.arrow}</a></div><div class="format-list"><div><span>01</span><h3>Zi de wellbeing</h3><p>Un program punctual, dedicat echipei.</p></div><div><span>02</span><h3>Program recurent</h3><p>Sesiuni organizate periodic, într-un ritm stabilit împreună.</p></div><div><span>03</span><h3>Eveniment intern</h3><p>O experiență de relaxare integrată într-un eveniment corporate.</p></div></div></section>
      ${cta('Spune-ne cum arată echipa ta.', 'Pregătim o propunere adaptată numărului de persoane, locației și frecvenței dorite.')}`
  },
  {
    path: '/masaj-la-birou/', title: 'Masaj la birou pentru angajați | Benvora Grup',
    description: 'Află cum se organizează masajul de relaxare la sediul companiei: program, înscriere, desfășurarea sesiunilor și evidența orelor.',
    heading: 'Masaj la birou', eyebrow: 'SERVICIUL',
    body: `${pageHero('SERVICIUL', 'Masaj la birou, fără complicații.', 'Un serviciu simplu de integrat în programul de lucru. Stabilim împreună formatul, iar terapeutul vine la sediul companiei.')}
      <section class="section-pad" aria-labelledby="steps-title"><div class="section-heading"><div><p class="eyebrow">PAS CU PAS</p><h2 id="steps-title">Cum funcționează</h2></div><p>Organizarea se adaptează echipei, spațiului și timpului disponibil.</p></div><div class="steps"><article><span>01</span><div><h3>Stabilim programul</h3><p>Alegem ziua, intervalul orar și frecvența: punctual, săptămânal, bilunar sau după un calendar personalizat.</p></div></article><article><span>02</span><div><h3>Angajații se programează</h3><p>Participanții sunt organizați nominal, pe intervale, astfel încât timpul disponibil să fie clar pentru toată lumea.</p></div></article><article><span>03</span><div><h3>Terapeutul vine la sediu</h3><p>Sesiunile se desfășoară în spațiul pus la dispoziție de companie, cu cât mai puține întreruperi ale activității.</p></div></article><article><span>04</span><div><h3>Urmărim orele efectuate</h3><p>La nevoie, programul include evidența participării și a orelor prestate, utilă pentru administrarea internă.</p></div></article></div></section>
      <section class="soft-section section-pad"><div class="two-col"><div><p class="eyebrow">ÎN TIMPUL ZILEI DE LUCRU</p><h2>Un beneficiu ușor de folosit.</h2></div><div><p>O pauză de relaxare accesibilă angajaților, fără deplasări și fără timp pierdut în trafic. Sesiunile individuale pot completa un program recurent de wellbeing sau o zi specială pentru echipă.</p><ul class="check-list"><li>Organizare flexibilă, în funcție de numărul de participanți</li><li>Programare individuală pe intervale orare</li><li>Serviciu oferit direct la sediul companiei</li></ul></div></div></section>
      ${cta('Gata să planificăm prima zi?', 'Spune-ne câți colegi ar participa și când ai dori să organizăm sesiunile.')}`
  },
  {
    path: '/pentru-companii/', title: 'Wellbeing pentru companii | Benvora Grup',
    description: 'Programe flexibile de masaj la birou pentru companii: zile de wellbeing, sesiuni recurente, evenimente interne și variante personalizate.',
    heading: 'Pentru companii', eyebrow: 'WELLBEING PENTRU ECHIPE',
    body: `${pageHero('WELLBEING PENTRU ECHIPE', 'Grija pentru oameni devine un gest concret.', 'O sesiune de masaj de relaxare oferită la birou poate aduce o pauză binevenită în ziua de lucru și poate completa inițiativele de wellbeing ale companiei.')}
      <section class="section-pad"><div class="section-heading"><div><p class="eyebrow">PENTRU ECHIPĂ ȘI HR</p><h2>Un serviciu util, ușor de administrat.</h2></div></div><div class="feature-grid"><article class="feature"><span class="feature-index">PENTRU ANGAJAȚI</span><h3>Relaxare accesibilă</h3><p>Colegii nu trebuie să plece de la sediu. Sesiunea se integrează într-un interval stabilit în prealabil.</p></article><article class="feature"><span class="feature-index">PENTRU HR</span><h3>Flexibilitate reală</h3><p>Programul se dimensionează în funcție de numărul de angajați, locație, timp și frecvența dorită.</p></article><article class="feature"><span class="feature-index">PENTRU COMPANIE</span><h3>Organizare vizibilă</h3><p>Planificarea nominală și evidența sesiunilor fac mai ușoară administrarea beneficiului.</p></article></div></section>
      <section class="soft-section section-pad"><div class="section-heading"><div><p class="eyebrow">FORMATE</p><h2>Colaborarea se adaptează echipei.</h2></div></div><div class="format-list format-list-grid"><div><span>01</span><h3>Zi de wellbeing</h3><p>Un program punctual pentru echipă.</p></div><div><span>02</span><h3>Program recurent</h3><p>Sesiuni organizate periodic.</p></div><div><span>03</span><h3>Evenimente interne</h3><p>Masaj ca beneficiu în cadrul unui eveniment corporate.</p></div><div><span>04</span><h3>Program personalizat</h3><p>Construit în funcție de numărul de persoane și timpul disponibil.</p></div></div></section>
      <section class="section-pad"><div class="two-col"><div><p class="eyebrow">OFERTĂ PERSONALIZATĂ</p><h2>Ce ne ajută să știm?</h2></div><div><p>Locația sediului, numărul aproximativ de participanți și frecvența dorită sunt suficiente pentru o primă discuție. Stabilim apoi detaliile programului împreună.</p><a class="button button-primary" href="/contact/">Solicită o ofertă ${icon.arrow}</a></div></div></section>`
  },
  {
    path: '/despre-noi/', title: 'Despre noi | Benvora Grup',
    description: 'Descoperă abordarea noastră pentru masajul de întreținere și relaxare la sediul companiilor: profesionalism, punctualitate, discreție și organizare.',
    heading: 'Despre noi', eyebrow: 'ABORDAREA NOASTRĂ',
    body: `${pageHero('ABORDAREA NOASTRĂ', 'O experiență atent organizată, de la prima discuție.', 'Benvora Grup dezvoltă servicii de masaj de întreținere și relaxare pentru companii, cu accent pe o experiență confortabilă pentru fiecare participant și un program ușor de administrat.')}
      <section class="section-pad"><div class="two-col"><div><p class="eyebrow">CUM LUCRĂM</p><h2>Wellbeing mai aproape de oameni.</h2></div><div><p>Modelul nostru este orientat către colaborarea cu organizații. Stabilim împreună programul, modul de înscriere, necesarul de personal și evidența sesiunilor, astfel încât serviciul să se potrivească ritmului fiecărei echipe.</p><p>Credem într-o pauză de relaxare discretă, punctuală și simplu de oferit, direct la locul de muncă.</p></div></div></section>
      <section class="soft-section section-pad"><div class="section-heading"><div><p class="eyebrow">PRINCIPII</p><h2>Lucrurile pe care le urmărim la fiecare vizită.</h2></div></div><div class="principles"><article><span>01</span><h3>Profesionalism</h3><p>Serviciu organizat cu atenție și personal selectat pentru activitatea prestată.</p></article><article><span>02</span><h3>Punctualitate</h3><p>Respectăm programul convenit cu fiecare companie.</p></article><article><span>03</span><h3>Discreție</h3><p>O experiență confortabilă și respectuoasă pentru fiecare participant.</p></article><article><span>04</span><h3>Flexibilitate</h3><p>Adaptăm programul dimensiunii și ritmului organizației.</p></article></div></section>
      ${cta('Hai să construim o pauză pentru echipa ta.', 'Povestește-ne despre companie, iar noi revenim cu o variantă de program.')}`
  },
  {
    path: '/contact/', title: 'Contact și ofertă | Benvora Grup',
    description: 'Contactează-ne pentru o ofertă personalizată de masaj la birou. Spune-ne locația, numărul aproximativ de angajați și frecvența dorită.',
    heading: 'Contact', eyebrow: 'SOLICITĂ O OFERTĂ',
    body: `${pageHero('SOLICITĂ O OFERTĂ', 'Spune-ne cum arată echipa ta.', 'Îți putem propune un program adaptat companiei tale. Pentru o primă discuție, avem nevoie doar de câteva detalii despre sediu și participanți.')}
      <section class="section-pad"><div class="contact-grid"><div><p class="eyebrow">CONTACT DIRECT</p><h2>Începem cu o conversație.</h2><p>Sună-ne sau scrie-ne pe WhatsApp. Dacă preferi, pregătește locația sediului, numărul aproximativ de angajați și frecvența dorită.</p><div class="contact-actions"><a class="contact-card" href="tel:${PHONE}">${icon.phone}<span><small>TELEFON</small><strong>${PHONE_DISPLAY}</strong></span>${icon.arrow}</a><a class="contact-card" href="${WHATSAPP}" target="_blank" rel="noopener noreferrer">${icon.chat}<span><small>WHATSAPP</small><strong>Scrie-ne un mesaj</strong></span>${icon.arrow}</a><div class="contact-card contact-card-static">${icon.mail}<span><small>E-MAIL · ÎN CURS DE ACTIVARE</small><strong>contact@masajlabirou.ro</strong><strong>office@masajlabirou.ro</strong><strong>programari@masajlabirou.ro</strong></span></div></div></div><aside class="contact-note"><p class="eyebrow">PENTRU O OFERTĂ UTILĂ</p><h3>Ce să ne transmiți</h3><ol><li>Orașul și locația aproximativă a sediului</li><li>Numărul estimativ de participanți</li><li>Ziua, intervalul sau frecvența preferată</li><li>Tipul programului: punctual, recurent sau eveniment</li></ol><p>Stabilim restul detaliilor împreună.</p></aside></div></section>`
  },
  {
    path: '/confidentialitate/', title: 'Confidențialitate | Benvora Grup',
    description: 'Informații privind prelucrarea datelor în cadrul site-ului Benvora Grup.',
    heading: 'Confidențialitate', eyebrow: 'INFORMAȚII LEGALE', noindex: true,
    body: `${pageHero('INFORMAȚII LEGALE', 'Confidențialitate', 'Această versiune este o previzualizare publică. Informațiile legale complete sunt în curs de validare de către clientă.')}
      <section class="section-pad legal-copy"><h2>Despre această previzualizare</h2><p>Site-ul nu conține formular de contact, conturi, instrumente proprii de analiză sau cookie-uri de publicitate. Poți alege să ne contactezi telefonic la <a href="tel:${PHONE}">${PHONE_DISPLAY}</a> ori prin WhatsApp. Dacă alegi WhatsApp, vei folosi un serviciu extern, supus propriilor condiții și politici.</p><p>Datele complete ale operatorului, scopurile și temeiurile prelucrării, perioadele de păstrare și modalitățile de exercitare a drepturilor vor fi publicate după validarea informațiilor legale. Până atunci, această pagină și site-ul sunt excluse de la indexarea motoarelor de căutare.</p></section>`
  },
];

function pageHero(eyebrow, heading, lead) {
  return `<section class="page-hero"><p class="eyebrow">${eyebrow}</p><h1 id="page-title">${heading}</h1><p class="lead">${lead}</p></section>`;
}
function cta(heading, lead) {
  return `<section class="cta-band section-pad"><div><p class="eyebrow eyebrow-light">HAI SĂ VORBIM</p><h2>${heading}</h2><p>${lead}</p></div><a class="button button-cream" href="/contact/">Solicită o ofertă ${icon.arrow}</a></section>`;
}
const introHead = '<script>try{if(!sessionStorage.getItem(\'benvora-intro-v2\')&&!matchMedia(\'(prefers-reduced-motion: reduce)\').matches&&!(navigator.connection&&navigator.connection.saveData)){document.documentElement.classList.add(\'intro-active\');sessionStorage.setItem(\'benvora-intro-v2\',\'1\')}}catch{}</script>';
const introBody = '<div class="brand-intro" id="brand-intro" aria-hidden="true"><div class="brand-intro__content"><div class="brand-intro__mark"><img id="brand-intro-mark" src="/assets/brand-mark.webp" width="768" height="768" alt="" decoding="async"><canvas id="brand-intro-canvas" aria-hidden="true"></canvas></div><p class="brand-intro__wordmark">BENVORA <span>GRUP</span></p><p class="brand-intro__caption">WELLBEING PENTRU ECHIPE</p></div></div>';
function layout(page) {
  const fullUrl = SITE_URL + page.path;
  const navHtml = nav.map(([path, label, n]) => `<li><a href="${path}" ${page.path === path ? 'aria-current="page"' : ''}><span>${n}</span>${label}${icon.arrow}</a></li>`).join('');
  const structured = page.path === '/' ? {
    '@context': 'https://schema.org', '@type': 'Service', name: 'Masaj la birou pentru companii',
    description: page.description, serviceType: 'Masaj de relaxare la sediul companiilor',
    url: fullUrl, areaServed: { '@type': 'City', name: 'București' },
    provider: { '@type': 'Organization', name: 'Benvora Grup', url: SITE_URL, telephone: PHONE }
  } : { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: fullUrl, inLanguage: 'ro-RO' };
  return `<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#143a3a"><meta name="description" content="${page.description}"><title>${page.title}</title><link rel="canonical" href="${fullUrl}"><link rel="icon" type="image/png" href="/assets/favicon.png">${page.path === '/' ? '<link rel="preload" as="image" href="/assets/hero.webp" fetchpriority="high">' : ''}<meta property="og:type" content="website"><meta property="og:locale" content="ro_RO"><meta property="og:title" content="${page.title}"><meta property="og:description" content="${page.description}"><meta property="og:url" content="${fullUrl}"><meta property="og:image" content="${SITE_URL}/assets/hero.webp"><meta name="twitter:card" content="summary_large_image">${PREVIEW_MODE ? '<meta name="robots" content="noindex,nofollow">' : page.noindex ? '<meta name="robots" content="noindex,follow">' : ''}${introHead}<link rel="stylesheet" href="/assets/style.css"><script type="application/ld+json">${JSON.stringify(structured).replaceAll('<', '\\u003c')}</script><script src="/assets/site.js" defer></script><script src="/assets/intro.js" defer></script></head><body>${introBody}<a class="skip-link" href="#main">Sari la conținut</a><div class="site-shell"><aside class="sidebar" id="sidebar"><a class="brand" href="/" aria-label="Benvora Grup, acasă"><span class="brand-mark" aria-hidden="true"></span><span class="brand-name">Benvora <span>Grup</span><small>WELLBEING PENTRU ECHIPE</small></span></a><p class="sidebar-caption">EXPLOREAZĂ</p><nav aria-label="Navigația principală"><ul>${navHtml}</ul></nav><div class="sidebar-bottom"><p>O pauză pentru echipă.<br>Un pas simplu pentru companie.</p><a href="tel:${PHONE}">${PHONE_DISPLAY}</a></div></aside><div class="sidebar-scrim" id="sidebar-scrim" hidden></div><div class="page-area"><header class="topbar"><button class="mobile-menu" type="button" id="menu-toggle" aria-controls="sidebar" aria-expanded="false" aria-label="Deschide meniul"><span></span><span></span><span></span></button><a class="topbar-home" href="/">Benvora <span>Grup</span></a><div class="topbar-actions"><span class="topbar-caption">Masaj corporate, la sediul tău</span><div class="explore-wrap"><button class="explore-button" type="button" id="explore-toggle" aria-haspopup="true" aria-expanded="false">Explorează <span aria-hidden="true">⌄</span></button><div class="explore-menu" id="explore-menu" hidden><a href="/masaj-la-birou/">Serviciul nostru</a><a href="/pentru-companii/">Pentru companii</a><a href="/despre-noi/">Despre noi</a><a href="/contact/">Contact</a></div></div><a class="topbar-cta" href="/contact/">Cere ofertă ${icon.arrow}</a></div></header><main id="main" tabindex="-1">${page.body}</main><footer class="footer"><div class="footer-main"><div><a class="footer-brand" href="/" aria-label="Benvora Grup, acasă"><img src="/assets/brand-logo.webp" alt="Benvora Grup" width="160" height="160" loading="lazy"></a><p>Masaj de relaxare la sediul companiilor din București. O pauză atent organizată pentru oameni și echipe.</p></div><div><h2>Navigare</h2><a href="/masaj-la-birou/">Masaj la birou</a><a href="/pentru-companii/">Pentru companii</a><a href="/despre-noi/">Despre noi</a><a href="/contact/">Contact</a></div><div><h2>Hai să vorbim</h2><a href="tel:${PHONE}">${PHONE_DISPLAY}</a><a href="${WHATSAPP}" target="_blank" rel="noopener noreferrer">WhatsApp</a><p>Programul se stabilește împreună, în funcție de echipă.</p></div></div><div class="footer-legal"><span>© ${new Date().getFullYear()} Benvora Grup</span><a href="/confidentialitate/">Confidențialitate</a><span>Realizat cu atenție pentru oameni.</span></div></footer></div></div><div class="float-actions" aria-label="Contact rapid"><a href="tel:${PHONE}" aria-label="Sună la ${PHONE_DISPLAY}" title="Sună">${icon.phone}</a><a href="${WHATSAPP}" target="_blank" rel="noopener noreferrer" aria-label="Scrie pe WhatsApp" title="WhatsApp">${icon.chat}</a><a href="/contact/" aria-label="Contact și e-mail" title="Contact și e-mail">${icon.mail}</a></div></body></html>`;
}

await mkdir('dist/assets', { recursive: true });
for (const name of ['hero.webp', 'service.webp', 'brand-logo.webp', 'brand-mark.webp', 'style.css', 'site.js', 'intro.js', 'favicon.png']) await copyFile(join('assets', name), join('dist/assets', name));
for (const page of pages) {
  const dir = join('dist', page.path.slice(1));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), layout(page));
}
const urls = pages.filter(p => !p.noindex).map(p => `  <url><loc>${SITE_URL}${p.path}</loc></url>`).join('\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await writeFile('dist/robots.txt', PREVIEW_MODE ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
await writeFile('dist/_headers', `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  ${PREVIEW_MODE ? 'X-Robots-Tag: noindex, nofollow\n  ' : ''}Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'\n\n/assets/*\n  Cache-Control: public, max-age=3600\n`);
console.log(`Built ${pages.length} pages for ${SITE_URL}`);
