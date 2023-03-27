import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalsService } from '@goalie/shared/api-client-api-gateway';
import { GoalDetailsComponent } from '@goalie/ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { iif, map, mergeMap, of, shareReplay } from 'rxjs';

@Component({
  selector: 'goalie-goal',
  standalone: true,
  imports: [CommonModule, GoalDetailsComponent, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalComponent {
  public readonly goalId$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    shareReplay()
  );

  public readonly goal$ = this.goalId$.pipe(
    mergeMap((id) => iif(() => !!id, this.goalsService.get(String(id)), of(null)))
  );

  public readonly goalActivity$ = this.goalId$.pipe(
    mergeMap((id) => iif(() => !!id, this.goalsService.getActivity(String(id)), of(null)))
  );

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly goalsService: GoalsService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  public deleteGoal(goalId: string): void {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: 'Are you sure that you want to delete this goal?',
      accept: () => {
        this.goalsService._delete(goalId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goal deleted' });
          this.router.navigate(['/goals']);
        });
      },
    });
  }
}
