import { Translate } from '@wawjs/ngx-translate';

export const ga = {
	'Go to homepage': 'Téigh go dtí an leathanach baile',
	'Switch to dark mode': 'Athraigh go mód dorcha',
	'Switch to light mode': 'Athraigh go mód geal',
	'Open language menu': 'Oscail roghchlár teanga',
	'Switch language to': 'Athraigh an teanga go',
} as const;

export type GaTranslationKey = keyof typeof ga;

export const gaTranslates: Translate[] = Object.entries(ga).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
