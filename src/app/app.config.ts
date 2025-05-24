import { ApplicationConfig, enableProdMode, importProvidersFrom, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withPreloading, withRouterConfig } from '@angular/router';
import { provideKeycloak, withAutoRefreshToken, AutoRefreshTokenService, UserActivityService } from 'keycloak-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { ShellModule } from './shell/shell.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerInterceptor } from '@core/interceptors';
import { RouteReusableStrategy } from '@core/helpers';
import { keycloakConfig } from '@core/config/keycloak.config';
import { DataSchoolSetupService } from './from_java/services/data-school-setup.service';
import { WireframeDataService } from './from_java/services/wireframe-data.service';
import { initDataAndWireframeFactory } from './from_java/services/init-services.factory';

if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection is required for Angular's zone.js
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

    // Keycloak configuration
    provideKeycloak({
      config: keycloakConfig,
      initOptions: {
        onLoad: 'login-required'      
      },
      providers: [AutoRefreshTokenService, UserActivityService]
    }),

    // import providers from other modules
    importProvidersFrom(
      TranslateModule.forRoot(),
      ShellModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    }
  ],
};
