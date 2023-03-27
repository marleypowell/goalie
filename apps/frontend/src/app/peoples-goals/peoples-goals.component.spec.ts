import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EMPTY } from 'rxjs';
import { GoalsFacade } from '../services/goals.facade';

import { PeoplesGoalsComponent } from './peoples-goals.component';

describe('PeoplesGoalsComponent', () => {
  let component: PeoplesGoalsComponent;
  let fixture: ComponentFixture<PeoplesGoalsComponent>;

  let goalsFacadeSpy: { [key in keyof GoalsFacade]?: jest.Mock };

  beforeEach(async () => {
    goalsFacadeSpy = {
      getGoals: jest.fn(() => EMPTY),
    };

    await TestBed.configureTestingModule({
      imports: [PeoplesGoalsComponent],
      providers: [MessageService, ConfirmationService, { provide: GoalsFacade, useValue: goalsFacadeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PeoplesGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
