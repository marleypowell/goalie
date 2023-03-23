import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Goal } from '@goalie/shared/api-client-api-gateway';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { UserAvatarPipe } from '../pipes/user-avatar.pipe';

@Component({
  selector: 'goalie-goals-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, UserAvatarPipe, AvatarModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './goals-table.component.html',
  styleUrls: ['./goals-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsTableComponent {
  @Input() public goals: Goal[] | null = null;

  @Output() public readonly avatarClicked = new EventEmitter<Goal>();

  @Output() public readonly goalClicked = new EventEmitter<string>();

  @Output() public readonly deleteGoal = new EventEmitter<string>();

  public selectedGoals: Goal[] = [];

  public constructor(private readonly confirmationService: ConfirmationService) {}

  public deleteGoalHandler(event: Event, goalId: string): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this goal?',
      accept: () => this.deleteGoal.emit(goalId),
    });
  }

  public itemSelected(event: Event): void {
    event.stopPropagation();
  }
}
