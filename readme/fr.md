# Angular Landing Template (SSR + Prerender)

Modèle de démarrage Angular 21 moderne pour créer rapidement des landing pages avec **SSR prerendering**, **TailwindCSS** et **GitHub Pages deployment**.

Ce modèle est optimisé pour des landing sites statiques où les pages sont rendues **au moment du build** pour le SEO et les performances.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** pendant le build
- **Zoneless Angular**
- Le state utilisé dans les HTML class bindings doit être exposé sous forme de **signals**
- Préférez **Angular Signal Forms** comme approche principale pour les nouveaux formulaires
- **OnPush change detection by default**
- **TailwindCSS v4**
- Utilisez les **theme CSS variables** partagées depuis `src/styles/_theme.scss` pour les couleurs, surfaces, espacements, rayons et animations
- **GitHub Pages deployment**
- **Prettier formatting**
- Structure de projet propre et minimale

Le projet construit les deux sorties :

```
dist/app/browser
dist/app/server
```

Mais le deployment utilise la **browser prerendered output**, ce qui le rend parfait pour un hébergement statique.

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

La SSR configuration se trouve dans :

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Démarrez le development server :

```
npm start
```

ou

```
ng serve
```

L'application fonctionne sur [http://localhost:4200](http://localhost:4200)

Le development mode fonctionne comme une Angular SPA normale.

---

# Build

Construisez le projet :

```
npm run build
```

Cela génère :

```
dist/app/browser
dist/app/server
```

Les pages sont **prerendered at build time** avec Angular SSR.

---

# Running the SSR server (optional)

Le modèle inclut un Node server pour SSR :

```
npm run serve:ssr:app
```

Cela exécute :

```
node dist/app/server/server.mjs
```

Pour la plupart des landing pages, cela n'est **pas nécessaire**, car le HTML prerendered est déjà généré.

---

# Prerender configuration

Toutes les routes sont prerendered par défaut :

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

Cela permet à Angular de générer du HTML statique pour chaque route pendant le build.

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

Tailwind est configuré via :

```
.postcssrc.json
```

Tailwind doit être utilisé autant que possible pour le travail UI quotidien.

Privilégiez les Tailwind utilities pour :

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Utilisez SCSS uniquement quand Tailwind n'est pas le bon outil, par exemple :

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- de petites quantités de style global

Les styles globaux se trouvent dans :

```
src/styles.scss
```

---

# Icons

Ce modèle inclut **Material Symbols Outlined** et ils doivent être utilisés comme jeu d'icônes par défaut dans tout le projet.

Chargé dans :

```
src/index.html
```

Utilisez les icônes directement dans le HTML comme ceci :

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Pour les boutons accessibles, gardez l'icône décorative et fournissez un libellé texte ou un `aria-label` sur le bouton lui-même :

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

Utilisez SCSS d'une manière conforme aux Angular defaults modernes :

- Gardez la plupart des styles dans le component `.scss` file.
- Utilisez `src/styles.scss` uniquement pour les styles vraiment globaux comme les resets, tokens, typography et utility layers.
- Préférez les CSS variables pour les couleurs, l'espacement et le theming susceptibles de changer au runtime.
- Utilisez les fonctionnalités SCSS comme `@use`, mixins et partials pour faciliter l'authoring et partager les design tokens.
- Évitez les selector nesting trop profonds. Gardez des selectors simples et locaux au component.
- Évitez `::ng-deep` et `ViewEncapsulation.None` sauf s'il existe une raison d'intégration claire.
- Préférez les class bindings dans les templates aux inline style bindings lourds.

Répartition recommandée :

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Ce modèle inclut les Angular environment files et ils peuvent être utilisés pour différents runtime setups comme le développement local et les production builds.

Fichiers disponibles :

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Cas d'usage typiques :

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Les production builds remplacent `environment.ts` par `environment.prod.ts` via les Angular file replacements.

Limitez les environment files à la configuration publique front-end. N'y stockez pas de secrets.

---

# Deployment

Le deployment est géré automatiquement via **GitHub Actions**.

Workflow :

```
.github/workflows/deploy.yml
```

Étapes :

1. Installer les dependencies
2. Construire l'Angular app
3. Copier `CNAME`
4. Push le build output vers `gh-pages`

Le dossier déployé est :

```
dist/app/browser
```

---

# Domain

Custom domain que vous devez ajuster à votre propre domaine pour que tout fonctionne correctement ; n'importe quel sous-domaine de `*.itkamianets.com` tant qu'il n'est pas déjà utilisé dans notre github org.

```
ngx.itkamianets.com
```

Configuré via :

```
CNAME
```

---

# Code Style

Le formatting est géré par :

- `.editorconfig`
- `.prettierrc`

Conventions clés :

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Si vous utilisez une AI en dehors de l'IDE et qu'elle ne lit pas automatiquement les instructions du repository, copiez d'abord
le contenu de `AGENTS.md` dans le AI prompt/context.

Cela garantit que l'AI suit les mêmes règles spécifiques au projet que celles utilisées par Codex dans l'IDE.

---

# NPM Scripts

Démarrer le development :

```
npm start
```

Construire le projet :

```
npm run build
```

Lancer le SSR server :

```
npm run serve:ssr:app
```

---

# Requirements

Environnement recommandé :

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Les Application pages doivent être créées dans :

```text
src/app/pages/
```

Chaque page doit avoir son propre dossier et son propre component file.

Exemple :

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Générez un page component avec Angular CLI :

```bash
ng generate component pages/home
```

ou plus court :

```bash
ng g c pages/home
```

Les pages doivent être lazy loaded depuis `src/app/app.routes.ts`.

Exemple de route config :

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

Si une partie de l'application a besoin de sa propre business logic et d'une back-end integration, créez un feature folder dédié dans :

```text
src/app/feature/
```

Chaque feature doit conserver sa propre structure interne.

Exemple :

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Exemple d'emplacement de service :

```text
src/app/feature/user/services/user.service.ts
```

Commandes CLI suggérées :

Créer une feature page :

```bash
ng g c feature/user/pages/user-profile
```

Créer un feature component :

```bash
ng g c feature/user/components/user-card
```

Créer une feature directive :

```bash
ng g d feature/user/directives/user-focus
```

Créer une feature pipe :

```bash
ng g p feature/user/pipes/user-name
```

Créer un feature service :

```bash
ng g s feature/user/services/user
```

Les interfaces sont généralement créées manuellement :

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Pour les petites features ciblées, des colocated files comme `feature/language/language.type.ts`,
`language.interface.ts`, `language.const.ts` et `language.service.ts` sont aussi valables lorsque cette
structure garde la feature plus simple.

---

## Generic shared code

Le code générique réutilisable qui n'est pas lié à une seule feature peut être placé directement sous `src/app`.

Exemples de shared folders :

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Exemple d'emplacement de shared pipe :

```text
src/app/pipes/phone.pipe.ts
```

Commandes CLI suggérées :

Créer un shared component :

```bash
ng g c components/page-header
```

Créer une shared directive :

```bash
ng g d directives/autofocus
```

Créer un shared pipe :

```bash
ng g p pipes/phone
```

Créer un shared service :

```bash
ng g s services/api
```

Les interfaces sont généralement créées manuellement :

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Utilisez ces emplacements par défaut :

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Clonez le default repository dans un nouveau dossier avec le nom de votre projet (remplacez `PROJECT_NAME` par le nom de votre projet) :

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Télécharge le template repository et crée un dossier local nommé `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Ouvre le dossier du projet nouvellement créé.
- `npm i`
  Installe toutes les dependencies du projet depuis `package.json`.
- `npm run start`
  Démarre le development server local.

Ensuite, ouvrez l'URL locale affichée dans le terminal, généralement [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Si vous voulez repartir de zéro au lieu de conserver l'historique git du template, supprimez le dossier `.git` existant, initialisez un nouveau repository et créez le premier commit.

Exemple :

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` connecte votre repository local au repository GitHub distant afin que les futures commandes `git push` et `git pull` sachent où se trouve votre projet principal.

Utilisez aussi un Conventional Commit message pour le premier commit. Une bonne valeur par défaut est :

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
