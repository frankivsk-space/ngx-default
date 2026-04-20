import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Job } from './job.interface';

@Injectable({
	providedIn: 'root',
})
export class JobService {
	jobs = signal<Job[]>(environment.jobs);
}
