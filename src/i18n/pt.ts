import { Translate } from '@wawjs/ngx-translate';

export const pt = {
	'Go to homepage': 'Ir para a página inicial',
	'Switch to dark mode': 'Mudar para o modo escuro',
	'Switch to light mode': 'Mudar para o modo claro',
	'Open language menu': 'Abrir menu de idiomas',
	'Switch language to': 'Mudar idioma para',
} as const;

export type PtTranslationKey = keyof typeof pt;

export const ptTranslates: Translate[] = Object.entries(pt).map(([sourceText, text]) => ({
	sourceText,
	text,
}));
