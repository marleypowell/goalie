import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { ApiGatewayApiModule, Configuration as ApiGatewayConfiguration } from '@goalie/shared/api-client-api-gateway';
import { Configuration as OAuthAgentConfiguration, OAuthAgentApiModule } from '@goalie/shared/api-client-oauth-agent';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { CHECK_AUTH_PROVIDER } from './app/check-auth';
import { refreshTokenInterceptorFn } from './app/interceptors/refresh-token.interceptor';
import { xsrfInterceptorFn } from './app/interceptors/xsrf.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({ cookieName: 'goalie-csrf', headerName: 'x-goalie-csrf' }),
      withInterceptors([xsrfInterceptorFn, refreshTokenInterceptorFn])
    ),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    importProvidersFrom(
      ApiGatewayApiModule.forRoot(() => new ApiGatewayConfiguration({ basePath: '', withCredentials: true })),
      OAuthAgentApiModule.forRoot(() => new OAuthAgentConfiguration({ basePath: '', withCredentials: true }))
    ),
    CHECK_AUTH_PROVIDER,
  ],
}).catch((err) => console.error(err));
