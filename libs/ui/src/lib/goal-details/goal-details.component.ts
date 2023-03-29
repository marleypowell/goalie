import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckInGoalDto, Goal, GoalActivity } from '@goalie/shared/api-client-api-gateway';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { filter, take } from 'rxjs';
import { CheckInFormComponent } from '../check-in-form/check-in-form.component';
import { GoalActivityComponent } from '../goal-activity/goal-activity.component';
import { UserAvatarPipe } from '../pipes/user-avatar.pipe';

@Component({
  selector: 'goalie-goal-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    GoalActivityComponent,
    UserAvatarPipe,
    AvatarModule,
    ButtonModule,
    MenuModule,
    ProgressBarModule,
  ],
  providers: [DialogService],
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalDetailsComponent {
  @Input() public goal: Goal | null = null;

  @Input() public goalActivity: GoalActivity[] | null = null;

  @Output() public readonly completeGoal = new EventEmitter<string>();

  @Output() public readonly checkInGoal = new EventEmitter<CheckInGoalDto>();

  @Output() public readonly deleteGoal = new EventEmitter<string>();

  public get progressPercentage(): number {
    if (this.goal) {
      return Math.round((this.goal.progress / this.goal.target) * 100);
    }

    return 0;
  }

  public readonly moreButtonItems: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      disabled: true,
      command: () => {
        // this.update();
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => {
        if (this.goal) {
          this.deleteGoal.emit(this.goal.goalId);
        }
      },
    },
  ];

  public constructor(private readonly dialogService: DialogService) {}

  public checkInGoalHandler(): void {
    if (!this.goal) {
      return;
    }

    const dialogRef = this.dialogService.open(CheckInFormComponent, {
      header: 'Check-in',
      width: '70%',
      data: {
        goal: this.goal,
      },
    });

    dialogRef.onClose.pipe(take(1), filter(Boolean)).subscribe((res) => {
      this.checkInGoal.emit({
        goalId: this.goal?.goalId ?? '',
        progress: res.progress,
        comment: res.comment,
      });
    });
  }
}
