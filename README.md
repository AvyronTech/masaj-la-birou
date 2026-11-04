# Benvora Grup — masaj la birou

Site de prezentare static, în limba română, pentru servicii de masaj la sediul companiilor. Codul este independent de site-ul AVYRON.

## Dezvoltare

`npm run build` generează `dist/`, gata pentru Cloudflare Pages. Configurare Pages: ramura de producție `main`, comanda `npm run build`, director de ieșire `dist`. `npm run check` verifică paginile și metadatele. Pentru previzualizare locală: `python3 -m http.server 4173 -d dist`.

## Conținut și etape următoare

- Benvora Grup este numele public confirmat de clientă. Logo-ul 3D este inclus în site; fișierul sursă se păstrează în `brand-private/`. Datele societății din documentul primit apar pe pagina de confidențialitate; clienta trebuie să le valideze și să comunice capitalul social pentru completarea informațiilor legale.
- `contact@masajlabirou.ro`, `office@masajlabirou.ro` și `programari@masajlabirou.ro` sunt afișate explicit ca adrese **în curs de activare**. Nu există încă mailbox sau routing pentru domeniul clientei. Butonul Email duce la pagina Contact.
- Pagina de confidențialitate este informativă și are `noindex`; conținutul trebuie validat de operatorul economic, inclusiv perioadele concrete de retenție și furnizorii folosiți după activarea e-mailului.
- Video-ul se adaugă după ce clienta trimite fișierul și confirmă drepturile de utilizare. Componenta actuală arată doar locul rezervat, fără autoplay sau transfer de date către un terț.
- Imaginile generate sunt compoziții editoriale AI, nu fotografii reale ale echipei sau clienților.
- Site-ul nu instalează cookie-uri de analiză, nu are formular care colectează date și nu încarcă fonturi ori scripturi externe.

## Domenii

URL inițial: `https://benvora-grup.avyron.eu/`. Clienta deține deja `masajlabirou.ro`; conectarea lui și a rutării e-mailurilor va avea loc ulterior. La mutarea domeniului canonic trebuie actualizate `SITE_URL` în `scripts/build.mjs`, sitemap-ul, datele structurate și redirecturile.
