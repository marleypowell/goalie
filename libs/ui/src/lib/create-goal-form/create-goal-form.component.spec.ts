import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { CreateGoalFormComponent } from './create-goal-form.component';

describe('CreateGoalFormComponent', () => {
  let component: CreateGoalFormComponent;
  let fixture: ComponentFixture<CreateGoalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGoalFormComponent],
      providers: [
        {
          provide: DynamicDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGoalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
