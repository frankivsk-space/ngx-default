# Angular Landing Template (SSR + Prerender)

Moderná štartovacia šablóna Angular 21 na vytváranie rýchlych landing pages so **SSR prerenderingom**, **TailwindCSS** a **nasadením na GitHub Pages**.

Táto šablóna je optimalizovaná pre statické landing stránky, kde sa stránky renderujú **počas buildu** kvôli SEO a výkonu.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** počas buildu
- **Zoneless Angular**
- Stav používaný v HTML class bindings má byť vystavený ako **signals**
- Pri vytváraní nových formulárov preferujte **Angular Signal Forms** ako hlavný prístup
- **OnPush change detection predvolene**
- **TailwindCSS v4**
- Používajte zdieľané **theme CSS variables** z `src/styles/_theme.scss` pre farby, povrchy, rozostupy, zaoblenia a animácie
- **Nasadenie na GitHub Pages**
- **Formátovanie cez Prettier**
- Čistá minimalistická štruktúra projektu

Projekt vytvára oba výstupy:

```
dist/app/browser
dist/app/server
```

Na nasadenie sa však používa **browser prerendered output**, čo je ideálne pre statický hosting.

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

SSR konfigurácia sa nachádza v:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Spustenie development servera:

```
npm start
```

alebo

```
ng serve
```

Aplikácia beží na [http://localhost:4200](http://localhost:4200)

Vývojový režim beží ako bežná Angular SPA.

---

# Build

Zostavenie projektu:

```
npm run build
```

Tým sa vygeneruje:

```
dist/app/browser
dist/app/server
```

Stránky sú **prerenderované počas buildu** pomocou Angular SSR.

---

# Running the SSR server (optional)

Šablóna obsahuje Node server pre SSR:

```
npm run serve:ssr:app
```

Tým sa spustí:

```
node dist/app/server/server.mjs
```

Pre väčšinu landing pages to **nie je potrebné**, pretože prerenderované HTML sa už generuje počas buildu.

---

# Prerender configuration

Všetky routes sú predvolene prerenderované:

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

To spôsobí, že Angular počas buildu vygeneruje statické HTML pre každú route.

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

Tailwind je nakonfigurovaný cez:

```
.postcssrc.json
```

Tailwind by sa mal používať čo najviac pri bežnej práci na UI.

Preferujte Tailwind utility pre:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

SCSS používajte len vtedy, keď Tailwind nie je správny nástroj, napríklad pre:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- malé množstvo globálnych štýlov

Globálne štýly sa nachádzajú v:

```
src/styles.scss
```

---

# Icons

Táto šablóna obsahuje **Material Symbols Outlined** a tie by sa mali používať ako predvolená sada ikon v celom projekte.

Načítavajú sa v:

```
src/index.html
```

Ikony používajte priamo v HTML takto:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Pri prístupných tlačidlách nechajte ikonu dekoratívnu a na samotné tlačidlo pridajte textový popis alebo `aria-label`:

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

Používajte SCSS spôsobom, ktorý zodpovedá moderným Angular defaultom:

- Väčšinu štýlov držte v `.scss` súbore komponentu.
- `src/styles.scss` používajte len pre skutočne globálne štýly, ako sú resets, tokens, typography a utility layers.
- Preferujte CSS variables pre farby, rozostupy a theming, ktoré sa môžu meniť za behu.
- Používajte SCSS možnosti ako `@use`, mixins a partials pre pohodlnejší authoring a zdieľané design tokens.
- Vyhýbajte sa hlbokému vnáraniu selectorov. Selectors nech sú jednoduché a lokálne pre komponent.
- Vyhýbajte sa `::ng-deep` a `ViewEncapsulation.None`, pokiaľ na to nie je jasný integračný dôvod.
- Preferujte class bindings v templates namiesto ťažkých inline style bindings.

Odporúčané rozdelenie:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Táto šablóna obsahuje Angular environment súbory a dajú sa použiť pre rôzne runtime konfigurácie, napríklad pre lokálny vývoj a produkčné buildy.

Dostupné súbory:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Typické použitia:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Produkčné buildy nahrádzajú `environment.ts` súborom `environment.prod.ts` cez Angular file replacements.

Environment súbory obmedzte na verejnú front-end konfiguráciu. Neukladajte do nich tajomstvá.

---

# Deployment

Nasadenie je riešené automaticky cez **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Kroky:

1. Nainštalovať závislosti
2. Zostaviť Angular aplikáciu
3. Skopírovať `CNAME`
4. Odoslať build output do `gh-pages`

Nasadzovaný priečinok je:

```
dist/app/browser
```

---

# Domain

Vlastnú doménu by ste si mali upraviť na svoju, aby všetko fungovalo správne; môže to byť akákoľvek subdoména `*.itkamianets.com`, ak sa ešte nepoužíva v našej GitHub organizácii.

```
ngx.itkamianets.com
```

Konfiguruje sa cez:

```
CNAME
```

---

# Code Style

Formátovanie sa riadi cez:

- `.editorconfig`
- `.prettierrc`

Hlavné konvencie:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Ak používate AI mimo IDE a tá automaticky nečíta inštrukcie repozitára, najprv skopírujte obsah `AGENTS.md` do promptu alebo kontextu AI.

Tým zabezpečíte, že AI bude dodržiavať rovnaké projektové pravidlá, aké Codex používa v IDE.

---

# NPM Scripts

Spustenie developmentu:

```
npm start
```

Build projektu:

```
npm run build
```

Spustenie SSR servera:

```
npm run serve:ssr:app
```

---

# Requirements

Odporúčané prostredie:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Stránky aplikácie by sa mali vytvárať v:

```text
src/app/pages/
```

Každá stránka by mala mať vlastný priečinok a vlastný component súbor.

Príklad:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Page component vygenerujete pomocou Angular CLI:

```bash
ng generate component pages/home
```

alebo kratšie:

```bash
ng g c pages/home
```

Pages by mali byť lazy loaded zo `src/app/app.routes.ts`.

Príklad route konfigurácie:

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

Ak určitá časť aplikácie potrebuje vlastnú business logic a back-end integráciu, vytvorte samostatný feature priečinok v:

```text
src/app/feature/
```

Každý feature by si mal zachovať vlastnú vnútornú štruktúru.

Príklad:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Príklad umiestnenia service:

```text
src/app/feature/user/services/user.service.ts
```

Odporúčané CLI príkazy:

Vytvoriť feature page:

```bash
ng g c feature/user/pages/user-profile
```

Vytvoriť feature component:

```bash
ng g c feature/user/components/user-card
```

Vytvoriť feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Vytvoriť feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Vytvoriť feature service:

```bash
ng g s feature/user/services/user
```

Interfaces sa zvyčajne vytvárajú ručne:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Pre malé zamerané features sú prijateľné aj colocated súbory ako `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` a `language.service.ts`, ak takáto štruktúra feature zjednodušuje.

---

## Generic shared code

Generický znovupoužiteľný kód, ktorý nie je viazaný na jednu konkrétnu feature, môže byť umiestnený priamo v `src/app`.

Príklady shared priečinkov:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Príklad umiestnenia shared pipe:

```text
src/app/pipes/phone.pipe.ts
```

Odporúčané CLI príkazy:

Vytvoriť shared component:

```bash
ng g c components/page-header
```

Vytvoriť shared directive:

```bash
ng g d directives/autofocus
```

Vytvoriť shared pipe:

```bash
ng g p pipes/phone
```

Vytvoriť shared service:

```bash
ng g s services/api
```

Interfaces sa zvyčajne vytvárajú ručne:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Tieto umiestnenia používajte predvolene:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Naklonujte predvolený repozitár do nového priečinka s názvom svojho projektu (nahraďte `PROJECT_NAME` názvom svojho projektu):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Stiahne template repository a vytvorí lokálny priečinok s názvom `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Otvorí novo vytvorený priečinok projektu.
- `npm i`
  Nainštaluje všetky závislosti projektu z `package.json`.
- `npm run start`
  Spustí lokálny development server.

Potom otvorte lokálnu URL zobrazenú v termináli, zvyčajne [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Ak chcete začať odznova namiesto zachovania git histórie šablóny, odstráňte existujúci `.git` priečinok, inicializujte nový repository a vytvorte prvý commit.

Príklad:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` prepojí váš lokálny repository so vzdialeným GitHub repository, aby budúce príkazy `git push` a `git pull` vedeli, kde sa nachádza váš hlavný projekt.

Aj pre prvý commit použite Conventional Commit message. Dobrý predvolený príklad:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
