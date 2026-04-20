import { Translate } from '@wawjs/ngx-translate';

export const lv = {
	'Go to homepage': 'Doties uz sākumlapu',
	'Switch to dark mode': 'Pārslēgt uz tumšo režīmu',
	'Switch to light mode': 'Pārslēgt uz gaišo režīmu',
	'Open language menu': 'Atvērt valodu izvēlni',
	'Switch language to': 'Pārslēgt valodu uz',
} as const;

export type LvTranslationKey = keyof typeof lv;

export const lvTranslates: Translate[] = Object.entries(lv).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
