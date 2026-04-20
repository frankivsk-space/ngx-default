# Angular Landing Template (SSR + Prerender)

Sodobna začetna predloga Angular 21 za izdelavo hitrih pristajalnih strani z **SSR prerenderiranjem**, **TailwindCSS** in **objavo prek GitHub Pages**.

Ta predloga je optimizirana za statične pristajalne strani, kjer so strani izrisane ob **času gradnje** za SEO in zmogljivost.

---

# Acknowledge

- Angular **21**
- **SSR prerenderiranje** med gradnjo
- **Zoneless Angular**
- Stanje, uporabljeno v vezavah razredov HTML, naj bo izpostavljeno kot **signals**
- Pri gradnji novih obrazcev dajte prednost **Angular Signal Forms** kot glavnemu pristopu za obrazce
- **OnPush change detection privzeto**
- **TailwindCSS v4**
- Uporabite skupne **CSS spremenljivke teme** iz `src/styles/_theme.scss` za barve, površine, razmike, radije in animacijo
- **Objava prek GitHub Pages**
- **Prettier formatiranje**
- Čista minimalna struktura projekta

Projekt izdela obe mapi:

```
dist/app/browser
dist/app/server
```

Vendar se za objavo uporablja **prerenderiran browser output**, zato je odlična izbira za statično gostovanje.

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

Konfiguracija SSR je v:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Zaženite razvojni strežnik:

```
npm start
```

ali

```
ng serve
```

Aplikacija teče na [http://localhost:4200](http://localhost:4200)

Razvojni način teče kot običajna Angular SPA.

---

# Build

Zgradite projekt:

```
npm run build
```

To ustvari:

```
dist/app/browser
dist/app/server
```

Strani se z Angular SSR **prerenderirajo ob času gradnje**.

---

# Running the SSR server (optional)

Predloga vključuje Node strežnik za SSR:

```
npm run serve:ssr:app
```

To zažene:

```
node dist/app/server/server.mjs
```

Za večino pristajalnih strani to **ni potrebno**, ker je prerenderiran HTML že ustvarjen.

---

# Prerender configuration

Vse poti se privzeto prerenderirajo:

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

To Angularju omogoči, da med gradnjo ustvari statični HTML za vsako pot.

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

Tailwind je konfiguriran prek:

```
.postcssrc.json
```

Tailwind je treba čim več uporabljati za vsakodnevno delo na uporabniškem vmesniku.

Dajte prednost Tailwind utilitijem za:

- postavitev
- razmike
- tipografijo
- barve
- obrobe
- dimenzije
- odzivno vedenje

SCSS uporabite le, ko Tailwind ni pravo orodje, na primer za:

- kompleksno stiliranje, vezano na komponento
- skupne oblikovne tokene in mixine
- napredna stanja ali selektorje
- manjše količine globalnega stiliranja

Globalni slogi so v:

```
src/styles.scss
```

---

# Icons

Ta predloga vključuje **Material Symbols Outlined**, ki naj bodo privzeti nabor ikon v celotnem projektu.

Naložene so v:

```
src/index.html
```

Ikone uporabite neposredno v HTML takole:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Pri dostopnih gumbih naj bo ikona dekorativna, gumb pa naj ima besedilno oznako ali `aria-label`:

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

SCSS uporabljajte na način, ki sledi sodobnim Angular privzetim nastavitvam:

- Večino slogov ohranite v datoteki komponente `.scss`.
- `src/styles.scss` uporabljajte le za res globalne sloge, kot so reseti, tokeni, tipografija in utility plasti.
- Dajte prednost CSS spremenljivkam za barve, razmike in temo, ki se lahko spreminja med izvajanjem.
- Uporabljajte možnosti SCSS, kot so `@use`, mixini in partials, za udobnejše pisanje in skupne oblikovne tokene.
- Izogibajte se globokemu gnezdenju selektorjev. Selektorji naj bodo preprosti in lokalni za komponento.
- Izogibajte se `::ng-deep` in `ViewEncapsulation.None`, razen če za to obstaja jasen integracijski razlog.
- V predlogah dajte prednost vezavam razredov pred obsežnimi vezavami inline slogov.

Priporočena razdelitev:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Ta predloga vključuje Angular okoljske datoteke, ki jih lahko uporabite za različne postavitve izvajanja, kot sta lokalni razvoj in produkcijska gradnja.

Razpoložljive datoteke:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Tipični primeri uporabe:

- osnovni URL-ji API-ja
- feature flags
- stikala za analitiko
- konfiguracija zunanjih storitev

Produkcijske gradnje z Angular zamenjavami datotek zamenjajo `environment.ts` z `environment.prod.ts`.

Okoljske datoteke naj vsebujejo le javno konfiguracijo frontenda. Vanje ne shranjujte skrivnosti.

---

# Deployment

Objava se samodejno izvaja prek **GitHub Actions**.

Potek:

```
.github/workflows/deploy.yml
```

Koraki:

1. Namestitev odvisnosti
2. Build Angular aplikacije
3. Kopiranje `CNAME`
4. Potisk build outputa v `gh-pages`

Objavljena mapa je:

```
dist/app/browser
```

---

# Domain

Lastna domena, ki jo morate prilagoditi svoji domeni, da bo pravilno delovala; lahko je katerakoli poddomena `*.itkamianets.com`, če še ni uporabljena v naši GitHub organizaciji.

```
ngx.itkamianets.com
```

Konfigurirana je prek:

```
CNAME
```

---

# Code Style

Formatiranje upravljata:

- `.editorconfig`
- `.prettierrc`

Ključne konvencije:

- **tabulatorji**
- **enojni narekovaji**
- **širina vrstice 100 znakov**

---

# AI Usage

Če uporabljate AI zunaj IDE-ja in ta samodejno ne prebere navodil repozitorija, najprej kopirajte vsebino `AGENTS.md` v AI prompt ali kontekst.

To zagotovi, da AI sledi istim pravilom, specifičnim za projekt, kot jih Codex uporablja v IDE-ju.

---

# NPM Scripts

Začetek razvoja:

```
npm start
```

Build projekta:

```
npm run build
```

Zagon SSR strežnika:

```
npm run serve:ssr:app
```

---

# Requirements

Priporočeno okolje:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Strani aplikacije ustvarjajte v:

```text
src/app/pages/
```

Vsaka stran naj ima svojo mapo in svojo datoteko komponente.

Primer:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Komponento strani ustvarite z Angular CLI:

```bash
ng generate component pages/home
```

ali krajše:

```bash
ng g c pages/home
```

Strani naj se leno nalagajo iz `src/app/app.routes.ts`.

Primer konfiguracije poti:

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

Če del aplikacije potrebuje lastno poslovno logiko in integracijo z backendom, ustvarite namensko feature mapo v:

```text
src/app/feature/
```

Vsak feature naj ohrani svojo notranjo strukturo.

Primer:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Primer lokacije storitve:

```text
src/app/feature/user/services/user.service.ts
```

Predlagani CLI ukazi:

Ustvari feature stran:

```bash
ng g c feature/user/pages/user-profile
```

Ustvari feature komponento:

```bash
ng g c feature/user/components/user-card
```

Ustvari feature direktivo:

```bash
ng g d feature/user/directives/user-focus
```

Ustvari feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Ustvari feature storitev:

```bash
ng g s feature/user/services/user
```

Vmesniki se običajno ustvarijo ročno:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Za majhne, osredotočene feature so sprejemljive tudi kolocirane datoteke, kot so `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` in `language.service.ts`, kadar takšna struktura feature poenostavi.

---

## Generic shared code

Splošna večkrat uporabna koda, ki ni vezana na en določen feature, je lahko neposredno pod `src/app`.

Primeri deljenih map:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Primer lokacije deljene pipe:

```text
src/app/pipes/phone.pipe.ts
```

Predlagani CLI ukazi:

Ustvari deljeno komponento:

```bash
ng g c components/page-header
```

Ustvari deljeno direktivo:

```bash
ng g d directives/autofocus
```

Ustvari deljeno pipo:

```bash
ng g p pipes/phone
```

Ustvari deljeno storitev:

```bash
ng g s services/api
```

Vmesniki se običajno ustvarijo ročno:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Privzeto uporabljajte te lokacije:

- `src/app/pages` - aplikacijske strani z lenim nalaganjem
- `src/app/feature/<name>` - feature-specifična koda z backend/poslovno logiko
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - splošna deljena koda

# Create a new project from this template

Privzeti repozitorij klonirajte v novo mapo z imenom projekta (zamenjajte `PROJECT_NAME` z imenom svojega projekta):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Prenese repozitorij predloge in ustvari lokalno mapo z imenom `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Odpre novo ustvarjeno mapo projekta.
- `npm i`
  Namesti vse odvisnosti projekta iz `package.json`.
- `npm run start`
  Zažene lokalni razvojni strežnik.

Nato odprite lokalni URL, prikazan v terminalu, običajno [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Če želite začeti na novo namesto da ohranite git zgodovino predloge, odstranite obstoječo mapo `.git`, inicializirajte nov repozitorij in ustvarite prvi commit.

Primer:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` poveže vaš lokalni repozitorij z oddaljenim GitHub repozitorijem, da bodo prihodnji ukazi `git push` in `git pull` vedeli, kje je glavni projekt.

Tudi za prvi commit uporabite Conventional Commit sporočilo. Dobra privzeta izbira je:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
