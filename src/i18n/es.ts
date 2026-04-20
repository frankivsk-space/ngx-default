import { Translate } from '@wawjs/ngx-translate';

export const es = {
	'Go to homepage': 'Ir a la página de inicio',
	'Switch to dark mode': 'Cambiar a modo oscuro',
	'Switch to light mode': 'Cambiar a modo claro',
	'Open language menu': 'Abrir menú de idiomas',
	'Switch language to': 'Cambiar idioma a',
} as const;

export type EsTranslationKey = keyof typeof es;

export const esTranslates: Translate[] = Object.entries(es).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
