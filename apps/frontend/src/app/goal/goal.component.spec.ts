import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GoalsService } from '@goalie/shared/api-client-api-gateway';
import { MessageService } from 'primeng/api';

import { GoalComponent } from './goal.component';

describe('GoalComponent', () => {
  let component: GoalComponent;
  let fixture: ComponentFixture<GoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalComponent, RouterTestingModule],
      providers: [MessageService, { provide: GoalsService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
