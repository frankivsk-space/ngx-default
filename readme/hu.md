# Angular Landing Template (SSR + Prerender)

Modern Angular 21 kezdősablon gyors landing page-ek készítéséhez **SSR prerendering**, **TailwindCSS** és **GitHub Pages deployment** támogatással.

Ez a sablon statikus landing site-okhoz van optimalizálva, ahol az oldalak **build time** során renderelődnek a SEO és a teljesítmény érdekében.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** build közben
- **Zoneless Angular**
- A HTML class bindings használatában szereplő state legyen **signals** formában elérhető
- Új űrlapok készítésekor elsődleges megoldásként használd az **Angular Signal Forms** megközelítést
- **OnPush change detection by default**
- **TailwindCSS v4**
- Használd a közös **theme CSS variables** változókat a `src/styles/_theme.scss` fájlból színekhez, felületekhez, távolságokhoz, sarkokhoz és mozgáshoz
- **GitHub Pages deployment**
- **Prettier formatting**
- Tiszta, minimalista projektstruktúra

A projekt mindkettőt buildeli:

```
dist/app/browser
dist/app/server
```

De a deployment a **browser prerendered output** kimenetet használja, ezért ideális statikus hosztoláshoz.

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

Az SSR configuration itt található:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Indítsd el a development servert:

```
npm start
```

vagy

```
ng serve
```

Az alkalmazás itt fut: [http://localhost:4200](http://localhost:4200)

A development mode normál Angular SPA-ként működik.

---

# Build

Buildeld a projektet:

```
npm run build
```

Ez a következőket generálja:

```
dist/app/browser
dist/app/server
```

Az oldalak **prerendered at build time** Angular SSR segítségével.

---

# Running the SSR server (optional)

A sablon tartalmaz egy Node server megoldást SSR-hez:

```
npm run serve:ssr:app
```

Ez ezt futtatja:

```
node dist/app/server/server.mjs
```

A legtöbb landing page esetén erre **nincs szükség**, mert a prerendered HTML már elkészült.

---

# Prerender configuration

Minden route alapértelmezetten prerenderelve van:

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

Ez azt eredményezi, hogy az Angular minden route-hoz statikus HTML-t generál build közben.

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

A Tailwind konfigurációja ezen keresztül történik:

```
.postcssrc.json
```

A Tailwindet a lehető legnagyobb mértékben érdemes használni a mindennapi UI munkában.

Tailwind utilities használata ajánlott ezekhez:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Csak akkor használj SCSS-t, ha a Tailwind nem a megfelelő eszköz, például:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- kisebb mennyiségű globális stílus

A globális stílusok itt találhatók:

```
src/styles.scss
```

---

# Icons

Ez a sablon tartalmazza a **Material Symbols Outlined** ikonokat, és ezeket kell használni alapértelmezett icon setként a projektben.

Betöltve itt:

```
src/index.html
```

Használd az ikonokat közvetlenül HTML-ben így:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Akadálymentes gomboknál az ikont hagyd dekoratívnak, és adj a gombnak szöveges címkét vagy `aria-label` attribútumot:

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

Az SCSS-t a modern Angular defaults elveknek megfelelően használd:

- A legtöbb style maradjon a component `.scss` file-ban.
- A `src/styles.scss` fájlt csak valóban globális style-okhoz használd, mint resets, tokens, typography és utility layers.
- Részesítsd előnyben a CSS variables használatát színekhez, spacinghez és theminghez, amelyek runtime közben változhatnak.
- Használd az SCSS képességeit, mint `@use`, mixins és partials a kényelmesebb authoring és a megosztott design tokens érdekében.
- Kerüld a mély selector nesting használatát. A selectors maradjanak egyszerűek és a componenthez lokálisak.
- Kerüld a `::ng-deep` és `ViewEncapsulation.None` használatát, hacsak nincs egyértelmű integrációs ok.
- A template-ekben a class bindings legyen előnyben a nehéz inline style bindings helyett.

Ajánlott felosztás:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Ez a sablon tartalmaz Angular environment files fájlokat, amelyek különböző runtime setups helyzetekhez használhatók, például helyi fejlesztéshez és production builds környezethez.

Elérhető fájlok:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Tipikus felhasználási esetek:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

A production builds során az Angular file replacements a `environment.ts` fájlt `environment.prod.ts` fájlra cseréli.

Az environment files csak nyilvános front-end konfigurációra szolgáljanak. Ne tárolj bennük titkokat.

---

# Deployment

A deployment automatikusan történik **GitHub Actions** segítségével.

Workflow:

```
.github/workflows/deploy.yml
```

Lépések:

1. Dependencies telepítése
2. Angular app buildelése
3. `CNAME` másolása
4. A build output pusholása `gh-pages` ágra

A deployolt mappa:

```
dist/app/browser
```

---

# Domain

Custom domain, amelyet a saját domainedre kell módosítani, hogy megfelelően működjön; bármely `*.itkamianets.com` aldomain megfelelő, ha még nem volt használatban a github orgunkban.

```
ngx.itkamianets.com
```

Konfigurálva ezen keresztül:

```
CNAME
```

---

# Code Style

A formázást ezek kezelik:

- `.editorconfig`
- `.prettierrc`

Fő konvenciók:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Ha az IDE-n kívül használsz AI-t, és az nem olvassa automatikusan a repository utasításokat, először másold be
az `AGENTS.md` tartalmát az AI prompt/context mezőbe.

Ez biztosítja, hogy az AI ugyanazokat a projektspecifikus szabályokat kövesse, amelyeket a Codex az IDE-ben használ.

---

# NPM Scripts

Development indítása:

```
npm start
```

Projekt buildelése:

```
npm run build
```

SSR server futtatása:

```
npm run serve:ssr:app
```

---

# Requirements

Ajánlott környezet:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Az Application pages elemeket itt kell létrehozni:

```text
src/app/pages/
```

Minden oldalnak saját mappával és saját component file-lal kell rendelkeznie.

Példa:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Page component generálása Angular CLI-val:

```bash
ng generate component pages/home
```

vagy rövidebben:

```bash
ng g c pages/home
```

Az oldalakat lazy loaded módon a `src/app/app.routes.ts` fájlból kell betölteni.

Példa route config:

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

Ha az alkalmazás egy részének saját business logic és back-end integration rétegre van szüksége, hozz létre egy dedikált feature foldert itt:

```text
src/app/feature/
```

Minden feature tartsa meg a saját belső struktúráját.

Példa:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Példa service helyre:

```text
src/app/feature/user/services/user.service.ts
```

Javasolt CLI parancsok:

Create feature page:

```bash
ng g c feature/user/pages/user-profile
```

Create feature component:

```bash
ng g c feature/user/components/user-card
```

Create feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Create feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Create feature service:

```bash
ng g s feature/user/services/user
```

Az interface-eket általában kézzel hozzák létre:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Kisebb, fókuszált feature-ök esetén az olyan colocated files is megfelelőek, mint a `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts` és `language.service.ts`, ha ez a
struktúra egyszerűbben tartja a feature-t.

---

## Generic shared code

Az általános, újrahasznosítható kód, amely nem kötődik egyetlen konkrét feature-höz, közvetlenül a `src/app` alatt lehet.

Példák shared folders mappákra:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Példa shared pipe helyre:

```text
src/app/pipes/phone.pipe.ts
```

Javasolt CLI parancsok:

Create shared component:

```bash
ng g c components/page-header
```

Create shared directive:

```bash
ng g d directives/autofocus
```

Create shared pipe:

```bash
ng g p pipes/phone
```

Create shared service:

```bash
ng g s services/api
```

Az interface-eket általában kézzel hozzák létre:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Alapértelmezetten ezeket a helyeket használd:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Klonozd a default repositoryt egy új mappába a projekted nevével (cseréld le a `PROJECT_NAME` értékét a saját projektnevedre):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Letölti a template repositoryt, és létrehoz egy helyi mappát `PROJECT_NAME` néven.
- `cd PROJECT_NAME`
  Megnyitja az újonnan létrehozott projektmappát.
- `npm i`
  Telepíti az összes projekt dependencyt a `package.json` alapján.
- `npm run start`
  Elindítja a helyi development servert.

Ezután nyisd meg a terminálban megjelenő helyi URL-t, általában [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Ha tiszta lappal akarsz indulni a template git history megtartása helyett, töröld a meglévő `.git` foldert, inicializálj egy új repositoryt, és hozd létre az első commitot.

Példa:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

A `git remote add origin ...` összeköti a helyi repositoryt a távoli GitHub repositoryval, így a későbbi `git push` és `git pull` parancsok tudni fogják, hol található a fő projekted.

Az első commithoz is használj Conventional Commit message formátumot. Jó alapértelmezett példa:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
