import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { ApiGatewayApiModule, Configuration as ApiGatewayConfiguration } from '@goalie/shared/api-client-api-gateway';
import { Configuration as OAuthAgentConfiguration, OAuthAgentApiModule } from '@goalie/shared/api-client-oauth-agent';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { refreshTokenInterceptorFn } from './app/interceptors/refresh-token.interceptor';
import { xsrfInterceptorFn } from './app/interceptors/xsrf.interceptor';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({ cookieName: 'goalie-csrf', headerName: 'x-goalie-csrf' }),
      withInterceptors([xsrfInterceptorFn, refreshTokenInterceptorFn])
    ),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    importProvidersFrom(
      ApiGatewayApiModule.forRoot(
        () => new ApiGatewayConfiguration({ basePath: environment.basePath, withCredentials: true })
      ),
      OAuthAgentApiModule.forRoot(
        () => new OAuthAgentConfiguration({ basePath: environment.basePath, withCredentials: true })
      )
    ),
    MessageService,
  ],
}).catch((err) => console.error(err));
