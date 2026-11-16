# Benvora Grup — masaj la birou

Site de prezentare static, în limba română, pentru servicii de masaj la sediul companiilor. Codul este independent de site-ul AVYRON.

## Dezvoltare

`npm run build` generează `dist/`, gata pentru Cloudflare Pages. `npm run check` verifică paginile, metadatele și protecția de indexare a previzualizării. Pentru previzualizare locală: `python3 -m http.server 4173 -d dist`.

## Publicare curentă

- Proiect Cloudflare Pages: `benvora-grup`, creat prin Direct Upload. Publicarea se face prin încărcarea manuală a buildului verificat din `main`; versiunea publică trebuie confirmată după fiecare upload. Public: `https://benvora-grup.avyron.eu/`; URL alternativ: `https://benvora-grup.pages.dev/`.
- DNS `benvora-grup.avyron.eu` este CNAME proxied către `benvora-grup.pages.dev`. În zona `avyron.eu`, ruta Worker mai specifică `benvora-grup.avyron.eu/*` are **Worker None** și lasă cererile către Pages. Excepția este necesară deoarece ruta existentă `*.avyron.eu/*` a Workerului AVYRON ar răspunde cu demo 404.
- Proiectul Pages nu are încă integrare automată cu GitHub. Conectarea ar acorda aplicației Cloudflare acces nou la repository și a fost respinsă de revizuirea automată a permisiunilor. Până la aprobarea explicită a acestui acces, actualizările se publică doar prin build verificat și Direct Upload. Sursa și istoricul rămân în repo-ul privat GitHub.

## Conținut și etape următoare

- Benvora Grup este numele public confirmat de clientă. Logo-ul 3D rafinat este inclus în site; sursa și exportul mare se păstrează în `brand-private/`. Pagina GDPR și termenii includ identitatea juridică din documentul GDPR furnizat de clientă. Buildul implicit rămâne o previzualizare cu `noindex` în pagini și antete până la confirmarea detaliilor operaționale ale politicilor. `robots.txt` permite crawlerelor să citească directiva `noindex`; sitemap-ul de previzualizare nu listează pagini.
- `contact@masajlabirou.ro`, `office@masajlabirou.ro`, `programari@masajlabirou.ro` și `colaborari@masajlabirou.ro` sunt afișate explicit ca adrese **în curs de activare**, în acord cu oferta de patru adrese. Nu există încă mailbox sau routing pentru domeniul clientei. Butonul Email duce la pagina Contact.
- Datele publice confirmate (nume, București, telefon și domeniul viitor) sunt grupate în `CLIENT` din `scripts/build.mjs`. Linkurile WhatsApp au mesaje diferite pentru ofertă, discuție și contact rapid. Formularul de ofertă cere separat telefonul și e-mailul. Meniul este închis implicit la toate rezoluțiile și se deschide din butonul cu trei linii ca panou compact peste pagină. Bara de sus își schimbă discret aspectul la scroll fără să-și modifice poziția sau înălțimea; butoanele plutitoare se micșorează.
- Paginile Confidențialitate, Cookie-uri și Termeni de utilizare au fost actualizate pe baza documentului GDPR și a funcțiilor existente. Operatorul trebuie încă să confirme perioadele concrete de retenție, furnizorii și fluxurile după activarea e-mailului. Bannerul informează despre prelucrare, permite deschiderea detaliilor și poate fi redeschis din subsol; memorează local doar închiderea sa, fără o alegere falsă pentru cookie-uri opționale inexistente. Buildul indexabil rămâne blocat până la aprobarea finală.
- Video-ul se adaugă după ce clienta trimite fișierul și confirmă drepturile de utilizare. Componenta actuală arată doar locul rezervat, fără autoplay sau transfer de date către un terț.
- Imaginile generate sunt compoziții editoriale AI, nu fotografii reale ale echipei sau clienților.
- Sursele PNG necomprimate pentru cele două scene sunt în `design-sources/` (1752 × 897 px), iar conceptul inițial și logo-ul rafinat sunt în `brand-private/`. `benvora-grup-logo-v2-4k.webp` are 4096 × 4096 px și este un export mărit din sursa AI de 1254 × 1254 px, nu o randare nativă 4K. `scripts/prepare-logo.py` (Python cu Pillow 12+) regenerează logo-ul sursă; variantele 480/720/800/960/1280 px pentru hero, 480/720/800/960/1280 px pentru scena secundară și faviconul de 64 px sunt exporturi pentru afișare rapidă. Hero-ul păstrează întreaga fotografie într-un cadru limitat pe desktop; fișierele portret rămân în surse, dar nu se mai livrează. Imaginea secțiunii video se încarcă numai la apropierea de secțiune. Scenele de pe site nu sunt randări native 4K/8K.
- Intro-ul animat a fost eliminat la cererea clientei pentru a reduce timpul și încărcarea GPU la deschiderea site-ului.
- Site-ul nu instalează cookie-uri de analiză și nu încarcă fonturi ori scripturi externe. Formularele de ofertă și programare compun local mesajele WhatsApp și e-mail, fără stocare sau trimitere automată. Calendarul selectează o dată și un moment preferate din următoarele șase luni; nu verifică disponibilitatea și nu confirmă rezervări. Mesajele de e-mail se deschid precompletate către adrese încă inactive și sunt prezentate ca atare. Butonul de cont anunță „În curând”; profilurile sociale nu există încă, iar cardurile lor au identități vizuale distincte. Lista de date și pași pentru lansare este în `docs/checklist-lansare.md`.

## Domenii

URL inițial: `https://benvora-grup.avyron.eu/`. Clienta deține deja `masajlabirou.ro`; conectarea lui și a rutării e-mailurilor va avea loc ulterior. `BENVORA_SITE_URL` poate fi setat la `https://masajlabirou.ro` pentru a actualiza împreună canonicalurile, sitemap-ul, datele structurate și `llms.txt`. Două copii identice accesibile pe ambele domenii nu pot fi garantate ca două rezultate indexate: alegeți unul canonic și redirecționați celălalt la migrare.

## Pregătirea indexării finale

1. Revizuiți textele juridice actualizate din `scripts/build.mjs` și confirmați identitatea operatorului, contactul funcțional pentru confidențialitate, furnizorii și perioadele de păstrare.
2. După validarea explicită, schimbați `LEGAL_CONTENT_APPROVED` în `true` într-un PR revizuit. `BENVORA_RELEASE_MODE=indexable npm run build` trebuie să treacă numai după înlocuirea markerelor de previzualizare. Rulați `BENVORA_RELEASE_MODE=indexable npm run check` pe acel build. Nu publicați buildul indexabil înainte de verificarea publică a datelor.
3. Verificați hostname-ul ales, răspunsurile HTTP ale celor cinci pagini principale, absența `noindex` din HTML și antete după aprobare, `robots.txt`, `sitemap.xml`, canonicalurile, redirecționarea `/despre-noi/` și pagina 404. `llms.txt` rezumă paginile reale; manifestele AI Catalog și ARD sunt valide, dar au liste goale deoarece site-ul nu oferă resurse agentice apelabile.
4. După deploy, verificați proprietatea domeniului în Google Search Console, trimiteți sitemap-ul și inspectați URL-urile. Trimiterea sitemap-ului și cererea de indexare nu garantează indexarea.
