import {
  ApplicationConfig,
  enableProdMode,
  importProvidersFrom,
  provideZoneChangeDetection,
  provideAppInitializer,
  inject,
  signal,

} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig
} from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateModule } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { routes } from './app.routes';
import { ShellModule } from './shell/shell.module';
import { ErrorHandlerInterceptor } from '@core/interceptors';
import { keycloakInitializer } from './shell/services/config.service';
import { AppConstants } from './shell/services/config.service';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEvent } from 'keycloak-angular';
import { HttpTokenInterceptor } from './@core/interceptors/http.token.interceptor';
import { KeycloakInterceptor } from './@core/interceptors/keycloak.interceptor';
import { HttpUserProfileIdInterceptor } from './restsvc/interceptors/http.userprofileid.interceptor';

if (environment.production) {
  enableProdMode();
}
const keycloakEvents = signal<KeycloakEvent[]>([]);


export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => keycloakInitializer(inject(AppConstants))),
    {
      provide: KEYCLOAK_EVENT_SIGNAL,
      useValue: keycloakEvents
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        useDefaultLang: true,
      }),
      ShellModule
    ),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always',
      }),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withPreloading(PreloadAllModules),
    ),
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: KeycloakInterceptor, // Use your fixed Keycloak interceptor
      multi: true 
    },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: HttpUserProfileIdInterceptor, // Add userProfileId to all requests
      multi: true 
    },
    provideHttpClient(withInterceptorsFromDi()),
   
  ],
};
