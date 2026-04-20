import { Translate } from '@wawjs/ngx-translate';

export const sk = {
	'Go to homepage': 'Prejsť na domovskú stránku',
	'Switch to dark mode': 'Prepnúť do tmavého režimu',
	'Switch to light mode': 'Prepnúť do svetlého režimu',
	'Open language menu': 'Otvoriť ponuku jazykov',
	'Switch language to': 'Prepnúť jazyk na',
} as const;

export type SkTranslationKey = keyof typeof sk;

export const skTranslates: Translate[] = Object.entries(sk).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
