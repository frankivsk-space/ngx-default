import { Translate } from '@wawjs/ngx-translate';

export const hr = {
	'Go to homepage': 'Idi na početnu stranicu',
	'Switch to dark mode': 'Prebaci na tamni način rada',
	'Switch to light mode': 'Prebaci na svijetli način rada',
	'Open language menu': 'Otvori izbornik jezika',
	'Switch language to': 'Promijeni jezik na',
} as const;

export type HrTranslationKey = keyof typeof hr;

export const hrTranslates: Translate[] = Object.entries(hr).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
