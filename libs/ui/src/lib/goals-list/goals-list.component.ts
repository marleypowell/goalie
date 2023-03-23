import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Goal } from '@goalie/shared/api-client-api-gateway';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'goalie-goals-list',
  standalone: true,
  imports: [CommonModule, TagModule, ProgressBarModule],
  templateUrl: './goals-list.component.html',
  styleUrls: ['./goals-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsListComponent {
  @Input() public goals: Goal[] | null = null;

  @Output() public readonly goalClicked = new EventEmitter<string>();

  public trackByGoalId(index: number, goal: Goal): string | number {
    return goal?.goalId ?? index;
  }
}
