import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  return authService.checkAuth().pipe(
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        authService.login();
      }
    })
  );
};
