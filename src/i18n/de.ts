import { Translate } from '@wawjs/ngx-translate';

export const de = {
	'Go to homepage': 'Zur Startseite',
	'Switch to dark mode': 'In den Dunkelmodus wechseln',
	'Switch to light mode': 'In den Hellmodus wechseln',
	'Open language menu': 'Sprachmenü öffnen',
	'Switch language to': 'Sprache umstellen auf',
} as const;

export type DeTranslationKey = keyof typeof de;

export const deTranslates: Translate[] = Object.entries(de).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
