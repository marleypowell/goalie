import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Goal } from '@goalie/shared/api-client-api-gateway';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { map, startWith } from 'rxjs';

export interface CheckInForm {
  progress: number;
}

@Component({
  selector: 'goalie-check-in-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, SliderModule, ButtonModule],
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckInFormComponent implements OnInit {
  public readonly goal: Goal | null = this.config.data?.goal ?? null;

  public readonly formGroup = new FormGroup({
    progress: new FormControl<number>(0, [Validators.required]),
  });

  public readonly progress$ = this.formGroup.controls.progress.valueChanges.pipe(
    startWith(this.goal?.progress),
    map((value) => value ?? 0)
  );

  public constructor(private readonly ref: DynamicDialogRef, private readonly config: DynamicDialogConfig) {}

  public ngOnInit(): void {
    this.formGroup.setValue({
      progress: this.goal?.progress ?? 0,
    });
  }

  public save(): void {
    if (this.formGroup.invalid) {
      this.formGroup.controls.progress.markAsDirty();
      return;
    }

    this.ref.close({
      progress: this.formGroup.value.progress,
    } as CheckInForm);
  }
}
