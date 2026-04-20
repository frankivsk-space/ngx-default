# Angular Landing Template (SSR + Prerender)

Moderní výchozí šablona Angular 21 pro tvorbu rychlých landing pages se **SSR prerenderingem**, **TailwindCSS** a **deployem na GitHub Pages**.

Tato šablona je optimalizovaná pro statické landing weby, kde se stránky renderují **během buildu** kvůli SEO a výkonu.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** během buildu
- **Zoneless Angular**
- Stav používaný v HTML class bindings musí být dostupný jako **signals**
- U nových formulářů preferujte **Angular Signal Forms** jako hlavní přístup
- **OnPush change detection ve výchozím stavu**
- **TailwindCSS v4**
- Používejte sdílené **theme CSS variables** z `src/styles/_theme.scss` pro barvy, povrchy, rozestupy, rádiusy a animace
- **Deploy na GitHub Pages**
- **Prettier formátování**
- Čistá minimalistická struktura projektu

Projekt generuje oba adresáře:

```
dist/app/browser
dist/app/server
```

Pro deployment se ale používá **browser prerendered output**, což je ideální pro statický hosting.

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

SSR konfigurace je umístěná v:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Spusťte development server:

```
npm start
```

nebo

```
ng serve
```

Aplikace běží na adrese [http://localhost:4200](http://localhost:4200)

Vývojový režim funguje jako běžná Angular SPA.

---

# Build

Sestavte projekt:

```
npm run build
```

To vygeneruje:

```
dist/app/browser
dist/app/server
```

Stránky jsou **prerendered at build time** pomocí Angular SSR.

---

# Running the SSR server (optional)

Šablona obsahuje Node server pro SSR:

```
npm run serve:ssr:app
```

Tím se spustí:

```
node dist/app/server/server.mjs
```

Pro většinu landing pages to **není potřeba**, protože prerendered HTML už je vygenerované.

---

# Prerender configuration

Všechny routes jsou prerenderované ve výchozím nastavení:

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

To nutí Angular generovat statický HTML pro každou route během buildu.

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

Tailwind je nastavený přes:

```
.postcssrc.json
```

Tailwind by se měl používat co nejčastěji pro běžnou práci s UI.

Preferujte Tailwind utilities pro:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

SCSS používejte jen tehdy, když Tailwind není správný nástroj, například pro:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- malé množství globálních stylů

Globální styly jsou umístěné v:

```
src/styles.scss
```

---

# Icons

Tato šablona obsahuje **Material Symbols Outlined** a měly by se používat jako standardní sada ikon v celém projektu.

Jsou připojené v:

```
src/index.html
```

Ikony používejte přímo v HTML takto:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

U přístupných tlačítek ponechte ikonu dekorativní a přidejte textový popisek nebo `aria-label` na samotné tlačítko:

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

Používejte SCSS způsobem, který odpovídá moderním Angular defaults:

- Většinu stylů držte uvnitř `.scss` souboru komponenty.
- `src/styles.scss` používejte jen pro skutečně globální styly, jako jsou resets, tokens, typography a utility layers.
- Preferujte CSS variables pro barvy, rozestupy a theming, které se mohou měnit za běhu.
- Používejte SCSS možnosti jako `@use`, mixins a partials pro pohodlnější authoring a sdílené design tokens.
- Vyhýbejte se hlubokému vnořování selectorů. Držte selectors jednoduché a lokální pro komponentu.
- Vyhýbejte se `::ng-deep` a `ViewEncapsulation.None`, pokud pro to není jasný integrační důvod.
- Preferujte class bindings v templates místo těžkých inline style bindings.

Doporučené rozdělení:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Tato šablona obsahuje Angular environment soubory a lze je použít pro různé runtime konfigurace, například pro lokální vývoj a production buildy.

Dostupné soubory:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Typické případy použití:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Production buildy nahrazují `environment.ts` souborem `environment.prod.ts` přes Angular file replacements.

Environment soubory používejte jen pro veřejnou front-end konfiguraci. Neukládejte do nich tajné údaje.

---

# Deployment

Deployment se provádí automaticky přes **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Kroky:

1. Nainstalovat závislosti
2. Sestavit Angular aplikaci
3. Zkopírovat `CNAME`
4. Odeslat build output do `gh-pages`

Adresář pro deployment:

```
dist/app/browser
```

---

# Domain

Vlastní doména, kterou byste měli změnit na svou, aby vše fungovalo správně; může to být jakýkoli subdoménový tvar `*.itkamianets.com`, pokud se ještě nepoužívá v naší GitHub organizaci.

```
ngx.itkamianets.com
```

Nastavuje se přes:

```
CNAME
```

---

# Code Style

Formátování se provádí přes:

- `.editorconfig`
- `.prettierrc`

Klíčová pravidla:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Pokud používáte AI mimo IDE a nečte automaticky instrukce repozitáře, nejprve zkopírujte obsah `AGENTS.md` do prompt/contextu AI.

Tím zajistíte, že AI bude dodržovat stejná projektová pravidla, která Codex dodržuje uvnitř IDE.

---

# NPM Scripts

Spuštění developmentu:

```
npm start
```

Build projektu:

```
npm run build
```

Spuštění SSR serveru:

```
npm run serve:ssr:app
```

---

# Requirements

Doporučené prostředí:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Stránky aplikace vytvářejte v:

```text
src/app/pages/
```

Každá stránka by měla mít vlastní složku a vlastní component soubor.

Příklad:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Page component vygenerujte pomocí Angular CLI:

```bash
ng generate component pages/home
```

nebo kratší variantou:

```bash
ng g c pages/home
```

Pages by měly být lazy loaded z `src/app/app.routes.ts`.

Příklad route konfigurace:

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

Pokud některá část app potřebuje vlastní business logic a back-end integraci, vytvořte samostatnou feature složku v:

```text
src/app/feature/
```

Každá feature by si měla zachovat vlastní vnitřní strukturu.

Příklad:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Příklad umístění service:

```text
src/app/feature/user/services/user.service.ts
```

Doporučené CLI příkazy:

Vytvořit feature page:

```bash
ng g c feature/user/pages/user-profile
```

Vytvořit feature component:

```bash
ng g c feature/user/components/user-card
```

Vytvořit feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Vytvořit feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Vytvořit feature service:

```bash
ng g s feature/user/services/user
```

Interfaces se obvykle vytvářejí ručně:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Pro malé zaměřené features jsou přijatelné i colocated soubory jako `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` a `language.service.ts`, pokud taková struktura feature zjednodušuje.

---

## Generic shared code

Obecný reusable kód, který není svázaný s jednou konkrétní feature, může být umístěný přímo v `src/app`.

Příklady shared složek:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Příklad umístění shared pipe:

```text
src/app/pipes/phone.pipe.ts
```

Doporučené CLI příkazy:

Vytvořit shared component:

```bash
ng g c components/page-header
```

Vytvořit shared directive:

```bash
ng g d directives/autofocus
```

Vytvořit shared pipe:

```bash
ng g p pipes/phone
```

Vytvořit shared service:

```bash
ng g s services/api
```

Interfaces se obvykle vytvářejí ručně:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Používejte tato umístění jako výchozí:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Naklonujte default repository do nové složky s názvem svého projektu (nahraďte `PROJECT_NAME` názvem svého projektu):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Stáhne template repository a vytvoří lokální složku s názvem `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Otevře právě vytvořenou složku projektu.
- `npm i`
  Nainstaluje všechny závislosti projektu z `package.json`.
- `npm run start`
  Spustí lokální development server.

Poté otevřete lokální URL zobrazené v terminálu, obvykle [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Pokud chcete začít zcela čistě místo zachování git history šablony, smažte existující složku `.git`, inicializujte nový repository a vytvořte první commit.

Příklad:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` propojí váš lokální repository se vzdáleným GitHub repository, aby budoucí příkazy `git push` a `git pull` věděly, kde se nachází váš hlavní projekt.

Pro první commit také používejte Conventional Commit message. Dobrý standardní příklad:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
