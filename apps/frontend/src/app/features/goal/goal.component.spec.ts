import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GoalsFacade } from '../../services/goals.facade';
import { GoalComponent } from './goal.component';

describe('GoalComponent', () => {
  let component: GoalComponent;
  let fixture: ComponentFixture<GoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalComponent, RouterTestingModule],
      providers: [MessageService, ConfirmationService, { provide: GoalsFacade, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
