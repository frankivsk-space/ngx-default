import { Translate } from '@wawjs/ngx-translate';

export const sv = {
	'Go to homepage': 'Gå till startsidan',
	'Switch to dark mode': 'Byt till mörkt läge',
	'Switch to light mode': 'Byt till ljust läge',
	'Open language menu': 'Öppna språkmenyn',
	'Switch language to': 'Byt språk till',
} as const;

export type SvTranslationKey = keyof typeof sv;

export const svTranslates: Translate[] = Object.entries(sv).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
