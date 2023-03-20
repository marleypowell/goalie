import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClaimsService, UserInfoService } from '@goalie/shared/api-client-oauth-agent';

@Component({
  selector: 'goalie-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  public readonly userInfo$ = this.userInfoService.getUserInfo();

  public readonly claims$ = this.claimsService.getClaims();

  public constructor(
    private readonly userInfoService: UserInfoService,
    private readonly claimsService: ClaimsService
  ) {}
}
