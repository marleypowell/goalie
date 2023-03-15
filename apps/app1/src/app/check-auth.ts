import { APP_INITIALIZER, Provider } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';

export function checkAuth(router: Router, authService: AuthService): () => void {
  return (): void => {
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        switchMap(() => authService.authState$),
        filter((res) => res.handled),
        tap((res) => {
          history.replaceState({}, window.document.title, res.path || '/');
          if (res.path) {
            router.navigateByUrl(res.path, { skipLocationChange: true });
          }
        })
      )
      .subscribe();
  };
}

export const CHECK_AUTH_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: checkAuth,
  deps: [Router, AuthService],
  multi: true,
};
