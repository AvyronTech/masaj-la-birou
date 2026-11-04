# Benvora Grup — date și pași pentru lansare

## De confirmat cu clienta

1. **Identitate juridică pentru paginile legale:** denumirea completă, datele de înregistrare, adresa care trebuie afișată și un contact pentru solicitări privind datele personale. Informațiile din documentul inițial rămân nepublicate până la validarea expresă.
2. **Serviciu și contact:** confirmarea numărului public de telefon și WhatsApp, aria de acoperire (acum: București), formatele oferite și orice condiții pe care clienta dorește să le comunice public.
3. **Domeniu și e-mail:** accesul proprietarei la `masajlabirou.ro`, destinația fiecăreia dintre cele patru adrese propuse (`contact`, `office`, `programari`, `colaborari`) și cine le administrează. Până la activare, site-ul le afișează drept „în curs de activare”.
4. **Social media:** cine deține profilurile TikTok, Instagram și Facebook, numele publice și linkurile exacte după creare. Butoanele din site arată acum „În curând”, fără linkuri inventate.
5. **Materiale:** video-ul demonstrativ, acordurile de utilizare a imaginilor și eventuale fotografii reale, dacă se dorește înlocuirea imaginilor ilustrative.
6. **Conturi și aprobări:** persoana care va fi proprietara conturilor GitHub, Cloudflare, Google Business Profile și Search Console; confirmarea textelor, a paginilor legale și a versiunii finale înainte de publicare/indexare.

## De realizat pe partea IT

1. **Release:** revizuirea și aprobarea PR-ului, build final, verificare vizuală pe mobil/desktop, apoi publicarea pe subdomeniul `benvora-grup.avyron.eu` numai după aprobare. Versiunea publică actuală este mai veche decât codul din PR.
2. **Legal și indexare:** completarea politicii de confidențialitate cu identitatea operatorului, fluxurile reale de date, furnizorii, temeiurile și perioadele de păstrare; revizuirea cookie-urilor și termenilor. Apoi dezactivarea modului de previzualizare, verificarea `robots.txt`, sitemapului, canonicalurilor și trimiterea în Search Console.
3. **Domeniu:** conectarea ulterioară a `masajlabirou.ro`, certificat HTTPS, redirecturi, actualizarea URL-ului canonic, a sitemapului și a datelor structurate.
4. **E-mail:** crearea cutiilor sau a rutărilor confirmate de clientă, DNS pentru e-mail (MX, SPF, DKIM, DMARC), verificarea trimiterii și primirii. Până atunci, contactul rămâne prin telefon/WhatsApp.
5. **Leaduri:** alegerea destinației solicitărilor; după activarea e-mailului, implementarea și testarea formularului de contact, a protecției anti-spam și a informării despre date. Site-ul actual nu conține formular.
6. **Conturi client:** stabilirea scopului, rolurilor și datelor necesare pentru înregistrare/conectare și dashboard. Butonul actual anunță „În curând”; nu există încă autentificare sau dashboard funcțional.
7. **Canale și conținut:** crearea profilurilor sociale, verificarea proprietarului și a linkurilor, încărcarea video-ului optimizat, configurarea profilului Google Business și a accesului de administrare.
8. **Predare:** transferul codului, proiectului Cloudflare, domeniului și serviciilor către conturile clientei, cu accesul Avyron păstrat doar conform acordului.
