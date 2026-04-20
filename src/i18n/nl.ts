import { Translate } from '@wawjs/ngx-translate';

export const nl = {
	'Go to homepage': 'Ga naar de homepage',
	'Switch to dark mode': 'Schakel naar donkere modus',
	'Switch to light mode': 'Schakel naar lichte modus',
	'Open language menu': 'Taalmenu openen',
	'Switch language to': 'Taal wijzigen naar',
} as const;

export type NlTranslationKey = keyof typeof nl;

export const nlTranslates: Translate[] = Object.entries(nl).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
