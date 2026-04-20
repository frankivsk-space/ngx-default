# Angular Landing Template (SSR + Prerender)

Modernus Angular 21 pradinis šablonas greitiems nukreipimo puslapiams kurti su **SSR prerenderinimu**, **TailwindCSS** ir **GitHub Pages diegimu**.

Šis šablonas optimizuotas statiniams nukreipimo puslapiams, kuriuose puslapiai sugeneruojami **kompiliavimo metu** dėl SEO ir našumo.

---

# Acknowledge

- Angular **21**
- **SSR prerenderinimas** kompiliavimo metu
- **Angular be Zone.js**
- Būsena, naudojama HTML klasių susiejimuose, turi būti pateikta kaip **signals**
- Kurdami naujas formas, kaip pagrindinį sprendimą rinkitės **Angular Signal Forms**
- **OnPush change detection pagal nutylėjimą**
- **TailwindCSS v4**
- Naudokite bendrus **temos CSS kintamuosius** iš `src/styles/_theme.scss` spalvoms, paviršiams, tarpams, kampų apvalinimui ir animacijai
- **GitHub Pages diegimas**
- **Prettier formatavimas**
- Švari minimali projekto struktūra

Projektas sugeneruoja abu:

```
dist/app/browser
dist/app/server
```

Tačiau diegimui naudojama **naršyklės prerenderinta išvestis**, todėl tai puikiai tinka statiniam talpinimui.

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

SSR konfigūracija yra:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Paleiskite vystymo serverį:

```
npm start
```

arba

```
ng serve
```

Programa veikia adresu [http://localhost:4200](http://localhost:4200)

Vystymo režimas veikia kaip įprasta Angular SPA.

---

# Build

Sukompiliuokite projektą:

```
npm run build
```

Tai sugeneruoja:

```
dist/app/browser
dist/app/server
```

Puslapiai yra **prerenderinami kompiliavimo metu** naudojant Angular SSR.

---

# Running the SSR server (optional)

Šablonas apima Node serverį SSR veikimui:

```
npm run serve:ssr:app
```

Tai paleidžia:

```
node dist/app/server/server.mjs
```

Daugumai nukreipimo puslapių to **nereikia**, nes prerenderintas HTML jau sugeneruotas.

---

# Prerender configuration

Pagal nutylėjimą prerenderinami visi maršrutai:

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

Tai leidžia Angular kompiliavimo metu sugeneruoti statinį HTML kiekvienam maršrutui.

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

Tailwind konfigūruojamas per:

```
.postcssrc.json
```

Tailwind turėtų būti naudojamas kuo dažniau kasdieniams UI darbams.

Tailwind utility klases rinkitės:

- išdėstymui
- tarpams
- tipografijai
- spalvoms
- kraštinėms
- dydžiams
- prisitaikančiam elgesiui

SCSS naudokite tik tada, kai Tailwind nėra tinkamas sprendimas, pavyzdžiui:

- sudėtingam konkretaus komponento stiliui
- bendriems dizaino tokenams ir miksinams
- pažangioms būsenoms ar selektoriams
- nedideliam kiekiui globalių stilių

Globalūs stiliai yra:

```
src/styles.scss
```

---

# Icons

Šiame šablone yra **Material Symbols Outlined**, ir jos turėtų būti naudojamos kaip numatytasis piktogramų rinkinys visame projekte.

Įkeliama čia:

```
src/index.html
```

Piktogramas naudokite tiesiogiai HTML taip:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Prieinamiems mygtukams piktogramą palikite dekoratyvinę, o pačiam mygtukui suteikite tekstinę etiketę arba `aria-label`:

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

Naudokite SCSS taip, kad tai atitiktų modernius Angular numatytuosius principus:

- Daugumą stilių laikykite komponento `.scss` faile.
- `src/styles.scss` naudokite tik tikrai globaliems stiliams, tokiems kaip resetai, tokenai, tipografija ir utility sluoksniai.
- Spalvoms, tarpams ir temoms, kurios gali keistis vykdymo metu, rinkitės CSS kintamuosius.
- Naudokite SCSS galimybes, tokias kaip `@use`, miksinus ir partials, kad būtų patogiau rašyti ir dalintis dizaino tokenais.
- Venkite gilaus selektorių lizdinimo. Selektoriai turi būti paprasti ir lokalūs komponentui.
- Venkite `::ng-deep` ir `ViewEncapsulation.None`, nebent yra aiški integracijos priežastis.
- Šablonuose rinkitės klasių susiejimus, o ne sudėtingus inline stiliaus susiejimus.

Rekomenduojamas skaidymas:

```text
src/styles.scss           -> globalus įėjimo taškas
src/app/**/**/*.scss      -> komponentų lokalūs stiliai
src/styles/_theme.scss    -> bendri temos CSS kintamieji
```

---

# Environments

Šiame šablone yra Angular environment failai, kuriuos galima naudoti skirtingoms vykdymo aplinkoms, pvz., vietiniam vystymui ir produkciniams buildams.

Galimi failai:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Tipiniai naudojimo atvejai:

- API baziniai URL
- funkcijų vėliavos
- analytics įjungimo / išjungimo nustatymai
- išorinių paslaugų konfigūracija

Produkciniai buildai pakeičia `environment.ts` į `environment.prod.ts` naudojant Angular file replacements.

Environment failuose laikykite tik viešą front-end konfigūraciją. Nelaikykite juose paslapčių.

---

# Deployment

Diegimas vykdomas automatiškai per **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Žingsniai:

1. Įdiegti priklausomybes
2. Sukompiliuoti Angular programą
3. Nukopijuoti `CNAME`
4. Išsiųsti build išvestį į `gh-pages`

Diegiamas aplankas:

```
dist/app/browser
```

---

# Domain

Pasirinktinis domenas, kurį turėtumėte pakeisti savo domenu, kad viskas veiktų tinkamai, bet kuriam `*.itkamianets.com` subdomenui, jei jis dar nebuvo naudotas mūsų GitHub organizacijoje.

```
ngx.itkamianets.com
```

Konfigūruota per:

```
CNAME
```

---

# Code Style

Formatavimą tvarko:

- `.editorconfig`
- `.prettierrc`

Pagrindinės konvencijos:

- **tabuliacija**
- **viengubos kabutės**
- **100 simbolių eilutės plotis**

---

# AI Usage

Jei naudojate AI už IDE ribų ir jis automatiškai neperskaito repozitorijos instrukcijų, pirmiausia nukopijuokite `AGENTS.md` turinį į AI užklausą / kontekstą.

Taip užtikrinsite, kad AI laikysis tų pačių projektui skirtų taisyklių, kurių IDE viduje laikosi Codex.

---

# NPM Scripts

Paleisti vystymą:

```
npm start
```

Sukompiliuoti projektą:

```
npm run build
```

Paleisti SSR serverį:

```
npm run serve:ssr:app
```

---

# Requirements

Rekomenduojama aplinka:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Programos puslapiai turi būti kuriami čia:

```text
src/app/pages/
```

Kiekvienas puslapis turi turėti savo aplanką ir savo komponento failą.

Pavyzdys:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Sugeneruokite puslapio komponentą su Angular CLI:

```bash
ng generate component pages/home
```

arba trumpiau:

```bash
ng g c pages/home
```

Puslapiai turi būti tingiai įkraunami iš `src/app/app.routes.ts`.

Maršrutų konfigūracijos pavyzdys:

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

Jei kuriai nors programos daliai reikia atskiros verslo logikos ir back-end integracijos, sukurkite atskirą feature aplanką čia:

```text
src/app/feature/
```

Kiekviena feature turi turėti savo vidinę struktūrą.

Pavyzdys:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Paslaugos vietos pavyzdys:

```text
src/app/feature/user/services/user.service.ts
```

Siūlomos CLI komandos:

Sukurti feature puslapį:

```bash
ng g c feature/user/pages/user-profile
```

Sukurti feature komponentą:

```bash
ng g c feature/user/components/user-card
```

Sukurti feature direktyvą:

```bash
ng g d feature/user/directives/user-focus
```

Sukurti feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Sukurti feature paslaugą:

```bash
ng g s feature/user/services/user
```

Sąsajos dažniausiai kuriamos rankiniu būdu:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Mažoms koncentruotoms feature taip pat tinka vienoje vietoje laikomi failai, tokie kaip `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` ir `language.service.ts`, kai tokia struktūra padeda išlaikyti feature paprastesnę.

---

## Generic shared code

Bendras daugkartinio naudojimo kodas, kuris nėra susietas su viena konkrečia feature, gali būti laikomas tiesiogiai `src/app`.

Bendrų aplankų pavyzdžiai:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Bendro pipe vietos pavyzdys:

```text
src/app/pipes/phone.pipe.ts
```

Siūlomos CLI komandos:

Sukurti bendrą komponentą:

```bash
ng g c components/page-header
```

Sukurti bendrą direktyvą:

```bash
ng g d directives/autofocus
```

Sukurti bendrą pipe:

```bash
ng g p pipes/phone
```

Sukurti bendrą paslaugą:

```bash
ng g s services/api
```

Sąsajos dažniausiai kuriamos rankiniu būdu:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Pagal nutylėjimą naudokite šias vietas:

- `src/app/pages` - programos lygio tingiai įkraunami puslapiai
- `src/app/feature/<name>` - feature specifinis kodas su verslo logika / back-end
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - bendras dalijamas kodas

# Create a new project from this template

Nukopijuokite numatytąjį repozitorijos šabloną į naują aplanką su savo projekto pavadinimu (pakeiskite `PROJECT_NAME` savo projekto pavadinimu):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Atsiunčia šablono repozitoriją ir sukuria vietinį aplanką pavadinimu `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Atidaro naujai sukurtą projekto aplanką.
- `npm i`
  Įdiegia visas projekto priklausomybes iš `package.json`.
- `npm run start`
  Paleidžia vietinį vystymo serverį.

Po to atidarykite vietinį URL, parodytą terminale, dažniausiai [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Jei norite pradėti nuo nulio vietoje šablono git istorijos išlaikymo, pašalinkite esamą `.git` aplanką, inicializuokite naują repozitoriją ir sukurkite pirmą commit.

Pavyzdys:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` prijungia jūsų vietinį repozitorijų prie nuotolinio GitHub repozitorijaus, kad būsimos `git push` ir `git pull` komandos žinotų, kur yra pagrindinis projektas.

Pirmajam commit taip pat naudokite Conventional Commit žinutę. Tinkamas numatytasis variantas:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
