# Angular Landing Template (SSR + Prerender)

Teimpléad tosaigh nua-aimseartha Angular 21 chun leathanaigh tuirlingthe thapa a thógáil le
**prerender SSR**, **TailwindCSS**, agus **imscaradh GitHub Pages**.

Tá an teimpléad seo optamaithe do shuímh thuirlingthe statacha ina rindreáiltear leathanaigh
**ag am tógála** le haghaidh SEO agus feidhmíochta.

---

# Acknowledge

- Angular **21**
- **Prerender SSR** le linn an build
- **Angular gan zones**
- Ba chóir staid a úsáidtear i `class` bindings HTML a nochtadh mar **signals**
- Is fearr **Angular Signal Forms** mar phríomhchur chuige agus foirmeacha nua á dtógáil
- **OnPush change detection by default**
- **TailwindCSS v4**
- Úsáid na **theme CSS variables** comhroinnte ó `src/styles/_theme.scss` le haghaidh dathanna,
  dromchlaí, spásála, ga agus gluaisne
- **Imscaradh GitHub Pages**
- **Formáidiú Prettier**
- Struchtúr tionscadail glan agus íosta

Tógann an tionscadal an dá aschur:

```
dist/app/browser
dist/app/server
```

Ach úsáideann an t-imscaradh an **t-aschur brabhsálaí prerenderáilte**, rud a fhágann go bhfuil sé
foirfe d'óstáil statach.

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

Tá cumraíocht SSR lonnaithe i:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Tosaigh an freastalaí forbartha:

```
npm start
```

nó

```
ng serve
```

Ritheann an feidhmchlár ag [http://localhost:4200](http://localhost:4200)

Sa mhodh forbartha ritheann sé mar ghnáth-Angular SPA.

---

# Build

Tóg an tionscadal:

```
npm run build
```

Gineann sé seo:

```
dist/app/browser
dist/app/server
```

Déantar leathanaigh a **prerenderáil ag am tógála** le Angular SSR.

---

# Running the SSR server (optional)

Tá freastalaí Node don SSR san áireamh sa teimpléad:

```
npm run serve:ssr:app
```

Ritheann sé seo:

```
node dist/app/server/server.mjs
```

I gcás fhormhór na leathanach tuirlingthe níl sé seo **riachtanach**, mar go ngintear HTML
prerenderáilte cheana féin.

---

# Prerender configuration

Déantar gach route a prerenderáil de réir réamhshocraithe:

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

Cuireann sé seo ar chumas Angular HTML statach a ghiniúint do gach route le linn an build.

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

Tá Tailwind cumraithe trí:

```
.postcssrc.json
```

Ba cheart Tailwind a úsáid oiread agus is féidir don ghnáthobair UI.

Is fearr utilities Tailwind do:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Úsáid SCSS amháin nuair nach é Tailwind an uirlis cheart, mar shampla do:

- stíliú casta sonrach do chomhpháirteanna
- design tokens agus mixins comhroinnte
- staideanna nó selectors ardleibhéil
- méid beag de stíliú domhanda

Tá na stíleanna domhanda lonnaithe i:

```
src/styles.scss
```

---

# Icons

Áiríonn an teimpléad seo **Material Symbols Outlined** agus ba chóir iad a úsáid mar an tacar
deilbhíní réamhshocraithe ar fud an tionscadail.

Luchtaithe i:

```
src/index.html
```

Úsáid deilbhíní go díreach in HTML mar seo:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Le haghaidh cnaipí inrochtana, coinnigh an deilbhín maisiúil agus cuir lipéad téacs nó
`aria-label` ar an gcnaipe féin:

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

Úsáid SCSS ar bhealach a mheaitseálann réamhshocruithe nua-aimseartha Angular:

- Coinnigh formhór na stíleanna taobh istigh de chomhad `.scss` an chomhpháirt.
- Ná húsáid `src/styles.scss` ach do stíleanna fíordhomhanda cosúil le resets, tokens,
  clóghrafaíocht, agus layers fóntais.
- Is fearr CSS variables do dhathanna, spásáil, agus téamaí a d'fhéadfadh athrú ag am rite.
- Úsáid gnéithe SCSS mar `@use`, mixins, agus partials ar mhaithe le húdarú níos éasca agus
  design tokens comhroinnte.
- Seachain selector nesting domhain. Coinnigh selectors simplí agus áitiúil don chomhpháirt.
- Seachain `::ng-deep` agus `ViewEncapsulation.None` mura bhfuil cúis shoiléir chomhtháthaithe ann.
- Is fearr class bindings i dteimpléid ná inline style bindings troma.

Roinnt mholta:

```text
src/styles.scss           -> point iontrála domhanda
src/app/**/**/*.scss      -> stíleanna áitiúla comhpháirte
src/styles/_theme.scss    -> theme CSS variables comhroinnte
```

---

# Environments

Áiríonn an teimpléad seo comhaid environment Angular agus is féidir iad a úsáid do
shocruithe éagsúla rite cosúil le forbairt áitiúil agus builds táirgthe.

Comhaid atá ar fáil:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Gnáthchásanna úsáide:

- bunchonairí API
- feature flags
- lasca anailíse
- cumraíocht seirbhísí seachtracha

Cuireann builds táirgthe `environment.prod.ts` in ionad `environment.ts` trí Angular file replacements.

Coinnigh comhaid environment teoranta do chumraíocht phoiblí an front-end. Ná stóráil rúin iontu.

---

# Deployment

Déantar an t-imscaradh go huathoibríoch le **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Céimeanna:

1. Spleáchais a shuiteáil
2. An aip Angular a thógáil
3. `CNAME` a chóipeáil
4. Aschur an build a bhrú chuig `gh-pages`

Is í an fillteán imscartha:

```
dist/app/browser
```

---

# Domain

Fearann saincheaptha ba chóir duit a choigeartú do d'fhearann féin ionas go n-oibreoidh sé i gceart;
tá aon fho-fhearann de `*.itkamianets.com` bailí mura bhfuil sé in úsáid cheana inár n-eagraíocht GitHub.

```
ngx.itkamianets.com
```

Cumraithe trí:

```
CNAME
```

---

# Code Style

Déantar formáidiú a láimhseáil le:

- `.editorconfig`
- `.prettierrc`

Príomhchoinbhinsiúin:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Má úsáideann tú AI taobh amuigh den IDE agus mura léann sé treoracha an stórais go huathoibríoch,
cóipeáil ábhar `AGENTS.md` isteach sa phrompt/comhthéacs ar dtús.

Cinntíonn sé sin go leanann an AI na rialacha tionscadail céanna a úsáideann Codex taobh istigh den IDE.

---

# NPM Scripts

Tosaigh forbairt:

```
npm start
```

Tóg an tionscadal:

```
npm run build
```

Rith an freastalaí SSR:

```
npm run serve:ssr:app
```

---

# Requirements

Timpeallacht mholta:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Ba chóir pages an fheidhmchláir a chruthú laistigh de:

```text
src/app/pages/
```

Ba chóir a fillteán agus a chomhad comhpháirte féin a bheith ag gach page.

Sampla:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Gin comhpháirt page leis an Angular CLI:

```bash
ng generate component pages/home
```

nó níos giorra:

```bash
ng g c pages/home
```

Ba chóir pages a bheith lazy loaded ó `src/app/app.routes.ts`.

Sampla de route config:

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

Má theastaíonn a loighic ghnó féin agus comhtháthú back-end ó chuid den aip, cruthaigh
fillteán feature tiomnaithe laistigh de:

```text
src/app/feature/
```

Ba chóir do gach feature a struchtúr inmheánach féin a choinneáil.

Sampla:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Suíomh samplach seirbhíse:

```text
src/app/feature/user/services/user.service.ts
```

Orduithe CLI molta:

Cruthaigh page feature:

```bash
ng g c feature/user/pages/user-profile
```

Cruthaigh comhpháirt feature:

```bash
ng g c feature/user/components/user-card
```

Cruthaigh directive feature:

```bash
ng g d feature/user/directives/user-focus
```

Cruthaigh pipe feature:

```bash
ng g p feature/user/pipes/user-name
```

Cruthaigh seirbhís feature:

```bash
ng g s feature/user/services/user
```

De ghnáth cruthaítear interfaces de láimh:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Le haghaidh features beaga dírithe, tá comhaid lonnaithe le chéile cosúil le
`feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts`,
agus `language.service.ts` bailí freisin má choinníonn an struchtúr sin an feature níos simplí.

---

## Generic shared code

Is féidir cód ginearálta in-athúsáidte nach mbaineann le feature ar leith a chur go díreach faoi `src/app`.

Samplaí d'fhillteáin chomhroinnte:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Suíomh samplach pipe comhroinnte:

```text
src/app/pipes/phone.pipe.ts
```

Orduithe CLI molta:

Cruthaigh comhpháirt chomhroinnte:

```bash
ng g c components/page-header
```

Cruthaigh directive chomhroinnte:

```bash
ng g d directives/autofocus
```

Cruthaigh pipe comhroinnte:

```bash
ng g p pipes/phone
```

Cruthaigh seirbhís chomhroinnte:

```bash
ng g s services/api
```

De ghnáth cruthaítear interfaces de láimh:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Úsáid na suíomhanna seo de réir réamhshocraithe:

- `src/app/pages` - pages leibhéal aipe a lódáiltear go mall
- `src/app/feature/<name>` - cód feature-shonrach le loighic ghnó/back-end
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - cód ginearálta comhroinnte

# Create a new project from this template

Clónaigh an stór réamhshocraithe isteach i bhfillteán nua le hainm do thionscadail
(cuir ainm do thionscadail in ionad `PROJECT_NAME`):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Íoslódálann sé stór an teimpléid agus cruthaíonn sé fillteán áitiúil darb ainm `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Osclaíonn sé an fillteán tionscadail nuachruthaithe.
- `npm i`
  Suiteálann sé spleáchais uile an tionscadail ó `package.json`.
- `npm run start`
  Tosaíonn sé an freastalaí forbartha áitiúil.

Ina dhiaidh sin, oscail an URL áitiúil a thaispeántar sa teirminéal, de ghnáth [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Más mian leat tosú as an nua seachas stair git an teimpléid a choinneáil, bain an fillteán `.git`,
tionscnaigh stór nua, agus cruthaigh an chéad commit.

Sampla:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

Ceanglaíonn `git remote add origin ...` do stór áitiúil leis an stór iargúlta GitHub ionas go mbeidh a fhios ag
`git push` agus `git pull` amach anseo cá bhfuil do phríomhthionscadal.

Úsáid teachtaireacht Conventional Commit don chéad commit freisin. Réamhshocrú maith ná:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
