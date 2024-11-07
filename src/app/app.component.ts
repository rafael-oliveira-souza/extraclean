import { Component, LOCALE_ID } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MenuComponent } from './tabs/menu/menu.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
// import * as moment from 'moment'; // Import Moment.js
import * as moment from 'moment-timezone';

import { LinguagemEnum } from './domains/enums/LinguagemEnum';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { registerLocaleData } from '@angular/common';
import 'moment/locale/pt-br';
import localePt from '@angular/common/locales/pt';
import { ImageComponent } from './components/image/image.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { LoadingComponent } from './components/loading/loading.component';

registerLocaleData(localePt);

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
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
    { provide: LOCALE_ID, useValue: LinguagemEnum.PT },
    { provide: MAT_DATE_LOCALE, useValue: LinguagemEnum.PT }, // Set locale to Portuguese (Brazil)
    { provide: 'moment', useValue: moment }, // Provide Moment.js
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
  ],
  imports: [
    RouterOutlet,
    ImageComponent,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'extraclean';
}
