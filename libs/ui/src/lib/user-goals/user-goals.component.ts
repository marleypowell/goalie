import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Goal } from '@goalie/shared/api-client-api-gateway';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { filter, take } from 'rxjs';
import { CreateGoalForm, CreateGoalFormComponent } from '../create-goal-form/create-goal-form.component';
import { GoalsListComponent } from '../goals-list/goals-list.component';

@Component({
  selector: 'goalie-user-goals',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule, GoalsListComponent],
  providers: [DialogService],
  templateUrl: './user-goals.component.html',
  styleUrls: ['./user-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGoalsComponent {
  @Input() public goals: Goal[] | null = null;

  @Output() public readonly createGoal = new EventEmitter<CreateGoalForm>();

  @Output() public readonly goalClicked = new EventEmitter<string>();

  public constructor(private readonly dialogService: DialogService) {}

  public createGoalHandler(): void {
    const dialogRef = this.dialogService.open(CreateGoalFormComponent, {
      header: 'New goal',
      width: '70%',
    });

    dialogRef.onClose.pipe(take(1), filter(Boolean)).subscribe((res) => {
      this.createGoal.emit(res);
    });
  }
}
