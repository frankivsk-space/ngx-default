import { Translate } from '@wawjs/ngx-translate';

export const ua = {
	'Go to homepage': 'Перейти на головну сторінку',
	'Switch to dark mode': 'Увімкнути темний режим',
	'Switch to light mode': 'Увімкнути світлий режим',
	'Open language menu': 'Відкрити меню мов',
	'Switch language to': 'Перемкнути мову на',
} as const;

export type UkrainianTranslationKey = keyof typeof ua;

export const uaTranslates: Translate[] = Object.entries(ua).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
