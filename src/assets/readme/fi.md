# Angular Landing Template (SSR + Prerender)

Moderni Angular 21 -aloituspohja nopeiden landing page -sivujen rakentamiseen käyttäen **SSR prerendering**, **TailwindCSS** ja **GitHub Pages deployment**.

Tämä pohja on optimoitu staattisille landing site -sivustoille, joissa sivut renderöidään **build time** -vaiheessa SEO:n ja suorituskyvyn vuoksi.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** buildin aikana
- **Zoneless Angular**
- HTML class bindings -sidonnoissa käytettävä state tulisi tarjota **signals**-muodossa
- Suosi **Angular Signal Forms** -ratkaisua ensisijaisena lähestymistapana uusia lomakkeita rakennettaessa
- **OnPush change detection by default**
- **TailwindCSS v4**
- Käytä jaettuja **theme CSS variables** -muuttujia tiedostosta `src/styles/_theme.scss` väreihin, pintoihin, väleihin, pyöristyksiin ja liikkeeseen
- **GitHub Pages deployment**
- **Prettier formatting**
- Siisti minimalistinen projektirakenne

Projekti rakentaa molemmat:

```
dist/app/browser
dist/app/server
```

Mutta deployment käyttää **browser prerendered output** -tulosta, mikä tekee siitä erinomaisen staattiseen hostaukseen.

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

SSR configuration sijaitsee tiedostoissa:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Käynnistä development server:

```
npm start
```

tai

```
ng serve
```

Sovellus toimii osoitteessa [http://localhost:4200](http://localhost:4200)

Development mode toimii tavallisen Angular SPA:n tavoin.

---

# Build

Rakenna projekti:

```
npm run build
```

Tämä generoi:

```
dist/app/browser
dist/app/server
```

Sivut ovat **prerendered at build time** Angular SSR:n avulla.

---

# Running the SSR server (optional)

Pohja sisältää Node server -ratkaisun SSR:ää varten:

```
npm run serve:ssr:app
```

Tämä suorittaa:

```
node dist/app/server/server.mjs
```

Useimmille landing page -sivuille tätä **ei tarvita**, koska prerendered HTML on jo generoitu.

---

# Prerender configuration

Kaikki routes prerenderöidään oletuksena:

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

Tämä saa Angularin generoimaan staattisen HTML:n jokaiselle route-polulle buildin aikana.

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

Tailwind on määritelty tiedoston kautta:

```
.postcssrc.json
```

Tailwindiä tulisi käyttää mahdollisimman paljon päivittäisessä UI-työssä.

Suosi Tailwind utilities -luokkia näihin:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Käytä SCSS:ää vain silloin, kun Tailwind ei ole oikea työkalu, esimerkiksi:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- pienet määrät globaalia tyylittelyä

Globaalit tyylit sijaitsevat tiedostossa:

```
src/styles.scss
```

---

# Icons

Tämä pohja sisältää **Material Symbols Outlined** -ikonit, ja niitä tulisi käyttää projektin oletusikoneina.

Ladattu tiedostossa:

```
src/index.html
```

Käytä ikoneita suoraan HTML:ssä näin:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Esteettömien painikkeiden kohdalla pidä ikoni koristeellisena ja lisää painikkeelle tekstiselite tai `aria-label`:

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

Käytä SCSS:ää tavalla, joka vastaa moderneja Angular defaults -käytäntöjä:

- Pidä suurin osa tyyleistä component `.scss` file -tiedoston sisällä.
- Käytä `src/styles.scss` -tiedostoa vain aidosti globaaleihin tyyleihin, kuten resets, tokens, typography ja utility layers.
- Suosi CSS variables -muuttujia väreihin, spacingiin ja themingiin, jotka voivat muuttua runtime-aikana.
- Käytä SCSS-ominaisuuksia kuten `@use`, mixins ja partials helpompaan authoring-työhön ja jaettuihin design tokens -rakenteisiin.
- Vältä syvää selector nesting -rakennetta. Pidä selectors yksinkertaisina ja komponenttiin paikallisina.
- Vältä `::ng-deep` ja `ViewEncapsulation.None`, ellei siihen ole selvää integraatiosyytä.
- Suosi templates-tiedostoissa class bindings -sidontoja raskaiden inline style bindings -ratkaisujen sijaan.

Suositeltu jako:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Tämä pohja sisältää Angular environment files -tiedostot, ja niitä voidaan käyttää erilaisiin runtime setups -tilanteisiin, kuten paikalliseen kehitykseen ja production builds -rakennuksiin.

Saatavilla olevat tiedostot:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Tyypilliset käyttötapaukset:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Production builds korvaa `environment.ts`-tiedoston tiedostolla `environment.prod.ts` Angular file replacements -mekanismin kautta.

Pidä environment files vain julkisen front-end-konfiguraation käytössä. Älä tallenna niihin salaisuuksia.

---

# Deployment

Deployment hoidetaan automaattisesti **GitHub Actions** -ratkaisun kautta.

Workflow:

```
.github/workflows/deploy.yml
```

Vaiheet:

1. Asenna dependencies
2. Rakenna Angular app
3. Kopioi `CNAME`
4. Push build output `gh-pages`-haaraan

Julkaistu kansio on:

```
dist/app/browser
```

---

# Domain

Custom domain, joka sinun tulee vaihtaa omaan domainiisi, jotta kaikki toimii oikein; mikä tahansa `*.itkamianets.com` alidomain käy, jos sitä ei ole aiemmin käytetty github orgissamme.

```
ngx.itkamianets.com
```

Määritetty tiedoston kautta:

```
CNAME
```

---

# Code Style

Muotoilua hallitaan tiedostoilla:

- `.editorconfig`
- `.prettierrc`

Keskeiset käytännöt:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Jos käytät AI:ta IDE:n ulkopuolella eikä se lue repository-ohjeita automaattisesti, kopioi ensin
`AGENTS.md`-tiedoston sisältö AI prompt/context -kenttään.

Tämä varmistaa, että AI noudattaa samoja projektikohtaisia sääntöjä, joita Codex käyttää IDE:n sisällä.

---

# NPM Scripts

Käynnistä development:

```
npm start
```

Rakenna projekti:

```
npm run build
```

Käynnistä SSR server:

```
npm run serve:ssr:app
```

---

# Requirements

Suositeltu ympäristö:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Application pages tulisi luoda kansioon:

```text
src/app/pages/
```

Jokaisella sivulla tulisi olla oma kansio ja oma component file.

Esimerkki:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Generoi page component Angular CLI:llä:

```bash
ng generate component pages/home
```

tai lyhyemmin:

```bash
ng g c pages/home
```

Pages tulisi lazy loadata tiedostosta `src/app/app.routes.ts`.

Esimerkki route config:

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

Jos jokin osa sovelluksesta tarvitsee oman business logic -kerroksen ja back-end integration -rakenteen, luo erillinen feature folder kansioon:

```text
src/app/feature/
```

Jokaisen feature-osion tulisi säilyttää oma sisäinen rakenteensa.

Esimerkki:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Esimerkkisijainti servicelle:

```text
src/app/feature/user/services/user.service.ts
```

Suositellut CLI-komennot:

Luo feature page:

```bash
ng g c feature/user/pages/user-profile
```

Luo feature component:

```bash
ng g c feature/user/components/user-card
```

Luo feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Luo feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Luo feature service:

```bash
ng g s feature/user/services/user
```

Interfaces luodaan yleensä käsin:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Pienille kohdennetuille features-osioille myös colocated files kuten `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts` ja `language.service.ts` ovat hyväksyttäviä, kun tämä
rakenne pitää feature-osuuden yksinkertaisempana.

---

## Generic shared code

Yleinen uudelleenkäytettävä koodi, joka ei kuulu yhteen tiettyyn feature-osioon, voi sijaita suoraan `src/app`-hakemiston alla.

Esimerkkejä shared folders -kansioista:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Esimerkki shared pipe -sijainnista:

```text
src/app/pipes/phone.pipe.ts
```

Suositellut CLI-komennot:

Luo shared component:

```bash
ng g c components/page-header
```

Luo shared directive:

```bash
ng g d directives/autofocus
```

Luo shared pipe:

```bash
ng g p pipes/phone
```

Luo shared service:

```bash
ng g s services/api
```

Interfaces luodaan yleensä käsin:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Käytä oletuksena näitä sijainteja:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Kloonaa default repository uuteen kansioon projektisi nimellä (korvaa `PROJECT_NAME` projektisi nimellä):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Lataa template repositoryn ja luo paikallisen kansion nimeltä `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Avaa juuri luodun projektikansion.
- `npm i`
  Asentaa kaikki projektin dependencies-paketit tiedostosta `package.json`.
- `npm run start`
  Käynnistää paikallisen development serverin.

Sen jälkeen avaa terminaalissa näytetty paikallinen URL, yleensä [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Jos haluat aloittaa puhtaalta pöydältä sen sijaan, että säilyttäisit template git historyn, poista olemassa oleva `.git` folder, alusta uusi repository ja luo ensimmäinen commit.

Esimerkki:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` yhdistää paikallisen repositorysi etäiseen GitHub repositoryyn, jotta tulevat `git push`- ja `git pull`-komennot tietävät, missä pääprojektisi sijaitsee.

Käytä ensimmäiselle commitille myös Conventional Commit message -muotoa. Hyvä oletusarvo on:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
