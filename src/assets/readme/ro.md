# Angular Landing Template (SSR + Prerender)

Șablon modern de pornire Angular 21 pentru construirea de pagini de prezentare rapide, cu
**prerandare SSR**, **TailwindCSS** și **deploy pe GitHub Pages**.

Acest șablon este optimizat pentru site-uri statice de tip landing page, unde paginile sunt
randate la **momentul build-ului** pentru SEO și performanță.

---

# Acknowledge

- Angular **21**
- **Prerandare SSR** în timpul build-ului
- **Angular fără zone**
- Starea folosită în binding-urile de clase HTML trebuie expusă ca **signals**
- Preferă **Angular Signal Forms** ca abordare principală pentru formularele noi
- **Detecție a schimbărilor OnPush implicit**
- **TailwindCSS v4**
- Folosește variabilele CSS partajate de temă din `src/styles/_theme.scss` pentru culori,
  suprafețe, spațiere, raze și mișcare
- **Deploy pe GitHub Pages**
- **Formatare Prettier**
- Structură de proiect curată și minimală

Proiectul generează ambele directoare:

```
dist/app/browser
dist/app/server
```

Dar deploy-ul folosește output-ul **browser prerendered**, ceea ce îl face ideal pentru hosting
static.

---

# Project Structure

```
src/
  app/
    app.component.ts
    app.config.ts
    app.config.server.ts
    app.routes.ts
    app.routes.server.ts
    layouts/
    pages/
  assets/
  environments/
  styles/
  styles.scss
```

Configurația SSR se află în:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Pornește serverul de dezvoltare:

```
npm start
```

sau

```
ng serve
```

Aplicația rulează la [http://localhost:4200](http://localhost:4200)

Modul de dezvoltare rulează ca un Angular SPA obișnuit.

---

# Build

Construiește proiectul:

```
npm run build
```

Acest lucru generează:

```
dist/app/browser
dist/app/server
```

Paginile sunt **prerandate la momentul build-ului** folosind Angular SSR.

---

# Running the SSR server (optional)

Șablonul include un server Node pentru SSR:

```
npm run serve:ssr:app
```

Acesta rulează:

```
node dist/app/server/server.mjs
```

Pentru majoritatea landing page-urilor acest lucru **nu este necesar**, deoarece HTML-ul
prerandat este deja generat.

---

# Prerender configuration

Toate rutele sunt prerandate implicit:

```
src/app/app.routes.server.ts
```

```
RenderMode.Prerender
```

```ts
export const serverRoutes: ServerRoute[] = [
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
```

Acest lucru face ca Angular să genereze HTML static pentru fiecare rută în timpul build-ului.

---

# Bootstrap Data

The app includes a small bootstrap data flow for company and item data.

Main files:

```text
src/app/app.config.ts
src/app/feature/bootstrap/bootstrap.service.ts
src/app/feature/bootstrap/bootstrap.interface.ts
src/app/feature/company/company.service.ts
src/app/feature/item/item.service.ts
src/environments/environment.prod.ts
```

How it works:

- `APP_INITIALIZER` runs `BootstrapService.initialize()` during app startup
- on the server, bootstrap data is fetched from `${environment.apiUrl}/api/regionit/bootstrap/${environment.companyId}`
- fetched data is stored in Angular `TransferState`
- on the browser, transferred data is applied immediately and then refreshed in the background
- if no remote data is available, the app falls back to `environment.company` and `environment.items`

Bootstrap payload shape:

```ts
export interface BootstrapData {
	company?: Company;
	items?: Item[];
}
```

Environment keys involved:

- `apiUrl` - API host used for bootstrap and status checks
- `companyId` - company identifier sent to the bootstrap endpoint
- `company` - fallback company data used before or instead of API data
- `items` - fallback item list used before or instead of API data
- `onApiFall` - controls what happens when the API is unavailable

Current fallback behavior in code:

- `'app'` keeps rendering the app with local environment data
- `'app reload'` keeps polling `${environment.apiUrl}/status` and reloads when the API becomes available

## This keeps SSR and prerender safe while still allowing the app to hydrate with API data when it exists.

# TailwindCSS

Tailwind este configurat prin:

```
.postcssrc.json
```

Tailwind ar trebui folosit cât mai mult posibil pentru munca UI de zi cu zi.

Preferă utilitarele Tailwind pentru:

- layout
- spațiere
- tipografie
- culori
- borduri
- dimensionare
- comportament responsive

Folosește SCSS doar când Tailwind nu este unealta potrivită, de exemplu:

- stilizare complexă specifică unei componente
- token-uri de design și mixin-uri partajate
- stări sau selectori avansați
- cantități mici de stiluri globale

Stilurile globale se află în:

```
src/styles.scss
```

---

# Icons

Acest șablon include **Material Symbols Outlined**, iar acestea ar trebui folosite ca setul
implicit de iconițe în întregul proiect.

Sunt încărcate în:

```
src/index.html
```

Folosește iconițele direct în HTML astfel:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Pentru butoane accesibile, păstrează iconița decorativă și oferă o etichetă text sau
`aria-label` pe buton:

```html
<button type="button" aria-label="Deschide meniul">
	<span class="material-symbols-outlined" aria-hidden="true">menu</span>
</button>
```

---

# Translations And Languages

UI translations live in:

```text
src/i18n/<code>.ts
src/i18n/index.ts
```

Language metadata lives in:

```text
src/app/feature/language/language.type.ts
src/app/feature/language/language.interface.ts
src/app/feature/language/language.const.ts
src/app/feature/language/language.service.ts
```

Translation bootstrap starts in:

```text
src/app/app.config.ts
```

The app uses the `wacom` translation stack:

- `provideTranslate(...)` registers the default language from `src/i18n/index.ts`
- `LanguageService` switches languages with `TranslateService.setMany(...)`
- English source text is used as the translation key

When adding or updating translations:

- add or update the matching `src/i18n/<code>.ts` dictionary
- keep `src/i18n/index.ts` in sync with the available language files
- keep language codes aligned with `LanguageCode`
- update `LANGUAGES` when adding or renaming a supported language
- keep English source text identical across templates, components, and `src/i18n/*`
- store translation text and language labels as real UTF-8 characters, not escaped or re-encoded mojibake
- remove unused translation keys when they are no longer referenced anywhere in the app

Supported usage patterns:

- Use the `translate` directive for plain element text content
- Use the `translate` pipe for interpolations and attribute bindings
- Use `TranslateService.translate('Key')()` in TypeScript when the translated value is needed inside `computed()` or composed strings

Examples:

```html
<span translate>Open language menu</span>
<button [aria-label]="'Go to homepage' | translate" type="button"></button>
```

```ts
private readonly _translateService = inject(TranslateService);

protected readonly toggleLabel = computed(() =>
	this._translateService.translate('Switch to dark mode')(),
);
```

---

# SCSS Conventions

Folosește SCSS într-un mod care se potrivește cu valorile implicite moderne din Angular:

- Păstrează majoritatea stilurilor în fișierul `.scss` al componentei.
- Folosește `src/styles.scss` doar pentru stiluri cu adevărat globale, precum resetări, token-uri,
  tipografie și straturi utilitare.
- Preferă variabilele CSS pentru culori, spațiere și teming care se pot schimba la runtime.
- Folosește facilități SCSS precum `@use`, mixin-uri și partials pentru confort la scriere și
  token-uri de design partajate.
- Evită imbricarea profundă a selectorilor. Păstrează selectorii simpli și locali componentei.
- Evită `::ng-deep` și `ViewEncapsulation.None` dacă nu există un motiv clar de integrare.
- Preferă class bindings în template-uri în locul binding-urilor inline de stil complexe.

Împărțire recomandată:

```text
src/styles.scss           -> punct de intrare global
src/app/**/**/*.scss      -> stiluri locale componentelor
src/styles/_theme.scss    -> variabile CSS partajate ale temei
```

---

# Environments

Acest șablon include fișiere Angular environment și ele pot fi folosite pentru configurări
runtime diferite, precum dezvoltare locală și build-uri de producție.

Fișiere disponibile:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Cazuri de utilizare tipice:

- URL-uri de bază pentru API
- feature flags
- comutatoare pentru analytics
- configurare pentru servicii externe

Build-urile de producție înlocuiesc `environment.ts` cu `environment.prod.ts` prin file
replacements Angular.

Păstrează fișierele environment limitate la configurarea publică de front-end. Nu stoca secrete în
ele.

---

# Deployment

Deploy-ul este gestionat automat prin **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Pași:

1. Instalează dependențele
2. Construiește aplicația Angular
3. Copiază `CNAME`
4. Trimite output-ul build-ului în `gh-pages`

Folderul publicat este:

```
dist/app/browser
```

---

# Domain

Domeniu personalizat pe care ar trebui să îl adaptezi la propriul domeniu pentru a funcționa
corect, orice subdomeniu al `*.itkamianets.com` dacă nu este deja folosit în organizația noastră
GitHub.

```
ngx.itkamianets.com
```

Configurat prin:

```
CNAME
```

---

# Code Style

Formatarea este gestionată de:

- `.editorconfig`
- `.prettierrc`

Convenții cheie:

- **tab-uri**
- **ghilimele simple**
- **lățime maximă de linie de 100 de caractere**

---

# AI Usage

Dacă folosești AI în afara IDE-ului și acesta nu citește automat instrucțiunile repository-ului,
copiază mai întâi conținutul din `AGENTS.md` în promptul/contextul AI.

Acest lucru asigură că AI-ul urmează aceleași reguli specifice proiectului pe care Codex le
folosește în IDE.

---

# NPM Scripts

Pornește dezvoltarea:

```
npm start
```

Construiește proiectul:

```
npm run build
```

Rulează serverul SSR:

```
npm run serve:ssr:app
```

---

# Requirements

Mediu recomandat:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Paginile aplicației ar trebui create în:

```text
src/app/pages/
```

Fiecare pagină ar trebui să aibă propriul folder și propriul fișier de componentă.

Exemplu:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Generează o componentă de pagină cu Angular CLI:

```bash
ng generate component pages/home
```

sau mai scurt:

```bash
ng g c pages/home
```

Paginile ar trebui lazy loaded din `src/app/app.routes.ts`.

Exemplu de configurare a rutelor:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
	},
	{
		path: 'about',
		loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
	},
];
```

---

## Feature structure for back-end connected modules

Dacă o parte a aplicației are nevoie de propria logică de business și integrare cu back-end-ul,
creează un folder feature dedicat în:

```text
src/app/feature/
```

Fiecare feature ar trebui să își păstreze propria structură internă.

Exemplu:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Exemplu de locație pentru serviciu:

```text
src/app/feature/user/services/user.service.ts
```

Comenzi CLI sugerate:

Creează pagină de feature:

```bash
ng g c feature/user/pages/user-profile
```

Creează componentă de feature:

```bash
ng g c feature/user/components/user-card
```

Creează directivă de feature:

```bash
ng g d feature/user/directives/user-focus
```

Creează pipe de feature:

```bash
ng g p feature/user/pipes/user-name
```

Creează serviciu de feature:

```bash
ng g s feature/user/services/user
```

Interfețele sunt de obicei create manual:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Pentru feature-uri mici și concentrate, fișiere grupate precum `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts` și `language.service.ts` sunt de asemenea valide
atunci când acea structură păstrează feature-ul mai simplu.

---

## Generic shared code

Codul generic reutilizabil care nu este legat de un singur feature specific poate sta direct sub
`src/app`.

Exemple de foldere partajate:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Exemplu de locație pentru un pipe partajat:

```text
src/app/pipes/phone.pipe.ts
```

Comenzi CLI sugerate:

Creează componentă partajată:

```bash
ng g c components/page-header
```

Creează directivă partajată:

```bash
ng g d directives/autofocus
```

Creează pipe partajat:

```bash
ng g p pipes/phone
```

Creează serviciu partajat:

```bash
ng g s services/api
```

Interfețele sunt de obicei create manual:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Folosește implicit aceste locații:

- `src/app/pages` - pagini la nivel de aplicație încărcate lazy
- `src/app/feature/<name>` - cod specific feature-ului cu logică de business/back-end
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - cod generic partajat

# Create a new project from this template

Clonează repository-ul de bază într-un folder nou cu numele proiectului tău (înlocuiește
`PROJECT_NAME` cu numele proiectului):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Descarcă repository-ul șablon și creează un folder local numit `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Deschide folderul nou creat al proiectului.
- `npm i`
  Instalează toate dependențele proiectului din `package.json`.
- `npm run start`
  Pornește serverul local de dezvoltare.

După aceea, deschide URL-ul local afișat în terminal, de obicei
[http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Dacă vrei să începi de la zero în loc să păstrezi istoricul git al șablonului, elimină folderul
`.git` existent, inițializează un repository nou și creează primul commit.

Exemplu:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` conectează repository-ul tău local la repository-ul GitHub remote,
astfel încât viitoarele comenzi `git push` și `git pull` să știe unde se află proiectul principal.

Folosește și pentru primul commit un mesaj Conventional Commit. O variantă bună implicită este:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
