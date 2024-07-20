import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './tabs/menu/menu.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment'; // Import Moment.js

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }, // Set locale to Portuguese (Brazil)
    { provide: 'moment', useValue: moment }, // Provide Moment.js
  ],
  imports: [
    RouterOutlet,
    MenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'extraclean';
}