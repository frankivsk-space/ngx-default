import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Review } from './review.interface';

@Injectable({
	providedIn: 'root',
})
export class ReviewService {
	reviews = signal<Review[]>(environment.reviews);
}
