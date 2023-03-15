import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concat, map, Observable, of, tap, throwError } from 'rxjs';
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

  private updateUserInfo(): void {
    this.getUserInfo()
      .pipe(
        catchError((err, source) => {
          console.log(err);

          if (err.status === HttpStatusCode.Unauthorized) {
            return concat(this.refreshAccessToken(), source);
          }

          return throwError(() => err);
        })
      )
      .subscribe((res: any) => {
        this.userInfo.next(res);
      });

    // this.getClaims().subscribe((res: any) => {
    //   this.claims.next(res);
    // });
  }

  private loginStart(path: string): Observable<any> {
    return this.http.post(
      '/oauth-agent/login/start',
      { path },
      {
        withCredentials: true,
      }
    );
  }

  private getUserInfo(): Observable<any> {
    return this.http.get('/oauth-agent/user-info', {
      withCredentials: true,
    });
  }

  private getClaims(): Observable<any> {
    return this.http.get('/oauth-agent/claims', {
      withCredentials: true,
    });
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
      .post('/oauth-agent/logout', null, {
        withCredentials: true,
      })
      .pipe(map((res: any) => String(res.url)));
  }

  private refreshAccessToken(): Observable<unknown> {
    return this.http
      .post('/oauth-agent/refresh-token', null, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.log(err);

          this.authState.next({
            handled: false,
            isLoggedIn: false,
          });

          return throwError(() => err);
        })
      );
  }
}
