import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CheckInFormComponent } from './check-in-form.component';

describe('CheckInFormComponent', () => {
  let component: CheckInFormComponent;
  let fixture: ComponentFixture<CheckInFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInFormComponent],
      providers: [
        {
          provide: DynamicDialogRef,
          useValue: {},
        },
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
