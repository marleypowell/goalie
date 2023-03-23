import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Goal, GoalActivity } from '@goalie/shared/api-client-api-gateway';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { GoalActivityComponent } from '../goal-activity/goal-activity.component';
import { UserAvatarPipe } from '../pipes/user-avatar.pipe';

@Component({
  selector: 'goalie-goal-details',
  standalone: true,
  imports: [CommonModule, CardModule, GoalActivityComponent, UserAvatarPipe, AvatarModule, ButtonModule, MenuModule],
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalDetailsComponent {
  @Input() public goal: Goal | null = null;

  @Input() public goalActivity: GoalActivity[] | null = null;

  public readonly moreButtonItems: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        // this.update();
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => {
        // this.delete();
      },
    },
  ];
}
