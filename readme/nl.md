# Angular Landing Template (SSR + Prerender)

Moderne Angular 21-starttemplate voor het bouwen van snelle landing pages met **SSR prerendering**, **TailwindCSS** en **GitHub Pages deployment**.

Deze template is geoptimaliseerd voor statische landing sites waarbij pagina's **tijdens build time** worden gerenderd voor SEO en prestaties.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** tijdens build
- **Zoneless Angular**
- State die wordt gebruikt in HTML class bindings moet beschikbaar worden gemaakt als **signals**
- Gebruik bij nieuwe formulieren bij voorkeur **Angular Signal Forms** als primaire aanpak
- **OnPush change detection by default**
- **TailwindCSS v4**
- Gebruik gedeelde **theme CSS variables** uit `src/styles/_theme.scss` voor kleuren, surfaces, spacing, radius en motion
- **GitHub Pages deployment**
- **Prettier formatting**
- Schone minimale projectstructuur

Het project bouwt beide:

```
dist/app/browser
dist/app/server
```

Maar deployment gebruikt de **browser prerendered output**, waardoor dit perfect is voor statische hosting.

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

SSR configuration staat in:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Start de development server:

```
npm start
```

of

```
ng serve
```

De applicatie draait op [http://localhost:4200](http://localhost:4200)

Development mode draait als een normale Angular SPA.

---

# Build

Build het project:

```
npm run build
```

Dit genereert:

```
dist/app/browser
dist/app/server
```

Pagina's worden **prerendered at build time** met Angular SSR.

---

# Running the SSR server (optional)

De template bevat een Node server voor SSR:

```
npm run serve:ssr:app
```

Dit voert uit:

```
node dist/app/server/server.mjs
```

Voor de meeste landing pages is dit **niet nodig**, omdat prerendered HTML al is gegenereerd.

---

# Prerender configuration

Alle routes worden standaard geprerenderd:

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

Hierdoor genereert Angular tijdens build statische HTML voor elke route.

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

Tailwind is geconfigureerd via:

```
.postcssrc.json
```

Tailwind moet zoveel mogelijk worden gebruikt voor dagelijks UI-werk.

Geef de voorkeur aan Tailwind utilities voor:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Gebruik SCSS alleen wanneer Tailwind niet het juiste hulpmiddel is, bijvoorbeeld voor:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- kleine hoeveelheden globale styling

Globale styles staan in:

```
src/styles.scss
```

---

# Icons

Deze template bevat **Material Symbols Outlined** en die moeten als standaard icon set in het hele project worden gebruikt.

Geladen in:

```
src/index.html
```

Gebruik icons direct in HTML zoals dit:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Houd voor toegankelijke knoppen het icoon decoratief en geef een tekstlabel of `aria-label` op de knop zelf:

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

Gebruik SCSS op een manier die past bij moderne Angular defaults:

- Houd de meeste styles binnen het component `.scss` file.
- Gebruik `src/styles.scss` alleen voor echt globale styles zoals resets, tokens, typography en utility layers.
- Geef de voorkeur aan CSS variables voor kleuren, spacing en theming die tijdens runtime kunnen veranderen.
- Gebruik SCSS-features zoals `@use`, mixins en partials voor eenvoudiger authoring en gedeelde design tokens.
- Vermijd diepe selector nesting. Houd selectors eenvoudig en lokaal voor het component.
- Vermijd `::ng-deep` en `ViewEncapsulation.None`, tenzij daar een duidelijke integratiereden voor is.
- Geef in templates de voorkeur aan class bindings boven zware inline style bindings.

Aanbevolen verdeling:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Deze template bevat Angular environment files en die kunnen worden gebruikt voor verschillende runtime setups zoals lokale ontwikkeling en production builds.

Beschikbare bestanden:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Typische use cases:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Production builds vervangen `environment.ts` door `environment.prod.ts` via Angular file replacements.

Beperk environment files tot publieke front-end-configuratie. Sla er geen secrets in op.

---

# Deployment

Deployment wordt automatisch afgehandeld via **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Stappen:

1. Installeer dependencies
2. Build Angular app
3. Kopieer `CNAME`
4. Push build output naar `gh-pages`

De gedeployde map is:

```
dist/app/browser
```

---

# Domain

Custom domain die je moet aanpassen naar je eigen domein zodat het correct werkt, elke subdomain van `*.itkamianets.com` zolang deze nog niet eerder is gebruikt in onze github org.

```
ngx.itkamianets.com
```

Geconfigureerd via:

```
CNAME
```

---

# Code Style

Formatting wordt afgehandeld door:

- `.editorconfig`
- `.prettierrc`

Belangrijke conventies:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Als je AI buiten de IDE gebruikt en deze repository-instructies niet automatisch leest, kopieer dan eerst
de inhoud van `AGENTS.md` naar de AI prompt/context.

Zo volgt de AI dezelfde projectspecifieke regels die Codex binnen de IDE gebruikt.

---

# NPM Scripts

Start development:

```
npm start
```

Build project:

```
npm run build
```

Run SSR server:

```
npm run serve:ssr:app
```

---

# Requirements

Aanbevolen omgeving:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Application pages moeten worden aangemaakt in:

```text
src/app/pages/
```

Elke pagina moet een eigen map en een eigen component file hebben.

Voorbeeld:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Genereer een page component met Angular CLI:

```bash
ng generate component pages/home
```

of korter:

```bash
ng g c pages/home
```

Pages moeten lazy loaded worden vanuit `src/app/app.routes.ts`.

Voorbeeld route config:

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

Als een deel van de app eigen business logic en back-end integration nodig heeft, maak dan een dedicated feature folder aan in:

```text
src/app/feature/
```

Elke feature moet zijn eigen interne structuur behouden.

Voorbeeld:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Voorbeeld service-locatie:

```text
src/app/feature/user/services/user.service.ts
```

Voorgestelde CLI-commando's:

Maak feature page:

```bash
ng g c feature/user/pages/user-profile
```

Maak feature component:

```bash
ng g c feature/user/components/user-card
```

Maak feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Maak feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Maak feature service:

```bash
ng g s feature/user/services/user
```

Interfaces worden meestal handmatig gemaakt:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Voor kleine gerichte features zijn colocated files zoals `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts` en `language.service.ts` ook geldig wanneer die
structuur de feature eenvoudiger houdt.

---

## Generic shared code

Generieke herbruikbare code die niet aan één specifieke feature is gekoppeld kan direct onder `src/app` staan.

Voorbeelden van shared folders:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Voorbeeld shared pipe-locatie:

```text
src/app/pipes/phone.pipe.ts
```

Voorgestelde CLI-commando's:

Maak shared component:

```bash
ng g c components/page-header
```

Maak shared directive:

```bash
ng g d directives/autofocus
```

Maak shared pipe:

```bash
ng g p pipes/phone
```

Maak shared service:

```bash
ng g s services/api
```

Interfaces worden meestal handmatig gemaakt:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Gebruik deze locaties standaard:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Clone de default repository naar een nieuwe map met je projectnaam (vervang `PROJECT_NAME` door je projectnaam):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Downloadt de template repository en maakt een lokale map met de naam `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Opent de nieuw aangemaakte projectmap.
- `npm i`
  Installeert alle projectdependencies uit `package.json`.
- `npm run start`
  Start de lokale development server.

Open daarna de lokale URL die in de terminal wordt getoond, meestal [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Als je opnieuw wilt beginnen in plaats van de template git history te behouden, verwijder dan de bestaande `.git` folder, initialiseer een nieuwe repository en maak de eerste commit.

Voorbeeld:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` verbindt je lokale repository met de remote GitHub repository zodat toekomstige `git push`- en `git pull`-commando's weten waar je hoofdproject zich bevindt.

Gebruik ook voor de eerste commit een Conventional Commit message. Een goede standaard is:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
