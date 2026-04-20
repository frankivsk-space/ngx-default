import { Translate } from '@wawjs/ngx-translate';

export const hu = {
	'Go to homepage': 'Ugrás a kezdőlapra',
	'Switch to dark mode': 'Váltás sötét módra',
	'Switch to light mode': 'Váltás világos módra',
	'Open language menu': 'Nyelvi menü megnyitása',
	'Switch language to': 'Nyelv váltása erre',
} as const;

export type HuTranslationKey = keyof typeof hu;

export const huTranslates: Translate[] = Object.entries(hu).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
