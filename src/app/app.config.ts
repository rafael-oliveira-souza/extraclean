import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { optionsConfig, provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask'
import { AuthInterceptor } from './interceptors/AuthInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(), provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideEnvironmentNgxMask(),
    provideNgxMask(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};
