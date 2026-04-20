# Angular Landing Template (SSR + Prerender)

Moderna Angular 21 sākuma veidne ātru nolaišanās lapu izveidei ar **SSR prerenderēšanu**, **TailwindCSS** un **izvietošanu GitHub Pages**.

Šī veidne ir optimizēta statiskām nolaišanās lapām, kurās lapas tiek renderētas **būvēšanas laikā** SEO un veiktspējas dēļ.

---

# Acknowledge

- Angular **21**
- **SSR prerenderēšana** būvēšanas laikā
- **Angular bez Zone.js**
- Stāvoklim, kas tiek izmantots HTML klašu sasaistēs, jābūt atklātam kā **signals**
- Veidojot jaunas formas, kā galveno pieeju izvēlieties **Angular Signal Forms**
- **OnPush change detection pēc noklusējuma**
- **TailwindCSS v4**
- Izmantojiet koplietojamos **tēmas CSS mainīgos** no `src/styles/_theme.scss` krāsām, virsmām, atstarpēm, rādiusiem un kustībai
- **Izvietošana GitHub Pages**
- **Prettier formatēšana**
- Tīra minimāla projekta struktūra

Projekts izveido abus:

```
dist/app/browser
dist/app/server
```

Taču izvietošanai tiek izmantota **pārlūkā prerenderētā izvade**, tāpēc tas ir lieliski piemērots statiskai hostēšanai.

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

SSR konfigurācija atrodas:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Palaidiet izstrādes serveri:

```
npm start
```

vai

```
ng serve
```

Lietotne darbojas adresē [http://localhost:4200](http://localhost:4200)

Izstrādes režīms darbojas kā parasta Angular SPA.

---

# Build

Uzbūvējiet projektu:

```
npm run build
```

Tas izveido:

```
dist/app/browser
dist/app/server
```

Lapas tiek **prerenderētas būvēšanas laikā**, izmantojot Angular SSR.

---

# Running the SSR server (optional)

Veidnē ir iekļauts Node serveris SSR darbībai:

```
npm run serve:ssr:app
```

Tas palaiž:

```
node dist/app/server/server.mjs
```

Lielākajai daļai nolaišanās lapu tas **nav nepieciešams**, jo prerenderētais HTML jau ir izveidots.

---

# Prerender configuration

Pēc noklusējuma tiek prerenderēti visi maršruti:

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

Tas liek Angular būvēšanas laikā ģenerēt statisku HTML katram maršrutam.

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

Tailwind tiek konfigurēts caur:

```
.postcssrc.json
```

Tailwind vajadzētu izmantot pēc iespējas vairāk ikdienas UI darbam.

Izvēlieties Tailwind utilītklases:

- izkārtojumam
- atstarpēm
- tipogrāfijai
- krāsām
- apmalēm
- izmēriem
- responsīvai uzvedībai

SCSS izmantojiet tikai tad, ja Tailwind nav piemērots rīks, piemēram:

- sarežģītam komponentam specifiskam stilam
- koplietojamiem dizaina tokeniem un miksīniem
- uzlabotiem stāvokļiem vai selektoriem
- nelielam daudzumam globālu stilu

Globālie stili atrodas:

```
src/styles.scss
```

---

# Icons

Šajā veidnē ir iekļautas **Material Symbols Outlined**, un tās jāizmanto kā noklusējuma ikonu komplekts visā projektā.

Ielādētas šeit:

```
src/index.html
```

Izmantojiet ikonas tieši HTML šādi:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Pieejamām pogām saglabājiet ikonu dekoratīvu un pašai pogai nodrošiniet teksta etiķeti vai `aria-label`:

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

Izmantojiet SCSS tā, lai tas atbilstu mūsdienu Angular noklusējuma principiem:

- Lielāko daļu stilu glabājiet komponenta `.scss` failā.
- `src/styles.scss` izmantojiet tikai patiesi globāliem stiliem, piemēram, resetiem, tokeniem, tipogrāfijai un utility slāņiem.
- Krāsām, atstarpēm un tēmām, kas var mainīties izpildes laikā, izvēlieties CSS mainīgos.
- Izmantojiet SCSS iespējas, piemēram, `@use`, miksīnus un partials, rakstīšanas ērtībai un koplietojamiem dizaina tokeniem.
- Izvairieties no dziļas selektoru ligzdošanas. Uzturiet selektorus vienkāršus un lokālus komponentam.
- Izvairieties no `::ng-deep` un `ViewEncapsulation.None`, ja vien nav skaidra integrācijas iemesla.
- Veidnēs dodiet priekšroku klašu sasaistēm, nevis smagām inline stilu sasaistēm.

Ieteicamais sadalījums:

```text
src/styles.scss           -> globālais ieejas punkts
src/app/**/**/*.scss      -> komponentu lokālie stili
src/styles/_theme.scss    -> koplietojamie tēmas CSS mainīgie
```

---

# Environments

Šajā veidnē ir Angular environment faili, un tos var izmantot dažādām izpildes konfigurācijām, piemēram, lokālai izstrādei un produkcijas būvēm.

Pieejamie faili:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Tipiski lietošanas gadījumi:

- API bāzes URL
- funkciju karogi
- analytics pārslēgi
- ārējo servisu konfigurācija

Produkciijas būves aizvieto `environment.ts` ar `environment.prod.ts`, izmantojot Angular file replacements.

Saglabājiet environment failos tikai publisku front-end konfigurāciju. Neglabājiet tajos noslēpumus.

---

# Deployment

Izvietošana tiek apstrādāta automātiski caur **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Soļi:

1. Instalēt atkarības
2. Uzbūvēt Angular lietotni
3. Nokopēt `CNAME`
4. Ievietot būves izvadi `gh-pages`

Izvietotā mape ir:

```
dist/app/browser
```

---

# Domain

Pielāgotais domēns, kuru jums vajadzētu nomainīt uz savu domēnu, lai tas darbotos pareizi, jebkurš `*.itkamianets.com` apakšdomēns, ja tas iepriekš nav izmantots mūsu GitHub organizācijā.

```
ngx.itkamianets.com
```

Konfigurēts caur:

```
CNAME
```

---

# Code Style

Formatēšanu apstrādā:

- `.editorconfig`
- `.prettierrc`

Galvenās konvencijas:

- **tabulācijas**
- **vienkāršās pēdiņas**
- **100 rakstzīmju rindas platums**

---

# AI Usage

Ja izmantojat AI ārpus IDE un tas automātiski neizlasa repozitorija instrukcijas, vispirms iekopējiet `AGENTS.md` saturu AI uzvednē / kontekstā.

Tas nodrošina, ka AI ievēro tās pašas projektam specifiskās vadlīnijas, kuras Codex izmanto IDE iekšienē.

---

# NPM Scripts

Palaist izstrādi:

```
npm start
```

Uzbūvēt projektu:

```
npm run build
```

Palaist SSR serveri:

```
npm run serve:ssr:app
```

---

# Requirements

Ieteicamā vide:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Lietotnes lapas jāveido šeit:

```text
src/app/pages/
```

Katrai lapai jābūt savai mapei un savam komponenta failam.

Piemērs:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Ģenerējiet lapas komponentu ar Angular CLI:

```bash
ng generate component pages/home
```

vai īsāk:

```bash
ng g c pages/home
```

Lapām jābūt lazy loaded no `src/app/app.routes.ts`.

Maršrutu konfigurācijas piemērs:

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

Ja kādai lietotnes daļai nepieciešama sava biznesa loģika un back-end integrācija, izveidojiet tai atsevišķu feature mapi šeit:

```text
src/app/feature/
```

Katrai feature jāsaglabā sava iekšējā struktūra.

Piemērs:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Servisa atrašanās vietas piemērs:

```text
src/app/feature/user/services/user.service.ts
```

Ieteicamās CLI komandas:

Izveidot feature lapu:

```bash
ng g c feature/user/pages/user-profile
```

Izveidot feature komponentu:

```bash
ng g c feature/user/components/user-card
```

Izveidot feature direktīvu:

```bash
ng g d feature/user/directives/user-focus
```

Izveidot feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Izveidot feature servisu:

```bash
ng g s feature/user/services/user
```

Interfeisi parasti tiek veidoti manuāli:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Mazām fokusētām feature der arī līdzās izvietoti faili, piemēram, `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` un `language.service.ts`, ja šāda struktūra saglabā feature vienkāršāku.

---

## Generic shared code

Vispārīgs atkārtoti lietojams kods, kas nav piesaistīts vienai konkrētai feature, var atrasties tieši zem `src/app`.

Koplietojamo mapju piemēri:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Koplietojama pipe atrašanās vietas piemērs:

```text
src/app/pipes/phone.pipe.ts
```

Ieteicamās CLI komandas:

Izveidot koplietojamu komponentu:

```bash
ng g c components/page-header
```

Izveidot koplietojamu direktīvu:

```bash
ng g d directives/autofocus
```

Izveidot koplietojamu pipe:

```bash
ng g p pipes/phone
```

Izveidot koplietojamu servisu:

```bash
ng g s services/api
```

Interfeisi parasti tiek veidoti manuāli:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Pēc noklusējuma izmantojiet šīs atrašanās vietas:

- `src/app/pages` - lietotnes līmeņa lazy loaded lapas
- `src/app/feature/<name>` - feature specifisks kods ar biznesa loģiku / back-end
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - koplietojamais vispārīgais kods

# Create a new project from this template

Klonējiet noklusēto repozitoriju jaunā mapē ar sava projekta nosaukumu (aizstājiet `PROJECT_NAME` ar sava projekta nosaukumu):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Lejupielādē veidnes repozitoriju un izveido lokālu mapi ar nosaukumu `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Atver jaunizveidoto projekta mapi.
- `npm i`
  Instalē visas projekta atkarības no `package.json`.
- `npm run start`
  Palaiž lokālo izstrādes serveri.

Pēc tam atveriet terminālī parādīto lokālo URL, parasti [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Ja vēlaties sākt no nulles, nevis saglabāt veidnes git vēsturi, noņemiet esošo `.git` mapi, inicializējiet jaunu repozitoriju un izveidojiet pirmo commit.

Piemērs:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` savieno jūsu lokālo repozitoriju ar attālo GitHub repozitoriju, lai turpmākās `git push` un `git pull` komandas zinātu, kur atrodas galvenais projekts.

Pirmajam commit arī izmantojiet Conventional Commit ziņojumu. Labs noklusējuma variants ir:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
