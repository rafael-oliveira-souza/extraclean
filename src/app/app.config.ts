import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { optionsConfig, provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask'

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes), provideClientHydration(), provideAnimationsAsync(),
  provideHttpClient(withInterceptorsFromDi(), withFetch()),
  provideEnvironmentNgxMask(),
  provideNgxMask(),]
};
