import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UserAvatarPipe } from '../pipes/user-avatar.pipe';

export interface CreateGoalForm {
  name: string;
  description: string;
  owner: any;
  startDate: string;
  endDate: string;
  target: number;
}

@Component({
  selector: 'goalie-create-goal-form',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DividerModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    AvatarModule,
    UserAvatarPipe,
    CalendarModule,
  ],
  templateUrl: './create-goal-form.component.html',
  styleUrls: ['./create-goal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGoalFormComponent implements OnInit {
  @Input() public defaultOwner: any | null = null;

  @Input() public users: any[] = [{ id: 'user1', displayName: 'User 1' }];

  @Input() public showOwner: boolean | null = false;

  @Input() public showTimeFrame: boolean | null = false;

  public readonly formGroup = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    owner: new FormControl<any>(null),
    target: new FormControl<number | null>(null, [Validators.required]),
    timeFrame: new FormControl<Date[] | null>(null),
  });

  public constructor(private readonly ref: DynamicDialogRef) {}

  public ngOnInit(): void {
    this.formGroup.setValue({
      name: '',
      description: '',
      owner: this.defaultOwner,
      target: null,
      timeFrame: null,
    });
  }

  public save(): void {
    if (this.formGroup.invalid) {
      this.formGroup.controls.name.markAsDirty();
      this.formGroup.controls.target.markAsDirty();
      return;
    }

    this.ref.close({
      name: this.formGroup.value.name ?? '',
      description: this.formGroup.value.description ?? '',
      owner: this.formGroup.value.owner,
      startDate: (this.formGroup.value.timeFrame ?? [])[0].toISOString(),
      endDate: (this.formGroup.value.timeFrame ?? [])[1].toISOString(),
      target: this.formGroup.value.target,
    } as CreateGoalForm);
  }
}
