# Angular Landing Template (SSR + Prerender)

Mudell modern Angular 21 biex tibni landing pages veloċi b'**SSR prerendering**, **TailwindCSS**, u **deploy fuq GitHub Pages**.

Dan il-mudell huwa ottimizzat għal landing pages statiċi fejn il-paġni jiġu rrendjati fil-**build time** għal SEO u prestazzjoni.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** waqt il-build
- **Zoneless Angular**
- L-istat użat fil-class bindings tal-HTML għandu jiġi espost bħala **signals**
- Ippreferi **Angular Signal Forms** bħala l-approċċ ewlieni għall-formoli meta tibni formoli ġodda
- **OnPush change detection by default**
- **TailwindCSS v4**
- Uża **theme CSS variables** kondiviżi minn `src/styles/_theme.scss` għall-kuluri, surfaces, spacing, radius, u motion
- **Deploy fuq GitHub Pages**
- **Formatting b'Prettier**
- Struttura tal-proġett nadifa u minima

Il-proġett jibni t-tnejn:

```
dist/app/browser
dist/app/server
```

Iżda d-deploy juża l-**browser prerendered output**, u għalhekk huwa ideali għal static hosting.

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

Il-konfigurazzjoni SSR tinsab f':

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Ibda s-server tal-iżvilupp:

```
npm start
```

jew

```
ng serve
```

L-applikazzjoni taħdem fuq [http://localhost:4200](http://localhost:4200)

Il-modalità tal-iżvilupp taħdem bħala Angular SPA normali.

---

# Build

Ibni l-proġett:

```
npm run build
```

Dan jiġġenera:

```
dist/app/browser
dist/app/server
```

Il-paġni jiġu **prerendered fil-build time** bl-Angular SSR.

---

# Running the SSR server (optional)

Il-mudell jinkludi Node server għal SSR:

```
npm run serve:ssr:app
```

Dan iħaddem:

```
node dist/app/server/server.mjs
```

Għall-biċċa l-kbira tal-landing pages dan **mhux meħtieġ**, għax HTML prerendered ikun diġà ġġenerat.

---

# Prerender configuration

Ir-routes kollha jiġu prerendered b'mod awtomatiku:

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

Dan jagħmel lil Angular jiġġenera HTML statiku għal kull route waqt il-build.

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

Tailwind huwa kkonfigurat permezz ta':

```
.postcssrc.json
```

Tailwind għandu jintuża kemm jista' jkun għax-xogħol ta' kuljum tal-UI.

Ippreferi Tailwind utilities għal:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Uża SCSS biss meta Tailwind ma jkunx l-għodda t-tajba, pereżempju għal:

- styling kumpless speċifiku għall-komponent
- design tokens u mixins kondiviżi
- states jew selectors avvanzati
- ammonti żgħar ta' global styling

L-istili globali jinsabu f':

```
src/styles.scss
```

---

# Icons

Dan il-mudell jinkludi **Material Symbols Outlined** u dawn għandhom jintużaw bħala s-sett default tal-ikoni fil-proġett kollu.

Jitgħabbew f':

```
src/index.html
```

Uża l-ikoni direttament fl-HTML hekk:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Għal buttons aċċessibbli, ħalli l-ikona dekorattiva u ipprovdi text label jew `aria-label` fuq il-button innifsu:

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

Uża SCSS b'mod li jaqbel mal-defaults moderni ta' Angular:

- Żomm il-biċċa l-kbira tal-istili ġewwa l-fajl `.scss` tal-komponent.
- Uża `src/styles.scss` biss għal stili tassew globali bħal resets, tokens, typography, u utility layers.
- Ippreferi CSS variables għall-kuluri, spacing, u theming li jista' jinbidel waqt runtime.
- Uża features ta' SCSS bħal `@use`, mixins, u partials għall-konvenjenza tal-awtur u design tokens kondiviżi.
- Evita nesting profond tas-selectors. Żomm is-selectors sempliċi u lokali għall-komponent.
- Evita `::ng-deep` u `ViewEncapsulation.None` sakemm ma jkunx hemm raġuni ċara ta' integrazzjoni.
- Ippreferi class bindings fit-templates fuq inline style bindings tqal.

Qsim rakkomandat:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Dan il-mudell jinkludi Angular environment files u jistgħu jintużaw għal setups differenti ta' runtime bħal żvilupp lokali u production builds.

Fajls disponibbli:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Każijiet ta' użu tipiċi:

- API base URLs
- feature flags
- toggles għall-analytics
- konfigurazzjoni ta' servizzi esterni

Production builds jissostitwixxu `environment.ts` b'`environment.prod.ts` permezz ta' Angular file replacements.

Żomm l-environment files limitati għal konfigurazzjoni pubblika tal-front-end. Taħżinx sigrieti fihom.

---

# Deployment

Id-deploy jiġi mmaniġġjat awtomatikament permezz ta' **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Passi:

1. Installa d-dependencies
2. Ibni l-app Angular
3. Ikkopja `CNAME`
4. Ippubblika l-build output fuq `gh-pages`

Il-folder deployjat huwa:

```
dist/app/browser
```

---

# Domain

Custom domain li għandek taġġusta għad-dominju tiegħek biex jaħdem sew, kwalunkwe subdomain ta' `*.itkamianets.com` jekk ma tkunx diġà intużat qabel fl-organizzazzjoni GitHub tagħna.

```
ngx.itkamianets.com
```

Ikkonfigurat permezz ta':

```
CNAME
```

---

# Code Style

Il-formatting jiġi mmaniġġjat minn:

- `.editorconfig`
- `.prettierrc`

Konvenzjonijiet ewlenin:

- **tabs**
- **single quotes**
- **line width ta' 100 karattru**

---

# AI Usage

Jekk tuża AI barra mill-IDE u ma taqrax awtomatikament l-istruzzjonijiet tar-repożitorju, ikkopja l-kontenut ta' `AGENTS.md` fil-prompt jew fil-kuntest tal-AI l-ewwel.

Dan jiżgura li l-AI ssegwi l-istess regoli speċifiċi għall-proġett li juża Codex ġewwa l-IDE.

---

# NPM Scripts

Ibda l-iżvilupp:

```
npm start
```

Ibni l-proġett:

```
npm run build
```

Ħaddem is-server SSR:

```
npm run serve:ssr:app
```

---

# Requirements

Ambjent rakkomandat:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Il-paġni tal-applikazzjoni għandhom jinħolqu ġewwa:

```text
src/app/pages/
```

Kull paġna għandu jkollha l-folder tagħha u l-fajl tal-komponent tagħha.

Eżempju:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Iġġenera page component bl-Angular CLI:

```bash
ng generate component pages/home
```

jew b'mod iqsar:

```bash
ng g c pages/home
```

Il-pages għandhom jiġu lazy loaded minn `src/app/app.routes.ts`.

Eżempju ta' route config:

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

Jekk parti mill-app teħtieġ il-business logic tagħha u integrazzjoni mal-back-end, oħloq folder dedikat ġewwa:

```text
src/app/feature/
```

Kull feature għandha żżomm l-istruttura interna tagħha.

Eżempju:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Eżempju ta' service location:

```text
src/app/feature/user/services/user.service.ts
```

CLI commands issuġġeriti:

Oħloq feature page:

```bash
ng g c feature/user/pages/user-profile
```

Oħloq feature component:

```bash
ng g c feature/user/components/user-card
```

Oħloq feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Oħloq feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Oħloq feature service:

```bash
ng g s feature/user/services/user
```

Interfaces normalment jinħolqu manwalment:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Għal features żgħar u ffukati, fajls colocated bħal `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts`, u `language.service.ts` huma wkoll validi meta dik l-istruttura żżomm il-feature aktar sempliċi.

---

## Generic shared code

Kodiċi riutilizzabbli ġeneriku li mhuwiex marbut ma' feature waħda speċifika jista' jgħix direttament taħt `src/app`.

Eżempji ta' folders kondiviżi:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Eżempju ta' shared pipe location:

```text
src/app/pipes/phone.pipe.ts
```

CLI commands issuġġeriti:

Oħloq shared component:

```bash
ng g c components/page-header
```

Oħloq shared directive:

```bash
ng g d directives/autofocus
```

Oħloq shared pipe:

```bash
ng g p pipes/phone
```

Oħloq shared service:

```bash
ng g s services/api
```

Interfaces normalment jinħolqu manwalment:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Uża dawn il-postijiet b'mod default:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - kodiċi speċifiku għall-feature b'backend/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - kodiċi ġeneriku kondiviż

# Create a new project from this template

Ikkklona r-repożitorju default ġo folder ġdid bl-isem tal-proġett tiegħek (ibdel `PROJECT_NAME` bl-isem tal-proġett tiegħek):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Iniżżel ir-repożitorju tal-mudell u joħloq folder lokali bl-isem `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Jiftaħ il-folder il-ġdid tal-proġett.
- `npm i`
  Jinstalla d-dependencies kollha tal-proġett minn `package.json`.
- `npm run start`
  Jibda s-server lokali tal-iżvilupp.

Wara dan, iftaħ il-URL lokali muri fit-terminal, ġeneralment [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Jekk trid tibda mill-ġdid minflok iżżomm il-git history tal-mudell, neħħi l-folder `.git` eżistenti, inizjalizza repożitorju ġdid, u oħloq l-ewwel commit.

Eżempju:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` jgħaqqad ir-repożitorju lokali tiegħek mar-repożitorju remot fuq GitHub biex `git push` u `git pull` fil-futur ikunu jafu fejn jinsab il-proġett prinċipali tiegħek.

Uża Conventional Commit message ukoll għall-ewwel commit. Default tajjeb huwa:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
