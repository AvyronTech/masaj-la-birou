# Domeniul final `masajlabirou.ro` — plan de conectare

Stare verificată la 11 noiembrie 2026. Acest document descrie configurarea pregătită și pașii rămași; domeniul final **nu este încă publicat**.

## Unde este administrat domeniul

- Înregistrarea domeniului este la Hostico, conform proprietarei. Contul Hostico AVYRON deschis pe Mac nu conține acest domeniu; schimbarea nameserverelor necesită acces la contul clientei sau intervenția ei.
- Nameserverele publice sunt încă AWS Route 53: `ns-1042.awsdns-02.org`, `ns-171.awsdns-21.com`, `ns-2021.awsdns-60.co.uk`, `ns-853.awsdns-42.net`. La verificarea publică nu au răspuns înregistrări A, CNAME pentru `www`, MX ori TXT la rădăcină. Scanarea Cloudflare a găsit zero înregistrări; aceasta nu exclude înregistrări pentru subdomenii neobișnuite. Nu a fost găsit un DS public pentru DNSSEC.
- Zona `masajlabirou.ro` a fost adăugată în contul Cloudflare AVYRON pe planul gratuit și este **Pending Nameserver Update**. Nameserverele alocate sunt `dara.ns.cloudflare.com` și `otto.ns.cloudflare.com`. Bot Preference Sync este oprit, pentru a nu modifica `robots.txt` al site-ului.

## Configurație deja pregătită în Cloudflare

| Tip | Nume | Țintă | Proxy | Scop |
| --- | --- | --- | --- | --- |
| CNAME | `@` | `benvora-grup.pages.dev` | Activ | Site-ul la domeniul principal; Cloudflare face flattening la rădăcină. |
| CNAME | `www` | `masajlabirou.ro` | Activ | Permite regulilor edge să răspundă pentru `www`. |

Sunt activate două reguli **301**: `https://www.masajlabirou.ro/*` și `http://www.masajlabirou.ro/*` duc direct la `https://masajlabirou.ro/${1}`, cu păstrarea parametrilor URL. Regula HTTP evită un hop suplimentar prin `www` pe HTTPS.

Nu au fost create înregistrări MX, SPF, DKIM sau DMARC: cele patru adrese din site sunt încă marcate „în curs de activare”, iar furnizorul și destinațiile lor nu sunt confirmate. Un MX inventat ar putea pierde mesaje; SPF/DKIM trebuie să corespundă serviciului ales.

## Pașii de conectare, în ordine

1. În contul Hostico al clientei, confirmați că `masajlabirou.ro` este domeniul corect și inventariați toate înregistrările din zona AWS înainte de a schimba delegarea. Replicați în Cloudflare orice înregistrare de serviciu care trebuie păstrată. Verificați și DNSSEC/DS în registru.
2. Înlocuiți **doar nameserverele** la Hostico cu `dara.ns.cloudflare.com` și `otto.ns.cloudflare.com`. Înregistrarea domeniului rămâne la Hostico. Nu introduceți nameservere Cloudflare în plus față de aceste două.
3. Verificați că răspunsurile NS de la `1.1.1.1` și `8.8.8.8` sunt cele două nume Cloudflare și că zona devine **Active** în Cloudflare. Până atunci, înregistrările pregătite în Cloudflare nu sunt autoritative.
4. După activarea zonei, în proiectul Cloudflare Pages **`benvora-grup` → Custom domains**, adăugați `masajlabirou.ro`. Interfața Pages nu permite încă asocierea domeniului principal cât timp transferul DNS este incomplet. Verificați că starea devine activă și certificatul HTTPS este valid. Un CNAME singur nu finalizează asocierea Pages.
5. Testați independent `https://masajlabirou.ro/`, fiecare pagină internă, resursele statice și `http://`/`https://www.masajlabirou.ro/` cu o cale și parametri. `www` trebuie să dea 301 către aceeași cale la domeniul principal; site-ul trebuie să dea 200 și un certificat valid.
6. Când textele legale sunt validate pentru publicare, generați buildul cu `BENVORA_SITE_URL=https://masajlabirou.ro`, treceți poarta `BENVORA_RELEASE_MODE=indexable` din `scripts/build.mjs`, rulați `npm run build` și `npm run check`, publicați buildul verificat prin Pages Direct Upload și verificați canonical, sitemap, `robots.txt` și antetele publice. Până la validarea juridică, păstrați `noindex`.
7. Decideți dacă `benvora-grup.avyron.eu` rămâne o previzualizare sau redirecționează permanent către domeniul final. Pentru conținut identic, folosiți un singur domeniu canonic. După lansarea indexabilă, verificați proprietatea `masajlabirou.ro` în Search Console și trimiteți sitemap-ul; trimiterea nu garantează indexarea.
8. Pentru `contact@`, `office@`, `programari@` și `colaborari@masajlabirou.ro`, confirmați dacă se doresc cutii poștale sau redirecționări, destinația fiecăreia și cine le administrează. Adăugați exact înregistrările MX/SPF/DKIM/DMARC furnizate de serviciul ales, apoi testați primirea și trimiterea. Abia după aceste teste schimbați eticheta „în curs de activare” și butoanele e-mail din site.
9. Pregătiți transferul zonei Cloudflare, al proiectului Pages și al codului către conturile clientei înainte de lansarea finală sau în termenul contractual de după lansare, cu AVYRON păstrat opțional ca partener. La transfer, verificați din nou DNS, certificatul și regulile de redirect.

## Verificări rapide

```sh
dig @1.1.1.1 NS masajlabirou.ro +short
dig @8.8.8.8 NS masajlabirou.ro +short
dig @1.1.1.1 A masajlabirou.ro +short
dig @1.1.1.1 A www.masajlabirou.ro +short
curl -sSI https://masajlabirou.ro/
curl -sSI 'https://www.masajlabirou.ro/contact/?sursa=test'
dig @1.1.1.1 MX masajlabirou.ro +short
```

Un răspuns DNS sau HTTP izolat nu dovedește că toate serviciile sunt activate. Notați separat starea DNS, Pages/HTTPS, e-mail și indexare.

Buildul de **previzualizare** cu `BENVORA_SITE_URL=https://masajlabirou.ro` a trecut `npm run build` și `npm run check` la 11 noiembrie 2026 (9 pagini și resursele verificate). Acest test local nu activează domeniul și nu înlătură `noindex`.
