import { Translate } from '@wawjs/ngx-translate';

export const el = {
	'Go to homepage': 'Μετάβαση στην αρχική σελίδα',
	'Switch to dark mode': 'Μετάβαση σε σκοτεινή λειτουργία',
	'Switch to light mode': 'Μετάβαση σε φωτεινή λειτουργία',
	'Open language menu': 'Άνοιγμα μενού γλωσσών',
	'Switch language to': 'Αλλαγή γλώσσας σε',
} as const;

export type ElTranslationKey = keyof typeof el;

export const elTranslates: Translate[] = Object.entries(el).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
