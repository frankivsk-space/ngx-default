import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './layouts/topbar/topbar.component';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, TopbarComponent],
	template: '<app-topbar /> <router-outlet />',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
