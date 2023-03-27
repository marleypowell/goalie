import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Goal } from '@goalie/shared/api-client-api-gateway';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { UserAvatarPipe } from '../pipes/user-avatar.pipe';

@Component({
  selector: 'goalie-goals-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, UserAvatarPipe, AvatarModule],
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

  public deleteGoalHandler(event: Event, goalId: string): void {
    event.stopPropagation();
    this.deleteGoal.emit(goalId);
  }

  public itemSelected(event: Event): void {
    event.stopPropagation();
  }
}
