import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Event } from './event.interface';

@Injectable({
	providedIn: 'root',
})
export class EventService {
	events = signal<Event[]>(environment.events);
}
