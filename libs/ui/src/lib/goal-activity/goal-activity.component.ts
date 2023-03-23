import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GoalActivity } from '@goalie/shared/api-client-api-gateway';
import { AvatarModule } from 'primeng/avatar';
import { TimelineModule } from 'primeng/timeline';
import { UserAvatarPipe } from '../pipes/user-avatar.pipe';

@Component({
  selector: 'goalie-goal-activity',
  standalone: true,
  imports: [CommonModule, TimelineModule, AvatarModule, UserAvatarPipe],
  templateUrl: './goal-activity.component.html',
  styleUrls: ['./goal-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalActivityComponent {
  @Input() public activity: GoalActivity[] | null = null;
}
