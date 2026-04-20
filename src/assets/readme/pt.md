# Angular Landing Template (SSR + Prerender)

Modelo inicial moderno em Angular 21 para criar landing pages rápidas com **prerenderização SSR**, **TailwindCSS** e **implantação no GitHub Pages**.

Este modelo é otimizado para sites estáticos de landing page, onde as páginas são renderizadas **durante a build** para SEO e desempenho.

---

# Acknowledge

- Angular **21**
- **Prerenderização SSR** durante a build
- **Angular sem Zone.js**
- O estado usado em bindings de classes no HTML deve ser exposto como **signals**
- Prefira **Angular Signal Forms** como abordagem principal ao criar novos formulários
- **Detecção de mudanças OnPush por padrão**
- **TailwindCSS v4**
- Use variáveis CSS de **tema compartilhado** de `src/styles/_theme.scss` para cores, superfícies, espaçamento, raios e movimento
- **Implantação no GitHub Pages**
- **Formatação com Prettier**
- Estrutura de projeto limpa e minimalista

O projeto gera ambos:

```
dist/app/browser
dist/app/server
```

Mas a implantação usa a **saída prerenderizada do navegador**, o que o torna perfeito para hospedagem estática.

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

A configuração de SSR fica em:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Inicie o servidor de desenvolvimento:

```
npm start
```

ou

```
ng serve
```

A aplicação roda em [http://localhost:4200](http://localhost:4200)

O modo de desenvolvimento roda como uma SPA Angular normal.

---

# Build

Compile o projeto:

```
npm run build
```

Isso gera:

```
dist/app/browser
dist/app/server
```

As páginas são **prerenderizadas durante a build** usando Angular SSR.

---

# Running the SSR server (optional)

O modelo inclui um servidor Node para SSR:

```
npm run serve:ssr:app
```

Isso executa:

```
node dist/app/server/server.mjs
```

Para a maioria das landing pages isso **não é necessário**, porque o HTML prerenderizado já é gerado.

---

# Prerender configuration

Todas as rotas são prerenderizadas por padrão:

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

Isso faz o Angular gerar HTML estático para cada rota durante a build.

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

O Tailwind é configurado via:

```
.postcssrc.json
```

O Tailwind deve ser usado o máximo possível no trabalho diário de UI.

Prefira utilitários do Tailwind para:

- layout
- espaçamento
- tipografia
- cores
- bordas
- dimensionamento
- comportamento responsivo

Use SCSS apenas quando o Tailwind não for a ferramenta certa, por exemplo:

- estilos complexos específicos de componente
- tokens de design e mixins compartilhados
- estados ou seletores avançados
- pequenas quantidades de estilo global

Os estilos globais ficam em:

```
src/styles.scss
```

---

# Icons

Este modelo inclui **Material Symbols Outlined** e eles devem ser usados como conjunto de ícones padrão em todo o projeto.

Carregados em:

```
src/index.html
```

Use ícones diretamente no HTML assim:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

Para botões acessíveis, mantenha o ícone decorativo e forneça um rótulo textual ou `aria-label` no próprio botão:

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

Use SCSS de um modo que siga os padrões modernos do Angular:

- Mantenha a maioria dos estilos dentro do arquivo `.scss` do componente.
- Use `src/styles.scss` apenas para estilos realmente globais, como resets, tokens, tipografia e camadas utilitárias.
- Prefira variáveis CSS para cores, espaçamento e temas que possam mudar em tempo de execução.
- Use recursos do SCSS como `@use`, mixins e partials para conveniência na autoria e compartilhamento de tokens de design.
- Evite aninhamento profundo de seletores. Mantenha os seletores simples e locais ao componente.
- Evite `::ng-deep` e `ViewEncapsulation.None` a menos que exista um motivo claro de integração.
- Prefira bindings de classe nos templates em vez de bindings pesados de estilo inline.

Divisão recomendada:

```text
src/styles.scss           -> ponto de entrada global
src/app/**/**/*.scss      -> estilos locais de componente
src/styles/_theme.scss    -> variáveis CSS de tema compartilhado
```

---

# Environments

Este modelo inclui arquivos de environment do Angular e eles podem ser usados para diferentes configurações de execução, como desenvolvimento local e builds de produção.

Arquivos disponíveis:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Casos de uso típicos:

- URLs base de API
- feature flags
- toggles de analytics
- configuração de serviços externos

As builds de produção substituem `environment.ts` por `environment.prod.ts` através de file replacements do Angular.

Mantenha os arquivos de environment limitados à configuração pública do front-end. Não armazene segredos neles.

---

# Deployment

A implantação é tratada automaticamente via **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Etapas:

1. Instalar dependências
2. Compilar a aplicação Angular
3. Copiar `CNAME`
4. Enviar a saída da build para `gh-pages`

A pasta implantada é:

```
dist/app/browser
```

---

# Domain

Domínio personalizado que você deve ajustar para o seu próprio domínio para funcionar corretamente, qualquer subdomínio de `*.itkamianets.com` caso ainda não tenha sido usado antes em nossa organização do GitHub.

```
ngx.itkamianets.com
```

Configurado via:

```
CNAME
```

---

# Code Style

A formatação é tratada por:

- `.editorconfig`
- `.prettierrc`

Principais convenções:

- **tabs**
- **aspas simples**
- **largura de linha de 100 caracteres**

---

# AI Usage

Se você usar IA fora da IDE e ela não ler automaticamente as instruções do repositório, copie primeiro o conteúdo de `AGENTS.md` para o prompt/contexto da IA.

Isso garante que a IA siga as mesmas regras específicas do projeto que o Codex usa dentro da IDE.

---

# NPM Scripts

Iniciar desenvolvimento:

```
npm start
```

Compilar o projeto:

```
npm run build
```

Executar o servidor SSR:

```
npm run serve:ssr:app
```

---

# Requirements

Ambiente recomendado:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

As páginas da aplicação devem ser criadas em:

```text
src/app/pages/
```

Cada página deve ter a sua própria pasta e o seu próprio arquivo de componente.

Exemplo:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Gere um componente de página com o Angular CLI:

```bash
ng generate component pages/home
```

ou, de forma mais curta:

```bash
ng g c pages/home
```

As páginas devem ser carregadas de forma lazy a partir de `src/app/app.routes.ts`.

Exemplo de configuração de rota:

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

Se uma parte da aplicação precisar de sua própria lógica de negócio e integração com back-end, crie uma pasta de feature dedicada dentro de:

```text
src/app/feature/
```

Cada feature deve manter sua própria estrutura interna.

Exemplo:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Exemplo de localização de service:

```text
src/app/feature/user/services/user.service.ts
```

Comandos CLI sugeridos:

Criar página de feature:

```bash
ng g c feature/user/pages/user-profile
```

Criar componente de feature:

```bash
ng g c feature/user/components/user-card
```

Criar directive de feature:

```bash
ng g d feature/user/directives/user-focus
```

Criar pipe de feature:

```bash
ng g p feature/user/pipes/user-name
```

Criar service de feature:

```bash
ng g s feature/user/services/user
```

Interfaces normalmente são criadas manualmente:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

Para features pequenas e focadas, arquivos colocados juntos como `feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts` e `language.service.ts` também são válidos quando essa estrutura mantém a feature mais simples.

---

## Generic shared code

Código reutilizável genérico que não está vinculado a uma feature específica pode ficar diretamente em `src/app`.

Exemplos de pastas compartilhadas:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Exemplo de localização de pipe compartilhado:

```text
src/app/pipes/phone.pipe.ts
```

Comandos CLI sugeridos:

Criar componente compartilhado:

```bash
ng g c components/page-header
```

Criar directive compartilhada:

```bash
ng g d directives/autofocus
```

Criar pipe compartilhado:

```bash
ng g p pipes/phone
```

Criar service compartilhado:

```bash
ng g s services/api
```

Interfaces normalmente são criadas manualmente:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Use estes locais por padrão:

- `src/app/pages` - páginas de aplicativo carregadas de forma lazy
- `src/app/feature/<name>` - código específico de feature com lógica de negócio/back-end
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - código compartilhado genérico

# Create a new project from this template

Clone o repositório padrão em uma nova pasta com o nome do seu projeto (substitua `PROJECT_NAME` pelo nome do seu projeto):

```bash
git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

### What these commands do

- `git clone https://github.com/IT-Kamianets/ngx-default.git PROJECT_NAME`
  Faz o download do repositório do modelo e cria uma pasta local chamada `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Abre a pasta do projeto recém-criada.
- `npm i`
  Instala todas as dependências do projeto a partir de `package.json`.
- `npm run start`
  Inicia o servidor de desenvolvimento local.

Depois disso, abra a URL local mostrada no terminal, normalmente [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

Se você quiser começar do zero em vez de manter o histórico git do modelo, remova a pasta `.git` existente, inicialize um novo repositório e crie o primeiro commit.

Exemplo:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from ngx-default template"
```

`git remote add origin ...` conecta o seu repositório local ao repositório remoto no GitHub para que futuros comandos `git push` e `git pull` saibam onde o projeto principal está.

Use também uma mensagem de Conventional Commit para o primeiro commit. Um bom padrão é:

```text
chore(init): bootstrap project from ngx-default template
```

# License

MIT
