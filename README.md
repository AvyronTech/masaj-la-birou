# Benvora Grup — masaj la birou

Site de prezentare static, în limba română, pentru servicii de masaj la sediul companiilor. Codul este independent de site-ul AVYRON.

## Dezvoltare

`npm run build` generează `dist/`, gata pentru Cloudflare Pages. Configurare Pages: ramura de producție `main`, comanda `npm run build`, director de ieșire `dist`. `npm run check` verifică paginile și metadatele. Pentru previzualizare locală: `python3 -m http.server 4173 -d dist`.

## Decizii înainte de publicare

- Benvora Grup este numele public confirmat de clientă. Logo-ul 3D este inclus în site; fișierul sursă se păstrează în `brand-private/`. Adresa exactă și datele din certificatul de înregistrare nu sunt afișate până la confirmarea publicării lor.
- Adresa de email publică trebuie confirmată. Butonul Email duce momentan la pagina Contact, fără a promite o căsuță inexistentă.
- Datele operatorului în politica de confidențialitate și informațiile legale trebuie validate de clientă înainte de lansare. Pagina actuală este marcată explicit ca versiune în pregătire și are `noindex`.
- Video-ul se adaugă după ce clienta trimite fișierul și confirmă drepturile de utilizare. Componenta actuală arată doar locul rezervat, fără autoplay sau transfer de date către un terț.
- Imaginile generate sunt compoziții editoriale AI, nu fotografii reale ale echipei sau clienților.
- Site-ul nu instalează cookie-uri de analiză, nu are formular care colectează date și nu încarcă fonturi ori scripturi externe.

## Domenii

URL temporar propus: `https://benvora-grup.avyron.eu/`. `masajlabirou.ro` a apărut ca indisponibil în căutarea Hostico din 4 noiembrie 2026. Dacă deținătoarea îl controlează deja sau îl obține, acesta poate deveni canonical; atunci trebuie actualizate `SITE_URL` în `scripts/build.mjs`, sitemap-ul, datele structurate și redirecturile.
