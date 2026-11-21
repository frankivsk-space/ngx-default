export interface Company {
	_id: string;
	name: string;
	title: string;
	description: string;
	image: string;
	siteUrl: string;
	custom?: Record<string, unknown>;
}

export interface SeoMetadata {
	title: string;
	description: string;
	/** `<meta name="author">`. */
	author: string;
	robots: string;
	image: string;
	/** `og:type`. */
	type: string;
	/** `twitter:card`. */
	twitterCard: string;
}

/** Per-route overrides read by `buildRouteMeta()` from `@wawjs/ngx-default`. */
export interface SeoPageOverride {
	title?: string;
	description?: string;
	robots?: string;
	image?: string;
	titleSuffix?: string;
}

/** Schema.org data for the JSON-LD block in the page head. */
export interface CompanyStructuredData {
	/** Schema.org type, for example `Organization` or `LocalBusiness`. */
	type: string;
	addressLocality: string;
	addressCountry: string;
	/** Profile URLs (social networks, directories). */
	sameAs: string[];
	/** Extra schema.org properties merged into the JSON-LD object. */
	custom?: Record<string, unknown>;
}

export interface CompanyProfile extends Company {
	/** `og:locale`, for example `en_US`. */
	locale: string;
	logo: string;
	phone: string;
	email: string;
	address: string;
	defaultSeo: SeoMetadata;
	pageSeo: Record<string, SeoPageOverride>;
	structuredData: CompanyStructuredData;
}
