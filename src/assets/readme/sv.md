# Angular Landing Template (SSR + Prerender)

Modern Angular 21-startmall för att bygga snabba landningssidor med **SSR-prerendering**, **TailwindCSS** och **distribution via GitHub Pages**.

Den här mallen är optimerad för statiska landningssidor där sidor renderas vid **byggtid** för SEO och prestanda.

---

# Acknowledge

- Angular **21**
- **SSR-prerendering** under byggprocessen
- **Zoneless Angular**
- Tillstånd som används i HTML-klassbindningar ska exponeras som **signals**
- Föredra **Angular Signal Forms** som primär metod när nya formulär byggs
- **OnPush change detection som standard**
- **TailwindCSS v4**
- Använd delade **tema-CSS-variabler** från `src/styles/_theme.scss` för färger, ytor, avstånd, radie och rörelse
- **Distribution via GitHub Pages**
- **Prettier-formatering**
- Ren och minimal projektstruktur

Projektet bygger båda:

```
dist/app/browser
dist/app/server
```

Men distributionen använder den **prerenderade browser-utdata**, vilket gör den perfekt för statisk hosting.

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

SSR-konfigurationen finns i:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Starta utvecklingsservern:

```
npm start
```

eller

```
ng serve
```

Applikationen körs på [http://localhost:4200](http://localhost:4200)

Utvecklingsläget körs som en vanlig Angular SPA.

---

# Build

Bygg projektet:

```
npm run build
```

Detta genererar:

```
dist/app/browser
dist/app/server
```

Sidorna **prerenderas vid byggtid** med Angular SSR.

---

# Running the SSR server (optional)

Mallen innehåller en Node-server för SSR:

```
npm run serve:ssr:app
```

Detta kör:

```
node dist/app/server/server.mjs
```

För de flesta landningssidor är detta **inte nödvändigt**, eftersom prerenderad HTML redan genereras.

---

# Prerender configuration

Alla rutter prerenderas som standard:

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

Detta gör att Angular genererar statisk HTML för varje rutt under byggprocessen.

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

Tailwind konfigureras via:

```
.postcssrc.json
```

Tailwind bör användas så mycket som möjligt för vanligt UI-arbete.

Föredra Tailwind-utilities för:

- layout
- avstånd
- typografi
- färger
- ramar
- storlek
- responsivt beteende

Använd SCSS endast när Tailwind inte är rätt verktyg, till exempel för:

- komponentspecifik komplex styling
- delade designtokens och mixins
- avancerade tillstånd eller selektorer
- små mängder global styling

Globala stilar finns i:

```
src/styles.scss
```

---

# Icons

Den här mallen innehåller **Material Symbols Outlined** och de ska användas som standarduppsättning för ikoner i projektet.

Laddas i:

```
src/index.html
```

Använd ikoner direkt i HTML så här:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

För tillgängliga knappar ska ikonen vara dekorativ och knappen ska ha en textetikett eller `aria-label`:

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

Använd SCSS på ett sätt som matchar moderna Angular-standarder:

- Behåll de flesta stilar i komponentens `.scss`-fil.
- Använd `src/styles.scss` endast för verkligt globala stilar som resets, tokens, typografi och utility-lager.
- Föredra CSS-variabler för färger, avstånd och teman som kan ändras vid körning.
- Använd SCSS-funktioner som `@use`, mixins och partials för bekväm utveckling och delade designtokens.
- Undvik djup nästling av selektorer. Håll selektorer enkla och lokala för komponenten.
- Undvik `::ng-deep` och `ViewEncapsulation.None` om det inte finns ett tydligt integrationsskäl.
- Föredra klassbindningar i mallar framför tunga inline-stilbindningar.

Rekommenderad uppdelning:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Den här mallen innehåller Angular-miljöfiler och de kan användas för olika körningsupplägg, som lokal utveckling och produktionsbyggen.

Tillgängliga filer:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Vanliga användningsfall:

- API-bas-URL:er
- feature flags
- växlar för analysverktyg
- konfiguration för externa tjänster

Produktionsbyggen ersätter `environment.ts` med `environment.prod.ts` genom Angulars filersättningar.

Håll miljöfiler begränsade till publik front-end-konfiguration. Lagra inga hemligheter i dem.

---

# Deployment

Distribution hanteras automatiskt via **GitHub Actions**.

Arbetsflöde:

```
.github/workflows/deploy.yml
```

Steg:

1. Installera beroenden
2. Bygg Angular-appen
3. Kopiera `CNAME`
4. Skjut byggutdata till `gh-pages`

Den distribuerade mappen är:

```
dist/app/browser
```

---

# Domain

Anpassad domän som du bör ändra till din egen domän så att det fungerar korrekt, valfri subdomän till `*.itkamianets.com` om den inte redan används i vår GitHub-organisation.

```
ngx.itkamianets.com
```

Konfigurerad via:

```
CNAME
```

---

# Code Style

Formatering hanteras av:

- `.editorconfig`
- `.prettierrc`

Viktiga konventioner:

- **tabbar**
- **enkla citationstecken**
- **100 teckens radbredd**

---

# AI Usage

Om du använder AI utanför IDE:n och den inte automatiskt läser instruktionerna i repot, kopiera först innehållet i `AGENTS.md` till AI-prompten eller kontexten.

Detta säkerställer att AI:n följer samma projektspecifika regler som Codex använder i IDE:n.

---

# NPM Scripts

Starta utveckling:

```
npm start
```

Bygg projektet:

```
npm run build
```

Kör SSR-servern:

```
npm run serve:ssr:app
```

---

# Requirements

Rekommenderad miljö:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Applikationssidor ska skapas i:

```text
src/app/pages/
```

Varje sida ska ha sin egen mapp och sin egen komponentfil.

Exempel:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Generera en sidkomponent med Angular CLI:

```bash
ng generate component pages/home
```

eller kortare:

```bash
ng g c pages/home
```

Sidor ska lazy-loadas från `src/app/app.routes.ts`.

Exempel på ruttkonfiguration:

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

Om en del av appen behöver egen affärslogik och backend-integration, skapa en dedikerad feature-mapp i:

```text
src/app/feature/
```

Varje feature ska behålla sin egen interna struktur.

Exempel:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Exempel på tjänstplats:

```text
src/app/feature/user/services/user.service.ts
```

Föreslagna CLI-kommandon:

Skapa feature-sida:

```bash
ng g c feature/user/pages/user-profile
```

Skapa feature-komponent:

```bash
ng g c feature/user/components/user-card
```

Skapa feature-direktiv:

```bash
ng g d feature/user/directives/user-focus
```

Skapa feature-pipe:

```bash
ng g p feature/user/pipes/user-name
```

Skapa feature-tjänst:

```bash
ng g s feature/user/services/user
```

Gränssnitt skapas vanligtvis manuellt:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

För små fokuserade features är samlokaliserade filer som `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` och `language.service.ts` också giltiga när den strukturen håller featuren enklare.

---

## Generic shared code

Generisk återanvändbar kod som inte är knuten till en specifik feature kan placeras direkt under `src/app`.

Exempel på delade mappar:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Exempel på delad pipe-plats:

```text
src/app/pipes/phone.pipe.ts
```

Föreslagna CLI-kommandon:

Skapa delad komponent:

```bash
ng g c components/page-header
```

Skapa delat direktiv:

```bash
ng g d directives/autofocus
```

Skapa delad pipe:

```bash
ng g p pipes/phone
```

Skapa delad tjänst:

```bash
ng g s services/api
```

Gränssnitt skapas vanligtvis manuellt:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Använd dessa platser som standard:

- `src/app/pages` - lazy-loadade sidor på appnivå
- `src/app/feature/<name>` - feature-specifik kod med backend-/affärslogik
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generisk delad kod

# Create a new project from this template

Klona standard-repot till en ny mapp med ditt projektnamn (ersätt `PROJECT_NAME` med ditt projektnamn):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Laddar ner mall-repot och skapar en lokal mapp med namnet `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Öppnar den nyskapade projektmappen.
- `npm i`
  Installerar alla projektberoenden från `package.json`.
- `npm run start`
  Startar den lokala utvecklingsservern.

Därefter öppnar du den lokala URL som visas i terminalen, vanligtvis [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Om du vill börja från början i stället för att behålla mallens git-historik, ta bort den befintliga `.git`-mappen, initiera ett nytt repository och skapa den första committen.

Exempel:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` kopplar ditt lokala repository till det externa GitHub-repot så att framtida `git push`- och `git pull`-kommandon vet var huvudprojektet finns.

Använd också ett Conventional Commit-meddelande för den första committen. En bra standard är:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
