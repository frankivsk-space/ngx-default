import { Translate } from '@wawjs/ngx-translate';

export const it = {
	'Go to homepage': 'Vai alla home page',
	'Switch to dark mode': 'Passa alla modalità scura',
	'Switch to light mode': 'Passa alla modalità chiara',
	'Open language menu': 'Apri il menu delle lingue',
	'Switch language to': 'Cambia lingua in',
} as const;

export type ItTranslationKey = keyof typeof it;

export const itTranslates: Translate[] = Object.entries(it).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
