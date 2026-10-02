# Implementacions futures

Pla d'indexació / SEO i altres pendents. Creat arran de la conversa sobre
millorar l'aparició de la web buscant el nom propi.

> ⚠️ **NO EXECUTAR res d'aquest document fins que es doni l'ORDRE EXPRESSA
> d'indexar la web.** La web encara està en estat **work in progress**, i no
> volem que els buscadors la comencin a rastrejar/indexar abans que ho decidim.
> Això inclou: no publicar `robots.txt`/`sitemap.xml`, no enviar el sitemap a
> Search Console, no afegir `canonical`/`hreflang` públics, etc. Tot queda
> documentat i llest, però aturat.

Decisions preses:
- Domini: es queda a `marcventosa.github.io` (no CNAME per ara).
- Abast: fer el paquet SEO ràpid quan s'indexi; la indexabilitat del contingut
  dinàmic es deixa per a una fase futura.
- Idiomes: català preferent + anglès (bilingüe). Una sola URL; l'idioma
  es canvia per JS.
- El nom complet ha de ser text semàntic indexable (avui es pinta amb JS).

---

## Context / diagnòstic

La web és gairebé tota dinàmica i client-side: projectes, perfil, educació i
registres es carreguen via `fetch()` (JSON/txt) i s'injecten amb JS. Els
buscadors indexen pitjor aquest contingut que l'HTML estàtic. Punts detectats:

- No hi ha `robots.txt` ni `sitemap.xml`.
- No hi ha metadades socials (`og:`, `twitter:`) ni dades estructurades
  (`application/ld+json`).
- `<title>` = "ventosa san martino" i `description` = "arquitectura i
  enginyeria": no contenen "Marc Ventosa" de manera clara.
- `<html lang="en">` però el contingut per defecte és català (`let lang = 'ca'`
  a `js/i18n.js`): incoherència.
- El nom apareix un sol cop a l'`index.html` (l'email al perfil, línia 167).
  La capçalera pinta "MARC VENTOSA SAN MARTINO" via JS/`<br>`, no com a text
  semàntic fort.
- Sense `canonical`.

Fitxers clau:
- `index.html` (meta tags, capçalera, secció perfil).
- `js/i18n.js` (idioma per defecte `ca`, `applyStrings()`).
- `js/mobile-router.js` (reescriu el nom a mòbil amb `innerHTML`).
- `public/` (Vite el copia a l'arrel de `dist/`; ja s'usa per a
  `strings.en.json` i altres dades d'execució).

---

## Estat actual (work in progress): NO INDEXAR

Mentre la web estigui en WIP, l'objectiu és **evitar** que els buscadors la
indexin. Quan es decideixi, fer servir una d'aquestes vies (triar-ne una i
aplicar-la com a primer pas, ABANS de la Fase 1):

- `public/robots.txt` amb `Disallow: /` (bloqueja tot el rastreig), o
- `<meta name="robots" content="noindex, nofollow">` a `index.html`.

⚠️ Atenció: `robots.txt` evita el rastreig però una URL pot aparèixer igualment
si algú hi enllaça; el `noindex` és el senyal més fiable per no sortir als
resultats. Quan es decideixi indexar, **treure** aquests bloquejos i aplicar la
Fase 1.

---

## Fase 1 — Paquet SEO ràpid (pendent, NOMÉS sota ordre expressa)

### 1.1 Fitxers d'indexació (a `public/`)

- `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://marcventosa.github.io/sitemap.xml
  ```
- `public/sitemap.xml`: una sola `<url>` amb
  `https://marcventosa.github.io/`, `lastmod`, `changefreq`, `priority`.
  (És una SPA; de moment només l'arrel.)
- `CNAME`: **no** (domini es queda a GitHub Pages).

### 1.2 Metadades i nom semàntic a `index.html`

- `<title>` bilingüe (preferència català primer). Opcions:
  - (A) `Marc Ventosa San Martino — arquitectura i enginyeria · architecture & engineering`
  - (B) `Marc Ventosa San Martino — architecture & engineering`
  - Pendent de triar A/B.
- `meta description` amb el nom complet + rol + keywords
  (enginyeria civil, arquitectura, digital twins, patrimoni, ponts).
- `<html lang="ca">` (coherent amb el default real).
- Afegir:
  - `<link rel="canonical" href="https://marcventosa.github.io/">`
  - `og:title`, `og:description`, `og:url`, `og:type=website`,
    `og:image` (+ `og:image:width/height/alt`),
    `og:locale=ca_ES`, `og:locale:alternate=en_US`.
  - `twitter:card=summary_large_image`, `twitter:title/description/image`.
  - `<link rel="alternate" hreflang="ca">` i `hreflang="en"` apuntant tots
    dos a la mateixa URL (auto-referència), i `x-default`.
- Fer el **nom semàntic indexable**: el `<h1 class="site-title">` ha de
  contenir el text complet "Marc Ventosa San Martino" dins del DOM
  (mantenint l'estètica de 3 línies amb `<br>`). Cal revisar
  `js/mobile-router.js` perquè no el destrueixi en `innerHTML` sinó que
  conservi el text pla.

### 1.3 Dades estructurades (`ld+json` a `index.html`)

- `Person`:
  - `name`: "Marc Ventosa San Martino"
  - `alternateName`
  - `jobTitle`
  - `url`, `email`
  - `sameAs`: LinkedIn (`https://linkedin.com/in/marc-ventosa`),
    UPCommons, ScienceDirect
  - `alumniOf`: UPC (Escola de Camins), KU Leuven
  - `knowsAbout`
- És el que fa que Google et reconegui com a entitat/persona.

### 1.4 OG image (pendent de triar)

Cal una imatge **1200×630 px** (JPG/PNG), p.ex. `images/og-image.jpg` o a
`public/`. Opcions:
1. Retrat teu amb fons net.
2. Captura del slitscan / landing (coherent amb la web).
3. Imatge de projecte icònica (maqueta, collage).
4. Deixar com a TODO.

`og:image` és el que fa que, en compartir l'enllaç (WhatsApp, LinkedIn, X,
iMessage…), aparegui una targeta amb imatge en lloc d'un enllaç pelat. Sense
aquest fitxer, la targeta surt sense imatge.

### 1.5 Verificació

- Enviar `sitemap.xml` a **Google Search Console** i verificar propietat.
- Comprovar la targeta social amb un debugger (Facebook Sharing Debugger /
  LinkedIn Post Inspector).
- Validar el `ld+json` amb el Rich Results Test.

---

## Fase 2 — Futur (fora d'abast ara)

- **Indexabilitat del contingut dinàmic**: projectes, registres, educació i
  perfil es carreguen per JS. Opcions:
  - Opció A (mínima): secció `<noscript>` o `hidden` amb text pla resum
    (nom, bio, projectes, estudis, registres) perquè els crawlers el vegin.
  - Opció B (robusta): pre-renderitzat en build (SSG) o pàgines estàtiques
    per projecte.
- Valorar domini propi en el futur (implicaria `CNAME`, `canonical`,
  sitemap i possibles URLs per idioma).
- Considerar URLs separades per idioma (avui: una URL, idioma per JS).

---

## Pendents de decisió (bloquejants de la Fase 1, quan s'indexi)

1. Títol bilingüe: opció (A) o (B)?
2. OG image: opció 1 / 2 / 3 / 4?
3. Confirmar que es pot tocar `index.html` + `js/mobile-router.js` per fer
   el nom semàntic mantenint el disseny de 3 línies.
4. Confirmar que els fitxers d'indexació van a `public/` (per arribar a
   `dist/`, com amb `strings.en.json`).
