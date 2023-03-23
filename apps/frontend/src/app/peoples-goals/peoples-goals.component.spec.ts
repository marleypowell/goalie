import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplesGoalsComponent } from './peoples-goals.component';

describe('PeoplesGoalsComponent', () => {
  let component: PeoplesGoalsComponent;
  let fixture: ComponentFixture<PeoplesGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeoplesGoalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeoplesGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
