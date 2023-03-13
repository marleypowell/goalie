import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'goalie-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  public readonly authState$ = this.authService.authState$;

  public readonly userInfo$ = this.authService.userInfo$;

  public constructor(private readonly authService: AuthService) {}
}
