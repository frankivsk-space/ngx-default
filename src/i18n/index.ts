import { Translate } from '@wawjs/ngx-translate';

type TranslateLoader = () => Promise<Translate[]>;

export const translationLoaders = {
	bg: () => import('./bg').then((module) => module.bgTranslates),
	cs: () => import('./cs').then((module) => module.csTranslates),
	da: () => import('./da').then((module) => module.daTranslates),
	de: () => import('./de').then((module) => module.deTranslates),
	el: () => import('./el').then((module) => module.elTranslates),
	en: () => import('./en').then((module) => module.enTranslates),
	es: () => import('./es').then((module) => module.esTranslates),
	et: () => import('./et').then((module) => module.etTranslates),
	fi: () => import('./fi').then((module) => module.fiTranslates),
	fr: () => import('./fr').then((module) => module.frTranslates),
	ga: () => import('./ga').then((module) => module.gaTranslates),
	hr: () => import('./hr').then((module) => module.hrTranslates),
	hu: () => import('./hu').then((module) => module.huTranslates),
	it: () => import('./it').then((module) => module.itTranslates),
	lt: () => import('./lt').then((module) => module.ltTranslates),
	lv: () => import('./lv').then((module) => module.lvTranslates),
	mt: () => import('./mt').then((module) => module.mtTranslates),
	nl: () => import('./nl').then((module) => module.nlTranslates),
	pl: () => import('./pl').then((module) => module.plTranslates),
	pt: () => import('./pt').then((module) => module.ptTranslates),
	ro: () => import('./ro').then((module) => module.roTranslates),
	sk: () => import('./sk').then((module) => module.skTranslates),
	sl: () => import('./sl').then((module) => module.slTranslates),
	sv: () => import('./sv').then((module) => module.svTranslates),
	ua: () => import('./ua').then((module) => module.uaTranslates),
} satisfies Record<string, TranslateLoader>;

export type LanguageKey = keyof typeof translationLoaders;
