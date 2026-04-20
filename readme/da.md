# Angular Landing Template (SSR + Prerender)

Moderne Angular 21-startskabelon til at bygge hurtige landing pages med **SSR prerendering**, **TailwindCSS** og **GitHub Pages deployment**.

Denne skabelon er optimeret til statiske landing sites, hvor sider renderes **ved build-tid** for SEO og ydeevne.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** under build
- **Zoneless Angular**
- Tilstand, der bruges i HTML class bindings, bør eksponeres som **signals**
- Foretræk **Angular Signal Forms** som den primære formularløsning, når du bygger nye formularer
- **OnPush change detection by default**
- **TailwindCSS v4**
- Brug delte **theme CSS variables** fra `src/styles/_theme.scss` til farver, flader, afstand, radius og bevægelse
- **GitHub Pages deployment**
- **Prettier formatting**
- Ren og minimalistisk projektstruktur

Projektet bygger begge:

```
dist/app/browser
dist/app/server
```

Men deployment bruger **browser prerendered output**, hvilket gør det perfekt til statisk hosting.

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

SSR configuration findes i:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Start development server:

```
npm start
```

eller

```
ng serve
```

Applikationen kører på [http://localhost:4200](http://localhost:4200)

Development mode kører som en normal Angular SPA.

---

# Build

Byg projektet:

```
npm run build
```

Dette genererer:

```
dist/app/browser
dist/app/server
```

Sider bliver **prerendered at build time** ved hjælp af Angular SSR.

---

# Running the SSR server (optional)

Skabelonen indeholder en Node server til SSR:

```
npm run serve:ssr:app
```

Dette kører:

```
node dist/app/server/server.mjs
```

For de fleste landing pages er dette **ikke nødvendigt**, fordi prerendered HTML allerede er genereret.

---

# Prerender configuration

Alle routes prerenderes som standard:

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

Dette får Angular til at generere statisk HTML for hver route under build.

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

Tailwind er konfigureret via:

```
.postcssrc.json
```

Tailwind bør bruges så meget som muligt i det daglige UI-arbejde.

Foretræk Tailwind utilities til:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Brug kun SCSS, når Tailwind ikke er det rigtige værktøj, for eksempel:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- små mængder global styling

Globale styles findes i:

```
src/styles.scss
```

---

# Icons

Denne skabelon inkluderer **Material Symbols Outlined**, og de bør bruges som standard iconsæt i hele projektet.

Indlæst i:

```
src/index.html
```

Brug ikoner direkte i HTML sådan:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

For tilgængelige knapper skal ikonet være dekorativt, og du skal give en tekstlabel eller `aria-label` på selve knappen:

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

Brug SCSS på en måde, der matcher moderne Angular defaults:

- Behold de fleste styles inde i component `.scss` file.
- Brug kun `src/styles.scss` til reelt globale styles som resets, tokens, typography og utility layers.
- Foretræk CSS variables til farver, afstand og theming, der kan ændre sig ved runtime.
- Brug SCSS-funktioner som `@use`, mixins og partials for nemmere authoring og delte design tokens.
- Undgå dyb selector nesting. Hold selectors enkle og lokale til component.
- Undgå `::ng-deep` og `ViewEncapsulation.None`, medmindre der er en klar integrationsgrund.
- Foretræk class bindings i templates frem for tunge inline style bindings.

Anbefalet opdeling:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Denne skabelon inkluderer Angular environment files, og de kan bruges til forskellige runtime setups såsom lokal udvikling og production builds.

Tilgængelige filer:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Typiske anvendelser:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Production builds erstatter `environment.ts` med `environment.prod.ts` via Angular file replacements.

Hold environment files begrænset til offentlig front-end-konfiguration. Gem ikke hemmeligheder i dem.

---

# Deployment

Deployment håndteres automatisk via **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Trin:

1. Installer dependencies
2. Byg Angular app
3. Kopiér `CNAME`
4. Push build output til `gh-pages`

Den deployede mappe er:

```
dist/app/browser
```

---

# Domain

Custom domain, som du bør ændre til dit eget domæne, så det virker korrekt, enhver subdomain af `*.itkamianets.com` hvis den ikke allerede er i brug i vores github org.

```
ngx.itkamianets.com
```

Konfigureret via:

```
CNAME
```

---

# Code Style

Formatering håndteres af:

- `.editorconfig`
- `.prettierrc`

Vigtige konventioner:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Hvis du bruger AI uden for IDE'en, og den ikke automatisk læser repository-instruktioner, så kopiér først
indholdet af `AGENTS.md` ind i AI prompt/context.

Dette sikrer, at AI følger de samme projektspecifikke regler, som Codex bruger inde i IDE'en.

---

# NPM Scripts

Start development:

```
npm start
```

Byg projekt:

```
npm run build
```

Kør SSR server:

```
npm run serve:ssr:app
```

---

# Requirements

Anbefalet miljø:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Application pages bør oprettes i:

```text
src/app/pages/
```

Hver side bør have sin egen mappe og sin egen component file.

Eksempel:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Generér en page component med Angular CLI:

```bash
ng generate component pages/home
```

eller kortere:

```bash
ng g c pages/home
```

Pages bør lazy loades fra `src/app/app.routes.ts`.

Eksempel på route config:

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

Hvis en del af appen har brug for sin egen business logic og back-end integration, skal du oprette en dedikeret feature folder i:

```text
src/app/feature/
```

Hver feature bør have sin egen interne struktur.

Eksempel:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Eksempel på serviceplacering:

```text
src/app/feature/user/services/user.service.ts
```

Foreslåede CLI-kommandoer:

Opret feature page:

```bash
ng g c feature/user/pages/user-profile
```

Opret feature component:

```bash
ng g c feature/user/components/user-card
```

Opret feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Opret feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Opret feature service:

```bash
ng g s feature/user/services/user
```

Interfaces oprettes normalt manuelt:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

For små fokuserede features er colocated files som `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts` og `language.service.ts` også gyldige, når den
struktur holder feature enklere.

---

## Generic shared code

Generisk genbrugelig kode, der ikke er knyttet til én bestemt feature, kan ligge direkte under `src/app`.

Eksempler på shared folders:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Eksempel på shared pipe-placering:

```text
src/app/pipes/phone.pipe.ts
```

Foreslåede CLI-kommandoer:

Opret shared component:

```bash
ng g c components/page-header
```

Opret shared directive:

```bash
ng g d directives/autofocus
```

Opret shared pipe:

```bash
ng g p pipes/phone
```

Opret shared service:

```bash
ng g s services/api
```

Interfaces oprettes normalt manuelt:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Brug disse placeringer som standard:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Klon default repository til en ny mappe med dit projektnavn (erstat `PROJECT_NAME` med dit projektnavn):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Downloader template repository og opretter en lokal mappe med navnet `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Åbner den nyoprettede projektmappe.
- `npm i`
  Installerer alle projektets dependencies fra `package.json`.
- `npm run start`
  Starter den lokale development server.

Derefter skal du åbne den lokale URL, der vises i terminalen, normalt [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Hvis du vil starte forfra i stedet for at beholde template git history, skal du fjerne den eksisterende `.git` folder, initialisere et nyt repository og oprette det første commit.

Eksempel:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` forbinder dit lokale repository til det eksterne GitHub repository, så fremtidige `git push`- og `git pull`-kommandoer ved, hvor dit hovedprojekt ligger.

Brug også en Conventional Commit message til det første commit. Et godt standardvalg er:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
