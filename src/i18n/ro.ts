import { Translate } from '@wawjs/ngx-translate';

export const ro = {
	'Go to homepage': 'Mergi la pagina principală',
	'Switch to dark mode': 'Comută la modul întunecat',
	'Switch to light mode': 'Comută la modul luminos',
	'Open language menu': 'Deschide meniul de limbi',
	'Switch language to': 'Schimbă limba în',
} as const;

export type RoTranslationKey = keyof typeof ro;

export const roTranslates: Translate[] = Object.entries(ro).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
