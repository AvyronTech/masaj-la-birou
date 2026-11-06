# Benvora Grup — masaj la birou

Site de prezentare static, în limba română, pentru servicii de masaj la sediul companiilor. Codul este independent de site-ul AVYRON.

## Dezvoltare

`npm run build` generează `dist/`, gata pentru Cloudflare Pages. `npm run check` verifică paginile, metadatele și protecția de indexare a previzualizării. Pentru previzualizare locală: `python3 -m http.server 4173 -d dist`.

## Publicare curentă

- Proiect Cloudflare Pages: `benvora-grup`, creat prin Direct Upload. Publicarea se face prin încărcarea manuală a buildului verificat din `main`; versiunea publică trebuie confirmată după fiecare upload. Public: `https://benvora-grup.avyron.eu/`; URL alternativ: `https://benvora-grup.pages.dev/`.
- DNS `benvora-grup.avyron.eu` este CNAME proxied către `benvora-grup.pages.dev`. În zona `avyron.eu`, ruta Worker mai specifică `benvora-grup.avyron.eu/*` are **Worker None** și lasă cererile către Pages. Excepția este necesară deoarece ruta existentă `*.avyron.eu/*` a Workerului AVYRON ar răspunde cu demo 404.
- Proiectul Pages nu are încă integrare automată cu GitHub. Conectarea ar acorda aplicației Cloudflare acces nou la repository și a fost respinsă de revizuirea automată a permisiunilor. Până la aprobarea explicită a acestui acces, actualizările se publică doar prin build verificat și Direct Upload. Sursa și istoricul rămân în repo-ul privat GitHub.

## Conținut și etape următoare

- Benvora Grup este numele public confirmat de clientă. Logo-ul 3D rafinat este inclus în site; sursa și exportul mare se păstrează în `brand-private/`. CUI-ul și sediul social din documentul primit **nu** sunt publicate: clienta a cerut să aștepte validarea lor. Site-ul este o previzualizare publică, cu `noindex` în pagini și antete, plus `Disallow: /` în `robots.txt`.
- `contact@masajlabirou.ro`, `office@masajlabirou.ro`, `programari@masajlabirou.ro` și `colaborari@masajlabirou.ro` sunt afișate explicit ca adrese **în curs de activare**, în acord cu oferta de patru adrese. Nu există încă mailbox sau routing pentru domeniul clientei. Butonul Email duce la pagina Contact.
- Datele publice confirmate (nume, București, telefon și domeniul viitor) sunt grupate în `CLIENT` din `scripts/build.mjs`. Linkurile WhatsApp au mesaje diferite pentru ofertă, discuție și contact rapid, cu câmpuri de completat de către solicitant. Meniul este închis implicit la toate rezoluțiile și se deschide din butonul cu trei linii ca panou compact peste pagină. Bara de sus rămâne vizibilă la scroll, iar bara și butoanele plutitoare se micșorează discret.
- Paginile Confidențialitate, Cookie-uri și Termeni de utilizare sunt provizorii. Textul final trebuie validat de operatorul economic, împreună cu datele juridice, capitalul social, perioadele concrete de retenție și furnizorii folosiți după activarea e-mailului. La lansarea finală, setați `PREVIEW_MODE = false` în `scripts/build.mjs` și validați din nou conținutul și SEO.
- Video-ul se adaugă după ce clienta trimite fișierul și confirmă drepturile de utilizare. Componenta actuală arată doar locul rezervat, fără autoplay sau transfer de date către un terț.
- Imaginile generate sunt compoziții editoriale AI, nu fotografii reale ale echipei sau clienților.
- Sursele PNG necomprimate pentru cele două scene sunt în `design-sources/` (1752 × 897 px), iar conceptul inițial și logo-ul rafinat sunt în `brand-private/`. `benvora-grup-logo-v2-4k.webp` are 4096 × 4096 px și este un export mărit din sursa AI de 1254 × 1254 px, nu o randare nativă 4K. `scripts/prepare-logo.py` (Python cu Pillow 12+) regenerează logo-ul sursă; variantele 480/720/800/960/1280 px pentru hero, 480/720/960/1280 px pentru scena secundară și faviconul de 64 px sunt exporturi pentru afișare rapidă. Hero-ul păstrează întreaga fotografie într-un cadru limitat pe desktop; fișierele portret rămân în surse, dar nu se mai livrează. Imaginea secțiunii video se încarcă numai la apropierea de secțiune. Scenele de pe site nu sunt randări native 4K/8K.
- Intro-ul animat a fost eliminat la cererea clientei pentru a reduce timpul și încărcarea GPU la deschiderea site-ului.
- Site-ul nu instalează cookie-uri de analiză și nu încarcă fonturi ori scripturi externe. Formularul de ofertă compune local un mesaj WhatsApp, fără stocare sau trimitere automată; vizitatorul decide dacă îl trimite. Butonul de cont și cele trei canale sociale anunță „În curând”; profilurile sociale nu există încă. Lista de date și pași pentru lansare este în `docs/checklist-lansare.md`.

## Domenii

URL inițial: `https://benvora-grup.avyron.eu/`. Clienta deține deja `masajlabirou.ro`; conectarea lui și a rutării e-mailurilor va avea loc ulterior. La mutarea domeniului canonic trebuie actualizate `SITE_URL` în `scripts/build.mjs`, sitemap-ul, datele structurate și redirecturile.
