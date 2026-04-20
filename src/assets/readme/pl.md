# Angular Landing Template (SSR + Prerender)

Nowoczesny szablon startowy Angular 21 do tworzenia szybkich landing page'y z
**prerenderingiem SSR**, **TailwindCSS** i **wdrożeniem na GitHub Pages**.

Ten szablon jest zoptymalizowany pod statyczne strony landingowe, gdzie strony są
renderowane **w czasie budowania** dla SEO i wydajności.

---

# Acknowledge

- Angular **21**
- **Prerendering SSR** podczas budowania
- **Angular bez Zone.js**
- Stan używany w powiązaniach klas HTML powinien być udostępniany jako **signals**
- Preferuj **Angular Signal Forms** jako podstawowe podejście przy tworzeniu nowych formularzy
- **OnPush change detection by default**
- **TailwindCSS v4**
- Używaj współdzielonych **zmiennych CSS motywu** z `src/styles/_theme.scss` dla kolorów,
  powierzchni, odstępów, promieni i ruchu
- **Wdrażanie na GitHub Pages**
- **Formatowanie przez Prettier**
- Czysta, minimalistyczna struktura projektu

Projekt buduje oba wyjścia:

```
dist/app/browser
dist/app/server
```

Ale wdrożenie korzysta z **prerenderowanego wyjścia przeglądarki**, co sprawia, że
szablon idealnie nadaje się do hostingu statycznego.

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

Konfiguracja SSR znajduje się w:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Uruchom serwer developerski:

```
npm start
```

lub

```
ng serve
```

Aplikacja działa pod adresem [http://localhost:4200](http://localhost:4200)

Tryb developerski działa jak zwykła aplikacja Angular SPA.

---

# Build

Zbuduj projekt:

```
npm run build
```

To generuje:

```
dist/app/browser
dist/app/server
```

Strony są **prerenderowane w czasie budowania** przy użyciu Angular SSR.

---

# Running the SSR server (optional)

Szablon zawiera serwer Node dla SSR:

```
npm run serve:ssr:app
```

To uruchamia:

```
node dist/app/server/server.mjs
```

Dla większości landing page'y **nie jest to potrzebne**, ponieważ prerenderowany HTML
jest już generowany podczas budowania.

---

# Prerender configuration

Wszystkie trasy są domyślnie prerenderowane:

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

To sprawia, że Angular generuje statyczny HTML dla każdej trasy podczas budowania.

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

Tailwind jest skonfigurowany przez:

```
.postcssrc.json
```

Tailwind powinien być używany jak najczęściej w codziennej pracy nad UI.

Preferuj klasy użytkowe Tailwinda dla:

- layoutu
- odstępów
- typografii
- kolorów
- obramowań
- rozmiarów
- zachowań responsywnych

Używaj SCSS tylko wtedy, gdy Tailwind nie jest odpowiednim narzędziem, na przykład dla:

- złożonych styli specyficznych dla komponentu
- współdzielonych design tokenów i mixinów
- zaawansowanych stanów lub selektorów
- niewielkiej ilości stylów globalnych

Style globalne znajdują się w:

```
src/styles.scss
```

---

# Icons

Ten szablon zawiera **Material Symbols Outlined** i powinny być one domyślnym zestawem ikon
w całym projekcie.

Ładowane w:

```
src/index.html
```

Używaj ikon bezpośrednio w HTML w ten sposób:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Dla dostępnych przycisków ikona powinna pozostać dekoracyjna, a sam przycisk powinien
mieć etykietę tekstową albo `aria-label`:

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

Używaj SCSS w sposób zgodny z nowoczesnymi domyślnymi praktykami Angulara:

- Trzymaj większość styli w pliku `.scss` danego komponentu.
- Używaj `src/styles.scss` tylko dla naprawdę globalnych styli, takich jak resety, tokeny,
  typografia i warstwy narzędziowe.
- Preferuj zmienne CSS dla kolorów, odstępów i motywów, które mogą zmieniać się w czasie działania.
- Korzystaj z funkcji SCSS takich jak `@use`, mixiny i partiale dla wygodniejszego pisania
  oraz współdzielonych design tokenów.
- Unikaj głębokiego zagnieżdżania selektorów. Utrzymuj selektory proste i lokalne dla komponentu.
- Unikaj `::ng-deep` i `ViewEncapsulation.None`, chyba że istnieje wyraźny powód integracyjny.
- Preferuj class bindings w szablonach zamiast rozbudowanych inline style bindings.

Rekomendowany podział:

```text
src/styles.scss           -> globalny punkt wejścia
src/app/**/**/*.scss      -> lokalne style komponentów
src/styles/_theme.scss    -> współdzielone zmienne CSS motywu
```

---

# Environments

Ten szablon zawiera pliki `environment` Angulara i można ich używać dla różnych
konfiguracji uruchomieniowych, takich jak lokalny rozwój i buildy produkcyjne.

Dostępne pliki:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Typowe przypadki użycia:

- bazowe adresy URL API
- feature flagi
- przełączniki analityki
- konfiguracja usług zewnętrznych

Buildy produkcyjne podmieniają `environment.ts` na `environment.prod.ts` poprzez
Angular file replacements.

Ogranicz pliki `environment` do publicznej konfiguracji frontendu. Nie przechowuj w nich sekretów.

---

# Deployment

Wdrażanie jest obsługiwane automatycznie przez **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Kroki:

1. Zainstaluj zależności
2. Zbuduj aplikację Angular
3. Skopiuj `CNAME`
4. Wypchnij wynik builda do `gh-pages`

Wdrażany folder to:

```
dist/app/browser
```

---

# Domain

Własna domena, którą należy dostosować do swojej domeny, aby wszystko działało poprawnie;
można użyć dowolnej subdomeny `*.itkamianets.com`, jeśli nie jest jeszcze zajęta
w naszej organizacji GitHub.

```
ngx.itkamianets.com
```

Konfigurowana przez:

```
CNAME
```

---

# Code Style

Formatowanie jest obsługiwane przez:

- `.editorconfig`
- `.prettierrc`

Kluczowe konwencje:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Jeśli korzystasz z AI poza IDE i nie odczytuje ono automatycznie instrukcji repozytorium,
najpierw skopiuj zawartość `AGENTS.md` do promptu lub kontekstu AI.

To gwarantuje, że AI będzie stosować te same zasady specyficzne dla projektu,
których Codex używa w IDE.

---

# NPM Scripts

Uruchomienie developmentu:

```
npm start
```

Build projektu:

```
npm run build
```

Uruchomienie serwera SSR:

```
npm run serve:ssr:app
```

---

# Requirements

Rekomendowane środowisko:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Strony aplikacji powinny być tworzone w:

```text
src/app/pages/
```

Każda strona powinna mieć własny folder i własny plik komponentu.

Przykład:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Wygeneruj komponent strony przy użyciu Angular CLI:

```bash
ng generate component pages/home
```

albo krócej:

```bash
ng g c pages/home
```

Strony powinny być lazy-loaded z `src/app/app.routes.ts`.

Przykładowa konfiguracja tras:

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

Jeśli część aplikacji potrzebuje własnej logiki biznesowej i integracji z back-endem,
utwórz dedykowany folder feature w:

```text
src/app/feature/
```

Każdy feature powinien utrzymywać własną wewnętrzną strukturę.

Przykład:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Przykładowa lokalizacja serwisu:

```text
src/app/feature/user/services/user.service.ts
```

Sugerowane polecenia CLI:

Utwórz stronę feature:

```bash
ng g c feature/user/pages/user-profile
```

Utwórz komponent feature:

```bash
ng g c feature/user/components/user-card
```

Utwórz dyrektywę feature:

```bash
ng g d feature/user/directives/user-focus
```

Utwórz pipe feature:

```bash
ng g p feature/user/pipes/user-name
```

Utwórz serwis feature:

```bash
ng g s feature/user/services/user
```

Interfejsy są zwykle tworzone ręcznie:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Dla małych, skoncentrowanych feature'ów poprawne są również pliki umieszczone obok siebie,
takie jak `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts`
i `language.service.ts`, kiedy taka struktura upraszcza feature.

---

## Generic shared code

Generyczny kod wielokrotnego użytku, który nie jest powiązany z jednym konkretnym feature,
może znajdować się bezpośrednio w `src/app`.

Przykłady współdzielonych folderów:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Przykładowa lokalizacja współdzielonego pipe:

```text
src/app/pipes/phone.pipe.ts
```

Sugerowane polecenia CLI:

Utwórz współdzielony komponent:

```bash
ng g c components/page-header
```

Utwórz współdzieloną dyrektywę:

```bash
ng g d directives/autofocus
```

Utwórz współdzielony pipe:

```bash
ng g p pipes/phone
```

Utwórz współdzielony serwis:

```bash
ng g s services/api
```

Interfejsy są zwykle tworzone ręcznie:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Domyślnie używaj tych lokalizacji:

- `src/app/pages` - strony aplikacji lazy-loaded
- `src/app/feature/<name>` - kod specyficzny dla feature z logiką biznesową/back-endem
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generyczny kod współdzielony

# Create a new project from this template

Sklonuj domyślne repozytorium do nowego folderu z nazwą projektu
(zamień `PROJECT_NAME` na nazwę swojego projektu):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Pobiera repozytorium szablonu i tworzy lokalny folder o nazwie `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Otwiera nowo utworzony folder projektu.
- `npm i`
  Instaluje wszystkie zależności projektu z `package.json`.
- `npm run start`
  Uruchamia lokalny serwer developerski.

Następnie otwórz lokalny adres URL pokazany w terminalu, zwykle [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Jeśli chcesz zacząć od zera zamiast zachowywać historię git szablonu, usuń istniejący
folder `.git`, zainicjalizuj nowe repozytorium i utwórz pierwszy commit.

Przykład:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` łączy lokalne repozytorium ze zdalnym repozytorium GitHub,
aby przyszłe polecenia `git push` i `git pull` wiedziały, gdzie znajduje się główny projekt.

Również dla pierwszego commita użyj komunikatu Conventional Commit. Dobrym domyślnym
wyborem jest:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
