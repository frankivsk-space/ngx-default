import { Translate } from '@wawjs/ngx-translate';

export const fr = {
	'Go to homepage': "Aller à la page d'accueil",
	'Switch to dark mode': 'Passer en mode sombre',
	'Switch to light mode': 'Passer en mode clair',
	'Open language menu': 'Ouvrir le menu des langues',
	'Switch language to': 'Passer la langue à',
} as const;

export type FrTranslationKey = keyof typeof fr;

export const frTranslates: Translate[] = Object.entries(fr).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
