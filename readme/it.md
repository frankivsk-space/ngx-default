# Angular Landing Template (SSR + Prerender)

Template starter moderno per Angular 21 per creare landing page veloci con
**SSR prerendering**, **TailwindCSS** e **deploy su GitHub Pages**.

Questo template e ottimizzato per siti landing statici in cui le pagine vengono
renderizzate **in fase di build** per SEO e prestazioni.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** durante la build
- **Angular zoneless**
- Lo stato usato nei `class` bindings HTML dovrebbe essere esposto come **signals**
- Preferisci **Angular Signal Forms** come approccio principale quando crei nuovi form
- **OnPush change detection by default**
- **TailwindCSS v4**
- Usa le **theme CSS variables** condivise da `src/styles/_theme.scss` per colori,
  superfici, spaziature, raggi e motion
- **Deploy su GitHub Pages**
- **Formattazione con Prettier**
- Struttura del progetto pulita e minimale

Il progetto genera entrambi gli output:

```
dist/app/browser
dist/app/server
```

Ma il deploy usa l'**output browser prerenderizzato**, rendendolo perfetto per hosting statico.

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

La configurazione SSR si trova in:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Avvia il server di sviluppo:

```
npm start
```

oppure

```
ng serve
```

L'applicazione gira su [http://localhost:4200](http://localhost:4200)

In modalita sviluppo funziona come una normale Angular SPA.

---

# Build

Compila il progetto:

```
npm run build
```

Questo genera:

```
dist/app/browser
dist/app/server
```

Le pagine vengono **prerenderizzate in fase di build** usando Angular SSR.

---

# Running the SSR server (optional)

Il template include un server Node per SSR:

```
npm run serve:ssr:app
```

Questo esegue:

```
node dist/app/server/server.mjs
```

Per la maggior parte delle landing page questo **non e necessario**, perche l'HTML
prerenderizzato viene gia generato durante la build.

---

# Prerender configuration

Tutte le route vengono prerenderizzate di default:

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

Questo fa si che Angular generi HTML statico per ogni route durante la build.

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

Tailwind e configurato tramite:

```
.postcssrc.json
```

Tailwind dovrebbe essere usato il piu possibile nel lavoro UI quotidiano.

Preferisci le utility Tailwind per:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Usa SCSS solo quando Tailwind non e lo strumento giusto, per esempio per:

- styling complesso specifico dei componenti
- design token e mixin condivisi
- stati o selettori avanzati
- piccole quantita di stile globale

Gli stili globali si trovano in:

```
src/styles.scss
```

---

# Icons

Questo template include **Material Symbols Outlined** e dovrebbero essere usate come
set di icone predefinito in tutto il progetto.

Sono caricate in:

```
src/index.html
```

Usa le icone direttamente in HTML in questo modo:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Per pulsanti accessibili, mantieni l'icona decorativa e fornisci un'etichetta testuale
o un `aria-label` sul pulsante stesso:

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

Usa SCSS in modo coerente con i default moderni di Angular:

- Mantieni la maggior parte degli stili nel file `.scss` del componente.
- Usa `src/styles.scss` solo per stili veramente globali come reset, token, tipografia
  e utility layer.
- Preferisci CSS variables per colori, spaziature e temi che possono cambiare a runtime.
- Usa funzionalita SCSS come `@use`, mixin e partial per comodita di authoring e
  design token condivisi.
- Evita nesting profondo dei selettori. Mantieni i selettori semplici e locali al componente.
- Evita `::ng-deep` e `ViewEncapsulation.None` salvo chiari motivi di integrazione.
- Preferisci class bindings nei template rispetto a inline style bindings pesanti.

Suddivisione consigliata:

```text
src/styles.scss           -> entry point globale
src/app/**/**/*.scss      -> stili locali ai componenti
src/styles/_theme.scss    -> theme CSS variables condivise
```

---

# Environments

Questo template include i file environment di Angular e possono essere usati per
diverse configurazioni runtime come sviluppo locale e build di produzione.

File disponibili:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Casi d'uso tipici:

- URL base API
- feature flag
- toggle analytics
- configurazione di servizi esterni

Le build di produzione sostituiscono `environment.ts` con `environment.prod.ts`
tramite i file replacements di Angular.

Mantieni i file environment limitati alla configurazione pubblica del front-end.
Non archiviare segreti al loro interno.

---

# Deployment

Il deploy viene gestito automaticamente tramite **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Passaggi:

1. Installare le dipendenze
2. Compilare l'app Angular
3. Copiare `CNAME`
4. Pubblicare l'output della build su `gh-pages`

La cartella deployata e:

```
dist/app/browser
```

---

# Domain

Dominio personalizzato che dovresti adattare al tuo dominio in modo che funzioni correttamente;
qualsiasi sottodominio di `*.itkamianets.com` va bene se non e gia usato nella nostra organizzazione GitHub.

```
ngx.itkamianets.com
```

Configurato tramite:

```
CNAME
```

---

# Code Style

La formattazione e gestita da:

- `.editorconfig`
- `.prettierrc`

Convenzioni principali:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Se usi AI fuori dall'IDE e non legge automaticamente le istruzioni del repository,
copia prima il contenuto di `AGENTS.md` nel prompt/contesto dell'AI.

Questo assicura che l'AI segua le stesse regole specifiche del progetto che Codex usa nell'IDE.

---

# NPM Scripts

Avvia lo sviluppo:

```
npm start
```

Compila il progetto:

```
npm run build
```

Esegui il server SSR:

```
npm run serve:ssr:app
```

---

# Requirements

Ambiente consigliato:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Le pagine dell'applicazione dovrebbero essere create dentro:

```text
src/app/pages/
```

Ogni pagina dovrebbe avere la propria cartella e il proprio file componente.

Esempio:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Genera un componente pagina con Angular CLI:

```bash
ng generate component pages/home
```

oppure in forma breve:

```bash
ng g c pages/home
```

Le pagine dovrebbero essere lazy loaded da `src/app/app.routes.ts`.

Esempio di configurazione route:

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

Se una parte dell'app ha bisogno della propria business logic e integrazione back-end,
crea una cartella feature dedicata dentro:

```text
src/app/feature/
```

Ogni feature dovrebbe mantenere la propria struttura interna.

Esempio:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Esempio di percorso per un service:

```text
src/app/feature/user/services/user.service.ts
```

Comandi CLI suggeriti:

Creare una pagina feature:

```bash
ng g c feature/user/pages/user-profile
```

Creare un componente feature:

```bash
ng g c feature/user/components/user-card
```

Creare una direttiva feature:

```bash
ng g d feature/user/directives/user-focus
```

Creare una pipe feature:

```bash
ng g p feature/user/pipes/user-name
```

Creare un service feature:

```bash
ng g s feature/user/services/user
```

Le interfacce di solito vengono create manualmente:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Per feature piccole e mirate, sono validi anche file colocati come
`feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts`
e `language.service.ts` quando questa struttura mantiene la feature piu semplice.

---

## Generic shared code

Il codice riutilizzabile generico che non appartiene a una feature specifica puo stare direttamente sotto `src/app`.

Esempi di cartelle condivise:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Esempio di percorso per una pipe condivisa:

```text
src/app/pipes/phone.pipe.ts
```

Comandi CLI suggeriti:

Creare un componente condiviso:

```bash
ng g c components/page-header
```

Creare una direttiva condivisa:

```bash
ng g d directives/autofocus
```

Creare una pipe condivisa:

```bash
ng g p pipes/phone
```

Creare un service condiviso:

```bash
ng g s services/api
```

Le interfacce di solito vengono create manualmente:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Usa queste posizioni come default:

- `src/app/pages` - pagine di livello applicazione caricate in lazy loading
- `src/app/feature/<name>` - codice specifico della feature con business logic/back-end
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - codice condiviso generico

# Create a new project from this template

Clona il repository base in una nuova cartella con il nome del tuo progetto
(sostituisci `PROJECT_NAME` con il nome del tuo progetto):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Scarica il repository template e crea una cartella locale chiamata `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Apre la cartella del progetto appena creata.
- `npm i`
  Installa tutte le dipendenze del progetto da `package.json`.
- `npm run start`
  Avvia il server di sviluppo locale.

Dopo, apri l'URL locale mostrato nel terminale, di solito [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Se vuoi partire da zero invece di mantenere la history git del template, rimuovi la cartella `.git`,
inizializza un nuovo repository e crea il primo commit.

Esempio:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` collega il tuo repository locale al repository remoto GitHub, in modo che
i futuri comandi `git push` e `git pull` sappiano dove si trova il progetto principale.

Usa un messaggio Conventional Commit anche per il primo commit. Un buon default e:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
