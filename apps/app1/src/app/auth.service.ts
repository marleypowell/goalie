import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  LoginEndResponse,
  LoginService,
  LogoutService,
  RefreshTokenService,
} from '@goalie/shared/api-client-oauth-agent';
import { BehaviorSubject, catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { WINDOW } from './injection-tokens';

interface AuthState {
  handled: boolean;
  isLoggedIn: boolean;
  path?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authState = new BehaviorSubject<AuthState>({ handled: false, isLoggedIn: false });
  public readonly authState$ = this.authState.asObservable();

  public constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  public login(path: string): void {
    this.loginService.loginStart({ path }).subscribe((res) => {
      this.window.location.href = res.authorizationRequestUrl;
    });
  }

  public logout(): void {
    this.logoutService.logout().subscribe((res) => {
      this.window.location.href = res.url;
    });
  }

  public checkAuth(pageUrl: string): Observable<LoginEndResponse> {
    return this.loginService.loginEnd({ pageUrl }).pipe(
      catchError(() => of({ handled: false, isLoggedIn: false })),
      tap((res: LoginEndResponse) =>
        this.authState.next({
          handled: res.handled,
          isLoggedIn: res.isLoggedIn,
          path: res.path,
        })
      )
    );
  }

  public refreshToken(): Observable<unknown> {
    return this.refreshTokenService.refreshToken().pipe(
      catchError((error: Error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === HttpStatusCode.BadRequest &&
          error.error.error === 'invalid_grant'
        ) {
          this.authState.next({
            handled: false,
            isLoggedIn: false,
          });
          this.login('/');
        }

        return EMPTY;
      })
    );
  }
}
