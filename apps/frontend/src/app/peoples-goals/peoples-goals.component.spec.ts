import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoalsService } from '@goalie/shared/api-client-api-gateway';
import { MessageService } from 'primeng/api';
import { EMPTY } from 'rxjs';

import { PeoplesGoalsComponent } from './peoples-goals.component';

describe('PeoplesGoalsComponent', () => {
  let component: PeoplesGoalsComponent;
  let fixture: ComponentFixture<PeoplesGoalsComponent>;

  let goalsServiceSpy: { [key in keyof GoalsService]?: jest.Mock };

  beforeEach(async () => {
    goalsServiceSpy = {
      getAll: jest.fn(() => EMPTY),
    };

    await TestBed.configureTestingModule({
      imports: [PeoplesGoalsComponent],
      providers: [MessageService, { provide: GoalsService, useValue: goalsServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PeoplesGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
