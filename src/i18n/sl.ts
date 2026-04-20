import { Translate } from '@wawjs/ngx-translate';

export const sl = {
	'Go to homepage': 'Pojdi na domačo stran',
	'Switch to dark mode': 'Preklopi v temni način',
	'Switch to light mode': 'Preklopi v svetli način',
	'Open language menu': 'Odpri meni jezikov',
	'Switch language to': 'Preklopi jezik na',
} as const;

export type SlTranslationKey = keyof typeof sl;

export const slTranslates: Translate[] = Object.entries(sl).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
