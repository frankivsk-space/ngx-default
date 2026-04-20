# Angular Landing Template (SSR + Prerender)

Съвременен начален шаблон с Angular 21 за създаване на бързи landing pages с **SSR prerendering**, **TailwindCSS** и **разгръщане в GitHub Pages**.

Този шаблон е оптимизиран за статични landing сайтове, където страниците се рендерират **по време на build** за SEO и производителност.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** по време на build
- **Zoneless Angular**
- Състоянието, използвано в HTML class bindings, трябва да е достъпно като **signals**
- За нови форми предпочитайте **Angular Signal Forms** като основен подход
- **OnPush change detection по подразбиране**
- **TailwindCSS v4**
- Използвайте споделените **theme CSS variables** от `src/styles/_theme.scss` за цветове, повърхности, отстояния, радиуси и анимации
- **Разгръщане в GitHub Pages**
- **Prettier форматиране**
- Чиста минималистична структура на проекта

Проектът генерира и двете директории:

```
dist/app/browser
dist/app/server
```

Но за deployment се използва **browser prerendered output**, което го прави идеален за статичен хостинг.

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

SSR конфигурацията е разположена в:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Стартирайте development сървъра:

```
npm start
```

или

```
ng serve
```

Приложението работи на [http://localhost:4200](http://localhost:4200)

Режимът за разработка работи като стандартно Angular SPA.

---

# Build

Изградете проекта:

```
npm run build
```

Това генерира:

```
dist/app/browser
dist/app/server
```

Страниците се **prerendered at build time** чрез Angular SSR.

---

# Running the SSR server (optional)

Шаблонът съдържа Node сървър за SSR:

```
npm run serve:ssr:app
```

Това стартира:

```
node dist/app/server/server.mjs
```

За повечето landing pages това **не е необходимо**, защото prerendered HTML вече е генериран.

---

# Prerender configuration

Всички routes се prerender-ват по подразбиране:

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

Това кара Angular да генерира статичен HTML за всеки route по време на build.

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

Tailwind е конфигуриран чрез:

```
.postcssrc.json
```

Tailwind трябва да се използва възможно най-често за ежедневната UI работа.

Предпочитайте Tailwind utilities за:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Използвайте SCSS само когато Tailwind не е подходящият инструмент, например за:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- малко количество глобални стилове

Глобалните стилове са разположени в:

```
src/styles.scss
```

---

# Icons

Този шаблон съдържа **Material Symbols Outlined** и те трябва да се използват като стандартен набор от икони в целия проект.

Включени са в:

```
src/index.html
```

Използвайте иконите директно в HTML така:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

За достъпни бутони оставяйте иконата декоративна и добавяйте текстов етикет или `aria-label` на самия бутон:

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

Използвайте SCSS по начин, който следва съвременните Angular defaults:

- Дръжте повечето стилове в `.scss` файла на съответния component.
- Използвайте `src/styles.scss` само за наистина глобални стилове като resets, tokens, typography и utility layers.
- Предпочитайте CSS variables за цветове, отстояния и theming, които могат да се променят по време на runtime.
- Използвайте SCSS възможности като `@use`, mixins и partials за по-удобно авториране и споделени design tokens.
- Избягвайте дълбоко влагане на selector-и. Поддържайте selectors прости и локални за component-а.
- Избягвайте `::ng-deep` и `ViewEncapsulation.None`, освен ако няма ясна интеграционна причина.
- Предпочитайте class bindings в templates вместо тежки inline style bindings.

Препоръчително разделение:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

Този шаблон съдържа Angular environment файлове и те могат да се използват за различни runtime конфигурации, като локална разработка и production builds.

Наличните файлове:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Типични случаи на употреба:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Production build-овете заменят `environment.ts` с `environment.prod.ts` чрез Angular file replacements.

Използвайте environment файловете само за публична front-end конфигурация. Не съхранявайте в тях тайни.

---

# Deployment

Deployment се изпълнява автоматично чрез **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Стъпки:

1. Инсталиране на зависимостите
2. Build на Angular приложението
3. Копиране на `CNAME`
4. Изпращане на build output към `gh-pages`

Директория за deployment:

```
dist/app/browser
```

---

# Domain

Персонализиран домейн, който трябва да смените със свой, за да работи всичко коректно; може да е всеки поддомейн `*.itkamianets.com`, ако още не се използва в нашата GitHub организация.

```
ngx.itkamianets.com
```

Конфигурира се чрез:

```
CNAME
```

---

# Code Style

Форматирането се изпълнява чрез:

- `.editorconfig`
- `.prettierrc`

Ключови правила:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Ако използвате AI извън IDE и той не чете автоматично инструкциите на репозитория, първо копирайте съдържанието на `AGENTS.md` в prompt/context на AI.

Това гарантира, че AI ще спазва същите проектни правила, които Codex спазва вътре в IDE.

---

# NPM Scripts

Стартиране на development:

```
npm start
```

Build на проекта:

```
npm run build
```

Стартиране на SSR сървъра:

```
npm run serve:ssr:app
```

---

# Requirements

Препоръчителна среда:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Страниците на приложението трябва да се създават в:

```text
src/app/pages/
```

Всяка страница трябва да има собствена папка и собствен component файл.

Пример:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Генерирайте page component чрез Angular CLI:

```bash
ng generate component pages/home
```

или по-кратко:

```bash
ng g c pages/home
```

Pages трябва да са lazy loaded от `src/app/app.routes.ts`.

Примерна route конфигурация:

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

Ако някоя част от app изисква собствена business logic и back-end интеграция, създайте отделна feature папка в:

```text
src/app/feature/
```

Всяка feature трябва да поддържа собствена вътрешна структура.

Пример:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Примерно разположение на service:

```text
src/app/feature/user/services/user.service.ts
```

Препоръчителни CLI команди:

Създаване на feature page:

```bash
ng g c feature/user/pages/user-profile
```

Създаване на feature component:

```bash
ng g c feature/user/components/user-card
```

Създаване на feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Създаване на feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Създаване на feature service:

```bash
ng g s feature/user/services/user
```

Interfaces обикновено се създават ръчно:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

За малки фокусирани features също са допустими colocated файлове като `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` и `language.service.ts`, когато такава структура прави feature-а по-прост.

---

## Generic shared code

Общ reusable код, който не е обвързан с конкретна feature, може да се поставя директно в `src/app`.

Примерни shared папки:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Примерно разположение на shared pipe:

```text
src/app/pipes/phone.pipe.ts
```

Препоръчителни CLI команди:

Създаване на shared component:

```bash
ng g c components/page-header
```

Създаване на shared directive:

```bash
ng g d directives/autofocus
```

Създаване на shared pipe:

```bash
ng g p pipes/phone
```

Създаване на shared service:

```bash
ng g s services/api
```

Interfaces обикновено се създават ръчно:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Използвайте тези разположения по подразбиране:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# Create a new project from this template

Клонирайте default repository в нова папка с името на вашия проект (заменете `PROJECT_NAME` с името на вашия проект):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Изтегля template repository и създава локална папка с име `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Отваря току-що създадената папка на проекта.
- `npm i`
  Инсталира всички зависимости на проекта от `package.json`.
- `npm run start`
  Стартира локалния development сървър.

След това отворете локалния URL, показан в терминала, обикновено [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Ако искате да започнете от чисто вместо да запазите git history на шаблона, изтрийте наличната `.git` папка, инициализирайте нов repository и създайте първия commit.

Пример:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` свързва локалния repository с remote GitHub repository, така че бъдещите `git push` и `git pull` команди да знаят къде се намира основният ви проект.

За първия commit също използвайте Conventional Commit message. Добър стандартен вариант:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
