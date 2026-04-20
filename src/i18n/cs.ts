import { Translate } from '@wawjs/ngx-translate';

export const cs = {
	'Go to homepage': 'Přejít na domovskou stránku',
	'Switch to dark mode': 'Přepnout do tmavého režimu',
	'Switch to light mode': 'Přepnout do světlého režimu',
	'Open language menu': 'Otevřít nabídku jazyků',
	'Switch language to': 'Přepnout jazyk na',
} as const;

export type CsTranslationKey = keyof typeof cs;

export const csTranslates: Translate[] = Object.entries(cs).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
