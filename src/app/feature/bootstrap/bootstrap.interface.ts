import { Article } from '../article/article.interface';
import { Company } from '../company/company.interface';
import { Event } from '../event/event.interface';
import { Item } from '../item/item.interface';
import { Job } from '../job/job.interface';
import { Product } from '../product/product.interface';
import { Quest } from '../quest/quest.interface';
import { Review } from '../review/review.interface';

export interface BootstrapData {
	articles?: Article[];
	company?: Company;
	events?: Event[];
	items?: Item[];
	jobs?: Job[];
	products?: Product[];
	quests?: Quest[];
	reviews?: Review[];
}
