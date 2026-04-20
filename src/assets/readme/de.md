# Angular Landing Template (SSR + Prerender)

Modernes Angular-21-Starter-Template zum Erstellen schneller Landingpages mit **SSR prerendering**, **TailwindCSS** und **GitHub Pages deployment**.

Dieses Template ist für statische Landing-Sites optimiert, bei denen Seiten **zur Build-Zeit** für SEO und Performance gerendert werden.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** während des Builds
- **Zoneless Angular**
- State, das in HTML class bindings verwendet wird, sollte als **signals** bereitgestellt werden
- Bevorzuge **Angular Signal Forms** als primären Ansatz beim Erstellen neuer Formulare
- **OnPush change detection by default**
- **TailwindCSS v4**
- Verwende gemeinsame **theme CSS variables** aus `src/styles/_theme.scss` für Farben, Flächen, Abstände, Rundungen und Bewegung
- **GitHub Pages deployment**
- **Prettier formatting**
- Saubere minimale Projektstruktur

Das Projekt baut beide Ausgaben:

```
dist/app/browser
dist/app/server
```

Für das Deployment wird jedoch die **browser prerendered output** verwendet, was es ideal für statisches Hosting macht.

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

Die SSR configuration befindet sich in:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Starte den development server:

```
npm start
```

oder

```
ng serve
```

Die Anwendung läuft unter [http://localhost:4200](http://localhost:4200)

Der Development mode läuft wie eine normale Angular SPA.

---

# Build

Baue das Projekt:

```
npm run build
```

Dies erzeugt:

```
dist/app/browser
dist/app/server
```

Seiten werden **prerendered at build time** mit Angular SSR.

---

# Running the SSR server (optional)

Das Template enthält einen Node server für SSR:

```
npm run serve:ssr:app
```

Dies startet:

```
node dist/app/server/server.mjs
```

Für die meisten Landingpages ist das **nicht erforderlich**, weil prerendered HTML bereits erzeugt wurde.

---

# Prerender configuration

Alle routes werden standardmäßig prerendered:

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

Dadurch erzeugt Angular während des Builds statisches HTML für jede Route.

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

Tailwind ist konfiguriert über:

```
.postcssrc.json
```

Tailwind sollte für die tägliche UI-Arbeit so weit wie möglich verwendet werden.

Bevorzuge Tailwind utilities für:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Verwende SCSS nur dann, wenn Tailwind nicht das richtige Werkzeug ist, zum Beispiel für:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- kleine Mengen globaler Styles

Globale Styles liegen in:

```
src/styles.scss
```

---

# Icons

Dieses Template enthält **Material Symbols Outlined**, und diese sollten projektweit als Standard-Icon-Set verwendet werden.

Geladen in:

```
src/index.html
```

Verwende Icons direkt in HTML so:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Für barrierefreie Buttons sollte das Icon dekorativ bleiben, und der Button selbst sollte ein Textlabel oder `aria-label` erhalten:

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

Verwende SCSS so, dass es modernen Angular defaults entspricht:

- Halte die meisten Styles in der component `.scss` file.
- Verwende `src/styles.scss` nur für wirklich globale Styles wie resets, tokens, typography und utility layers.
- Bevorzuge CSS variables für Farben, Abstände und theming, die sich zur Laufzeit ändern können.
- Verwende SCSS-Features wie `@use`, mixins und partials für bequemeres Authoring und gemeinsame design tokens.
- Vermeide tiefes selector nesting. Halte selectors einfach und lokal zur component.
- Vermeide `::ng-deep` und `ViewEncapsulation.None`, außer es gibt einen klaren Integrationsgrund.
- Bevorzuge class bindings in Templates gegenüber schweren inline style bindings.

Empfohlene Aufteilung:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Dieses Template enthält Angular environment files, die für verschiedene runtime setups wie lokale Entwicklung und production builds verwendet werden können.

Verfügbare Dateien:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Typische Anwendungsfälle:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Production builds ersetzen `environment.ts` durch `environment.prod.ts` über Angular file replacements.

Environment files sollten auf öffentliche Frontend-Konfiguration beschränkt bleiben. Speichere dort keine Secrets.

---

# Deployment

Deployment wird automatisch über **GitHub Actions** abgewickelt.

Workflow:

```
.github/workflows/deploy.yml
```

Schritte:

1. Dependencies installieren
2. Angular app bauen
3. `CNAME` kopieren
4. Build output nach `gh-pages` pushen

Der deployte Ordner ist:

```
dist/app/browser
```

---

# Domain

Custom domain, die du auf deine eigene Domain anpassen solltest, damit alles korrekt funktioniert; jede Subdomain von `*.itkamianets.com`, sofern sie nicht bereits in unserer github org verwendet wird.

```
ngx.itkamianets.com
```

Konfiguriert über:

```
CNAME
```

---

# Code Style

Die Formatierung wird gesteuert durch:

- `.editorconfig`
- `.prettierrc`

Wichtige Konventionen:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Wenn du AI außerhalb der IDE verwendest und sie Repository-Anweisungen nicht automatisch liest, kopiere zuerst
den Inhalt von `AGENTS.md` in den AI prompt/context.

So wird sichergestellt, dass die AI dieselben projektspezifischen Regeln befolgt, die Codex innerhalb der IDE verwendet.

---

# NPM Scripts

Development starten:

```
npm start
```

Projekt bauen:

```
npm run build
```

SSR server starten:

```
npm run serve:ssr:app
```

---

# Requirements

Empfohlene Umgebung:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Application pages sollten in folgendem Verzeichnis erstellt werden:

```text
src/app/pages/
```

Jede Seite sollte ihren eigenen Ordner und ihre eigene component file haben.

Beispiel:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Erzeuge eine page component mit Angular CLI:

```bash
ng generate component pages/home
```

oder kürzer:

```bash
ng g c pages/home
```

Pages sollten aus `src/app/app.routes.ts` lazy loaded werden.

Beispiel für route config:

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

Wenn ein Teil der App eigene business logic und back-end integration benötigt, erstelle einen dedizierten feature folder in:

```text
src/app/feature/
```

Jedes Feature sollte seine eigene interne Struktur beibehalten.

Beispiel:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Beispiel für den Service-Speicherort:

```text
src/app/feature/user/services/user.service.ts
```

Vorgeschlagene CLI-Befehle:

Feature page erstellen:

```bash
ng g c feature/user/pages/user-profile
```

Feature component erstellen:

```bash
ng g c feature/user/components/user-card
```

Feature directive erstellen:

```bash
ng g d feature/user/directives/user-focus
```

Feature pipe erstellen:

```bash
ng g p feature/user/pipes/user-name
```

Feature service erstellen:

```bash
ng g s feature/user/services/user
```

Interfaces werden normalerweise manuell erstellt:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Für kleine fokussierte Features sind colocated files wie `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts` und `language.service.ts` ebenfalls gültig, wenn diese
Struktur das Feature einfacher hält.

---

## Generic shared code

Generischer wiederverwendbarer Code, der nicht an ein bestimmtes Feature gebunden ist, kann direkt unter `src/app` liegen.

Beispiele für shared folders:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Beispiel für shared pipe-Speicherort:

```text
src/app/pipes/phone.pipe.ts
```

Vorgeschlagene CLI-Befehle:

Shared component erstellen:

```bash
ng g c components/page-header
```

Shared directive erstellen:

```bash
ng g d directives/autofocus
```

Shared pipe erstellen:

```bash
ng g p pipes/phone
```

Shared service erstellen:

```bash
ng g s services/api
```

Interfaces werden normalerweise manuell erstellt:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Verwende diese Speicherorte standardmäßig:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Klon das default repository in einen neuen Ordner mit deinem Projektnamen (ersetze `PROJECT_NAME` durch deinen Projektnamen):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Lädt das template repository herunter und erstellt einen lokalen Ordner mit dem Namen `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Öffnet den neu erstellten Projektordner.
- `npm i`
  Installiert alle Projekt-dependencies aus `package.json`.
- `npm run start`
  Startet den lokalen development server.

Öffne danach die im Terminal angezeigte lokale URL, normalerweise [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Wenn du neu starten möchtest, anstatt die template git history zu behalten, entferne den vorhandenen `.git` folder, initialisiere ein neues repository und erstelle den ersten commit.

Beispiel:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` verbindet dein lokales repository mit dem entfernten GitHub repository, damit zukünftige `git push`- und `git pull`-Befehle wissen, wo dein Hauptprojekt liegt.

Verwende auch für den ersten commit eine Conventional Commit message. Ein guter Standardwert ist:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
