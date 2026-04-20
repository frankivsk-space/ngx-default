# Angular Landing Template (SSR + Prerender)

Moderan početni Angular 21 predložak za izradu brzih landing stranica s **SSR prerenderingom**, **TailwindCSS-om** i **deployom na GitHub Pages**.

Ovaj je predložak optimiziran za statične landing stranice, gdje se stranice renderiraju **tijekom builda** radi SEO-a i performansi.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** tijekom builda
- **Zoneless Angular**
- Stanje koje se koristi u HTML class bindings mora biti dostupno kao **signals**
- Za nove forme preferirajte **Angular Signal Forms** kao primarni pristup
- **OnPush change detection po zadanim postavkama**
- **TailwindCSS v4**
- Koristite zajedničke **theme CSS variables** iz `src/styles/_theme.scss` za boje, površine, razmake, radijuse i animacije
- **Deploy na GitHub Pages**
- **Prettier formatiranje**
- Čista minimalistička struktura projekta

Projekt generira oba direktorija:

```
dist/app/browser
dist/app/server
```

Ali za deployment koristi se **browser prerendered output**, što ga čini idealnim za statični hosting.

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

SSR konfiguracija nalazi se u:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Pokrenite development server:

```
npm start
```

ili

```
ng serve
```

Aplikacija radi na [http://localhost:4200](http://localhost:4200)

Razvojni način rada ponaša se kao uobičajeni Angular SPA.

---

# Build

Izgradite projekt:

```
npm run build
```

To generira:

```
dist/app/browser
dist/app/server
```

Stranice se **prerendered at build time** pomoću Angular SSR-a.

---

# Running the SSR server (optional)

Predložak sadrži Node server za SSR:

```
npm run serve:ssr:app
```

Time se pokreće:

```
node dist/app/server/server.mjs
```

Za većinu landing stranica to **nije potrebno**, jer je prerendered HTML već generiran.

---

# Prerender configuration

Sve routes su prerenderirane prema zadanim postavkama:

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

To tjera Angular da generira statični HTML za svaki route tijekom builda.

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

Tailwind je konfiguriran putem:

```
.postcssrc.json
```

Tailwind treba koristiti što je češće moguće za svakodnevni UI rad.

Preferirajte Tailwind utilities za:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Koristite SCSS samo kada Tailwind nije pravi alat, na primjer za:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- malu količinu globalnih stilova

Globalni stilovi nalaze se u:

```
src/styles.scss
```

---

# Icons

Ovaj predložak uključuje **Material Symbols Outlined** i njih treba koristiti kao standardni set ikona u cijelom projektu.

Uključeni su u:

```
src/index.html
```

Ikone koristite izravno u HTML-u ovako:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Za pristupačne gumbe ostavite ikonu dekorativnom i dodajte tekstualnu oznaku ili `aria-label` na sam gumb:

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

Koristite SCSS na način koji slijedi moderne Angular defaults:

- Većinu stilova držite unutar `.scss` datoteke komponente.
- Koristite `src/styles.scss` samo za stvarno globalne stilove kao što su resets, tokens, typography i utility layers.
- Preferirajte CSS variables za boje, razmake i theming koji se mogu mijenjati tijekom runtimea.
- Koristite SCSS mogućnosti poput `@use`, mixins i partials za lakše autoriranje i dijeljene design tokene.
- Izbjegavajte duboko ugnježđivanje selector-a. Držite selectors jednostavnima i lokalnima za komponentu.
- Izbjegavajte `::ng-deep` i `ViewEncapsulation.None` osim ako ne postoji jasan integracijski razlog.
- Preferirajte class bindings u templates umjesto teških inline style bindings.

Preporučena podjela:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Ovaj predložak sadrži Angular environment datoteke i mogu se koristiti za različite runtime postavke, poput lokalnog razvoja i production buildova.

Dostupne datoteke:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Tipični slučajevi upotrebe:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Production buildovi zamjenjuju `environment.ts` s `environment.prod.ts` putem Angular file replacements.

Environment datoteke koristite samo za javnu front-end konfiguraciju. Nemojte u njih spremati tajne.

---

# Deployment

Deployment se izvršava automatski putem **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Koraci:

1. Instalirati ovisnosti
2. Buildati Angular aplikaciju
3. Kopirati `CNAME`
4. Poslati build output u `gh-pages`

Direktorij za deployment:

```
dist/app/browser
```

---

# Domain

Prilagođena domena koju trebate zamijeniti svojom kako bi sve radilo ispravno; može biti bilo koja poddomena `*.itkamianets.com` ako se još ne koristi u našoj GitHub organizaciji.

```
ngx.itkamianets.com
```

Konfigurira se putem:

```
CNAME
```

---

# Code Style

Formatiranje se provodi putem:

- `.editorconfig`
- `.prettierrc`

Ključna pravila:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Ako koristite AI izvan IDE-a i on ne čita automatski upute repozitorija, najprije kopirajte sadržaj `AGENTS.md` u prompt/context AI-ja.

Time se osigurava da će AI slijediti ista projektna pravila kojih se Codex pridržava unutar IDE-a.

---

# NPM Scripts

Pokretanje developmenta:

```
npm start
```

Build projekta:

```
npm run build
```

Pokretanje SSR servera:

```
npm run serve:ssr:app
```

---

# Requirements

Preporučeno okruženje:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Stranice aplikacije treba stvarati u:

```text
src/app/pages/
```

Svaka stranica treba imati vlastitu mapu i vlastitu component datoteku.

Primjer:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Generirajte page component pomoću Angular CLI-ja:

```bash
ng generate component pages/home
```

ili kraće:

```bash
ng g c pages/home
```

Pages trebaju biti lazy loaded iz `src/app/app.routes.ts`.

Primjer route konfiguracije:

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

Ako neki dio app-a zahtijeva vlastitu business logic i integraciju s back-endom, stvorite zasebnu feature mapu u:

```text
src/app/feature/
```

Svaka feature treba zadržati vlastitu unutarnju strukturu.

Primjer:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Primjer lokacije service-a:

```text
src/app/feature/user/services/user.service.ts
```

Preporučene CLI naredbe:

Stvoriti feature page:

```bash
ng g c feature/user/pages/user-profile
```

Stvoriti feature component:

```bash
ng g c feature/user/components/user-card
```

Stvoriti feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Stvoriti feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Stvoriti feature service:

```bash
ng g s feature/user/services/user
```

Interfaces se obično stvaraju ručno:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Za male fokusirane features dopuštene su i colocated datoteke poput `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` i `language.service.ts` kada takva struktura feature čini jednostavnijom.

---

## Generic shared code

Opći reusable kod koji nije vezan uz jednu određenu feature može se smjestiti izravno u `src/app`.

Primjeri shared mapa:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Primjer lokacije shared pipe-a:

```text
src/app/pipes/phone.pipe.ts
```

Preporučene CLI naredbe:

Stvoriti shared component:

```bash
ng g c components/page-header
```

Stvoriti shared directive:

```bash
ng g d directives/autofocus
```

Stvoriti shared pipe:

```bash
ng g p pipes/phone
```

Stvoriti shared service:

```bash
ng g s services/api
```

Interfaces se obično stvaraju ručno:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Koristite ove lokacije kao zadane:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Klonirajte default repository u novu mapu s nazivom vašeg projekta (zamijenite `PROJECT_NAME` nazivom svojeg projekta):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Preuzima template repository i stvara lokalnu mapu s nazivom `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Otvara upravo stvorenu mapu projekta.
- `npm i`
  Instalira sve ovisnosti projekta iz `package.json`.
- `npm run start`
  Pokreće lokalni development server.

Nakon toga otvorite lokalni URL prikazan u terminalu, obično [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Ako želite krenuti od nule umjesto zadržati git history predloška, izbrišite postojeću `.git` mapu, inicijalizirajte novi repository i napravite prvi commit.

Primjer:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` povezuje vaš lokalni repository s udaljenim GitHub repositoryjem kako bi buduće `git push` i `git pull` naredbe znale gdje se nalazi vaš glavni projekt.

Za prvi commit također koristite Conventional Commit poruku. Dobar standardni primjer:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
