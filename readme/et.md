# Angular Landing Template (SSR + Prerender)

Kaasaegne Angular 21 stardimall kiirete landing page'ide loomiseks koos **SSR prerendering**, **TailwindCSS** ja **GitHub Pages deployment** toega.

See mall on optimeeritud staatiliste landing site'ide jaoks, kus lehed renderdatakse **build time** ajal SEO ja jõudluse jaoks.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** build'i ajal
- **Zoneless Angular**
- HTML class bindings jaoks kasutatav state peaks olema saadaval kui **signals**
- Uute vormide loomisel eelista põhivormilahendusena **Angular Signal Forms**
- **OnPush change detection by default**
- **TailwindCSS v4**
- Kasuta jagatud **theme CSS variables** väärtusi failist `src/styles/_theme.scss` värvide, pindade, vahede, raadiuse ja liikumise jaoks
- **GitHub Pages deployment**
- **Prettier formatting**
- Puhas minimalistlik projektistruktuur

Projekt ehitab mõlemad:

```
dist/app/browser
dist/app/server
```

Aga deployment kasutab **browser prerendered output** väljundit, mis teeb selle ideaalseks staatiliseks hostimiseks.

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

SSR configuration asub failides:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Käivita development server:

```
npm start
```

või

```
ng serve
```

Rakendus töötab aadressil [http://localhost:4200](http://localhost:4200)

Development mode töötab nagu tavaline Angular SPA.

---

# Build

Ehita projekt:

```
npm run build
```

See genereerib:

```
dist/app/browser
dist/app/server
```

Lehed on **prerendered at build time** Angular SSR-i abil.

---

# Running the SSR server (optional)

Mall sisaldab Node server'it SSR-i jaoks:

```
npm run serve:ssr:app
```

See käivitab:

```
node dist/app/server/server.mjs
```

Enamiku landing page'ide puhul ei ole see **vajalik**, sest prerendered HTML on juba loodud.

---

# Prerender configuration

Kõik routes prerenderdatakse vaikimisi:

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

See paneb Angulari build'i ajal genereerima iga route'i jaoks staatilise HTML-i.

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

Tailwind on seadistatud läbi:

```
.postcssrc.json
```

Tailwindit tuleks kasutada nii palju kui võimalik igapäevase UI-töö jaoks.

Eelista Tailwind utilities kasutamist järgmise jaoks:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Kasuta SCSS-i ainult siis, kui Tailwind ei ole õige tööriist, näiteks:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- väikesed kogused globaalset stiili

Globaalsed stiilid asuvad siin:

```
src/styles.scss
```

---

# Icons

See mall sisaldab **Material Symbols Outlined** ikoone ning neid tuleks kasutada projekti vaikimisi ikoonikomplektina.

Laetud failis:

```
src/index.html
```

Kasuta ikoone otse HTML-is nii:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Ligipääsetavate nuppude puhul hoia ikoon dekoratiivne ning lisa nupule endale tekstisilt või `aria-label`:

```html
<button type="button" aria-label="Open menu">
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

Kasuta SCSS-i viisil, mis vastab kaasaegsetele Angular defaults põhimõtetele:

- Hoia enamik styles'e component `.scss` file sees.
- Kasuta `src/styles.scss` ainult tõeliselt globaalsete styles'ide jaoks, nagu resets, tokens, typography ja utility layers.
- Eelista CSS variables kasutamist värvide, vahede ja theming jaoks, mis võivad runtime'i ajal muutuda.
- Kasuta SCSS-i võimalusi nagu `@use`, mixins ja partials mugavamaks authoring'uks ning jagatud design tokens jaoks.
- Väldi sügavat selector nesting'ut. Hoia selectors lihtsad ja component'i suhtes lokaalsed.
- Väldi `::ng-deep` ja `ViewEncapsulation.None`, kui selleks pole selget integratsioonipõhjust.
- Eelista templates class bindings kasutamist raskete inline style bindings asemel.

Soovitatav jaotus:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

See mall sisaldab Angular environment files'e ning neid saab kasutada erinevate runtime setups jaoks nagu kohalik arendus ja production builds.

Saadaval olevad failid:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Tüüpilised kasutusjuhud:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Production builds asendavad `environment.ts` faili `environment.prod.ts` failiga Angular file replacements kaudu.

Hoia environment files ainult avaliku front-end konfiguratsiooni jaoks. Ära salvesta neisse saladusi.

---

# Deployment

Deployment toimub automaatselt läbi **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Sammud:

1. Installi dependencies
2. Ehita Angular app
3. Kopeeri `CNAME`
4. Push'i build output `gh-pages` harusse

Deployitud kaust on:

```
dist/app/browser
```

---

# Domain

Custom domain, mida peaksid muutma enda domeeniks, et kõik töötaks korrektselt; sobib ükskõik milline `*.itkamianets.com` alamdomeen, kui seda ei ole meie github org'is varem kasutatud.

```
ngx.itkamianets.com
```

Seadistatud läbi:

```
CNAME
```

---

# Code Style

Vormindamist haldavad:

- `.editorconfig`
- `.prettierrc`

Peamised kokkulepped:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Kui kasutad AI-d väljaspool IDE-d ja see ei loe repository juhiseid automaatselt, kopeeri kõigepealt
`AGENTS.md` sisu AI prompt/context sisse.

See tagab, et AI järgib samu projektispetsiifilisi reegleid, mida Codex kasutab IDE sees.

---

# NPM Scripts

Käivita development:

```
npm start
```

Ehita projekt:

```
npm run build
```

Käivita SSR server:

```
npm run serve:ssr:app
```

---

# Requirements

Soovitatav keskkond:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Application pages tuleks luua kausta:

```text
src/app/pages/
```

Igal lehel peaks olema oma kaust ja oma component file.

Näide:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Genereeri page component Angular CLI abil:

```bash
ng generate component pages/home
```

või lühemalt:

```bash
ng g c pages/home
```

Pages tuleks lazy load'ida failist `src/app/app.routes.ts`.

Näidis route config:

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

Kui osa rakendusest vajab oma business logic'ut ja back-end integration'it, loo eraldi feature folder kausta:

```text
src/app/feature/
```

Iga feature peaks hoidma oma sisemist struktuuri.

Näide:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Näide service'i asukohast:

```text
src/app/feature/user/services/user.service.ts
```

Soovitatud CLI käsud:

Loo feature page:

```bash
ng g c feature/user/pages/user-profile
```

Loo feature component:

```bash
ng g c feature/user/components/user-card
```

Loo feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Loo feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Loo feature service:

```bash
ng g s feature/user/services/user
```

Interfaces luuakse tavaliselt käsitsi:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Väikeste fokusseeritud feature'ite puhul on ka colocated files nagu `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts` ja `language.service.ts` sobivad, kui see
struktuur hoiab feature'i lihtsamana.

---

## Generic shared code

Üldine taaskasutatav kood, mis ei ole seotud ühe kindla feature'iga, võib asuda otse `src/app` all.

Näited shared folders'itest:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Näide shared pipe asukohast:

```text
src/app/pipes/phone.pipe.ts
```

Soovitatud CLI käsud:

Loo shared component:

```bash
ng g c components/page-header
```

Loo shared directive:

```bash
ng g d directives/autofocus
```

Loo shared pipe:

```bash
ng g p pipes/phone
```

Loo shared service:

```bash
ng g s services/api
```

Interfaces luuakse tavaliselt käsitsi:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Kasuta vaikimisi neid asukohti:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Klooni default repository uude kausta oma projekti nimega (asenda `PROJECT_NAME` oma projekti nimega):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Laeb alla template repository ja loob lokaalse kausta nimega `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Avab äsja loodud projekti kausta.
- `npm i`
  Installib kõik projekti dependencies failist `package.json`.
- `npm run start`
  Käivitab lokaalse development server'i.

Pärast seda ava terminalis kuvatud kohalik URL, tavaliselt [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Kui soovid alustada puhtalt lehelt selle asemel, et hoida template git history't, eemalda olemasolev `.git` folder, initsialiseeri uus repository ja loo esimene commit.

Näide:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` ühendab sinu lokaalse repository remote GitHub repository'ga, et tulevased `git push` ja `git pull` käsud teaksid, kus sinu põhiprojekt asub.

Kasuta esimese commit'i jaoks samuti Conventional Commit message'it. Hea vaikimisi variant on:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
