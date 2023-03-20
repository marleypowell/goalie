import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

export interface CreateGoalForm {
  name: string;
  description: string;
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
  ],
  templateUrl: './create-goal-form.component.html',
  styleUrls: ['./create-goal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGoalFormComponent {
  public readonly formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    target: new FormControl<number | null>(null, [Validators.required]),
  });

  public constructor(private readonly ref: DynamicDialogRef) {}

  public save(): void {
    if (this.formGroup.invalid) {
      this.formGroup.controls.name.markAsDirty();
      this.formGroup.controls.target.markAsDirty();
      return;
    }

    this.ref.close(this.formGroup.value as CreateGoalForm);
  }
}
