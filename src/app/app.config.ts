import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { buildAbsoluteUrl, buildSeoTitleSuffix, provideNgxDefaultSeo } from '@wawjs/ngx-default';
import { provideNgxCore } from '@wawjs/ngx-core';
import { provideTranslate } from '@wawjs/ngx-translate';
import { provideNgxUi, provideStartup } from '@wawjs/ngx-ui';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { companyProfile } from './feature/company/company.data';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideHttpClient(withFetch()),
		provideNgxCore({
			meta: {
				applyFromRoutes: true,
				useTitleSuffix: true,
				defaults: {
					// Fallback for pages without their own title, shown with the company suffix. It must
					// not be the company name, or the title would read "<name> | <name>".
					title: 'Build your app',
					titleSuffix: buildSeoTitleSuffix(companyProfile),
					description: companyProfile.defaultSeo.description,
					image: buildAbsoluteUrl(
						companyProfile.siteUrl,
						companyProfile.defaultSeo.image,
					),
					robots: companyProfile.defaultSeo.robots,
				},
			},
		}),
		provideNgxDefaultSeo({
			siteUrl: companyProfile.siteUrl,
		}),
		provideNgxUi(),
		provideRouter(
			routes,
			// The landing CTA links to its own section with routerLink + fragment.
			withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
		),
		provideClientHydration(withEventReplay()),
		provideTranslate({
			defaultLanguage: environment.defaultLanguage,
			languages: environment.languages,
			folder: '/i18n/',
		}),
		// Startup screen: shown only when the saved language differs from the prerendered one (see
		// index.html). It is released after the first render, which already waits for the language
		// (provideTranslate loads it in an app initializer). The saved
		// theme is applied before first paint in index.html. Add more waits with
		// provideStartupTask('name', () => promise).
		provideStartup(),
	],
};
