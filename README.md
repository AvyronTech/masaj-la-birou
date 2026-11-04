# Benvora Grup — masaj la birou

Site de prezentare static, în limba română, pentru servicii de masaj la sediul companiilor. Codul este independent de site-ul AVYRON.

## Dezvoltare

`npm run build` generează `dist/`, gata pentru Cloudflare Pages. `npm run check` verifică paginile, metadatele și protecția de indexare a previzualizării. Pentru previzualizare locală: `python3 -m http.server 4173 -d dist`.

## Publicare curentă

- Proiect Cloudflare Pages: `benvora-grup`, creat prin Direct Upload. Buildul verificat din ramura `codex/benvora-site-2026-11-04` a fost încărcat manual. Public: `https://benvora-grup.avyron.eu/`; URL alternativ: `https://benvora-grup.pages.dev/`.
- DNS `benvora-grup.avyron.eu` este CNAME proxied către `benvora-grup.pages.dev`. În zona `avyron.eu`, ruta Worker mai specifică `benvora-grup.avyron.eu/*` are **Worker None** și lasă cererile către Pages. Excepția este necesară deoarece ruta existentă `*.avyron.eu/*` a Workerului AVYRON ar răspunde cu demo 404.
- Proiectul Pages nu are încă integrare automată cu GitHub. Conectarea ar acorda aplicației Cloudflare acces nou la repository și a fost respinsă de revizuirea automată a permisiunilor. Până la aprobarea explicită a acestui acces, actualizările se publică doar prin build verificat și Direct Upload. Sursa și istoricul rămân în repo-ul privat GitHub.

## Conținut și etape următoare

- Benvora Grup este numele public confirmat de clientă. Logo-ul 3D este inclus în site; fișierul sursă se păstrează în `brand-private/`. CUI-ul și sediul social din documentul primit **nu** sunt publicate: clienta a cerut să aștepte validarea lor. Site-ul este o previzualizare publică, cu `noindex` în pagini și antete, plus `Disallow: /` în `robots.txt`.
- `contact@masajlabirou.ro`, `office@masajlabirou.ro` și `programari@masajlabirou.ro` sunt afișate explicit ca adrese **în curs de activare**. Nu există încă mailbox sau routing pentru domeniul clientei. Butonul Email duce la pagina Contact.
- Pagina de confidențialitate este provizorie. Textul final trebuie validat de operatorul economic, împreună cu datele juridice, capitalul social, perioadele concrete de retenție și furnizorii folosiți după activarea e-mailului. La lansarea finală, setați `PREVIEW_MODE = false` în `scripts/build.mjs` și validați din nou conținutul și SEO.
- Video-ul se adaugă după ce clienta trimite fișierul și confirmă drepturile de utilizare. Componenta actuală arată doar locul rezervat, fără autoplay sau transfer de date către un terț.
- Imaginile generate sunt compoziții editoriale AI, nu fotografii reale ale echipei sau clienților.
- Site-ul nu instalează cookie-uri de analiză, nu are formular care colectează date și nu încarcă fonturi ori scripturi externe.

## Domenii

URL inițial: `https://benvora-grup.avyron.eu/`. Clienta deține deja `masajlabirou.ro`; conectarea lui și a rutării e-mailurilor va avea loc ulterior. La mutarea domeniului canonic trebuie actualizate `SITE_URL` în `scripts/build.mjs`, sitemap-ul, datele structurate și redirecturile.
