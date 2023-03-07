import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@goalie/ui';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, AsyncPipe, JsonPipe, NgIf],
  selector: 'goalie-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly authState$ = this.authService.authState$;

  public readonly userInfo$ = this.authService.userInfo$;

  public constructor(private readonly authService: AuthService) {}

  public login(): void {
    this.authService.login();
  }

  public logout(): void {
    this.authService.logout();
  }
}
