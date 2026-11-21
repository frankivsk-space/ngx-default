import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';

interface FooterPageLink {
	label: string;
	path: string;
}

@Component({
	selector: 'app-footer',
	imports: [RouterLink, TranslateDirective],
	templateUrl: './footer.component.html',
})
export class FooterComponent {
	private readonly _translateService = inject(TranslateService);

	protected readonly company = companyProfile;
	protected readonly currentYear = new Date().getFullYear();
	protected readonly pageLinks = computed<FooterPageLink[]>(() => [
		{
			label: 'Головна',
			path: '/',
		},
	]);
	protected readonly companyDescription = this._translateService.translate(
		companyProfile.description,
	);
}
