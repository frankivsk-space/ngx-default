import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Item } from './item.interface';

@Injectable({
	providedIn: 'root',
})
export class ItemService {
	items = signal<Item[]>(environment.items);
}
