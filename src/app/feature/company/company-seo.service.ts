import { DOCUMENT } from '@angular/common';
import { inject, Service } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { buildAbsoluteUrl } from '@wawjs/ngx-default';
import { companyProfile } from './company.data';

const STRUCTURED_DATA_ID = 'company-structured-data';

/**
 * Writes the company-wide head tags that do not change per route: `author`, `og:locale`,
 * `og:type`, `og:site_name`, `twitter:card` and a schema.org JSON-LD block. It runs during
 * prerender, so the static HTML already contains them, and again in the browser, where it updates
 * the same tags instead of adding copies.
 */
@Service()
export class CompanySeoService {
	private readonly _document = inject(DOCUMENT);
	private readonly _meta = inject(Meta);

	apply() {
		const seo = companyProfile.defaultSeo;

		this._meta.updateTag({ name: 'author', content: seo.author });
		this._meta.updateTag({ property: 'og:site_name', content: companyProfile.name });
		this._meta.updateTag({ property: 'og:locale', content: companyProfile.locale });
		this._meta.updateTag({ property: 'og:type', content: seo.type });
		this._meta.updateTag({ name: 'twitter:card', content: seo.twitterCard });

		this._writeStructuredData();
	}

	private _writeStructuredData() {
		const head = this._document.head;

		if (!head) {
			return;
		}

		let script = this._document.getElementById(STRUCTURED_DATA_ID);

		if (!script) {
			script = this._document.createElement('script');
			script.id = STRUCTURED_DATA_ID;
			script.setAttribute('type', 'application/ld+json');
			head.appendChild(script);
		}

		// `<` is escaped so text in company.json can never close the script element.
		script.textContent = JSON.stringify(_buildStructuredData()).replace(/</g, '\\u003c');
	}
}

function _buildStructuredData(): Record<string, unknown> {
	const { structuredData } = companyProfile;
	const address = {
		...(companyProfile.address ? { streetAddress: companyProfile.address } : {}),
		...(structuredData.addressLocality ? { addressLocality: structuredData.addressLocality } : {}),
		...(structuredData.addressCountry ? { addressCountry: structuredData.addressCountry } : {}),
	};

	return {
		'@context': 'https://schema.org',
		'@type': structuredData.type,
		name: companyProfile.name,
		url: `${companyProfile.siteUrl}/`,
		image: buildAbsoluteUrl(companyProfile.siteUrl, companyProfile.defaultSeo.image),
		logo: buildAbsoluteUrl(companyProfile.siteUrl, companyProfile.logo),
		...(companyProfile.description ? { description: companyProfile.description } : {}),
		...(companyProfile.email ? { email: companyProfile.email } : {}),
		...(companyProfile.phone ? { telephone: companyProfile.phone } : {}),
		...(Object.keys(address).length ? { address: { '@type': 'PostalAddress', ...address } } : {}),
		...(structuredData.sameAs.length ? { sameAs: structuredData.sameAs } : {}),
		...(structuredData.custom ?? {}),
	};
}
