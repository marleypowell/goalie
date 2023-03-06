import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '@goalie/ui';
import { BehaviorSubject, filter, switchMap } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, AsyncPipe, JsonPipe, NgIf],
  selector: 'sea-project-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public readonly authState$ = new BehaviorSubject<any | null>(null);

  public readonly userInfo$ = new BehaviorSubject<any | null>(null);

  public constructor(private readonly http: HttpClient, private readonly router: Router) {}

  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        switchMap(() =>
          this.http.post<{
            handled: boolean;
            isLoggedIn: boolean;
          }>(
            'http://localhost:3334/api/login/end',
            { pageUrl: location.href },
            {
              withCredentials: true,
            }
          )
        )
      )
      .subscribe((res) => {
        console.log(res);
        this.authState$.next(res);

        if (res.handled) {
          history.replaceState({}, document.title, '/');
        }

        this.updateUserInfo();
      });
  }

  public login(): void {
    this.http
      .post('http://localhost:3334/api/login/start', null, {
        withCredentials: true,
      })
      .subscribe((res: any) => {
        location.href = res.authorizationRequestUrl;
      });
  }

  public updateUserInfo(): void {
    this.http
      .get('http://localhost:3334/api/user-info', {
        withCredentials: true,
      })
      .subscribe((res: any) => {
        this.userInfo$.next(res);
      });
  }

  public logout(): void {
    console.log('logout');
  }
}
