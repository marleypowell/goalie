import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalActivityComponent } from './goal-activity.component';

describe('GoalActivityComponent', () => {
  let component: GoalActivityComponent;
  let fixture: ComponentFixture<GoalActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalActivityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
