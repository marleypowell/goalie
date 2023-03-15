import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { WINDOW } from './injection-tokens';

export interface CheckAuthResponse {
  handled: boolean;
  isLoggedIn: boolean;
  path?: string;
}

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

  public constructor(@Inject(WINDOW) private readonly window: Window, private readonly http: HttpClient) {}

  public login(): void {
    const path = this.window.location.href.replace(this.window.location.origin, '');
    this.loginStart(path).subscribe((res: any) => {
      this.window.location.href = res.authorizationRequestUrl;
    });
  }

  public logout(): void {
    this.getLogoutUrl().subscribe((url) => {
      this.window.location.href = url;
    });
  }

  public checkAuth(): Observable<boolean> {
    return this.checkAuthApi().pipe(
      catchError(() => of({ handled: false, isLoggedIn: false })),
      tap((res: CheckAuthResponse) => this.authState.next(res)),
      map((res: CheckAuthResponse) => res.isLoggedIn)
    );
  }

  public refreshAccessToken(): Observable<unknown> {
    return this.http.post('/oauth-agent/refresh-token', null, { withCredentials: true });
  }

  private loginStart(path: string): Observable<any> {
    return this.http.post('/oauth-agent/login/start', { path }, { withCredentials: true });
  }

  private checkAuthApi(): Observable<CheckAuthResponse> {
    return this.http.post<CheckAuthResponse>(
      '/oauth-agent/login/end',
      { pageUrl: this.window.location.href },
      { withCredentials: true }
    );
  }

  private getLogoutUrl(): Observable<string> {
    return this.http
      .post('/oauth-agent/logout', null, { withCredentials: true })
      .pipe(map((res: any) => String(res.url)));
  }
}
