import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, TransferState } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ArticleService } from '../article/article.service';
import { CompanyService } from '../company/company.service';
import { EventService } from '../event/event.service';
import { ItemService } from '../item/item.service';
import { JobService } from '../job/job.service';
import { ProductService } from '../product/product.service';
import { QuestService } from '../quest/quest.service';
import { ReviewService } from '../review/review.service';
import { BOOTSTRAP_STATE_KEY } from './bootstrap.const';
import { BootstrapData } from './bootstrap.interface';

@Injectable({
	providedIn: 'root',
})
export class BootstrapService {
	private _platformId = inject(PLATFORM_ID);
	private _transferState = inject(TransferState);
	private _articleService = inject(ArticleService);
	private _companyService = inject(CompanyService);
	private _eventService = inject(EventService);
	private _itemService = inject(ItemService);
	private _jobService = inject(JobService);
	private _productService = inject(ProductService);
	private _questService = inject(QuestService);
	private _reviewService = inject(ReviewService);

	async initialize() {
		const transferData = this._transferState.get<BootstrapData | null>(
			BOOTSTRAP_STATE_KEY,
			null,
		);

		if (transferData) {
			this._apply(transferData);

			if (isPlatformBrowser(this._platformId)) {
				this._transferState.remove(BOOTSTRAP_STATE_KEY);
				void this._refreshInBrowser();
			}

			return;
		}

		if (isPlatformServer(this._platformId)) {
			const data = await this._load();

			if (data) {
				this._transferState.set(BOOTSTRAP_STATE_KEY, data);
				this._apply(data);
			}

			return;
		}

		void this._refreshInBrowser();
	}

	private _apply(data: BootstrapData) {
		if (Array.isArray(data.articles)) {
			this._articleService.articles.set(data.articles);
		}

		if (data.company) {
			this._companyService.company.set(data.company);
		}

		if (Array.isArray(data.events)) {
			this._eventService.events.set(data.events);
		}

		if (Array.isArray(data.items)) {
			this._itemService.items.set(data.items);
		}

		if (Array.isArray(data.jobs)) {
			this._jobService.jobs.set(data.jobs);
		}

		if (Array.isArray(data.products)) {
			this._productService.products.set(data.products);
		}

		if (Array.isArray(data.quests)) {
			this._questService.quests.set(data.quests);
		}

		if (Array.isArray(data.reviews)) {
			this._reviewService.reviews.set(data.reviews);
		}
	}

	private async _refreshInBrowser() {
		const data = await this._load();

		if (data) {
			this._apply(data);
			return;
		}

		if (environment.onApiFall !== 'app') {
			this._waitForApiAndReload();
		}
	}

	private async _load() {
		try {
			const response = await fetch(
				`${environment.apiUrl}/api/regionit/bootstrap/${environment.companyId}`,
			);

			if (!response.ok) {
				return null;
			}

			return (await response.json()) as BootstrapData;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	private _waitForApiAndReload() {
		let isChecking = false;

		const intervalId = window.setInterval(async () => {
			if (isChecking) {
				return;
			}

			isChecking = true;

			try {
				const response = await fetch(`${environment.apiUrl}/status`);

				if (response.ok) {
					window.clearInterval(intervalId);
					window.location.reload();
				}
			} catch {
				// Keep polling until the API responds successfully.
			} finally {
				isChecking = false;
			}
		}, 1000);
	}
}
