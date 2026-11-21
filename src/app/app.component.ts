import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanonicalService } from '@wawjs/ngx-default';
import { LanguageService } from '@wawjs/ngx-translate';
import { ThemeService } from '@wawjs/ngx-ui';
import { environment } from '../environments/environment';
import { CompanySeoService } from './feature/company/company-seo.service';
import { FooterComponent } from './layouts/footer/footer.component';
import { TopbarComponent } from './layouts/topbar/topbar.component';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, TopbarComponent, FooterComponent],
	template: `
		<div class="flex min-h-screen flex-col">
			<app-topbar />
			<main class="flex-1">
				<router-outlet />
			</main>
			<app-footer />
		</div>
	`,
})
export class App {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _companySeoService = inject(CompanySeoService);
	private readonly _document = inject(DOCUMENT);
	private readonly _languageService = inject(LanguageService);
	private readonly _themeService = inject(ThemeService);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	constructor() {
		this._canonicalService.initialize();
		this._companySeoService.apply();

		// Browser chrome color follows the active mode (not the OS), using the page background.
		effect(() => {
			this._themeService.mode();

			if (!this._isBrowser) {
				return;
			}

			const color = getComputedStyle(this._document.documentElement)
				.getPropertyValue('--c-bg-primary')
				.trim();
			const meta = this._document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

			if (color && meta) {
				meta.content = color;
			}
		});

		effect(() => {
			const language = this._languageService.language();
			const htmlLang =
				environment.languages.find((item) => item.code === language)?.htmlLang ?? language;

			if (htmlLang) {
				this._document.documentElement.lang = htmlLang;
			}
		});
	}
}
