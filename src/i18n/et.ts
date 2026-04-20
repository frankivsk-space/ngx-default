import { Translate } from '@wawjs/ngx-translate';

export const et = {
	'Go to homepage': 'Mine avalehele',
	'Switch to dark mode': 'Lülitu tumedale režiimile',
	'Switch to light mode': 'Lülitu heledale režiimile',
	'Open language menu': 'Ava keelemenüü',
	'Switch language to': 'Vaheta keel keeleks',
} as const;

export type EtTranslationKey = keyof typeof et;

export const etTranslates: Translate[] = Object.entries(et).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
