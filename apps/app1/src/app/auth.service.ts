import { Inject, Injectable } from '@angular/core';
import { LoginEndResponse, LoginService, LogoutService } from '@goalie/shared/api-client-oauth-agent';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
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

  private readonly userInfo = new BehaviorSubject<any | null>(null);
  public readonly userInfo$ = this.userInfo.asObservable();

  private readonly claims = new BehaviorSubject<any | null>(null);
  public readonly claims$ = this.claims.asObservable();

  public constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService
  ) {}

  public login(): void {
    const path = this.window.location.href.replace(this.window.location.origin, '');

    this.loginService.loginStart({ path }).subscribe((res) => {
      this.window.location.href = res.authorizationRequestUrl;
    });
  }

  public logout(): void {
    this.logoutService.logout().subscribe((res) => {
      this.window.location.href = res.url;
    });
  }

  public checkAuth(): Observable<boolean> {
    return this.loginService.loginEnd({ pageUrl: this.window.location.href }).pipe(
      catchError(() => of({ handled: false, isLoggedIn: false })),
      tap((res: LoginEndResponse) =>
        this.authState.next({
          handled: res.handled,
          isLoggedIn: res.isLoggedIn,
          path: res.path,
        })
      ),
      map((res: LoginEndResponse) => res.isLoggedIn)
    );
  }
}
