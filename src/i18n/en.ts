import { Translate } from '@wawjs/ngx-translate';

export const en = {
	'Go to homepage': 'Go to homepage',
	'Switch to dark mode': 'Switch to dark mode',
	'Switch to light mode': 'Switch to light mode',
	'Open language menu': 'Open language menu',
	'Switch language to': 'Switch language to',
} as const;

export type EnglishTranslationKey = keyof typeof en;

export const enTranslates: Translate[] = Object.entries(en).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
