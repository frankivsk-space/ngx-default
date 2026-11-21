import companyData from '../../../data/company/company.json';
import {
	CompanyProfile,
	CompanyStructuredData,
	SeoMetadata,
	SeoPageOverride,
} from './company.interface';

type RawCompanyProfile = Partial<
	Omit<CompanyProfile, 'defaultSeo' | 'pageSeo' | 'structuredData'>
> & {
	defaultSeo?: Partial<SeoMetadata>;
	pageSeo?: Record<string, SeoPageOverride | undefined>;
	structuredData?: Partial<CompanyStructuredData>;
};

const rawCompanyProfile = companyData as RawCompanyProfile;

/** The company profile, bundled at build time from `src/data/company/company.json`. */
export const companyProfile: CompanyProfile = {
	_id: _stringOrFallback(rawCompanyProfile._id),
	name: _stringOrFallback(rawCompanyProfile.name, 'Company'),
	title: _stringOrFallback(
		rawCompanyProfile.title,
		_optionalString(rawCompanyProfile.name) ?? 'Company',
	),
	description: _stringOrFallback(rawCompanyProfile.description),
	image: _stringOrFallback(
		rawCompanyProfile.image,
		_optionalString(rawCompanyProfile.logo) ?? '/logo.png',
	),
	siteUrl: _trimTrailingSlash(
		_stringOrFallback(rawCompanyProfile.siteUrl, 'https://example.com'),
	),
	locale: _stringOrFallback(rawCompanyProfile.locale, 'en_US'),
	logo: _stringOrFallback(
		rawCompanyProfile.logo,
		_optionalString(rawCompanyProfile.image) ?? '/logo.png',
	),
	phone: _stringOrFallback(rawCompanyProfile.phone),
	email: _stringOrFallback(rawCompanyProfile.email),
	address: _stringOrFallback(rawCompanyProfile.address),
	defaultSeo: _normalizeSeoMetadata(rawCompanyProfile),
	pageSeo: _normalizePageSeo(rawCompanyProfile.pageSeo),
	structuredData: _normalizeStructuredData(rawCompanyProfile.structuredData),
	custom: rawCompanyProfile.custom,
};

function _normalizeSeoMetadata(profile: RawCompanyProfile): SeoMetadata {
	const metadata = profile.defaultSeo;
	const title = _stringOrFallback(
		metadata?.title,
		_optionalString(profile.title) ?? _optionalString(profile.name) ?? 'Company',
	);
	const description = _stringOrFallback(metadata?.description, profile.description);
	const image = _stringOrFallback(
		metadata?.image,
		_optionalString(profile.image) ?? _optionalString(profile.logo) ?? '/logo.png',
	);

	return {
		title,
		description,
		author: _stringOrFallback(metadata?.author, _optionalString(profile.name) ?? 'Company'),
		robots: _stringOrFallback(metadata?.robots, 'index, follow'),
		image,
		type: _stringOrFallback(metadata?.type, 'website'),
		twitterCard: _stringOrFallback(metadata?.twitterCard, 'summary'),
	};
}

function _normalizePageSeo(pageSeo: RawCompanyProfile['pageSeo']): Record<string, SeoPageOverride> {
	if (!pageSeo) {
		return {};
	}

	return Object.fromEntries(
		Object.entries(pageSeo).map(([path, metadata]) => [
			path,
			{
				title: _optionalString(metadata?.title),
				description: _optionalString(metadata?.description),
				robots: _optionalString(metadata?.robots),
				image: _optionalString(metadata?.image),
				titleSuffix: metadata?.titleSuffix,
			},
		]),
	);
}

function _normalizeStructuredData(
	structuredData: RawCompanyProfile['structuredData'],
): CompanyStructuredData {
	return {
		type: _stringOrFallback(structuredData?.type, 'Organization'),
		addressLocality: _stringOrFallback(structuredData?.addressLocality),
		addressCountry: _stringOrFallback(structuredData?.addressCountry),
		sameAs: _stringArrayOrFallback(structuredData?.sameAs),
		custom: structuredData?.custom,
	};
}

function _stringOrFallback(value: string | null | undefined, fallback = ''): string {
	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function _optionalString(value: string | null | undefined): string | undefined {
	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function _stringArrayOrFallback(value: string[] | null | undefined): string[] {
	return Array.isArray(value)
		? value.filter(
				(entry): entry is string => typeof entry === 'string' && entry.trim().length > 0,
			)
		: [];
}

function _trimTrailingSlash(value: string): string {
	return value.endsWith('/') ? value.slice(0, -1) : value;
}
