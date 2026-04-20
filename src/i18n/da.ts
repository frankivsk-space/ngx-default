import { Translate } from '@wawjs/ngx-translate';

export const da = {
	'Go to homepage': 'Gå til forsiden',
	'Switch to dark mode': 'Skift til mørk tilstand',
	'Switch to light mode': 'Skift til lys tilstand',
	'Open language menu': 'Åbn sprogmenuen',
	'Switch language to': 'Skift sprog til',
} as const;

export type DaTranslationKey = keyof typeof da;

export const daTranslates: Translate[] = Object.entries(da).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
