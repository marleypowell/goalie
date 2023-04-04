import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Params, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { WINDOW } from '../injection-tokens';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const window = inject(WINDOW);

  const url = `${window.location.origin}${state.url}`;

  return authService.checkAuth(url).pipe(
    map((res) => {
      if (!res.isLoggedIn) {
        console.log('not logged in, redirecting to login');
        authService.login(state.url);
        return false;
      }

      if (route.queryParamMap.has('code') && route.queryParamMap.has('state')) {
        const path = res.path || '/';
        const [newPath, queryParamStr] = path.split('?');
        console.log(`removing auth redirect query params and navigating to: ${path}`);

        const queryParams =
          queryParamStr?.split('&').reduce((acc, curr) => {
            const [key, value] = curr.split('=');
            acc[key] = value;
            return acc;
          }, {} as Params) ?? {};

        return router.createUrlTree([newPath], {
          queryParams: {
            code: null,
            state: null,
            session_state: null,
            ...queryParams,
          },
          queryParamsHandling: 'merge',
        });
      }

      return true;
    })
  );
};
