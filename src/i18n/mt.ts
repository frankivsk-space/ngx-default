import { Translate } from '@wawjs/ngx-translate';

export const mt = {
	'Go to homepage': 'Mur fil-paġna ewlenija',
	'Switch to dark mode': 'Aqleb għall-modalità skura',
	'Switch to light mode': 'Aqleb għall-modalità ċara',
	'Open language menu': 'Iftaħ il-menu tal-lingwi',
	'Switch language to': 'Aqleb il-lingwa għal',
} as const;

export type MtTranslationKey = keyof typeof mt;

export const mtTranslates: Translate[] = Object.entries(mt).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
