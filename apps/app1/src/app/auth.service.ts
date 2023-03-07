import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { WINDOW } from './injection-tokens';

export interface CheckAuthResponse {
  handled: boolean;
  isLoggedIn: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authState = new BehaviorSubject<CheckAuthResponse | null>(null);
  public readonly authState$ = this.authState.asObservable();

  private readonly userInfo = new BehaviorSubject<any | null>(null);
  public readonly userInfo$ = this.userInfo.asObservable();

  public constructor(@Inject(WINDOW) private readonly window: Window, private readonly http: HttpClient) {}

  public login(): void {
    this.loginStart().subscribe((res: any) => {
      this.window.location.href = res.authorizationRequestUrl;
    });
  }

  public logout(): void {
    console.log('logout');
  }

  public updateAuthState(): Observable<CheckAuthResponse> {
    return this.checkAuth().pipe(
      tap((res) => {
        this.authState.next(res);

        if (res.handled) {
          this.window.history.replaceState({}, this.window.document.title, '/');
        }

        this.updateUserInfo();
      })
    );
  }

  private updateUserInfo(): void {
    this.getUserInfo().subscribe((res: any) => {
      this.userInfo.next(res);
    });
  }

  private loginStart(): Observable<any> {
    return this.http.post('http://localhost:3334/api/login/start', null, {
      withCredentials: true,
    });
  }

  private getUserInfo(): Observable<any> {
    return this.http.get('http://localhost:3334/api/user-info', {
      withCredentials: true,
    });
  }

  private checkAuth(): Observable<CheckAuthResponse> {
    return this.http.post<CheckAuthResponse>(
      'http://localhost:3334/api/login/end',
      { pageUrl: location.href },
      { withCredentials: true }
    );
  }
}
