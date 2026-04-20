# Angular Landing Template (SSR + Prerender)

Σύγχρονο Angular 21 starter template για τη δημιουργία γρήγορων landing pages με **SSR prerendering**, **TailwindCSS** και **GitHub Pages deployment**.

Αυτό το template είναι βελτιστοποιημένο για στατικά landing sites όπου οι σελίδες γίνονται render **κατά το build time** για SEO και απόδοση.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** κατά τη διάρκεια του build
- **Zoneless Angular**
- Το state που χρησιμοποιείται σε HTML class bindings πρέπει να εκτίθεται ως **signals**
- Προτιμήστε τα **Angular Signal Forms** ως βασική προσέγγιση για νέα forms
- **OnPush change detection by default**
- **TailwindCSS v4**
- Χρησιμοποιήστε κοινά **theme CSS variables** από το `src/styles/_theme.scss` για χρώματα, surfaces, spacing, radius και motion
- **GitHub Pages deployment**
- **Prettier formatting**
- Καθαρή και μινιμαλιστική δομή έργου

Το project κάνει build και τα δύο:

```
dist/app/browser
dist/app/server
```

Αλλά το deployment χρησιμοποιεί το **browser prerendered output**, κάτι που το κάνει ιδανικό για static hosting.

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

Η SSR configuration βρίσκεται στα:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Ξεκινήστε τον development server:

```
npm start
```

ή

```
ng serve
```

Η εφαρμογή εκτελείται στο [http://localhost:4200](http://localhost:4200)

Το development mode λειτουργεί σαν ένα κανονικό Angular SPA.

---

# Build

Κάντε build το project:

```
npm run build
```

Αυτό παράγει:

```
dist/app/browser
dist/app/server
```

Οι σελίδες είναι **prerendered at build time** με Angular SSR.

---

# Running the SSR server (optional)

Το template περιλαμβάνει Node server για SSR:

```
npm run serve:ssr:app
```

Αυτό εκτελεί:

```
node dist/app/server/server.mjs
```

Για τα περισσότερα landing pages αυτό **δεν απαιτείται**, επειδή το prerendered HTML έχει ήδη παραχθεί.

---

# Prerender configuration

Όλα τα routes γίνονται prerendered από προεπιλογή:

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

Αυτό κάνει το Angular να παράγει static HTML για κάθε route κατά το build.

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

Το Tailwind είναι ρυθμισμένο μέσω:

```
.postcssrc.json
```

Το Tailwind πρέπει να χρησιμοποιείται όσο το δυνατόν περισσότερο για την καθημερινή UI δουλειά.

Προτιμήστε Tailwind utilities για:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Χρησιμοποιήστε SCSS μόνο όταν το Tailwind δεν είναι το σωστό εργαλείο, για παράδειγμα:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- μικρές ποσότητες global styling

Τα global styles βρίσκονται στο:

```
src/styles.scss
```

---

# Icons

Αυτό το template περιλαμβάνει **Material Symbols Outlined** και αυτά πρέπει να χρησιμοποιούνται ως το προεπιλεγμένο icon set σε όλο το project.

Φορτώνονται στο:

```
src/index.html
```

Χρησιμοποιήστε icons απευθείας σε HTML έτσι:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Για προσβάσιμα buttons, κρατήστε το icon διακοσμητικό και δώστε text label ή `aria-label` στο ίδιο το button:

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

Χρησιμοποιήστε SCSS με τρόπο που ταιριάζει στα σύγχρονα Angular defaults:

- Κρατήστε τα περισσότερα styles μέσα στο component `.scss` file.
- Χρησιμοποιήστε το `src/styles.scss` μόνο για πραγματικά global styles όπως resets, tokens, typography και utility layers.
- Προτιμήστε CSS variables για χρώματα, spacing και theming που μπορεί να αλλάξουν κατά το runtime.
- Χρησιμοποιήστε δυνατότητες SCSS όπως `@use`, mixins και partials για πιο εύκολο authoring και κοινά design tokens.
- Αποφύγετε το βαθύ selector nesting. Κρατήστε τα selectors απλά και τοπικά στο component.
- Αποφύγετε τα `::ng-deep` και `ViewEncapsulation.None` εκτός αν υπάρχει σαφής λόγος ενσωμάτωσης.
- Προτιμήστε class bindings στα templates αντί για βαριά inline style bindings.

Προτεινόμενος διαχωρισμός:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Αυτό το template περιλαμβάνει Angular environment files και μπορούν να χρησιμοποιηθούν για διαφορετικά runtime setups όπως local development και production builds.

Διαθέσιμα αρχεία:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Τυπικές χρήσεις:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Τα production builds αντικαθιστούν το `environment.ts` με το `environment.prod.ts` μέσω Angular file replacements.

Περιορίστε τα environment files σε public front-end configuration. Μην αποθηκεύετε secrets σε αυτά.

---

# Deployment

Το deployment γίνεται αυτόματα μέσω **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Βήματα:

1. Εγκατάσταση dependencies
2. Build του Angular app
3. Αντιγραφή του `CNAME`
4. Push του build output στο `gh-pages`

Ο deployed φάκελος είναι:

```
dist/app/browser
```

---

# Domain

Custom domain που πρέπει να προσαρμόσετε στο δικό σας domain ώστε να λειτουργεί σωστά, οποιοδήποτε subdomain του `*.itkamianets.com` εφόσον δεν έχει ήδη χρησιμοποιηθεί στο github org μας.

```
ngx.itkamianets.com
```

Ρυθμίζεται μέσω:

```
CNAME
```

---

# Code Style

Το formatting διαχειρίζεται από:

- `.editorconfig`
- `.prettierrc`

Βασικές συμβάσεις:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Αν χρησιμοποιείτε AI έξω από το IDE και δεν διαβάζει αυτόματα τις οδηγίες του repository, αντιγράψτε πρώτα
το περιεχόμενο του `AGENTS.md` στο AI prompt/context.

Αυτό διασφαλίζει ότι το AI ακολουθεί τους ίδιους project-specific κανόνες που χρησιμοποιεί το Codex μέσα στο IDE.

---

# NPM Scripts

Έναρξη development:

```
npm start
```

Build του project:

```
npm run build
```

Εκτέλεση SSR server:

```
npm run serve:ssr:app
```

---

# Requirements

Προτεινόμενο περιβάλλον:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Τα Application pages πρέπει να δημιουργούνται μέσα στο:

```text
src/app/pages/
```

Κάθε page πρέπει να έχει το δικό του folder και το δικό του component file.

Παράδειγμα:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Δημιουργήστε ένα page component με Angular CLI:

```bash
ng generate component pages/home
```

ή πιο σύντομα:

```bash
ng g c pages/home
```

Τα pages πρέπει να είναι lazy loaded από το `src/app/app.routes.ts`.

Παράδειγμα route config:

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

Αν ένα μέρος της εφαρμογής χρειάζεται το δικό του business logic και back-end integration, δημιουργήστε ένα dedicated feature folder μέσα στο:

```text
src/app/feature/
```

Κάθε feature πρέπει να κρατά τη δική του εσωτερική δομή.

Παράδειγμα:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Παράδειγμα τοποθεσίας service:

```text
src/app/feature/user/services/user.service.ts
```

Προτεινόμενες CLI εντολές:

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

Τα interfaces συνήθως δημιουργούνται χειροκίνητα:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Για μικρά focused features, colocated files όπως `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts` και `language.service.ts` είναι επίσης αποδεκτά όταν αυτή η
δομή κρατά το feature πιο απλό.

---

## Generic shared code

Generic reusable code που δεν σχετίζεται με ένα συγκεκριμένο feature μπορεί να τοποθετείται απευθείας κάτω από το `src/app`.

Παραδείγματα shared folders:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Παράδειγμα τοποθεσίας shared pipe:

```text
src/app/pipes/phone.pipe.ts
```

Προτεινόμενες CLI εντολές:

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

Τα interfaces συνήθως δημιουργούνται χειροκίνητα:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Χρησιμοποιήστε αυτές τις τοποθεσίες ως προεπιλογή:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Κλωνοποιήστε το default repository σε νέο folder με το όνομα του project σας (αντικαταστήστε το `PROJECT_NAME` με το όνομα του project σας):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Κατεβάζει το template repository και δημιουργεί ένα local folder με όνομα `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Ανοίγει το νέο folder του project.
- `npm i`
  Εγκαθιστά όλα τα project dependencies από το `package.json`.
- `npm run start`
  Ξεκινά τον local development server.

Μετά από αυτό, ανοίξτε το local URL που εμφανίζεται στο terminal, συνήθως [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Αν θέλετε να ξεκινήσετε από την αρχή αντί να κρατήσετε το template git history, αφαιρέστε το υπάρχον `.git` folder, αρχικοποιήστε ένα νέο repository και δημιουργήστε το πρώτο commit.

Παράδειγμα:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

Το `git remote add origin ...` συνδέει το local repository σας με το remote GitHub repository ώστε μελλοντικές εντολές `git push` και `git pull` να ξέρουν πού βρίσκεται το βασικό project σας.

Χρησιμοποιήστε επίσης Conventional Commit message για το πρώτο commit. Μια καλή προεπιλογή είναι:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
