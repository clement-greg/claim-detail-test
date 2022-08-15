import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteAppointmentDialogComponent } from './complete-appointment-dialog.component';

describe('CompleteAppointmentDialogComponent', () => {
  let component: CompleteAppointmentDialogComponent;
  let fixture: ComponentFixture<CompleteAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteAppointmentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
