import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import { ThemeService } from '@wawjs/ngx-ui';
import type { Language } from '@wawjs/ngx-translate';
import type { AppLanguage } from '../../../environments/environment.prod';
import { companyProfile } from '../../feature/company/company.data';

@Component({
	selector: 'app-topbar',
	imports: [NgOptimizedImage, RouterLink],
	templateUrl: './topbar.component.html',
	styleUrl: './topbar.component.scss',
	host: {
		'(document:click)': 'onDocumentClick($event)',
		'(document:keydown.escape)': 'onEscape()',
	},
})
export class TopbarComponent {
	private readonly _languageMenuRoot = viewChild<ElementRef<HTMLElement>>('languageMenuRoot');
	private readonly _languageMenuToggle =
		viewChild<ElementRef<HTMLButtonElement>>('languageMenuToggle');
	private readonly _translateService = inject(TranslateService);
	private readonly _themeService = inject(ThemeService);
	private readonly _languageService = inject(LanguageService);

	protected readonly mode = computed(() => this._themeService.mode() ?? 'light');
	protected readonly languageMenuOpen = signal(false);
	// The default language comes first, then the rest by number of speakers (environment
	// `population`, in millions); ties keep the environment order.
	protected readonly languages = computed(() => {
		const defaultLanguage = this._languageService.defaultLanguage();

		return this._languageService
			.languages()
			.map((language) => _toAppLanguage(language))
			.sort(
				(a, b) =>
					Number(b.code === defaultLanguage) - Number(a.code === defaultLanguage) ||
					b.population - a.population,
			);
	});
	protected readonly company = companyProfile;
	protected readonly activeLanguage = this._languageService.language;
	protected readonly currentLanguage = computed(() =>
		_toAppLanguage(this._languageService.getLanguage(this.activeLanguage())),
	);
	protected readonly toggleLabel = computed(() => {
		this.activeLanguage();
		return this.mode() === 'dark'
			? this._translateService.translate('Увімкнути світлий режим')()
			: this._translateService.translate('Увімкнути темний режим')();
	});
	protected readonly languageMenuLabel = computed(() => {
		this.activeLanguage();
		return this._translateService.translate('Відкрити меню мов')();
	});
	protected readonly languageCycleLabel = computed(() => {
		this.activeLanguage();
		return `${this._translateService.translate('Перемкнути мову на')()} ${this.getNextLanguage().nativeName}`;
	});

	protected toggleMode() {
		const nextMode = this.mode() === 'dark' ? 'light' : 'dark';
		this._themeService.setMode(nextMode);
	}

	protected nextLanguage() {
		return this.setLanguage(this.getNextLanguage());
	}

	protected toggleLanguageMenu() {
		this.languageMenuOpen.update((open) => !open);
	}

	protected onDocumentClick(event: MouseEvent) {
		if (!this.languageMenuOpen()) {
			return;
		}

		const root = this._languageMenuRoot()?.nativeElement;

		if (root && event.target instanceof Node && !root.contains(event.target)) {
			this.languageMenuOpen.set(false);
		}
	}

	protected onEscape() {
		if (!this.languageMenuOpen()) {
			return;
		}

		this.languageMenuOpen.set(false);
		this._languageMenuToggle()?.nativeElement.focus();
	}

	/** Translations are signals, so the page updates in place; no navigation is needed. */
	protected async setLanguage(language: AppLanguage) {
		await this._translateService.setLanguage(language.code);
		this.languageMenuOpen.set(false);
	}

	protected getNextLanguage() {
		const languages = this.languages();
		const currentCode = this.currentLanguage().code;
		const currentIndex = languages.findIndex((language) => language.code === currentCode);

		return languages[(currentIndex + 1) % languages.length] ?? languages[0]!;
	}
}

function _toAppLanguage(language: Language | undefined): AppLanguage {
	const fallback: AppLanguage = {
		code: 'en',
		name: 'English',
		nativeName: 'English',
		flagSrc: 'flags/united-kingdom.svg',
		htmlLang: 'en',
		population: 0,
	};

	return { ...fallback, ...(language as Partial<AppLanguage> | undefined) };
}
