# Benvora Grup — date și pași pentru lansare

## De confirmat cu clienta

1. **Identitate juridică pentru paginile legale:** confirmați pentru publicare denumirea completă, CUI, numărul de înregistrare, sediul și persoana de contact GDPR preluate din documentul GDPR recent. Confirmați și canalul funcțional pentru exercitarea drepturilor până la activarea adresei de e-mail.
2. **Serviciu și contact:** confirmarea numărului public de telefon și WhatsApp, aria de acoperire (acum: București), formatele oferite și orice condiții pe care clienta dorește să le comunice public.
3. **Domeniu și e-mail:** accesul proprietarei la `masajlabirou.ro`, destinația fiecăreia dintre cele patru adrese propuse (`contact`, `office`, `programari`, `colaborari`) și cine le administrează. Până la activare, site-ul le afișează drept „în curs de activare”.
4. **Programări:** zilele și orele reale de lucru, durata unei sesiuni, timpul necesar între vizite și persoana care confirmă cererile. Calendarul actual colectează numai preferințe; nu prezintă disponibilitate live.
5. **Social media:** cine deține profilurile TikTok, Instagram și Facebook, numele publice și linkurile exacte după creare. Butoanele din site arată acum „În curând”, fără linkuri inventate.
6. **Materiale:** video-ul demonstrativ, acordurile de utilizare a imaginilor și eventuale fotografii reale, dacă se dorește înlocuirea imaginilor ilustrative.
7. **Conturi și aprobări:** persoana care va fi proprietara conturilor GitHub, Cloudflare, Google Business Profile și Search Console; confirmarea textelor, a paginilor legale și a versiunii finale înainte de publicare/indexare.

## De realizat pe partea IT

1. **Release:** revizuirea PR-ului, build final, verificare vizuală pe mobil/desktop, publicarea autorizată pe `benvora-grup.avyron.eu` și verificarea răspunsului public pentru fiecare pagină și resursă.
2. **Legal și indexare:** revizuiți textele actualizate și confirmați furnizorii, transferurile internaționale dacă există și perioadele concrete de păstrare pentru fluxurile reale. După aprobarea explicită, permiteți buildul indexabil prin poarta din `scripts/build.mjs`, verificați absența `noindex` din cele cinci pagini principale și antetele lor, `robots.txt`, sitemap-ul, canonicalurile, redirecționarea `/despre-noi/` și răspunsul 404. Abia apoi trimiteți sitemap-ul în Search Console și verificați fiecare URL cu URL Inspection; trimiterea nu echivalează cu indexarea.
3. **Domeniu:** conectați ulterior `masajlabirou.ro` cu HTTPS și accesul proprietarei. Ambele adrese pot rămâne accesibile, dar copiile identice trebuie să indice un singur domeniu canonic. La mutare, setați `BENVORA_SITE_URL=https://masajlabirou.ro`, testați URL-urile echivalente, aplicați redirecționări permanente de la subdomeniu și actualizați sitemap-ul și proprietățile Search Console.
4. **E-mail:** crearea cutiilor sau a rutărilor confirmate de clientă, DNS pentru e-mail (MX, SPF, DKIM, DMARC), verificarea trimiterii și primirii. Până atunci, contactul rămâne prin telefon/WhatsApp.
5. **Leaduri și programări:** formularele actuale pregătesc local mesaje WhatsApp și e-mail, pe care vizitatorul le verifică și le trimite manual. Pentru disponibilitate live sau rezervare confirmată sunt necesare programul real, un calendar operațional, reguli de alocare, notificări și teste de conflict între cereri. Pentru primirea cererilor direct în dashboard sau e-mail sunt necesare destinația confirmată, protecția anti-spam, testele de livrare și actualizarea informării despre date.
6. **Conturi client:** stabilirea scopului, rolurilor și datelor necesare pentru înregistrare/conectare și dashboard. Butonul actual anunță „În curând”; nu există încă autentificare sau dashboard funcțional.
7. **Canale și conținut:** crearea profilurilor sociale, verificarea proprietarului și a linkurilor, încărcarea video-ului optimizat, configurarea profilului Google Business și a accesului de administrare.
8. **Predare:** transferul codului, proiectului Cloudflare, domeniului și serviciilor către conturile clientei, cu accesul Avyron păstrat doar conform acordului.
