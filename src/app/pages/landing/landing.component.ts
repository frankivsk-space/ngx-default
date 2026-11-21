import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';

@Component({
	imports: [NgOptimizedImage, RouterLink, TranslateDirective],
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
})
export class LandingComponent {
	private readonly _translateService = inject(TranslateService);

	protected readonly company = companyProfile;
	protected readonly companyDescription = this._translateService.translate(
		companyProfile.description,
	);
}
