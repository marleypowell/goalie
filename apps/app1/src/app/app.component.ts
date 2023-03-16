import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '@goalie/ui';
import { filter } from 'rxjs';
import { AuthService } from './auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, AsyncPipe, JsonPipe, NgIf, SidebarComponent],
  selector: 'goalie-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly authState$ = this.authService.authState$;

  public readonly userInfo$ = this.authService.userInfo$;

  public constructor(private readonly authService: AuthService, private readonly router: Router) {}

  public ngOnInit(): void {
    this.authService.authState$.pipe(filter((res) => res.handled)).subscribe((res) => {
      console.log(res);
      history.replaceState({}, window.document.title, res.path || '/');
      if (res.path) {
        // this.router.navigateByUrl(res.path, { skipLocationChange: true });
      }
    });
  }

  public logout(): void {
    this.authService.logout();
  }

  public navigateToProfile(): void {
    this.router.navigate(['profile']);
  }
}
