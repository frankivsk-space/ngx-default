import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Article } from './article.interface';

@Injectable({
	providedIn: 'root',
})
export class ArticleService {
	articles = signal<Article[]>(environment.articles);
}
