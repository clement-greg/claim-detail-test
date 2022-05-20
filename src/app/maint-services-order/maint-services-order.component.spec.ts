import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintServicesOrderComponent } from './maint-services-order.component';

describe('MaintServicesOrderComponent', () => {
  let component: MaintServicesOrderComponent;
  let fixture: ComponentFixture<MaintServicesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintServicesOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintServicesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
