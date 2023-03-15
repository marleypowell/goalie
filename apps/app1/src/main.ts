import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { CHECK_AUTH_PROVIDER } from './app/check-auth';
import { xsrfInterceptorFn } from './app/xsrf.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({ cookieName: 'goalie-csrf', headerName: 'x-goalie-csrf' }),
      withInterceptors([xsrfInterceptorFn])
    ),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    CHECK_AUTH_PROVIDER,
  ],
}).catch((err) => console.error(err));
