import { Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Company } from './company.interface';

@Injectable({
	providedIn: 'root',
})
export class CompanyService {
	company = signal<Company>(environment.company);
}
