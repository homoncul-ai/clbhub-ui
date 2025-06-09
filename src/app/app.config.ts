import { ApplicationConfig, enableProdMode, importProvidersFrom, provideZoneChangeDetection, APP_INITIALIZER, provideAppInitializer, inject, signal } from '@angular/core';
import { PreloadAllModules, provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withPreloading, withRouterConfig } from '@angular/router';
import { provideKeycloak, AutoRefreshTokenService, UserActivityService } from 'keycloak-angular';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { ShellModule } from './shell/shell.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerInterceptor } from '@core/interceptors';
import { DataSchoolSetupService } from './from_java/services/data-school-setup.service';
import { WireframeDataService } from './from_java/services/wireframe-data.service';
import { initDataAndWireframeFactory } from './from_java/services/init-services.factory';
import { keycloakConfig } from './@core/config/keycloak.config';

if (environment.production) {
  enableProdMode();
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideKeycloak({
      config: keycloakConfig,
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
      providers: [AutoRefreshTokenService, UserActivityService],
    }),

    provideZoneChangeDetection({ eventCoalescing: true }),

    // Data initialization
    DataSchoolSetupService,
    WireframeDataService,
    {
      provide: APP_INITIALIZER,
      useFactory: initDataAndWireframeFactory,
      deps: [DataSchoolSetupService],
      multi: true
    },

    // import providers from other modules
    importProvidersFrom(
      TranslateModule.forRoot(),
      ShellModule
    ),

    // Router configuration
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

    // HTTP configuration
    provideHttpClient(withInterceptors([])),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
  ],
};
