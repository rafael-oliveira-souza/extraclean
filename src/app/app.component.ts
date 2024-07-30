import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './tabs/menu/menu.component';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import * as moment from 'moment'; // Import Moment.js
import { LinguagemEnum } from './domains/enums/LinguagemEnum';
import 'moment/locale/pt-br';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
    { provide: MAT_DATE_LOCALE, useValue: LinguagemEnum.PT }, // Set locale to Portuguese (Brazil)
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