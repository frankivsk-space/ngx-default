# Angular Landing Template (SSR + Prerender)

Plantilla inicial moderna de Angular 21 para crear landing pages rapidas con
**prerender SSR**, **TailwindCSS** y **despliegue en GitHub Pages**.

Esta plantilla esta optimizada para sitios estaticos donde las paginas se renderizan
**en tiempo de compilacion** para SEO y rendimiento.

---

# Acknowledge

- Angular **21**
- **Prerender SSR** durante la compilacion
- **Angular sin zones**
- El estado usado en los `class` bindings de HTML debe exponerse como **signals**
- Prioriza **Angular Signal Forms** como enfoque principal al crear formularios nuevos
- **OnPush change detection by default**
- **TailwindCSS v4**
- Usa las **theme CSS variables** compartidas desde `src/styles/_theme.scss` para colores,
  superficies, espaciado, radios y movimiento
- **Despliegue en GitHub Pages**
- **Formato con Prettier**
- Estructura de proyecto limpia y minima

El proyecto compila ambas salidas:

```
dist/app/browser
dist/app/server
```

Pero el despliegue usa la **salida prerenderizada del navegador**, lo que la hace ideal
para hosting estatico.

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

La configuracion SSR esta en:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Inicia el servidor de desarrollo:

```
npm start
```

o

```
ng serve
```

La aplicacion se ejecuta en [http://localhost:4200](http://localhost:4200)

El modo desarrollo funciona como una SPA normal de Angular.

---

# Build

Compila el proyecto:

```
npm run build
```

Esto genera:

```
dist/app/browser
dist/app/server
```

Las paginas se **prerenderizan en tiempo de compilacion** usando Angular SSR.

---

# Running the SSR server (optional)

La plantilla incluye un servidor Node para SSR:

```
npm run serve:ssr:app
```

Esto ejecuta:

```
node dist/app/server/server.mjs
```

Para la mayoria de las landing pages esto **no es necesario**, porque el HTML
prerenderizado ya se genera durante la compilacion.

---

# Prerender configuration

Todas las rutas se prerenderizan por defecto:

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

Esto hace que Angular genere HTML estatico para cada ruta durante la compilacion.

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

Tailwind esta configurado mediante:

```
.postcssrc.json
```

Tailwind deberia usarse tanto como sea posible para el trabajo cotidiano de UI.

Prefiere utilidades de Tailwind para:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Usa SCSS solo cuando Tailwind no sea la herramienta adecuada, por ejemplo para:

- estilos complejos especificos de componentes
- design tokens y mixins compartidos
- estados o selectores avanzados
- pequenas cantidades de estilos globales

Los estilos globales estan en:

```
src/styles.scss
```

---

# Icons

Esta plantilla incluye **Material Symbols Outlined** y deben usarse como conjunto
de iconos por defecto en todo el proyecto.

Se cargan en:

```
src/index.html
```

Usa iconos directamente en HTML asi:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Para botones accesibles, el icono debe seguir siendo decorativo y el boton debe
tener una etiqueta de texto o un `aria-label`:

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

Usa SCSS de forma alineada con los valores por defecto modernos de Angular:

- Manten la mayoria de los estilos dentro del archivo `.scss` del componente.
- Usa `src/styles.scss` solo para estilos realmente globales como resets, tokens,
  tipografia y capas utilitarias.
- Prefiere variables CSS para colores, espaciado y temas que puedan cambiar en tiempo de ejecucion.
- Usa funciones de SCSS como `@use`, mixins y parciales para facilitar la autoria y
  compartir design tokens.
- Evita el anidamiento profundo de selectores. Manten los selectores simples y locales al componente.
- Evita `::ng-deep` y `ViewEncapsulation.None` salvo que haya una razon clara de integracion.
- Prefiere class bindings en las plantillas antes que inline style bindings pesados.

Division recomendada:

```text
src/styles.scss           -> punto de entrada global
src/app/**/**/*.scss      -> estilos locales de componentes
src/styles/_theme.scss    -> variables CSS compartidas del tema
```

---

# Environments

Esta plantilla incluye archivos `environment` de Angular y pueden usarse para
distintas configuraciones de ejecucion, como desarrollo local y builds de produccion.

Archivos disponibles:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Casos de uso tipicos:

- URLs base de API
- feature flags
- interruptores de analitica
- configuracion de servicios externos

Los builds de produccion sustituyen `environment.ts` por `environment.prod.ts`
mediante los file replacements de Angular.

Limita los archivos `environment` a configuracion publica del frontend. No guardes
secretos en ellos.

---

# Deployment

El despliegue se gestiona automaticamente con **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Pasos:

1. Instalar dependencias
2. Compilar la app Angular
3. Copiar `CNAME`
4. Enviar la salida del build a `gh-pages`

La carpeta desplegada es:

```
dist/app/browser
```

---

# Domain

Dominio personalizado que debes ajustar a tu propio dominio para que funcione correctamente;
cualquier subdominio de `*.itkamianets.com` sirve si todavia no esta en uso dentro de nuestra organizacion de GitHub.

```
ngx.itkamianets.com
```

Configurado mediante:

```
CNAME
```

---

# Code Style

El formato se gestiona con:

- `.editorconfig`
- `.prettierrc`

Convenciones principales:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

Si usas IA fuera del IDE y no lee automaticamente las instrucciones del repositorio,
copia primero el contenido de `AGENTS.md` dentro del prompt/contexto.

Eso garantiza que la IA siga las mismas reglas especificas del proyecto que Codex usa dentro del IDE.

---

# NPM Scripts

Iniciar desarrollo:

```
npm start
```

Compilar proyecto:

```
npm run build
```

Ejecutar servidor SSR:

```
npm run serve:ssr:app
```

---

# Requirements

Entorno recomendado:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Las paginas de la aplicacion deben crearse dentro de:

```text
src/app/pages/
```

Cada pagina debe tener su propia carpeta y su propio archivo de componente.

Ejemplo:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Genera un componente de pagina con Angular CLI:

```bash
ng generate component pages/home
```

o mas corto:

```bash
ng g c pages/home
```

Las paginas deben cargarse de forma diferida desde `src/app/app.routes.ts`.

Ejemplo de configuracion de rutas:

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

Si una parte de la app necesita su propia logica de negocio e integracion con back-end,
crea una carpeta de feature dedicada dentro de:

```text
src/app/feature/
```

Cada feature debe mantener su propia estructura interna.

Ejemplo:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Ubicacion de ejemplo para un servicio:

```text
src/app/feature/user/services/user.service.ts
```

Comandos CLI sugeridos:

Crear pagina de feature:

```bash
ng g c feature/user/pages/user-profile
```

Crear componente de feature:

```bash
ng g c feature/user/components/user-card
```

Crear directiva de feature:

```bash
ng g d feature/user/directives/user-focus
```

Crear pipe de feature:

```bash
ng g p feature/user/pipes/user-name
```

Crear servicio de feature:

```bash
ng g s feature/user/services/user
```

Las interfaces normalmente se crean manualmente:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Para features pequenas y concretas, tambien son validos archivos colocados juntos como
`feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` y
`language.service.ts` cuando esa estructura mantiene el feature mas simple.

---

## Generic shared code

El codigo reutilizable generico que no esta ligado a un feature especifico puede vivir directamente bajo `src/app`.

Ejemplos de carpetas compartidas:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Ubicacion de ejemplo para un pipe compartido:

```text
src/app/pipes/phone.pipe.ts
```

Comandos CLI sugeridos:

Crear componente compartido:

```bash
ng g c components/page-header
```

Crear directiva compartida:

```bash
ng g d directives/autofocus
```

Crear pipe compartido:

```bash
ng g p pipes/phone
```

Crear servicio compartido:

```bash
ng g s services/api
```

Las interfaces normalmente se crean manualmente:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Usa estas ubicaciones por defecto:

- `src/app/pages` - paginas de nivel app con carga diferida
- `src/app/feature/<name>` - codigo especifico del feature con logica de negocio/back-end
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - codigo compartido generico

# Create a new project from this template

Clona el repositorio base en una carpeta nueva con el nombre de tu proyecto
(sustituye `PROJECT_NAME` por el nombre de tu proyecto):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Descarga el repositorio plantilla y crea una carpeta local llamada `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Abre la carpeta del proyecto recien creada.
- `npm i`
  Instala todas las dependencias del proyecto desde `package.json`.
- `npm run start`
  Inicia el servidor local de desarrollo.

Despues, abre la URL local que aparezca en la terminal, normalmente [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Si quieres empezar desde cero en lugar de conservar el historial git de la plantilla,
elimina la carpeta `.git`, inicializa un repositorio nuevo y crea el primer commit.

Ejemplo:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` conecta tu repositorio local con el repositorio remoto de GitHub
para que futuros `git push` y `git pull` sepan donde vive tu proyecto principal.

Usa tambien un mensaje Conventional Commit para el primer commit. Un valor por defecto razonable es:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
