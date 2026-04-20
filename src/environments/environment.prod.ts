import { Article } from '../app/feature/article/article.interface';
import { Company } from '../app/feature/company/company.interface';
import { Event } from '../app/feature/event/event.interface';
import { Item } from '../app/feature/item/item.interface';
import { Job } from '../app/feature/job/job.interface';
import { Product } from '../app/feature/product/product.interface';
import { Quest } from '../app/feature/quest/quest.interface';
import { Review } from '../app/feature/review/review.interface';

export const environment: {
	apiUrl: string;
	onApiFall: 'spinner' | 'app reload' | 'app';
	appVersion: string;
	production: boolean;
	defaultLanguage: string;
	companyId: string;
	company: Company;
	articles: Article[];
	events: Event[];
	items: Item[];
	jobs: Job[];
	products: Product[];
	quests: Quest[];
	reviews: Review[];
} = {
	apiUrl: 'https://api.webart.work',
	onApiFall: 'app',
	appVersion: '1.0.0',
	production: true,
	defaultLanguage: 'ua',
	articles: [],
	events: [],
	items: [],
	jobs: [],
	products: [],
	quests: [],
	reviews: [],
	companyId: 'demo',
	company: {
		_id: '',
		name: '',
	},
};
