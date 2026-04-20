import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Quest } from './quest.interface';

@Injectable({
	providedIn: 'root',
})
export class QuestService {
	quests = signal<Quest[]>(environment.quests);
}
