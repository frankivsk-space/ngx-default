import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from './product.interface';

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	products = signal<Product[]>(environment.products);
}
