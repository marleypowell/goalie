import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '@goalie/ui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    AsyncPipe,
    JsonPipe,
    NgIf,
    SidebarComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  selector: 'goalie-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly authState$ = this.authService.authState$;

  public constructor(private readonly authService: AuthService, private readonly router: Router) {}

  public logout(): void {
    this.authService.logout();
  }

  public navigateToProfile(): void {
    this.router.navigate(['profile']);
  }
}
