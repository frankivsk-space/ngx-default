import { Translate } from '@wawjs/ngx-translate';

export const pl = {
	'Go to homepage': 'Przejdź do strony głównej',
	'Switch to dark mode': 'Przełącz na tryb ciemny',
	'Switch to light mode': 'Przełącz na tryb jasny',
	'Open language menu': 'Otwórz menu języków',
	'Switch language to': 'Przełącz język na',
} as const;

export type PlTranslationKey = keyof typeof pl;

export const plTranslates: Translate[] = Object.entries(pl).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
